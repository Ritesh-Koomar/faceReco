// import axios from "axios";
// import { Link } from "react-router-dom";
// import React, { useEffect, useRef, useState } from "react";
// import { Html5Qrcode } from 'html5-qrcode';

// const Front = () => {
//   const [recognizedName, setRecognizedName] = useState("Roll No. will appear here");
//   const [recognizedStudentName, setRecognizedStudentName] = useState("Name will appear here");
//   const [students, setStudents] = useState([]);
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [successInfo, setSuccessInfo] = useState(null);

//   const [confidence, setConfidence] = useState(null);
//   const [isUnknown, setIsUnknown] = useState(false);
//   const [isProxy, setIsProxy] = useState(false);
//   const [isCameraReady, setIsCameraReady] = useState(false);
//   const [showQR, setShowQR] = useState(false);
//   const [qrResult, setQrResult] = useState(null);
//   const [qrLoading, setQrLoading] = useState(false);
//   const html5QrRef = useRef(null);

//   const [attendancePct, setAttendancePct] = useState(null);
//   const [alertSent, setAlertSent] = useState(false);

//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     const fetchStudents = async () => {
//       try {
//         const response = await axios.get("http://localhost:5001/api/students");
//         setStudents(response.data);
//       } catch (err) {
//         console.error("Error fetching students:", err);
//       }
//     };
//     fetchStudents();
//   }, []);

//   useEffect(() => {
//     const getCamera = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//         if (videoRef.current) {
//           videoRef.current.srcObject = stream;
//           await videoRef.current.play();
//         }
//       } catch (err) {
//         console.error("Camera access error:", err);
//       }
//     };
//     getCamera();
//   }, []);

//   const getMeterColor = () => {
//     if (isProxy || isUnknown) return "#ef4444";
//     if (confidence >= 70) return "#22c55e";
//     if (confidence >= 40) return "#f59e0b";
//     return "#ef4444";
//   };

//   const getMeterLabel = () => {
//     if (isProxy) return "⚠ Proxy Attempt Detected!";
//     if (isUnknown) return "⚠ Unknown Face";
//     if (confidence === null) return "";
//     if (confidence >= 70) return "High Confidence";
//     if (confidence >= 40) return "Low Confidence";
//     return "Not Recognized";
//   };

//   const getPctColor = (pct) => {
//     if (pct >= 75) return "#22c55e";
//     if (pct >= 60) return "#f59e0b";
//     return "#ef4444";
//   };

//   function getCurrentPeriod() {
//     const now = new Date();
//     const hours = now.getHours();
//     const minutes = now.getMinutes();
//     if (hours === 9 && hours < 10) return "ECEN4133";
//     else if (hours === 10 && minutes >= 10 && hours < 11) return "ECEN4142";
//     else if (hours === 11 && minutes >= 20 && hours < 12) return "ECEN4147";
//     else if (hours === 15 && minutes >= 30 && hours < 16) return "CHEN2125";
//     return "No Period";
//   }

//   const handleRecognize = async () => {
//     const video = videoRef.current;
//     const canvas = canvasRef.current;

//     // Reset all state
//     setConfidence(null);
//     setIsUnknown(false);
//     setIsProxy(false);
//     setAttendancePct(null);
//     setAlertSent(false);
//     setShowSuccess(false);
//     setSuccessInfo(null);
//     setShowQR(false);
//     setQrResult(null);

//     if (!isCameraReady || video.videoWidth === 0) {
//       alert("Camera is not ready yet. Please wait.");
//       return;
//     }

//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;
//     canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
//     const imageData = canvas.toDataURL("image/jpeg");

//     try {
//       const response = await axios.post("http://localhost:5000/recognize", { image: imageData });
//       const { usn, confidence: conf, is_unknown, is_proxy } = response.data;

//       setConfidence(conf ?? null);
//       setIsProxy(is_proxy ?? false);

//       const noFace = usn === "No face detected";
//       const unknownFace = (is_unknown ?? false) || noFace;
//       setIsUnknown(unknownFace);

