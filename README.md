# Smart Attendance System using Face Recognition

A smart attendance management system that uses face recognition to automatically identify students and mark their attendance. The system is designed to reduce manual attendance work, minimize proxy attendance, and maintain attendance records digitally.

## Features

- Face detection and recognition using OpenCV
- Automatic attendance marking
- Student registration and image capture
- Face training and recognition
- Attendance records stored digitally
- CSV-based student and attendance management
- Tkinter-based desktop interface
- Node.js backend for server-side operations
- MongoDB database integration
- QR code-based attendance as a fallback mechanism
- Email notification support
- Attendance monitoring and record management

## Technologies Used

### Frontend
- HTML
- CSS
- JavaScript
- React.js

### Backend
- Python
- Flask
- Node.js
- Express.js

### Database
- MongoDB
- CSV files for local student and attendance records

### Computer Vision
- OpenCV
- Haar Cascade Classifier
- LBPH (Local Binary Pattern Histogram)
- Face Recognition / facial feature extraction

### Other Tools and Libraries
- Tkinter
- NumPy
- Pandas
- Mongoose
- CORS

## System Workflow

The system follows the following basic workflow:

1. Student details are registered in the system.
2. Images of the student are captured using a camera.
3. The captured images are pre-processed.
4. Facial features are extracted and the recognition model is trained.
5. During attendance, the camera captures the student's face.
6. The system detects and recognizes the face.
7. If the student is recognized, attendance is automatically recorded.
8. Attendance data is stored for later viewing and management.
9. A QR code can be used as an alternative method when face recognition is unsuccessful.

## Face Recognition Process

The recognition pipeline consists of:

```text
Camera
   ↓
Face Detection
   ↓
Image Pre-processing
   ↓
Feature Extraction
   ↓
LBPH Recognition
   ↓
Face Matching
   ↓
Student Identification
   ↓
Attendance Marked
