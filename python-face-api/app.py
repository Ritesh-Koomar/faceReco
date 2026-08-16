from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import os
import base64
from datetime import datetime
from collections import defaultdict
import threading

app = Flask(__name__)
CORS(app)

# ──────────────────────────────────────────────
# Cascades
# ──────────────────────────────────────────────
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

FACES_DIR       = "faces"
UNKNOWN_LOG_DIR = "unknown_faces"
MODEL_PATH      = "trained_model.yml"
LABEL_MAP_PATH  = "label_map.txt"

os.makedirs(FACES_DIR,       exist_ok=True)
os.makedirs(UNKNOWN_LOG_DIR, exist_ok=True)

CONFIDENCE_THRESHOLD = 55   # LBPH raw distance: 0=perfect, good matches ~50-90, unknown >90

# ──────────────────────────────────────────────
# Proxy detection
# ──────────────────────────────────────────────
proxy_log  = defaultdict(list)
proxy_lock = threading.Lock()

# Recognizer cache
_recognizer_cache      = None
_recognizer_cache_time = None
_label_reverse_map     = None
CACHE_TTL_SECONDS      = 30

recognizer_lock = threading.Lock()


# ──────────────────────────────────────────────
# Preprocessing — CLAHE + gamma correction
# ──────────────────────────────────────────────
def preprocess(img_gray):
    clahe = cv2.createCLAHE(clipLimit=4.0, tileGridSize=(8, 8))
    eq    = clahe.apply(img_gray)
    gamma = 1.5
    lut   = np.array([min(255, int((i / 255.0) ** (1.0 / gamma) * 255)) for i in range(256)], dtype=np.uint8)
    return cv2.LUT(eq, lut)


# ──────────────────────────────────────────────
# Detect faces
# ──────────────────────────────────────────────
def detect_faces(gray):
    return face_cascade.detectMultiScale(
        gray,
        scaleFactor=1.2,
        minNeighbors=5,
        minSize=(80, 80),
        flags=cv2.CASCADE_SCALE_IMAGE
    )