//       // Don't show technical error strings on screen
//       if (noFace || usn === "Error recognizing") {
//         setRecognizedName("USN will appear here");
//         setRecognizedStudentName("Name will appear here");
//       } else {
//         setRecognizedName(usn);
//       }

//       // Proxy — just show the proxy warning, no success
//       if (is_proxy) {
//         setRecognizedStudentName("—");
//         return;
//       }

//       // Unknown or no face — show QR option, stop here
//       if (unknownFace) {
//         setRecognizedStudentName("Name will appear here");
//         return;
//       }

//       // Recognized — find student name
//       const matchedStudent = students.find((s) => s.usn === usn);
//       setRecognizedStudentName(matchedStudent ? matchedStudent.name : "Not found");

//       const recognizedAt = new Date().toISOString();
//       const currentPeriod = getCurrentPeriod();

//       // Outside period — just show attendance %
//       if (currentPeriod === "No Period") {
//         try {
//           const pctRes = await axios.get(`http://localhost:5001/api/attendance-percentage/${usn}`);
//           setAttendancePct(pctRes.data.percentage);
//         } catch (_) {}
//         return;
//       }

//       // Mark attendance
//       try {
//         const res = await axios.post("http://localhost:5001/api/periodwise-attendance", {
//           usn,
//           recognizedAt,
//         });

//         const pct = res.data.percentage;
//         setAttendancePct(pct);
//         setAlertSent(res.data.alertSent ?? false);

//         // Show success animation
//         setShowSuccess(true);
//         setSuccessInfo({
//           name: matchedStudent ? matchedStudent.name : usn,
//           usn: usn,
//           course: currentPeriod,
//           percentage: pct
//         });
//         setTimeout(() => setShowSuccess(false), 4000);

//       } catch (err) {
//         // Already marked today — still fetch and show %
//         try {
//           const pctRes = await axios.get(`http://localhost:5001/api/attendance-percentage/${usn}`);
//           setAttendancePct(pctRes.data.percentage);
//         } catch (_) {}
//       }

//     } catch (err) {
//       console.error(err);
//       // Don't show errors on screen — just reset
//       setRecognizedName("USN will appear here");
//       setRecognizedStudentName("Name will appear here");
//       setConfidence(null);
//     }
//   };

//   const startQrScanner = () => {
//     setQrResult(null);
//     setTimeout(async () => {
//       try {
//         const scanner = new Html5Qrcode("qr-reader-front");
//         html5QrRef.current = scanner;
//         await scanner.start(
//           { facingMode: "environment" },
//           { fps: 10, qrbox: { width: 220, height: 220 } },
//           async (usn) => {
//             await stopQrScanner();
//             setQrLoading(true);
//             try {
//               const res = await axios.post('http://localhost:5001/api/qr-attendance', { usn: usn.trim() });
//               setQrResult({
//                 success: true,
//                 message: res.data.message,
//                 name: res.data.name,
//                 percentage: res.data.percentage
//               });
//             } catch (err) {
//               setQrResult({ success: false, message: err.response?.data?.message || "Failed" });
//             }
//             setQrLoading(false);
//           },
//           () => {}
//         );
//       } catch (err) {
//         console.error("QR scanner error:", err);
//       }
//     }, 100);
//   };

//   const stopQrScanner = async () => {
//     try {
//       if (html5QrRef.current) {
//         await html5QrRef.current.stop();
//         html5QrRef.current = null;
//       }
//     } catch (e) {}
//   };

//   const meterColor = getMeterColor();
//   const meterLabel = getMeterLabel();

//   return (
//     <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]">
//       <div className="flex h-full items-center justify-center">
//         <div className="flex flex-col sm:flex-row gap-5 w-full h-[80vh] p-5">