# ──────────────────────────────────────────────
# Augmentation — 24 variants covering natural
# left-to-right head movement range
# ──────────────────────────────────────────────
def rotate_image(img, angle):
    h, w = img.shape
    M = cv2.getRotationMatrix2D((w // 2, h // 2), angle, 1.0)
    return cv2.warpAffine(img, M, (w, h), borderMode=cv2.BORDER_REPLICATE)

def add_noise(img):
    noise = np.random.normal(0, 8, img.shape).astype(np.int16)
    return np.clip(img.astype(np.int16) + noise, 0, 255).astype(np.uint8)

def generate_augmented_images(face_img):
    """
    Simulates the natural variation of someone moving slightly
    left-to-right in front of the camera:
      - horizontal flips + rotations cover head-turn appearance
      - brightness/contrast variants cover lighting shifts as person moves
      - noise + blur variants improve robustness
    """
    flipped = cv2.flip(face_img, 1)
    blurred = cv2.GaussianBlur(face_img, (3, 3), 0)

    return [
        # ── Baseline ──────────────────────────
        face_img,                                                        #  1. original
        flipped,                                                         #  2. mirror (simulates opposite head turn)

        # ── Lighting variations ───────────────
        cv2.convertScaleAbs(face_img, alpha=1.4, beta=25),              #  3. brighter
        cv2.convertScaleAbs(face_img, alpha=0.6, beta=-20),             #  4. darker
        cv2.convertScaleAbs(face_img, alpha=1.6, beta=0),               #  5. high contrast
        cv2.convertScaleAbs(face_img, alpha=0.75, beta=20),             #  6. low contrast
        cv2.convertScaleAbs(face_img, alpha=0.9, beta=30),              #  7. lifted shadows
        cv2.equalizeHist(face_img),                                      #  8. hist-equalised

        # ── Rotations (head tilt as person moves) ─
        rotate_image(face_img, -15),                                     #  9. tilt left-15°
        rotate_image(face_img,  -8),                                     # 10. tilt left-8°
        rotate_image(face_img,  -4),                                     # 11. tilt left-4°
        rotate_image(face_img,   4),                                     # 12. tilt right+4°
        rotate_image(face_img,   8),                                     # 13. tilt right+8°
        rotate_image(face_img,  15),                                     # 14. tilt right+15°

        # ── Flipped + rotation combos ─────────
        rotate_image(flipped,  -10),                                     # 15. flip + tilt L
        rotate_image(flipped,   10),                                     # 16. flip + tilt R
        cv2.convertScaleAbs(flipped, alpha=1.3, beta=15),               # 17. flip + bright
        cv2.convertScaleAbs(flipped, alpha=0.7, beta=-10),              # 18. flip + dark

        # ── Blur + noise ──────────────────────
        blurred,                                                         # 19. slight blur
        cv2.convertScaleAbs(blurred, alpha=1.3, beta=10),               # 20. blur + bright
        add_noise(face_img),                                             # 21. noise
        add_noise(flipped),                                              # 22. noise + flip

        # ── Combined ──────────────────────────
        rotate_image(cv2.convertScaleAbs(face_img, alpha=1.2), -8),    # 23. bright + tilt
        cv2.convertScaleAbs(rotate_image(face_img, 6), alpha=0.8, beta=10),  # 24. dark + tilt
    ]


# ──────────────────────────────────────────────
# Label map  (USN ↔ int label)
# ──────────────────────────────────────────────
def save_label_map(label_map):
    with open(LABEL_MAP_PATH, "w") as f:
        for usn, label in label_map.items():
            f.write(f"{label},{usn}\n")

def load_label_map():
    if not os.path.exists(LABEL_MAP_PATH):
        return {}
    label_map = {}
    with open(LABEL_MAP_PATH, "r") as f:
        for line in f:
            line = line.strip()
            if "," in line:
                label, usn = line.split(",", 1)
                label_map[int(label)] = usn
    return label_map


# ──────────────────────────────────────────────
# Train LBPH
# ──────────────────────────────────────────────
def train_model_internal():
    recognizer = cv2.face.LBPHFaceRecognizer_create(
        radius=2, neighbors=8, grid_x=8, grid_y=8
    )
    faces, labels = [], []
    label_map = {}
    current_label = 0

    for person_usn in sorted(os.listdir(FACES_DIR)):
        person_folder = os.path.join(FACES_DIR, person_usn)
        if not os.path.isdir(person_folder):
            continue

        label_map[person_usn] = current_label
        img_count = 0

        for img_file in sorted(os.listdir(person_folder)):
            img_path = os.path.join(person_folder, img_file)
            img = cv2.imread(img_path, cv2.IMREAD_GRAYSCALE)
            if img is None:
                continue
            img = preprocess(img)
            img = cv2.resize(img, (200, 200))
            faces.append(img)
            labels.append(current_label)
            img_count += 1

        print(f"[TRAIN] {person_usn}: {img_count} images, label={current_label}")
        current_label += 1

    if not faces:
        raise ValueError("No face images found for training.")

    recognizer.train(faces, np.array(labels))
    recognizer.save(MODEL_PATH)
    save_label_map(label_map)

    reverse_map = {v: k for k, v in label_map.items()}
    print(f"[TRAIN] Done. {len(faces)} images across {len(label_map)} person(s).")
    return recognizer, reverse_map


# ──────────────────────────────────────────────
# Cached recognizer
# On cache miss: load saved model from disk (fast).
# Only falls back to full retrain if no saved model exists.
# ──────────────────────────────────────────────
def load_recognizer_from_disk():
    """Load saved LBPH model + label map — no retraining required."""
    if not os.path.exists(MODEL_PATH) or not os.path.exists(LABEL_MAP_PATH):
        raise ValueError("No saved model found. Train first.")
    recognizer = cv2.face.LBPHFaceRecognizer_create(
        radius=2, neighbors=8, grid_x=8, grid_y=8
    )
    recognizer.read(MODEL_PATH)
    rev_map = load_label_map()   # {int_label: usn}
    if not rev_map:
        raise ValueError("Label map empty or missing.")
    return recognizer, rev_map


def get_recognizer():
    global _recognizer_cache, _recognizer_cache_time, _label_reverse_map

    with recognizer_lock:
        now = datetime.now()
        if (
            _recognizer_cache is not None
            and _recognizer_cache_time is not None
            and (now - _recognizer_cache_time).total_seconds() < CACHE_TTL_SECONDS
        ):
            return _recognizer_cache, _label_reverse_map

        # Fast path: load already-trained model from disk
        try:
            rec, rev_map = load_recognizer_from_disk()
        except ValueError:
            # Fallback: full retrain (first run or missing files)
            try:
                rec, rev_map = train_model_internal()
            except ValueError:
                return None, {}

        _recognizer_cache      = rec
        _recognizer_cache_time = now
        _label_reverse_map     = rev_map
        return rec, rev_map

def invalidate_cache():
    global _recognizer_cache, _recognizer_cache_time
    with recognizer_lock:
        _recognizer_cache      = None
        _recognizer_cache_time = None


# ──────────────────────────────────────────────
# /detect — live bounding box for the UI
# ──────────────────────────────────────────────

def predict_with_voting(recognizer, face_img, label_reverse_map):
    variants = [
        face_img,
        cv2.flip(face_img, 1),
        cv2.equalizeHist(face_img),
        cv2.convertScaleAbs(face_img, alpha=1.2, beta=10),
        cv2.GaussianBlur(face_img, (3, 3), 0),
    ]
    
    all_predictions = []
    for variant in variants:
        label, conf = recognizer.predict(variant)
        all_predictions.append((label, conf))
    
    # Count raw votes (no threshold filter yet)
    vote_counts = defaultdict(list)
    for label, conf in all_predictions:
        vote_counts[label].append(conf)
    
    # Must win majority (3 of 5 variants agree on same label)
    best_label = max(vote_counts, key=lambda l: len(vote_counts[l]))
    if len(vote_counts[best_label]) < 4:
        return None, 999   # No majority → Unknown
    
    # Majority agreed — NOW check if average confidence is good enough
    avg_conf = sum(vote_counts[best_label]) / len(vote_counts[best_label])
    if avg_conf > CONFIDENCE_THRESHOLD:
        return None, avg_conf   # Majority agreed but confidence is poor → Unknown
    
    return best_label, avg_conf



@app.route("/detect", methods=["POST"])
def detect():
    data       = request.get_json()
    image_data = data["image"].split(",")[1]
    np_arr     = np.frombuffer(base64.b64decode(image_data), np.uint8)
    img        = cv2.imdecode(np_arr, cv2.IMREAD_GRAYSCALE)
    img        = preprocess(img)

    faces     = detect_faces(img)
    face_list = [
        {"x": int(x), "y": int(y), "w": int(w), "h": int(h)}
        for (x, y, w, h) in faces
    ]
    return jsonify({"faces": face_list, "count": len(face_list)})


# ──────────────────────────────────────────────
# /enroll — single-click enrollment
#
# One POST with a single frame is all that's needed.
# 24 augmented variants are saved automatically,
# covering the natural left-to-right motion range.
# The model is trained immediately after saving.
# ──────────────────────────────────────────────
@app.route("/enroll", methods=["POST"])
def enroll():
    data       = request.get_json()
    usn        = data["usn"]
    image_data = data["image"].split(",")[1]

    np_arr = np.frombuffer(base64.b64decode(image_data), np.uint8)
    img    = cv2.imdecode(np_arr, cv2.IMREAD_GRAYSCALE)
    img    = preprocess(img)

    faces = detect_faces(img)

    if len(faces) == 0:
        return jsonify({"message": "No face detected. Move closer or improve lighting."}), 400
    if len(faces) > 1:
        return jsonify({"message": "Multiple faces detected. Only one person allowed."}), 400

    student_folder = os.path.join(FACES_DIR, usn)
    os.makedirs(student_folder, exist_ok=True)

    # Clear any previous enrollment for this USN so we start fresh
    for old_file in os.listdir(student_folder):
        os.remove(os.path.join(student_folder, old_file))

    (x, y, w, h) = faces[0]
    face_crop    = img[y:y+h, x:x+w]
    face_resized = cv2.resize(face_crop, (200, 200))

    augmented = generate_augmented_images(face_resized)
    for i, aug_img in enumerate(augmented, start=1):
        img_path = os.path.join(student_folder, f"{usn}_{i:02d}.jpg")
        cv2.imwrite(img_path, aug_img)

    saved = len(augmented)
    print(f"[ENROLL] {usn}: saved {saved} augmented images.")

    # Train immediately
    try:
        train_model_internal()
        invalidate_cache()
        print(f"[ENROLL] Model updated for {usn}.")
    except Exception as e:
        print(f"[ENROLL] Training error: {e}")
        return jsonify({"message": f"Images saved but training failed: {e}"}), 500

    return jsonify({
        "message":      f"Enrolled successfully. {saved} variants saved and model updated.",
        "usn":          usn,
        "saved":        saved,
        "trained":      True
    })


# ──────────────────────────────────────────────
# /train — manual retrain (admin use)
# ──────────────────────────────────────────────
@app.route("/train", methods=["POST"])
def train():
    try:
        _, rev_map = train_model_internal()
        invalidate_cache()
        return jsonify({
            "message": f"Model trained for {len(rev_map)} student(s).",
            "persons": len(rev_map)
        })
    except ValueError as e:
        return jsonify({"message": str(e)}), 400
    except Exception as e:
        return jsonify({"message": f"Training failed: {str(e)}"}), 500


# ──────────────────────────────────────────────
# /recognize
# ──────────────────────────────────────────────
@app.route("/recognize", methods=["POST"])
def recognize():
    client_ip  = request.remote_addr
    data       = request.get_json()
    image_data = data["image"].split(",")[1]

    np_arr = np.frombuffer(base64.b64decode(image_data), np.uint8)
    frame  = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    gray   = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    gray   = preprocess(gray)

    faces = detect_faces(gray)

    # ── Proxy check ───────────────────────────
    if len(faces) > 1:
        now = datetime.now()
        with proxy_lock:
            proxy_log[client_ip] = [
                t for t in proxy_log[client_ip]
                if (now - t).total_seconds() < 60
            ]
            proxy_log[client_ip].append(now)
            consecutive = len(proxy_log[client_ip])

        should_log = consecutive >= 2
        if should_log:
            ts        = now.strftime("%Y%m%d_%H%M%S")
            save_path = os.path.join(UNKNOWN_LOG_DIR, f"proxy_{ts}.jpg")
            cv2.imwrite(save_path, frame)
            print(f"[PROXY] Consecutive #{consecutive} from {client_ip} — saved {save_path}")

        return jsonify({
            "usn":        "Multiple faces",
            "message":    f"⚠️ {len(faces)} faces detected. Possible proxy attempt.",
            "confidence": 0,
            "is_proxy":   True,
            "logged":     should_log,
            "consecutive": consecutive
        }), 400

    with proxy_lock:
        proxy_log[client_ip] = []

    if len(faces) == 0:
        return jsonify({"usn": "No face detected", "confidence": 0})

    # ── Recognize ─────────────────────────────
    recognizer, label_reverse_map = get_recognizer()
    if recognizer is None:
        return jsonify({"usn": "Error", "message": "No trained model. Enroll students first."}), 400

    (x, y, w, h)    = faces[0]
    face_crop        = gray[y:y+h, x:x+w]
    face_resized     = cv2.resize(face_crop, (200, 200))
    #face_resized = preprocess(face_resized)
    # label, raw_conf  = recognizer.predict(face_resized)
    label, raw_conf  = predict_with_voting(recognizer, face_resized, label_reverse_map)
    print(f"[DEBUG] label={label} raw_conf={raw_conf:.1f}")
    # LBPH raw_conf is unbounded (0=perfect, 200+=poor). Map to 0-100%.
    # confidence_pct   = max(0, int(100 - raw_conf / 2))
    confidence_pct   = max(0, int(100 * (1 - raw_conf / CONFIDENCE_THRESHOLD)))
    # if raw_conf > CONFIDENCE_THRESHOLD:
    if label is None or raw_conf > CONFIDENCE_THRESHOLD:
        ts = datetime.now().strftime("%Y%m%d_%H%M%S")
        cv2.imwrite(os.path.join(UNKNOWN_LOG_DIR, f"unknown_{ts}.jpg"), frame)
        print(f"[UNKNOWN] raw={raw_conf:.1f}")
        return jsonify({
            "usn":        "Unknown",
            "message":    "Face not recognised.",
            "confidence": confidence_pct,
            "is_unknown": True
        })

    usn = label_reverse_map.get(label, "Unknown")
    print(f"[RECOGNISED] {usn} raw={raw_conf:.1f} pct={confidence_pct}%")
    return jsonify({
        "usn":        usn,
        "confidence": confidence_pct,
        "is_unknown": False,
        "is_proxy":   False
    })


# ──────────────────────────────────────────────
# /status
# ──────────────────────────────────────────────
@app.route("/status/<usn>", methods=["GET"])
def status(usn):
    folder = os.path.join(FACES_DIR, usn)
    if not os.path.exists(folder):
        return jsonify({"usn": usn, "images": 0, "enrolled": False})
    count = len([f for f in os.listdir(folder) if f.endswith(".jpg")])
    return jsonify({"usn": usn, "images": count, "enrolled": count > 0})


if __name__ == "__main__":
    if os.path.exists(MODEL_PATH):
        try:
            get_recognizer()
            print("[STARTUP] Pre-loaded existing model.")
        except Exception as e:
            print(f"[STARTUP] Could not pre-load model: {e}")

    app.run(port=5000, threaded=True)