//           {/* Camera */}
//           <div className="w-1/2 h-full flex items-center justify-center">
//             <div className="w-full max-w-2xl aspect-video bg-black rounded-2xl shadow-2xl overflow-hidden border-2 border-[#E8E4FF]">
//               <video
//                 ref={videoRef}
//                 autoPlay
//                 playsInline
//                 muted
//                 onLoadedMetadata={() => setIsCameraReady(true)}
//                 className="w-full h-full object-cover"
//               />
//               <canvas ref={canvasRef} className="hidden" />
//             </div>
//           </div>

//           {/* Right panel */}
//           <div className="w-1/2 h-full flex flex-col items-center justify-center text-center overflow-y-auto">
//             <h1 className="text-5xl font-bold text-white drop-shadow-md mb-6">
//               Smart Attendance System
//             </h1>

//             <div className="mt-5 text-2xl font-medium text-gray-300">
//               Recognized USN:{" "}
//               <span className={`font-bold ${isUnknown || isProxy ? "text-red-400" : "text-emerald-400"}`}>
//                 {recognizedName}
//               </span>
//             </div>
//             <div className="mt-3 text-2xl font-medium text-gray-300">
//               Recognized Student Name:{" "}
//               <span className={`font-bold ${isUnknown || isProxy ? "text-red-400" : "text-emerald-400"}`}>
//                 {recognizedStudentName}
//               </span>
//             </div>

//             {/* Confidence Meter */}
//             {confidence !== null && (
//               <div className="w-full max-w-sm mt-5 px-2">
//                 <div className="flex justify-between text-sm font-semibold mb-1">
//                   <span style={{ color: meterColor }}>{meterLabel}</span>
//                   <span style={{ color: meterColor }}>{confidence}%</span>
//                 </div>
//                 <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
//                   <div
//                     className="h-full rounded-full transition-all duration-700 ease-out"
//                     style={{ width: `${confidence}%`, backgroundColor: meterColor }}
//                   />
//                 </div>
//               </div>
//             )}

//             {/* Attendance Percentage Bar */}
//             {attendancePct !== null && (
//               <div className="w-full max-w-sm mt-5 px-2">
//                 <div className="flex justify-between text-sm font-semibold mb-1">
//                   <span style={{ color: getPctColor(attendancePct) }}>Overall Attendance</span>
//                   <span style={{ color: getPctColor(attendancePct) }}>{attendancePct}%</span>
//                 </div>
//                 <div className="relative w-full">
//                   <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden">
//                     <div
//                       className="h-full rounded-full transition-all duration-700 ease-out"
//                       style={{ width: `${attendancePct}%`, backgroundColor: getPctColor(attendancePct) }}
//                     />
//                   </div>
//                   <div className="absolute top-0 h-4 w-0.5 bg-white opacity-60" style={{ left: '75%' }} />
//                   <span className="absolute -top-5 text-[10px] text-white opacity-50" style={{ left: '73%' }}>75%</span>
//                 </div>
//                 {attendancePct < 75 && (
//                   <p className="text-red-400 text-xs font-semibold mt-2">
//                     ⚠️ Below minimum · {alertSent ? "Email alert sent ✉️" : ""}
//                   </p>
//                 )}
//               </div>
//             )}

//             {/* Success animation */}
//             {showSuccess && successInfo && (
//               <div className="mt-4 max-w-sm w-full bg-green-900/60 border border-green-500 rounded-xl p-4 flex flex-col items-center gap-2 text-center">
//                 <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white text-2xl font-bold">
//                   ✓
//                 </div>
//                 <p className="text-green-300 font-bold text-lg">Attendance Marked!</p>
//                 <p className="text-white text-sm font-semibold">{successInfo.name}</p>
//                 <p className="text-gray-300 text-xs">{successInfo.course} · <span style={{ color: getPctColor(successInfo.percentage) }}>{successInfo.percentage}%</span></p>
//               </div>
//             )}

//             {/* Proxy warning */}
//             {isProxy && (
//               <div className="mt-4 px-4 py-2 bg-red-900/50 border border-red-500 rounded-xl text-red-300 text-sm font-semibold max-w-sm">
//                 ⚠️ Multiple faces detected! Possible proxy attendance. Incident logged.
//               </div>
//             )}

//             {/* Unknown / No face — show QR fallback */}
//             {isUnknown && !isProxy && (
//               <div className="mt-4 max-w-sm w-full">
//                 <button
//                   onClick={() => { setShowQR(true); startQrScanner(); }}
//                   className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-all flex items-center justify-center gap-2">
//                   📷 Scan QR Code Instead
//                 </button>
//               </div>
//             )}

//             {/* QR Scanner panel */}
//             {showQR && (
//               <div className="mt-4 max-w-sm w-full bg-white/10 border border-white/20 rounded-xl p-4">
//                 <div className="flex justify-between items-center mb-2">
//                   <span className="text-white text-sm font-bold">📷 QR Code Scanner</span>
//                   <button
//                     onClick={() => { stopQrScanner(); setShowQR(false); setQrResult(null); }}
//                     className="text-gray-400 hover:text-white text-lg">
//                     ✕
//                   </button>
//                 </div>

//                 <div id="qr-reader-front" className="w-full rounded-lg overflow-hidden bg-black" />

//                 {qrLoading && (
//                   <p className="text-blue-300 text-sm text-center mt-2 animate-pulse">Marking attendance...</p>
//                 )}

//                 {qrResult && !qrLoading && (
//                   <div className={`mt-2 p-3 rounded-lg text-sm font-semibold ${qrResult.success ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
//                     <p>{qrResult.message}</p>
//                     {qrResult.success && (
//                       <p className="mt-1">
//                         {qrResult.name} · <span style={{ color: getPctColor(qrResult.percentage) }}>{qrResult.percentage}%</span>
//                       </p>
//                     )}
//                     <button
//                       onClick={() => { setQrResult(null); startQrScanner(); }}
//                       className="mt-2 w-full py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold">
//                       Scan Another
//                     </button>
//                   </div>
//                 )}
//               </div>
//             )}

//             <div className="flex flex-row gap-3">
//               <button
//                 onClick={handleRecognize}
//                 className="mt-8 transition-background inline-flex h-12 items-center justify-center rounded-xl border border-gray-800 bg-gradient-to-r from-gray-100 via-[#c7d2fe] to-[#8678f9] bg-[length:200%_200%] bg-[0%_0%] px-6 font-medium text-gray-950 duration-500 hover:bg-[100%_200%] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-50"
//               >
//                 Recognize Face
//               </button>

//               <Link to="/Signin">
//                 <button className="mt-8 transition-background inline-flex h-12 items-center justify-center rounded-xl border border-gray-800 bg-gradient-to-r from-gray-100 via-[#c7d2fe] to-[#8678f9] bg-[length:200%_200%] bg-[0%_0%] px-6 font-medium text-gray-950 duration-500 hover:bg-[100%_200%] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-50">
//                   Dashboard
//                 </button>
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Front;



import axios from "axios";
import { Link } from "react-router-dom";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { Html5Qrcode } from 'html5-qrcode';

const DETECT_INTERVAL = 300; // ms between /detect calls

const Front = () => {
  const [recognizedName, setRecognizedName] = useState("Roll No. will appear here");
  const [recognizedStudentName, setRecognizedStudentName] = useState("Name will appear here");
  const [students, setStudents] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successInfo, setSuccessInfo] = useState(null);

  const [confidence, setConfidence] = useState(null);
  const [isUnknown, setIsUnknown] = useState(false);
  const [isProxy, setIsProxy] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [qrResult, setQrResult] = useState(null);
  const [qrLoading, setQrLoading] = useState(false);
  const html5QrRef = useRef(null);

  const [attendancePct, setAttendancePct] = useState(null);
  const [alertSent, setAlertSent] = useState(false);
  const [faceCount, setFaceCount] = useState(0); // live face count from /detect

  const videoRef    = useRef(null);
  const canvasRef   = useRef(null); // hidden canvas for capture
  const overlayRef  = useRef(null); // visible canvas for bounding boxes
  const detectLoop  = useRef(null);

  // ── Draw bounding boxes on the overlay canvas ──────────────────
  const drawBoxes = useCallback((faces) => {
    const video   = videoRef.current;
    const overlay = overlayRef.current;
    if (!overlay || !video) return;

    const ctx = overlay.getContext("2d");
    overlay.width  = video.videoWidth  || overlay.offsetWidth;
    overlay.height = video.videoHeight || overlay.offsetHeight;
    ctx.clearRect(0, 0, overlay.width, overlay.height);

    const scaleX = overlay.width  / (video.videoWidth  || 1);
    const scaleY = overlay.height / (video.videoHeight || 1);

    faces.forEach((f) => {
      const x = f.x * scaleX;
      const y = f.y * scaleY;
      const w = f.w * scaleX;
      const h = f.h * scaleY;

      // Main rectangle
      ctx.strokeStyle = "#a78bfa"; // purple to match the page theme
      ctx.lineWidth   = 2.5;
      ctx.strokeRect(x, y, w, h);

      // Corner accents
      const c = 16;
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth   = 2.5;
      [
        [x,     y,      c,  0,  0,  c],
        [x + w, y,     -c,  0,  0,  c],
        [x,     y + h,  c,  0,  0, -c],
        [x + w, y + h, -c,  0,  0, -c],
      ].forEach(([cx, cy, dx, , , dy]) => {
        ctx.beginPath();
        ctx.moveTo(cx + dx, cy);
        ctx.lineTo(cx, cy);
        ctx.lineTo(cx, cy + dy);
        ctx.stroke();
      });

      // Label pill above the box
      const label = "Face detected";
      ctx.font = "bold 12px sans-serif";
      const tw  = ctx.measureText(label).width;
      const px  = 8, py = 4, r = 6;
      const bx  = x, by = y - 26, bw = tw + px * 2, bh = 22;

      ctx.fillStyle = "rgba(167,139,250,0.85)";
      ctx.beginPath();
      ctx.moveTo(bx + r, by);
      ctx.lineTo(bx + bw - r, by);
      ctx.quadraticCurveTo(bx + bw, by, bx + bw, by + r);
      ctx.lineTo(bx + bw, by + bh - r);
      ctx.quadraticCurveTo(bx + bw, by + bh, bx + bw - r, by + bh);
      ctx.lineTo(bx + r, by + bh);
      ctx.quadraticCurveTo(bx, by + bh, bx, by + bh - r);
      ctx.lineTo(bx, by + r);
      ctx.quadraticCurveTo(bx, by, bx + r, by);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.fillText(label, bx + px, by + bh - py - 1);
    });
  }, []);

  // ── Start the live detect loop once camera is ready ────────────
  const startDetectLoop = useCallback(() => {
    if (detectLoop.current) clearInterval(detectLoop.current);

    detectLoop.current = setInterval(async () => {
      const video = videoRef.current;
      if (!video || video.readyState < 2 || video.videoWidth === 0) return;

      // Grab a frame
      const tmp = document.createElement("canvas");
      tmp.width  = video.videoWidth;
      tmp.height = video.videoHeight;
      tmp.getContext("2d").drawImage(video, 0, 0);
      const image = tmp.toDataURL("image/jpeg", 0.7);

      try {
        const res = await axios.post("http://localhost:5000/detect", { image });
        const faces = res.data.faces || [];
        setFaceCount(faces.length);
        drawBoxes(faces);
      } catch {
        // Flask not reachable — clear overlay silently
        setFaceCount(0);
        drawBoxes([]);
      }
    }, DETECT_INTERVAL);
  }, [drawBoxes]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/students");
        setStudents(response.data);
      } catch (err) {
        console.error("Error fetching students:", err);
      }
    };
    fetchStudents();
  }, []);

  useEffect(() => {
    const getCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (err) {
        console.error("Camera access error:", err);
      }
    };
    getCamera();

    return () => {
      // Cleanup on unmount
      if (detectLoop.current) clearInterval(detectLoop.current);
    };
  }, []);

  // Start detect loop once camera metadata is loaded
  const handleCameraReady = () => {
    setIsCameraReady(true);
    startDetectLoop();
  };

  const getMeterColor = () => {
    if (isProxy || isUnknown) return "#ef4444";
    if (confidence >= 70) return "#22c55e";
    if (confidence >= 40) return "#f59e0b";
    return "#ef4444";
  };

  const getMeterLabel = () => {
    if (isProxy) return "⚠ Proxy Attempt Detected!";
    if (isUnknown) return "⚠ Unknown Face";
    if (confidence === null) return "";
    if (confidence >= 70) return "High Confidence";
    if (confidence >= 40) return "Low Confidence";
    return "Not Recognized";
  };

  const getPctColor = (pct) => {
    if (pct >= 75) return "#22c55e";
    if (pct >= 60) return "#f59e0b";
    return "#ef4444";
  };

  function getCurrentPeriod() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    if (hours <= 9 ) return "ECEN4133";
    else if (hours === 10 && minutes >= 10 && hours < 11) return "ECEN4142";
    else if (hours === 11 && minutes >= 20 && hours < 12) return "ECEN4147";
    else if (hours === 15 && minutes >= 30 && hours < 16) return "CHEN2125";
    return "No Period";
  }

  const handleRecognize = async () => {
    const video  = videoRef.current;
    const canvas = canvasRef.current;

    setConfidence(null);
    setIsUnknown(false);
    setIsProxy(false);
    setAttendancePct(null);
    setAlertSent(false);
    setShowSuccess(false);
    setSuccessInfo(null);
    setShowQR(false);
    setQrResult(null);

    if (!isCameraReady || video.videoWidth === 0) {
      alert("Camera is not ready yet. Please wait.");
      return;
    }

    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL("image/jpeg");

    try {
      const response = await axios.post("http://localhost:5000/recognize", { image: imageData });
      const { usn, confidence: conf, is_unknown, is_proxy } = response.data;

      setConfidence(conf ?? null);
      setIsProxy(is_proxy ?? false);

      const noFace     = usn === "No face detected";
      const unknownFace = (is_unknown ?? false) || noFace;
      setIsUnknown(unknownFace);

      if (noFace || usn === "Error recognizing") {
        setRecognizedName("USN will appear here");
        setRecognizedStudentName("Name will appear here");
      } else {
        setRecognizedName(usn);
      }

      if (is_proxy) {
        setRecognizedStudentName("—");
        return;
      }

      if (unknownFace) {
        setRecognizedStudentName("Name will appear here");
        return;
      }

      const matchedStudent = students.find((s) => s.usn === usn);
      setRecognizedStudentName(matchedStudent ? matchedStudent.name : "Not found");

      const recognizedAt  = new Date().toISOString();
      const currentPeriod = getCurrentPeriod();

      if (currentPeriod === "No Period") {
        try {
          const pctRes = await axios.get(`http://localhost:5001/api/attendance-percentage/${usn}`);
          setAttendancePct(pctRes.data.percentage);
        } catch (_) {}
        return;
      }

      try {
        const res = await axios.post("http://localhost:5001/api/periodwise-attendance", {
          usn,
          recognizedAt,
        });

        const pct = res.data.percentage;
        setAttendancePct(pct);
        setAlertSent(res.data.alertSent ?? false);

        setShowSuccess(true);
        setSuccessInfo({
          name:       matchedStudent ? matchedStudent.name : usn,
          usn:        usn,
          course:     currentPeriod,
          percentage: pct,
        });
        setTimeout(() => setShowSuccess(false), 4000);

      } catch (err) {
        try {
          const pctRes = await axios.get(`http://localhost:5001/api/attendance-percentage/${usn}`);
          setAttendancePct(pctRes.data.percentage);
        } catch (_) {}
      }

    } catch (err) {
      console.error(err);
      setRecognizedName("USN will appear here");
      setRecognizedStudentName("Name will appear here");
      setConfidence(null);
    }
  };

  const startQrScanner = () => {
    setQrResult(null);
    setTimeout(async () => {
      try {
        const scanner = new Html5Qrcode("qr-reader-front");
        html5QrRef.current = scanner;
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 220, height: 220 } },
          async (usn) => {
            await stopQrScanner();
            setQrLoading(true);
            try {
              const res = await axios.post('http://localhost:5001/api/qr-attendance', { usn: usn.trim() });
              setQrResult({
                success:    true,
                message:    res.data.message,
                name:       res.data.name,
                percentage: res.data.percentage,
              });
            } catch (err) {
              setQrResult({ success: false, message: err.response?.data?.message || "Failed" });
            }
            setQrLoading(false);
          },
          () => {}
        );
      } catch (err) {
        console.error("QR scanner error:", err);
      }
    }, 100);
  };

  const stopQrScanner = async () => {
    try {
      if (html5QrRef.current) {
        await html5QrRef.current.stop();
        html5QrRef.current = null;
      }
    } catch (e) {}
  };

  const meterColor = getMeterColor();
  const meterLabel = getMeterLabel();

  return (
    <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]">
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col sm:flex-row gap-5 w-full h-[80vh] p-5">

          {/* ── Camera + overlay ── */}
          <div className="w-1/2 h-full flex flex-col items-center justify-center gap-3">

            {/* Live face-count badge */}
            <div className={`text-xs font-semibold px-3 py-1 rounded-full transition-colors ${
              faceCount > 0
                ? "bg-purple-600/80 text-white"
                : "bg-white/10 text-gray-400"
            }`}>
              {faceCount > 0
                ? `${faceCount} face${faceCount > 1 ? "s" : ""} detected`
                : "No face in frame"}
            </div>

            {/* Video wrapper — position:relative lets the canvas sit on top */}
            <div className="relative w-full max-w-2xl aspect-video bg-black rounded-2xl shadow-2xl overflow-hidden border-2 border-[#E8E4FF]">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                onLoadedMetadata={handleCameraReady}
                className="w-full h-full object-cover"
              />

              {/* Overlay canvas — exactly covers the video */}
              <canvas
                ref={overlayRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
              />

              {/* Hidden capture canvas (unchanged) */}
              <canvas ref={canvasRef} className="hidden" />
            </div>
          </div>

          {/* ── Right panel (unchanged) ── */}
          <div className="w-1/2 h-full flex flex-col items-center justify-center text-center overflow-y-auto">
            <h1 className="text-5xl font-bold text-white drop-shadow-md mb-6">
              Smart Attendance System
            </h1>

            <div className="mt-5 text-2xl font-medium text-gray-300">
              Recognized USN:{" "}
              <span className={`font-bold ${isUnknown || isProxy ? "text-red-400" : "text-emerald-400"}`}>
                {recognizedName}
              </span>
            </div>
            <div className="mt-3 text-2xl font-medium text-gray-300">
              Recognized Student Name:{" "}
              <span className={`font-bold ${isUnknown || isProxy ? "text-red-400" : "text-emerald-400"}`}>
                {recognizedStudentName}
              </span>
            </div>

            {/* Confidence Meter */}
            {confidence !== null && (
              <div className="w-full max-w-sm mt-5 px-2">
                <div className="flex justify-between text-sm font-semibold mb-1">
                  <span style={{ color: meterColor }}>{meterLabel}</span>
                  <span style={{ color: meterColor }}>{confidence}%</span>
                </div>
                <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${confidence}%`, backgroundColor: meterColor }}
                  />
                </div>
              </div>
            )}

            {/* Attendance Percentage Bar */}
            {attendancePct !== null && (
              <div className="w-full max-w-sm mt-5 px-2">
                <div className="flex justify-between text-sm font-semibold mb-1">
                  <span style={{ color: getPctColor(attendancePct) }}>Overall Attendance</span>
                  <span style={{ color: getPctColor(attendancePct) }}>{attendancePct}%</span>
                </div>
                <div className="relative w-full">
                  <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${attendancePct}%`, backgroundColor: getPctColor(attendancePct) }}
                    />
                  </div>
                  <div className="absolute top-0 h-4 w-0.5 bg-white opacity-60" style={{ left: "75%" }} />
                  <span className="absolute -top-5 text-[10px] text-white opacity-50" style={{ left: "73%" }}>75%</span>
                </div>
                {attendancePct < 75 && (
                  <p className="text-red-400 text-xs font-semibold mt-2">
                    ⚠️ Below minimum · {alertSent ? "Email alert sent ✉️" : ""}
                  </p>
                )}
              </div>
            )}

            {/* Success animation */}
            {showSuccess && successInfo && (
              <div className="mt-4 max-w-sm w-full bg-green-900/60 border border-green-500 rounded-xl p-4 flex flex-col items-center gap-2 text-center">
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white text-2xl font-bold">
                  ✓
                </div>
                <p className="text-green-300 font-bold text-lg">Attendance Marked!</p>
                <p className="text-white text-sm font-semibold">{successInfo.name}</p>
                <p className="text-gray-300 text-xs">
                  {successInfo.course} · <span style={{ color: getPctColor(successInfo.percentage) }}>{successInfo.percentage}%</span>
                </p>
              </div>
            )}

            {/* Proxy warning */}
            {isProxy && (
              <div className="mt-4 px-4 py-2 bg-red-900/50 border border-red-500 rounded-xl text-red-300 text-sm font-semibold max-w-sm">
                ⚠️ Multiple faces detected! Possible proxy attendance. Incident logged.
              </div>
            )}

            {/* Unknown / No face — QR fallback */}
            {isUnknown && !isProxy && (
              <div className="mt-4 max-w-sm w-full">
                <button
                  onClick={() => { setShowQR(true); startQrScanner(); }}
                  className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-all flex items-center justify-center gap-2"
                >
                  📷 Scan QR Code Instead
                </button>
              </div>
            )}

            {/* QR Scanner panel */}
            {showQR && (
              <div className="mt-4 max-w-sm w-full bg-white/10 border border-white/20 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white text-sm font-bold">📷 QR Code Scanner</span>
                  <button
                    onClick={() => { stopQrScanner(); setShowQR(false); setQrResult(null); }}
                    className="text-gray-400 hover:text-white text-lg"
                  >
                    ✕
                  </button>
                </div>

                <div id="qr-reader-front" className="w-full rounded-lg overflow-hidden bg-black" />

                {qrLoading && (
                  <p className="text-blue-300 text-sm text-center mt-2 animate-pulse">Marking attendance...</p>
                )}

                {qrResult && !qrLoading && (
                  <div className={`mt-2 p-3 rounded-lg text-sm font-semibold ${qrResult.success ? "bg-green-900/50 text-green-300" : "bg-red-900/50 text-red-300"}`}>
                    <p>{qrResult.message}</p>
                    {qrResult.success && (
                      <p className="mt-1">
                        {qrResult.name} · <span style={{ color: getPctColor(qrResult.percentage) }}>{qrResult.percentage}%</span>
                      </p>
                    )}
                    <button
                      onClick={() => { setQrResult(null); startQrScanner(); }}
                      className="mt-2 w-full py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
                    >
                      Scan Another
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-row gap-3">
              <button
                onClick={handleRecognize}
                className="mt-8 transition-background inline-flex h-12 items-center justify-center rounded-xl border border-gray-800 bg-gradient-to-r from-gray-100 via-[#c7d2fe] to-[#8678f9] bg-[length:200%_200%] bg-[0%_0%] px-6 font-medium text-gray-950 duration-500 hover:bg-[100%_200%] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-50"
              >
                Recognize Face
              </button>

              <Link to="/Signin">
                <button className="mt-8 transition-background inline-flex h-12 items-center justify-center rounded-xl border border-gray-800 bg-gradient-to-r from-gray-100 via-[#c7d2fe] to-[#8678f9] bg-[length:200%_200%] bg-[0%_0%] px-6 font-medium text-gray-950 duration-500 hover:bg-[100%_200%] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-50">
                  Dashboard
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Front;