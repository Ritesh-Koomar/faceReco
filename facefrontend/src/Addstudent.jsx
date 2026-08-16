
// // // // // import "./App.css";
// // // // // import { FaHome, FaFileAlt, FaUser, FaDownload, FaClock } from 'react-icons/fa';
// // // // // import { Link } from 'react-router-dom';
// // // // // import axios from 'axios';
// // // // // import React, { useState, useEffect, useRef } from 'react';

// // // // // const Addstudent = () => {
// // // // //   const videoRef = useRef(null);
// // // // //   const canvasRef = useRef(null);

// // // // //   const [student, setStudent] = useState({
// // // // //     name: '',
// // // // //     usn: '',
// // // // //     age: '',
// // // // //     course: '',
// // // // //     phone: ''
// // // // //   });

// // // // //   useEffect(() => {
// // // // //     const getCameraStream = async () => {
// // // // //       try {
// // // // //         const stream = await navigator.mediaDevices.getUserMedia({ video: true });
// // // // //         if (videoRef.current) {
// // // // //           videoRef.current.srcObject = stream;
// // // // //         }
// // // // //       } catch (err) {
// // // // //         console.error("Error accessing webcam: ", err);
// // // // //       }
// // // // //     };

// // // // //     getCameraStream();

// // // // //     return () => {
// // // // //       if (videoRef.current && videoRef.current.srcObject) {
// // // // //         const tracks = videoRef.current.srcObject.getTracks();
// // // // //         tracks.forEach((track) => track.stop());
// // // // //       }
// // // // //     };
// // // // //   }, []);

// // // // //   const handleChange = (e) => {
// // // // //     setStudent({ ...student, [e.target.name]: e.target.value });
// // // // //   };
// // // // // /*
// // // // //   const captureAndSend = async () => {
// // // // //     const video = videoRef.current;
// // // // //     const canvas = canvasRef.current;

// // // // //     if (!student.name || !student.usn || !student.age || !student.course || !student.phone) {
// // // // //       alert("Please fill in all student details.");
// // // // //       return;
// // // // //     }

// // // // //     if (video && canvas) {
// // // // //       const context = canvas.getContext('2d');
// // // // //       context.drawImage(video, 0, 0, canvas.width, canvas.height);

// // // // //       const imageData = canvas.toDataURL('image/jpeg');

// // // // //       try {
// // // // //         const response = await fetch('http://localhost:5000/enroll', {
// // // // //           method: 'POST',
// // // // //           headers: { 'Content-Type': 'application/json' },
// // // // //           body: JSON.stringify({ usn: student.usn, image: imageData })
// // // // //         });

// // // // //         const result = await response.json();
// // // // //         alert(result.message);

// // // // //         const dataResponse = await fetch('http://localhost:5001/api/students', {
// // // // //           method: 'POST',
// // // // //           headers: { 'Content-Type': 'application/json' },
// // // // //           body: JSON.stringify(student)
// // // // //         });

// // // // //         const dataResult = await dataResponse.json();
// // // // //         console.log('Student DB response:', dataResult.message);

// // // // //         alert('Student enrolled successfully!');
// // // // //         setStudent({ name: '', age: '', course: '', phone: '', usn: '' });

// // // // //       } catch (err) {
// // // // //         console.error('Error sending data to backend:', err);
// // // // //         alert("Failed to enroll face.");
// // // // //       }
// // // // //     }
// // // // //   };
// // // // //   */

// // // // //   const captureAndSend = async () => {
// // // // //   const video = videoRef.current;
// // // // //   const canvas = canvasRef.current;

// // // // //   if (!student.name || !student.usn || !student.age || !student.course || !student.phone) {
// // // // //     alert("Please fill in all student details.");
// // // // //     return;
// // // // //   }

// // // // //   // ✅ Fix 1: Check the video stream is actually playing
// // // // //   if (!video || video.readyState < 2 || video.videoWidth === 0) {
// // // // //     alert("Camera is not ready yet. Please wait a moment.");
// // // // //     return;
// // // // //   }

// // // // //   if (video && canvas) {
// // // // //     // ✅ Fix 2: Match canvas to actual video dimensions
// // // // //     canvas.width = video.videoWidth;
// // // // //     canvas.height = video.videoHeight;

// // // // //     const context = canvas.getContext('2d');
// // // // //     context.drawImage(video, 0, 0, canvas.width, canvas.height);

// // // // //     const imageData = canvas.toDataURL('image/jpeg');

// // // // //     try {
// // // // //       const response = await fetch('http://localhost:5000/enroll', {
// // // // //         method: 'POST',
// // // // //         headers: { 'Content-Type': 'application/json' },
// // // // //         body: JSON.stringify({ usn: student.usn, image: imageData })
// // // // //       });

// // // // //       const result = await response.json();

// // // // //       if (!response.ok) {
// // // // //         alert(result.message); // e.g. "No face detected"
// // // // //         return;               // ✅ Fix 3: Stop here, don't save to DB
// // // // //       }

// // // // //       const dataResponse = await fetch('http://localhost:5001/api/students', {
// // // // //         method: 'POST',
// // // // //         headers: { 'Content-Type': 'application/json' },
// // // // //         body: JSON.stringify(student)
// // // // //       });

// // // // //       const dataResult = await dataResponse.json();
// // // // //       console.log('Student DB response:', dataResult.message);

// // // // //       alert('Student enrolled successfully!');
// // // // //       setStudent({ name: '', age: '', course: '', phone: '', usn: '' });

// // // // //     } catch (err) {
// // // // //       console.error('Error sending data to backend:', err);
// // // // //       alert("Failed to enroll face.");
// // // // //     }
// // // // //   }
// // // // // };

// // // // //   return (
// // // // //     <div className="min-h-screen p-4 bg-split">
// // // // //       <div className="flex flex-col lg:flex-row gap-6">


// // // // //         <div className="w-full lg:w-64 bg-white shadow-xl rounded-2xl p-4 flex flex-col justify-between min-h-[90vh]">
// // // // //           <div>
// // // // //             <h2 className="text-xl font-semibold text-center mb-6">Admin Page</h2>
// // // // //             <div className="flex flex-col gap-5">
// // // // //               <Link to="/dashboard">
// // // // //                 <button className="flex items-center space-x-2 w-full text-left py-2 px-4 rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-all duration-300">
// // // // //                   <FaHome className="text-purple-600" />
// // // // //                   <span>Home</span>
// // // // //                 </button>
// // // // //               </Link>
// // // // //               <Link to="/Addstudent">
// // // // //                 <button className="flex items-center space-x-2 w-full text-left py-2 px-4 rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-all duration-300">
// // // // //                   <FaUser className="text-black" />
// // // // //                   <span>Add Students</span>
// // // // //                 </button>
// // // // //               </Link>
// // // // //               <Link to="/Enrolled">
// // // // //                 <button className="flex items-center space-x-2 w-full text-left py-2 px-4 rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-all duration-300">
// // // // //                   <FaFileAlt className="text-red-500" />
// // // // //                   <span>Enrolled</span>
// // // // //                 </button>
// // // // //               </Link>
// // // // //               <Link to="/Period">
// // // // //                 <button className="flex items-center space-x-2 w-full text-left py-2 px-4 rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-all duration-300">
// // // // //                   <FaClock className="text-green-500" />
// // // // //                   <span>Period Wise</span>
// // // // //                 </button>
// // // // //               </Link>
// // // // //             </div>
// // // // //           </div>
// // // // //           <Link to='/signin'>
// // // // //             <button className="w-full py-2 rounded-xl bg-[#1E2A78] text-white shadow-md flex items-center justify-center space-x-2 hover:bg-[#16239D] active:bg-[#0f1c77] transition-all duration-300">
// // // // //               <FaDownload />
// // // // //               <span>LogOut</span>
// // // // //             </button></Link>
// // // // //         </div>

// // // // //         {/* Main Content */}
// // // // //         <div className="flex-1">
// // // // //           <div className="flex flex-col md:flex-row justify-between items-start md:items-center text-white mt-2 gap-4">

// // // // //           </div>

// // // // //           <div className="bg-white rounded-[1.1rem] shadow-md p-4">
// // // // //             <h1 className="text-gray-900 font-semibold mb-4 ml-2">Add Students Here</h1>
// // // // //             <div className="w-full grid gap-5 grid-cols-2 mt-5 p-5">
// // // // //               <input type="text" name="name" value={student.name} onChange={handleChange} className="placeholder:text-gray-700 rounded-xl bg-[#F7F7F7] px-4 py-2" placeholder="Enter the student's name" />
// // // // //               <input type="text" name="usn" value={student.usn} onChange={handleChange} className="placeholder:text-gray-700 rounded-xl bg-[#F7F7F7] px-4 py-2" placeholder="Enter the USN" />
// // // // //               <input type="text" name="age" value={student.age} onChange={handleChange} className="placeholder:text-gray-700 rounded-xl bg-[#F7F7F7] px-4 py-2" placeholder="Enter the age" />
// // // // //               <input type="text" name="course" value={student.course} onChange={handleChange} className="placeholder:text-gray-700 rounded-xl bg-[#F7F7F7] px-4 py-2" placeholder="Enter the course" />
// // // // //               <input type="number" name="phone" value={student.phone} onChange={handleChange} className="placeholder:text-gray-700 rounded-xl bg-[#F7F7F7] px-4 py-2" placeholder="Enter the mobile number" />
// // // // //             </div>

// // // // //             {/* Camera & Button */}
// // // // //             <div className='flex flex-col lg:flex-row w-full gap-4 mt-6'>
// // // // //               <div className='w-full lg:w-1/2 h-[53vh] bg-white/20 backdrop-blur-lg border border-gray-50 rounded-2xl p-2 flex justify-center items-center overflow-hidden'>
// // // // //                 <div className="w-full h-full bg-black rounded-2xl shadow-2xl overflow-hidden">
// // // // //                    {/* <video ref={videoRef} autoPlay muted className="w-full h-full object-cover" />  */}
                  
// // // // //                   <video 
// // // // //   ref={videoRef} 
// // // // //   autoPlay 
// // // // //   muted 
// // // // //   onLoadedMetadata={() => console.log("Camera ready")}
// // // // //   className="w-full h-full object-cover" 
// // // // // />

// // // // //                   <canvas ref={canvasRef} width="640" height="480" className="hidden"></canvas>
// // // // //                 </div>
// // // // //               </div>
// // // // //               <div className='w-full lg:w-1/2 flex flex-col justify-start mt-5 items-center text-center'>
// // // // //                 <h1 className='text-gray-800 font-bold text-[1.5rem] mb-4'>Please place your face properly</h1>
// // // // //                 <button
// // // // //                   onClick={captureAndSend}
// // // // //                   className='w-sm rounded-xl bg-gradient-to-r from-blue-700 to-blue-600 px-8 py-3 font-bold text-white transition-all hover:opacity-90 hover:shadow-lg'>
// // // // //                   Enroll Face
// // // // //                 </button>
// // // // //               </div>
// // // // //             </div>
// // // // //           </div>


// // // // //         </div>
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default Addstudent;




// // // // // ***********************************

// // // // import "./App.css";
// // // // import { FaHome, FaFileAlt, FaUser, FaDownload, FaClock } from 'react-icons/fa';
// // // // import { Link } from 'react-router-dom';
// // // // import React, { useState, useEffect, useRef } from 'react';

// // // // const Addstudent = () => {
// // // //   const videoRef = useRef(null);
// // // //   const canvasRef = useRef(null);
// // // //   const overlayCanvasRef = useRef(null);   // ← live bounding box overlay
// // // //   const detectIntervalRef = useRef(null);  // ← polling timer

// // // //   const [isCameraReady, setIsCameraReady] = useState(false);
// // // //   const [faceCount, setFaceCount] = useState(0);

// // // //   const [student, setStudent] = useState({
// // // //     name: '', usn: '', age: '', course: '', phone: ''
// // // //   });

// // // //   // ── Start camera ──
// // // //   useEffect(() => {
// // // //     const getCameraStream = async () => {
// // // //       try {
// // // //         const stream = await navigator.mediaDevices.getUserMedia({ video: true });
// // // //         if (videoRef.current) {
// // // //           videoRef.current.srcObject = stream;
// // // //           await videoRef.current.play();
// // // //         }
// // // //       } catch (err) {
// // // //         console.error("Error accessing webcam:", err);
// // // //         alert("Camera access denied: " + err.message);
// // // //       }
// // // //     };

// // // //     getCameraStream();

// // // //     return () => {
// // // //       if (detectIntervalRef.current) clearInterval(detectIntervalRef.current);
// // // //       if (videoRef.current?.srcObject) {
// // // //         videoRef.current.srcObject.getTracks().forEach(t => t.stop());
// // // //       }
// // // //     };
// // // //   }, []);

// // // //   // ── Start polling /detect once camera is ready ──
// // // //   useEffect(() => {
// // // //     if (!isCameraReady) return;

// // // //     detectIntervalRef.current = setInterval(async () => {
// // // //       const video = videoRef.current;
// // // //       const overlay = overlayCanvasRef.current;
// // // //       if (!video || !overlay || video.videoWidth === 0) return;

// // // //       // Capture low-quality frame for speed
// // // //       const tempCanvas = document.createElement('canvas');
// // // //       tempCanvas.width = video.videoWidth;
// // // //       tempCanvas.height = video.videoHeight;
// // // //       tempCanvas.getContext('2d').drawImage(video, 0, 0);
// // // //       const imageData = tempCanvas.toDataURL('image/jpeg', 0.4);

// // // //       try {
// // // //         const res = await fetch('http://localhost:5000/detect', {
// // // //           method: 'POST',
// // // //           headers: { 'Content-Type': 'application/json' },
// // // //           body: JSON.stringify({ image: imageData })
// // // //         });
// // // //         const result = await res.json();
// // // //         setFaceCount(result.count);

// // // //         // Draw boxes on overlay canvas
// // // //         const ctx = overlay.getContext('2d');
// // // //         ctx.clearRect(0, 0, overlay.width, overlay.height);

// // // //         const scaleX = overlay.width / video.videoWidth;
// // // //         const scaleY = overlay.height / video.videoHeight;

// // // //         result.faces.forEach(face => {
// // // //           const color = result.count > 1 ? '#ef4444' : '#22c55e'; // red if multiple faces
// // // //           ctx.strokeStyle = color;
// // // //           ctx.lineWidth = 2.5;
// // // //           ctx.shadowColor = color;
// // // //           ctx.shadowBlur = 8;
// // // //           ctx.strokeRect(
// // // //             face.x * scaleX,
// // // //             face.y * scaleY,
// // // //             face.w * scaleX,
// // // //             face.h * scaleY
// // // //           );

// // // //           // Label above box
// // // //           ctx.shadowBlur = 0;
// // // //           ctx.fillStyle = color;
// // // //           ctx.font = 'bold 13px monospace';
// // // //           ctx.fillText(
// // // //             result.count > 1 ? '⚠ Multiple!' : 'Face',
// // // //             face.x * scaleX + 4,
// // // //             face.y * scaleY - 6
// // // //           );
// // // //         });
// // // //       } catch (_) {
// // // //         // silent fail — backend may not be running
// // // //       }
// // // //     }, 500);

// // // //     return () => clearInterval(detectIntervalRef.current);
// // // //   }, [isCameraReady]);

// // // //   const handleChange = (e) => {
// // // //     setStudent({ ...student, [e.target.name]: e.target.value });
// // // //   };

// // // //   const captureAndSend = async () => {
// // // //     const video = videoRef.current;
// // // //     const canvas = canvasRef.current;

// // // //     if (!student.name || !student.usn || !student.age || !student.course || !student.phone) {
// // // //       alert("Please fill in all student details.");
// // // //       return;
// // // //     }

// // // //     if (!isCameraReady || !video || video.videoWidth === 0) {
// // // //       alert("Camera is not ready yet. Please wait a moment.");
// // // //       return;
// // // //     }

// // // //     if (faceCount > 1) {
// // // //       alert("⚠️ Multiple faces detected! Please ensure only one person is in frame.");
// // // //       return;
// // // //     }

// // // //     // Match canvas to real video size
// // // //     canvas.width = video.videoWidth;
// // // //     canvas.height = video.videoHeight;
// // // //     canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
// // // //     const imageData = canvas.toDataURL('image/jpeg');

// // // //     try {
// // // //       const response = await fetch('http://localhost:5000/enroll', {
// // // //         method: 'POST',
// // // //         headers: { 'Content-Type': 'application/json' },
// // // //         body: JSON.stringify({ usn: student.usn, image: imageData })
// // // //       });

// // // //       const result = await response.json();

// // // //       if (!response.ok) {
// // // //         alert(result.message);
// // // //         return;
// // // //       }

// // // //       // Save to student DB
// // // //       const dataResponse = await fetch('http://localhost:5001/api/students', {
// // // //         method: 'POST',
// // // //         headers: { 'Content-Type': 'application/json' },
// // // //         body: JSON.stringify(student)
// // // //       });

// // // //       const dataResult = await dataResponse.json();
// // // //       console.log('Student DB response:', dataResult.message);

// // // //       alert('✅ Student enrolled successfully!');
// // // //       setStudent({ name: '', age: '', course: '', phone: '', usn: '' });

// // // //     } catch (err) {
// // // //       console.error('Error sending data to backend:', err);
// // // //       alert("Failed to enroll face.");
// // // //     }
// // // //   };

// // // //   // Face count status badge
// // // //   const faceStatus = () => {
// // // //     if (!isCameraReady) return { text: 'Camera loading...', color: 'text-gray-400' };
// // // //     if (faceCount === 0) return { text: 'No face detected', color: 'text-yellow-500' };
// // // //     if (faceCount === 1) return { text: '✓ Face detected', color: 'text-green-500' };
// // // //     return { text: `⚠ ${faceCount} faces — proxy risk!`, color: 'text-red-500' };
// // // //   };

// // // //   const status = faceStatus();

// // // //   return (
// // // //     <div className="min-h-screen p-4 bg-split">
// // // //       <div className="flex flex-col lg:flex-row gap-6">

// // // //         {/* Sidebar */}
// // // //         <div className="w-full lg:w-64 bg-white shadow-xl rounded-2xl p-4 flex flex-col justify-between min-h-[90vh]">
// // // //           <div>
// // // //             <h2 className="text-xl font-semibold text-center mb-6">Admin Page</h2>
// // // //             <div className="flex flex-col gap-5">
// // // //               <Link to="/dashboard">
// // // //                 <button className="flex items-center space-x-2 w-full text-left py-2 px-4 rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-all duration-300">
// // // //                   <FaHome className="text-purple-600" />
// // // //                   <span>Home</span>
// // // //                 </button>
// // // //               </Link>
// // // //               <Link to="/Addstudent">
// // // //                 <button className="flex items-center space-x-2 w-full text-left py-2 px-4 rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-all duration-300">
// // // //                   <FaUser className="text-black" />
// // // //                   <span>Add Students</span>
// // // //                 </button>
// // // //               </Link>
// // // //               <Link to="/Enrolled">
// // // //                 <button className="flex items-center space-x-2 w-full text-left py-2 px-4 rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-all duration-300">
// // // //                   <FaFileAlt className="text-red-500" />
// // // //                   <span>Enrolled</span>
// // // //                 </button>
// // // //               </Link>
// // // //               <Link to="/Period">
// // // //                 <button className="flex items-center space-x-2 w-full text-left py-2 px-4 rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-all duration-300">
// // // //                   <FaClock className="text-green-500" />
// // // //                   <span>Period Wise</span>
// // // //                 </button>
// // // //               </Link>
// // // //             </div>
// // // //           </div>
// // // //           <Link to='/signin'>
// // // //             <button className="w-full py-2 rounded-xl bg-[#1E2A78] text-white shadow-md flex items-center justify-center space-x-2 hover:bg-[#16239D] active:bg-[#0f1c77] transition-all duration-300">
// // // //               <FaDownload />
// // // //               <span>LogOut</span>
// // // //             </button>
// // // //           </Link>
// // // //         </div>

// // // //         {/* Main Content */}
// // // //         <div className="flex-1">
// // // //           <div className="bg-white rounded-[1.1rem] shadow-md p-4">
// // // //             <h1 className="text-gray-900 font-semibold mb-4 ml-2">Add Students Here</h1>

// // // //             {/* Form */}
// // // //             <div className="w-full grid gap-5 grid-cols-2 mt-5 p-5">
// // // //               <input type="text" name="name" value={student.name} onChange={handleChange}
// // // //                 className="placeholder:text-gray-700 rounded-xl bg-[#F7F7F7] px-4 py-2"
// // // //                 placeholder="Enter the student's name" />
// // // //               <input type="text" name="usn" value={student.usn} onChange={handleChange}
// // // //                 className="placeholder:text-gray-700 rounded-xl bg-[#F7F7F7] px-4 py-2"
// // // //                 placeholder="Enter the USN" />
// // // //               <input type="text" name="age" value={student.age} onChange={handleChange}
// // // //                 className="placeholder:text-gray-700 rounded-xl bg-[#F7F7F7] px-4 py-2"
// // // //                 placeholder="Enter the age" />
// // // //               <input type="text" name="course" value={student.course} onChange={handleChange}
// // // //                 className="placeholder:text-gray-700 rounded-xl bg-[#F7F7F7] px-4 py-2"
// // // //                 placeholder="Enter the course" />
// // // //               <input type="number" name="phone" value={student.phone} onChange={handleChange}
// // // //                 className="placeholder:text-gray-700 rounded-xl bg-[#F7F7F7] px-4 py-2"
// // // //                 placeholder="Enter the mobile number" />
// // // //             </div>

// // // //             {/* Camera & Enroll */}
// // // //             <div className='flex flex-col lg:flex-row w-full gap-4 mt-6'>

// // // //               {/* Camera with bounding box overlay */}
// // // //               <div className='w-full lg:w-1/2 h-[53vh] bg-white/20 backdrop-blur-lg border border-gray-50 rounded-2xl p-2 flex justify-center items-center overflow-hidden'>
// // // //                 <div className="relative w-full h-full bg-black rounded-2xl shadow-2xl overflow-hidden">
// // // //                   <video
// // // //                     ref={videoRef}
// // // //                     autoPlay
// // // //                     playsInline
// // // //                     muted
// // // //                     onLoadedMetadata={() => setIsCameraReady(true)}
// // // //                     className="w-full h-full object-cover"
// // // //                   />
// // // //                   {/* Overlay canvas for bounding boxes — must match video size */}
// // // //                   <canvas
// // // //                     ref={overlayCanvasRef}
// // // //                     width={640}
// // // //                     height={480}
// // // //                     className="absolute top-0 left-0 w-full h-full"
// // // //                     style={{ pointerEvents: 'none' }}
// // // //                   />
// // // //                 </div>
// // // //               </div>

// // // //               {/* Right panel */}
// // // //               <div className='w-full lg:w-1/2 flex flex-col justify-start mt-5 items-center text-center gap-4'>
// // // //                 <h1 className='text-gray-800 font-bold text-[1.5rem]'>Please place your face properly</h1>

// // // //                 {/* Live face status */}
// // // //                 <p className={`text-sm font-semibold ${status.color}`}>{status.text}</p>

// // // //                 <button
// // // //                   onClick={captureAndSend}
// // // //                   disabled={faceCount !== 1}
// // // //                   className={`w-sm rounded-xl px-8 py-3 font-bold text-white transition-all
// // // //                     ${faceCount === 1
// // // //                       ? 'bg-gradient-to-r from-blue-700 to-blue-600 hover:opacity-90 hover:shadow-lg'
// // // //                       : 'bg-gray-400 cursor-not-allowed opacity-60'}`}>
// // // //                   Enroll Face
// // // //                 </button>
// // // //               </div>
// // // //             </div>
// // // //           </div>
// // // //         </div>

// // // //       </div>

// // // //       {/* Hidden capture canvas */}
// // // //       <canvas ref={canvasRef} className="hidden" />
// // // //     </div>
// // // //   );
// // // // };

// // // // export default Addstudent;



// // // import "./App.css";
// // // import { FaHome, FaFileAlt, FaUser, FaDownload, FaClock } from 'react-icons/fa';
// // // import { Link } from 'react-router-dom';
// // // import React, { useState, useEffect, useRef } from 'react';

// // // // Enrollment steps the user goes through
// // // const POSES = [
// // //   { key: "front",  instruction: "Look straight at the camera",     emoji: "😐" },
// // //   { key: "blink",  instruction: "Close your eyes / blink slowly",  emoji: "😌" },
// // //   { key: "left",   instruction: "Turn your head slightly LEFT",     emoji: "👈" },
// // //   { key: "right",  instruction: "Turn your head slightly RIGHT",    emoji: "👉" },
// // //   { key: "up",     instruction: "Tilt your head slightly UP",       emoji: "☝️" },
// // // ];

// // // const Addstudent = () => {
// // //   const videoRef        = useRef(null);
// // //   const canvasRef       = useRef(null);
// // //   const overlayRef      = useRef(null);
// // //   const detectInterval  = useRef(null);

// // //   const [isCameraReady, setIsCameraReady] = useState(false);
// // //   const [faceCount,     setFaceCount]     = useState(0);
// // //   const [eyeState,      setEyeState]      = useState("unknown");

// // //   // Enrollment flow state
// // //   const [poseIndex,     setPoseIndex]     = useState(0);   // which step we're on
// // //   const [enrolling,     setEnrolling]     = useState(false);
// // //   const [doneSteps,     setDoneSteps]     = useState([]);  // completed pose keys
// // //   const [statusMsg,     setStatusMsg]     = useState("");
// // //   const [enrollDone,    setEnrollDone]    = useState(false);

// // //   const [student, setStudent] = useState({
// // //     name: '', usn: '', age: '', course: '', phone: '', email: ''
// // //   });

// // //   // ── Start camera ──
// // //   useEffect(() => {
// // //     let cancelled = false;

// // //     const getCameraStream = async () => {
// // //       try {
// // //         const stream = await navigator.mediaDevices.getUserMedia({ video: true });
// // //         if (cancelled) { stream.getTracks().forEach(t => t.stop()); return; }
// // //         if (videoRef.current) videoRef.current.srcObject = stream;
// // //       } catch (err) {
// // //         if (!cancelled) console.error("Camera error:", err);
// // //       }
// // //     };

// // //     getCameraStream();

// // //     return () => {
// // //       cancelled = true;
// // //       if (videoRef.current?.srcObject)
// // //         videoRef.current.srcObject.getTracks().forEach(t => t.stop());
// // //     };
// // //   }, []);

// // //   // ── Live detect loop ──
// // //   useEffect(() => {
// // //     if (!isCameraReady) return;

// // //     detectInterval.current = setInterval(async () => {
// // //       const video   = videoRef.current;
// // //       const overlay = overlayRef.current;
// // //       if (!video || !overlay || video.videoWidth === 0) return;

// // //       const tmp = document.createElement('canvas');
// // //       tmp.width  = video.videoWidth;
// // //       tmp.height = video.videoHeight;
// // //       tmp.getContext('2d').drawImage(video, 0, 0);

// // //       try {
// // //         const res    = await fetch('http://localhost:5000/detect', {
// // //           method: 'POST',
// // //           headers: { 'Content-Type': 'application/json' },
// // //           body: JSON.stringify({ image: tmp.toDataURL('image/jpeg', 0.4) })
// // //         });
// // //         const result = await res.json();
// // //         setFaceCount(result.count);

// // //         // Eye state from first face
// // //         if (result.faces?.[0]?.eye_state) setEyeState(result.faces[0].eye_state);

// // //         // Draw bounding boxes
// // //         const ctx    = overlay.getContext('2d');
// // //         ctx.clearRect(0, 0, overlay.width, overlay.height);
// // //         const scaleX = overlay.width  / video.videoWidth;
// // //         const scaleY = overlay.height / video.videoHeight;

// // //         result.faces.forEach(face => {
// // //           const color = result.count > 1 ? '#ef4444' : '#22c55e';
// // //           ctx.strokeStyle = color;
// // //           ctx.lineWidth   = 2.5;
// // //           ctx.shadowColor = color;
// // //           ctx.shadowBlur  = 8;
// // //           ctx.strokeRect(face.x * scaleX, face.y * scaleY, face.w * scaleX, face.h * scaleY);

// // //           ctx.shadowBlur  = 0;
// // //           ctx.fillStyle   = color;
// // //           ctx.font        = 'bold 13px monospace';
// // //           ctx.fillText(
// // //             result.count > 1 ? '⚠ Multiple!' : `👁 ${face.eye_state ?? ''}`,
// // //             face.x * scaleX + 4,
// // //             face.y * scaleY - 6
// // //           );
// // //         });
// // //       } catch (_) {}
// // //     }, 400);

// // //     return () => clearInterval(detectInterval.current);
// // //   }, [isCameraReady]);

// // //   const handleChange = (e) => setStudent({ ...student, [e.target.name]: e.target.value });

// // //   // ── Capture one pose ──
// // //   const captureCurrentPose = async () => {
// // //     const video  = videoRef.current;
// // //     const canvas = canvasRef.current;
// // //     const pose   = POSES[poseIndex];

// // //     if (!isCameraReady || video.videoWidth === 0) {
// // //       setStatusMsg("Camera not ready yet."); return;
// // //     }
// // //     if (faceCount === 0) { setStatusMsg("No face detected. Adjust your position."); return; }
// // //     if (faceCount > 1)   { setStatusMsg("Multiple faces detected!"); return; }

// // //     // For blink step — show hint if eyes still open
// // //     if (pose.key === "blink" && eyeState === "open") {
// // //       setStatusMsg("Eyes still open — please close or blink slowly first."); return;
// // //     }

// // //     canvas.width  = video.videoWidth;
// // //     canvas.height = video.videoHeight;
// // //     canvas.getContext('2d').drawImage(video, 0, 0);

// // //     setEnrolling(true);
// // //     setStatusMsg(`Capturing ${pose.key} pose...`);

// // //     try {
// // //       const response = await fetch('http://localhost:5000/enroll', {
// // //         method: 'POST',
// // //         headers: { 'Content-Type': 'application/json' },
// // //         body: JSON.stringify({
// // //           usn:   student.usn,
// // //           pose:  pose.key,
// // //           image: canvas.toDataURL('image/jpeg')
// // //         })
// // //       });

// // //       const result = await response.json();

// // //       if (!response.ok) {
// // //         setStatusMsg(`⚠ ${result.message}`);
// // //         setEnrolling(false);
// // //         return;
// // //       }

// // //       setDoneSteps(prev => [...prev, pose.key]);
// // //       setStatusMsg(`✅ ${pose.key.charAt(0).toUpperCase() + pose.key.slice(1)} done! ${result.message}`);

// // //       const nextIndex = poseIndex + 1;

// // //       if (nextIndex >= POSES.length) {
// // //         // All poses done — save to student DB
// // //         await saveStudentToDB();
// // //         setEnrollDone(true);
// // //         setStatusMsg("🎉 Enrollment complete! All poses captured.");
// // //       } else {
// // //         setPoseIndex(nextIndex);
// // //       }

// // //     } catch (err) {
// // //       console.error(err);
// // //       setStatusMsg("Failed to send to backend.");
// // //     }

// // //     setEnrolling(false);
// // //   };

// // //   const saveStudentToDB = async () => {
// // //     try {
// // //       const res = await fetch('http://localhost:5001/api/students', {
// // //         method: 'POST',
// // //         headers: { 'Content-Type': 'application/json' },
// // //         body: JSON.stringify(student)
// // //       });
// // //       const data = await res.json();
// // //       console.log('DB:', data.message);
// // //     } catch (err) {
// // //       console.error('DB save error:', err);
// // //     }
// // //   };

// // //   const resetEnrollment = () => {
// // //     setPoseIndex(0);
// // //     setDoneSteps([]);
// // //     setEnrollDone(false);
// // //     setStatusMsg("");
// // //     setStudent({ name: '', usn: '', age: '', course: '', phone: '', email: '' });
// // //   };

// // //   // Face status text
// // //   const faceStatus = () => {
// // //     if (!isCameraReady)  return { text: 'Camera loading...', color: 'text-gray-400' };
// // //     if (faceCount === 0) return { text: 'No face detected', color: 'text-yellow-500' };
// // //     if (faceCount > 1)   return { text: `⚠ ${faceCount} faces detected!`, color: 'text-red-500' };
// // //     return { text: `✓ Face detected · Eyes: ${eyeState}`, color: 'text-green-500' };
// // //   };

// // //   const currentPose = POSES[poseIndex];
// // //   const status      = faceStatus();

// // //   return (
// // //     <div className="min-h-screen p-4 bg-split">
// // //       <div className="flex flex-col lg:flex-row gap-6">

// // //         {/* Sidebar */}
// // //         <div className="w-full lg:w-64 bg-white shadow-xl rounded-2xl p-4 flex flex-col justify-between min-h-[90vh]">
// // //           <div>
// // //             <h2 className="text-xl font-semibold text-center mb-6">Admin Page</h2>
// // //             <div className="flex flex-col gap-5">
// // //               <Link to="/dashboard">
// // //                 <button className="flex items-center space-x-2 w-full text-left py-2 px-4 rounded-xl hover:bg-gray-100 transition-all duration-300">
// // //                   <FaHome className="text-purple-600" /><span>Home</span>
// // //                 </button>
// // //               </Link>
// // //               <Link to="/Addstudent">
// // //                 <button className="flex items-center space-x-2 w-full text-left py-2 px-4 rounded-xl hover:bg-gray-100 transition-all duration-300">
// // //                   <FaUser className="text-black" /><span>Add Students</span>
// // //                 </button>
// // //               </Link>
// // //               <Link to="/Enrolled">
// // //                 <button className="flex items-center space-x-2 w-full text-left py-2 px-4 rounded-xl hover:bg-gray-100 transition-all duration-300">
// // //                   <FaFileAlt className="text-red-500" /><span>Enrolled</span>
// // //                 </button>
// // //               </Link>
// // //               <Link to="/Period">
// // //                 <button className="flex items-center space-x-2 w-full text-left py-2 px-4 rounded-xl hover:bg-gray-100 transition-all duration-300">
// // //                   <FaClock className="text-green-500" /><span>Period Wise</span>
// // //                 </button>
// // //               </Link>
// // //             </div>
// // //           </div>
// // //           <Link to='/signin'>
// // //             <button className="w-full py-2 rounded-xl bg-[#1E2A78] text-white flex items-center justify-center space-x-2 hover:bg-[#16239D] transition-all duration-300">
// // //               <FaDownload /><span>LogOut</span>
// // //             </button>
// // //           </Link>
// // //         </div>

// // //         {/* Main */}
// // //         <div className="flex-1">
// // //           <div className="bg-white rounded-[1.1rem] shadow-md p-4">
// // //             <h1 className="text-gray-900 font-semibold mb-4 ml-2">Add Students Here</h1>

// // //             {/* Form */}
// // //             <div className="w-full grid gap-5 grid-cols-2 mt-5 p-5">
// // //               <input type="text"   name="name"   value={student.name}   onChange={handleChange} className="placeholder:text-gray-700 rounded-xl bg-[#F7F7F7] px-4 py-2" placeholder="Student name" />
// // //               <input type="text"   name="usn"    value={student.usn}    onChange={handleChange} className="placeholder:text-gray-700 rounded-xl bg-[#F7F7F7] px-4 py-2" placeholder="USN" />
// // //               <input type="text"   name="age"    value={student.age}    onChange={handleChange} className="placeholder:text-gray-700 rounded-xl bg-[#F7F7F7] px-4 py-2" placeholder="Age" />
// // //               <input type="text"   name="course" value={student.course} onChange={handleChange} className="placeholder:text-gray-700 rounded-xl bg-[#F7F7F7] px-4 py-2" placeholder="Course" />
// // //               <input type="number" name="phone"  value={student.phone}  onChange={handleChange} className="placeholder:text-gray-700 rounded-xl bg-[#F7F7F7] px-4 py-2" placeholder="Mobile number" />
// // //               <input type="email"  name="email"  value={student.email}  onChange={handleChange} className="placeholder:text-gray-700 rounded-xl bg-[#F7F7F7] px-4 py-2" placeholder="Student email" />
// // //             </div>

// // //             <div className="flex flex-col lg:flex-row w-full gap-4 mt-6">

// // //               {/* Camera */}
// // //               <div className="w-full lg:w-1/2 h-[53vh] bg-white/20 rounded-2xl p-2 flex justify-center items-center overflow-hidden">
// // //                 <div className="relative w-full h-full bg-black rounded-2xl shadow-2xl overflow-hidden">
// // //                   <video
// // //                     ref={videoRef}
// // //                     autoPlay playsInline muted
// // //                     onLoadedMetadata={() => setIsCameraReady(true)}
// // //                     className="w-full h-full object-cover"
// // //                   />
// // //                   <canvas
// // //                     ref={overlayRef}
// // //                     width={640} height={480}
// // //                     className="absolute top-0 left-0 w-full h-full"
// // //                     style={{ pointerEvents: 'none' }}
// // //                   />
// // //                 </div>
// // //               </div>

// // //               {/* Right panel */}
// // //               <div className="w-full lg:w-1/2 flex flex-col justify-start mt-4 items-center text-center gap-3">

// // //                 {/* Face + eye status */}
// // //                 <p className={`text-sm font-semibold ${status.color}`}>{status.text}</p>

// // //                 {!enrollDone ? (
// // //                   <>
// // //                     {/* Progress steps */}
// // //                     <div className="flex gap-2 mt-2">
// // //                       {POSES.map((p, i) => (
// // //                         <div key={p.key} className={`flex flex-col items-center`}>
// // //                           <div className={`w-9 h-9 rounded-full flex items-center justify-center text-lg border-2 transition-all
// // //                             ${doneSteps.includes(p.key)
// // //                               ? 'bg-green-500 border-green-500 text-white'
// // //                               : i === poseIndex
// // //                                 ? 'bg-blue-600 border-blue-600 text-white scale-110'
// // //                                 : 'bg-gray-100 border-gray-300 text-gray-400'}`}>
// // //                             {doneSteps.includes(p.key) ? '✓' : p.emoji}
// // //                           </div>
// // //                           <span className="text-[10px] text-gray-500 mt-1 capitalize">{p.key}</span>
// // //                         </div>
// // //                       ))}
// // //                     </div>

// // //                     {/* Current instruction */}
// // //                     <div className="mt-3 px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl max-w-xs">
// // //                       <p className="text-4xl mb-1">{currentPose.emoji}</p>
// // //                       <p className="text-blue-800 font-semibold text-sm">{currentPose.instruction}</p>
// // //                       {currentPose.key === "blink" && (
// // //                         <p className="text-xs text-blue-500 mt-1">
// // //                           Eyes: <span className={eyeState === 'closed' ? 'text-green-600 font-bold' : 'text-red-500'}>
// // //                             {eyeState}
// // //                           </span>
// // //                         </p>
// // //                       )}
// // //                     </div>

// // //                     {/* Status message */}
// // //                     {statusMsg && (
// // //                       <p className="text-sm text-gray-600 max-w-xs">{statusMsg}</p>
// // //                     )}

// // //                     {/* Capture button */}
// // //                     <button
// // //                       onClick={captureCurrentPose}
// // //                       disabled={enrolling || faceCount !== 1}
// // //                       className={`mt-2 w-64 rounded-xl px-8 py-3 font-bold text-white transition-all
// // //                         ${enrolling || faceCount !== 1
// // //                           ? 'bg-gray-400 cursor-not-allowed opacity-60'
// // //                           : 'bg-gradient-to-r from-blue-700 to-blue-600 hover:opacity-90 hover:shadow-lg'}`}>
// // //                       {enrolling ? 'Capturing...' : `Capture — ${currentPose.key.toUpperCase()}`}
// // //                     </button>

// // //                     <p className="text-xs text-gray-400">
// // //                       Step {poseIndex + 1} of {POSES.length}
// // //                     </p>
// // //                   </>
// // //                 ) : (
// // //                   /* Done screen */
// // //                   <div className="flex flex-col items-center gap-3 mt-4">
// // //                     <div className="text-5xl">🎉</div>
// // //                     <p className="text-green-600 font-bold text-lg">Enrollment Complete!</p>
// // //                     <p className="text-gray-500 text-sm max-w-xs">
// // //                       All {POSES.length} poses captured with 10 augmented images each —
// // //                       <strong> {POSES.length * 10} total training images</strong>.
// // //                     </p>
// // //                     <button
// // //                       onClick={resetEnrollment}
// // //                       className="mt-2 px-6 py-2 rounded-xl bg-[#1E2A78] text-white font-semibold hover:bg-[#16239D] transition-all">
// // //                       Enroll Another Student
// // //                     </button>
// // //                   </div>
// // //                 )}
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>

// // //       <canvas ref={canvasRef} className="hidden" />
// // //     </div>
// // //   );
// // // };

// // // export default Addstudent;


// // //////////////////////**************** */
// // import "./App.css";
// // import { FaHome, FaFileAlt, FaUser, FaDownload, FaClock } from 'react-icons/fa';
// // import { Link } from 'react-router-dom';
// // import React, { useState, useEffect, useRef } from 'react';

// // const POSES = [
// //   { key: "front",  instruction: "Look straight at the camera",     emoji: "😐" },
// //   { key: "blink",  instruction: "Close your eyes / blink slowly",  emoji: "😌" },
// //   { key: "left",   instruction: "Turn your head slightly LEFT",     emoji: "👈" },
// //   { key: "right",  instruction: "Turn your head slightly RIGHT",    emoji: "👉" },
// //   { key: "up",     instruction: "Tilt your head slightly UP",       emoji: "☝️" },
// // ];

// // const DEPARTMENTS = ['CSE', 'ECE', 'EEE', 'ME', 'CE', 'IT', 'ISE', 'CSBS', 'AI&ML', 'Other'];

// // const Addstudent = () => {
// //   const videoRef       = useRef(null);
// //   const canvasRef      = useRef(null);
// //   const overlayRef     = useRef(null);
// //   const detectInterval = useRef(null);

// //   const [isCameraReady, setIsCameraReady] = useState(false);
// //   const [faceCount,     setFaceCount]     = useState(0);
// //   const [eyeState,      setEyeState]      = useState("unknown");

// //   const [poseIndex,  setPoseIndex]  = useState(0);
// //   const [enrolling,  setEnrolling]  = useState(false);
// //   const [doneSteps,  setDoneSteps]  = useState([]);
// //   const [statusMsg,  setStatusMsg]  = useState("");
// //   const [enrollDone, setEnrollDone] = useState(false);

// //   // Removed: age, phone  |  Added: department, email
// //   const [student, setStudent] = useState({
// //     name: '', usn: '', department: '', course: '', email: ''
// //   });

// //   // ── Start camera ──
// //   useEffect(() => {
// //     let cancelled = false;
// //     const getCameraStream = async () => {
// //       try {
// //         const stream = await navigator.mediaDevices.getUserMedia({ video: true });
// //         if (cancelled) { stream.getTracks().forEach(t => t.stop()); return; }
// //         if (videoRef.current) videoRef.current.srcObject = stream;
// //       } catch (err) {
// //         if (!cancelled) console.error("Camera error:", err);
// //       }
// //     };
// //     getCameraStream();
// //     return () => {
// //       cancelled = true;
// //       if (videoRef.current?.srcObject)
// //         videoRef.current.srcObject.getTracks().forEach(t => t.stop());
// //     };
// //   }, []);

// //   // ── Live detect loop ──
// //   useEffect(() => {
// //     if (!isCameraReady) return;
// //     detectInterval.current = setInterval(async () => {
// //       const video   = videoRef.current;
// //       const overlay = overlayRef.current;
// //       if (!video || !overlay || video.videoWidth === 0) return;

// //       const tmp = document.createElement('canvas');
// //       tmp.width  = video.videoWidth;
// //       tmp.height = video.videoHeight;
// //       tmp.getContext('2d').drawImage(video, 0, 0);

// //       try {
// //         const res    = await fetch('http://localhost:5000/detect', {
// //           method: 'POST',
// //           headers: { 'Content-Type': 'application/json' },
// //           body: JSON.stringify({ image: tmp.toDataURL('image/jpeg', 0.4) })
// //         });
// //         const result = await res.json();
// //         setFaceCount(result.count);
// //         if (result.faces?.[0]?.eye_state) setEyeState(result.faces[0].eye_state);

// //         const ctx    = overlay.getContext('2d');
// //         ctx.clearRect(0, 0, overlay.width, overlay.height);
// //         const scaleX = overlay.width  / video.videoWidth;
// //         const scaleY = overlay.height / video.videoHeight;

// //         result.faces.forEach(face => {
// //           const color = result.count > 1 ? '#ef4444' : '#22c55e';
// //           ctx.strokeStyle = color;
// //           ctx.lineWidth   = 2.5;
// //           ctx.shadowColor = color;
// //           ctx.shadowBlur  = 8;
// //           ctx.strokeRect(face.x * scaleX, face.y * scaleY, face.w * scaleX, face.h * scaleY);
// //           ctx.shadowBlur  = 0;
// //           ctx.fillStyle   = color;
// //           ctx.font        = 'bold 13px monospace';
// //           ctx.fillText(
// //             result.count > 1 ? '⚠ Multiple!' : `👁 ${face.eye_state ?? ''}`,
// //             face.x * scaleX + 4, face.y * scaleY - 6
// //           );
// //         });
// //       } catch (_) {}
// //     }, 400);
// //     return () => clearInterval(detectInterval.current);
// //   }, [isCameraReady]);

// //   const handleChange = (e) => setStudent({ ...student, [e.target.name]: e.target.value });

// //   const validateForm = () => {
// //     const { name, usn, department, course, email } = student;
// //     if (!name || !usn || !department || !course || !email) {
// //       setStatusMsg("Please fill in all student details."); return false;
// //     }
// //     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
// //       setStatusMsg("Please enter a valid email address."); return false;
// //     }
// //     return true;
// //   };

// //   const captureCurrentPose = async () => {
// //     if (!validateForm()) return;

// //     const video  = videoRef.current;
// //     const canvas = canvasRef.current;
// //     const pose   = POSES[poseIndex];

// //     if (!isCameraReady || video.videoWidth === 0) { setStatusMsg("Camera not ready."); return; }
// //     if (faceCount === 0) { setStatusMsg("No face detected. Adjust your position."); return; }
// //     if (faceCount > 1)   { setStatusMsg("Multiple faces detected!"); return; }
// //     if (pose.key === "blink" && eyeState === "open") {
// //       setStatusMsg("Eyes still open — please close or blink slowly."); return;
// //     }

// //     canvas.width  = video.videoWidth;
// //     canvas.height = video.videoHeight;
// //     canvas.getContext('2d').drawImage(video, 0, 0);

// //     setEnrolling(true);
// //     setStatusMsg(`Capturing ${pose.key} pose...`);

// //     try {
// //       const response = await fetch('http://localhost:5000/enroll', {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify({ usn: student.usn, pose: pose.key, image: canvas.toDataURL('image/jpeg') })
// //       });
// //       const result = await response.json();

// //       if (!response.ok) { setStatusMsg(`⚠ ${result.message}`); setEnrolling(false); return; }

// //       setDoneSteps(prev => [...prev, pose.key]);
// //       setStatusMsg(`✅ ${pose.key.charAt(0).toUpperCase() + pose.key.slice(1)} done!`);

// //       const nextIndex = poseIndex + 1;
// //       if (nextIndex >= POSES.length) {
// //         await saveStudentToDB();
// //         setEnrollDone(true);
// //         setStatusMsg("🎉 Enrollment complete!");
// //       } else {
// //         setPoseIndex(nextIndex);
// //       }
// //     } catch (err) {
// //       console.error(err);
// //       setStatusMsg("Failed to send to backend.");
// //     }
// //     setEnrolling(false);
// //   };

// //   const saveStudentToDB = async () => {
// //     try {
// //       const res  = await fetch('http://localhost:5001/api/students', {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify(student)  // name, usn, department, course, email
// //       });
// //       const data = await res.json();
// //       console.log('DB:', data.message);
// //     } catch (err) {
// //       console.error('DB save error:', err);
// //     }
// //   };

// //   const resetEnrollment = () => {
// //     setPoseIndex(0); setDoneSteps([]); setEnrollDone(false); setStatusMsg("");
// //     setStudent({ name: '', usn: '', department: '', course: '', email: '' });
// //   };

// //   const faceStatus = () => {
// //     if (!isCameraReady)  return { text: 'Camera loading...', color: 'text-gray-400' };
// //     if (faceCount === 0) return { text: 'No face detected', color: 'text-yellow-500' };
// //     if (faceCount > 1)   return { text: `⚠ ${faceCount} faces detected!`, color: 'text-red-500' };
// //     return { text: `✓ Face detected · Eyes: ${eyeState}`, color: 'text-green-500' };
// //   };

// //   const currentPose = POSES[poseIndex];
// //   const status      = faceStatus();

// //   return (
// //     <div className="min-h-screen p-4 bg-split">
// //       <div className="flex flex-col lg:flex-row gap-6">

// //         {/* Sidebar */}
// //         <div className="w-full lg:w-64 bg-white shadow-xl rounded-2xl p-4 flex flex-col justify-between min-h-[90vh]">
// //           <div>
// //             <h2 className="text-xl font-semibold text-center mb-6">Admin Page</h2>
// //             <div className="flex flex-col gap-5">
// //               <Link to="/dashboard"><button className="flex items-center space-x-2 w-full text-left py-2 px-4 rounded-xl hover:bg-gray-100 transition-all duration-300"><FaHome className="text-purple-600" /><span>Home</span></button></Link>
// //               <Link to="/Addstudent"><button className="flex items-center space-x-2 w-full text-left py-2 px-4 rounded-xl hover:bg-gray-100 transition-all duration-300"><FaUser className="text-black" /><span>Add Students</span></button></Link>
// //               <Link to="/Enrolled"><button className="flex items-center space-x-2 w-full text-left py-2 px-4 rounded-xl hover:bg-gray-100 transition-all duration-300"><FaFileAlt className="text-red-500" /><span>Enrolled</span></button></Link>
// //               <Link to="/Period"><button className="flex items-center space-x-2 w-full text-left py-2 px-4 rounded-xl hover:bg-gray-100 transition-all duration-300"><FaClock className="text-green-500" /><span>Period Wise</span></button></Link>
// //             </div>
// //           </div>
// //           <Link to='/signin'>
// //             <button className="w-full py-2 rounded-xl bg-[#1E2A78] text-white flex items-center justify-center space-x-2 hover:bg-[#16239D] transition-all duration-300">
// //               <FaDownload /><span>LogOut</span>
// //             </button>
// //           </Link>
// //         </div>

// //         {/* Main */}
// //         <div className="flex-1">
// //           <div className="bg-white rounded-[1.1rem] shadow-md p-4">
// //             <h1 className="text-gray-900 font-semibold mb-4 ml-2">Add Students Here</h1>

// //             {/* ── Form ── */}
// //             <div className="w-full grid gap-5 grid-cols-2 mt-5 p-5">
// //               <input type="text" name="name" value={student.name} onChange={handleChange}
// //                 className="placeholder:text-gray-700 rounded-xl bg-[#F7F7F7] px-4 py-2"
// //                 placeholder="Student name" />

// //               <input type="text" name="usn" value={student.usn} onChange={handleChange}
// //                 className="placeholder:text-gray-700 rounded-xl bg-[#F7F7F7] px-4 py-2"
// //                 placeholder="USN" />

// //               {/* Department dropdown */}
// //               <select name="department" value={student.department} onChange={handleChange}
// //                 className="rounded-xl bg-[#F7F7F7] px-4 py-2 text-gray-700">
// //                 <option value="">Select Department</option>
// //                 {DEPARTMENTS.map(dept => <option key={dept} value={dept}>{dept}</option>)}
// //               </select>

// //               <input type="text" name="course" value={student.course} onChange={handleChange}
// //                 className="placeholder:text-gray-700 rounded-xl bg-[#F7F7F7] px-4 py-2"
// //                 placeholder="Course (e.g. ECEN4149)" />

// //               {/* Email — full width */}
// //               <input type="email" name="email" value={student.email} onChange={handleChange}
// //                 className="placeholder:text-gray-700 rounded-xl bg-[#F7F7F7] px-4 py-2 col-span-2"
// //                 placeholder="Student email (used for low-attendance alerts)" />
// //             </div>

// //             <div className="flex flex-col lg:flex-row w-full gap-4 mt-6">

// //               {/* Camera */}
// //               <div className="w-full lg:w-1/2 h-[53vh] bg-white/20 rounded-2xl p-2 flex justify-center items-center overflow-hidden">
// //                 <div className="relative w-full h-full bg-black rounded-2xl shadow-2xl overflow-hidden">
// //                   <video ref={videoRef} autoPlay playsInline muted
// //                     onLoadedMetadata={() => setIsCameraReady(true)}
// //                     className="w-full h-full object-cover" />
// //                   <canvas ref={overlayRef} width={640} height={480}
// //                     className="absolute top-0 left-0 w-full h-full"
// //                     style={{ pointerEvents: 'none' }} />
// //                 </div>
// //               </div>

// //               {/* Right panel */}
// //               <div className="w-full lg:w-1/2 flex flex-col justify-start mt-4 items-center text-center gap-3">
// //                 <p className={`text-sm font-semibold ${status.color}`}>{status.text}</p>

// //                 {!enrollDone ? (
// //                   <>
// //                     <div className="flex gap-2 mt-2">
// //                       {POSES.map((p, i) => (
// //                         <div key={p.key} className="flex flex-col items-center">
// //                           <div className={`w-9 h-9 rounded-full flex items-center justify-center text-lg border-2 transition-all
// //                             ${doneSteps.includes(p.key) ? 'bg-green-500 border-green-500 text-white'
// //                               : i === poseIndex ? 'bg-blue-600 border-blue-600 text-white scale-110'
// //                               : 'bg-gray-100 border-gray-300 text-gray-400'}`}>
// //                             {doneSteps.includes(p.key) ? '✓' : p.emoji}
// //                           </div>
// //                           <span className="text-[10px] text-gray-500 mt-1 capitalize">{p.key}</span>
// //                         </div>
// //                       ))}
// //                     </div>

// //                     <div className="mt-3 px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl max-w-xs">
// //                       <p className="text-4xl mb-1">{currentPose.emoji}</p>
// //                       <p className="text-blue-800 font-semibold text-sm">{currentPose.instruction}</p>
// //                       {currentPose.key === "blink" && (
// //                         <p className="text-xs text-blue-500 mt-1">
// //                           Eyes: <span className={eyeState === 'closed' ? 'text-green-600 font-bold' : 'text-red-500'}>{eyeState}</span>
// //                         </p>
// //                       )}
// //                     </div>

// //                     {statusMsg && <p className="text-sm text-gray-600 max-w-xs">{statusMsg}</p>}

// //                     <button onClick={captureCurrentPose} disabled={enrolling || faceCount !== 1}
// //                       className={`mt-2 w-64 rounded-xl px-8 py-3 font-bold text-white transition-all
// //                         ${enrolling || faceCount !== 1
// //                           ? 'bg-gray-400 cursor-not-allowed opacity-60'
// //                           : 'bg-gradient-to-r from-blue-700 to-blue-600 hover:opacity-90 hover:shadow-lg'}`}>
// //                       {enrolling ? 'Capturing...' : `Capture — ${currentPose.key.toUpperCase()}`}
// //                     </button>

// //                     <p className="text-xs text-gray-400">Step {poseIndex + 1} of {POSES.length}</p>
// //                   </>
// //                 ) : (
// //                   <div className="flex flex-col items-center gap-3 mt-4">
// //                     <div className="text-5xl">🎉</div>
// //                     <p className="text-green-600 font-bold text-lg">Enrollment Complete!</p>
// //                     <p className="text-gray-500 text-sm max-w-xs">
// //                       All {POSES.length} poses captured — <strong>{POSES.length * 10} total training images</strong>.
// //                     </p>
// //                     <button onClick={resetEnrollment}
// //                       className="mt-2 px-6 py-2 rounded-xl bg-[#1E2A78] text-white font-semibold hover:bg-[#16239D] transition-all">
// //                       Enroll Another Student
// //                     </button>
// //                   </div>
// //                 )}
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //       <canvas ref={canvasRef} className="hidden" />
// //     </div>
// //   );
// // };

// // export default Addstudent;


// //////////////////////////*////////////////////////////////////////
// import "./App.css";
// import { FaHome, FaFileAlt, FaUser, FaDownload, FaClock } from 'react-icons/fa';
// import { Link } from 'react-router-dom';
// import React, { useState, useEffect, useRef } from 'react';

// const POSES = [
//   { key: "front",  instruction: "Look straight at the camera",     emoji: "😐" },
//   { key: "blink",  instruction: "Close your eyes / blink slowly",  emoji: "😌" },
//   { key: "left",   instruction: "Turn your head slightly LEFT",     emoji: "👈" },
//   { key: "right",  instruction: "Turn your head slightly RIGHT",    emoji: "👉" },
//   { key: "up",     instruction: "Tilt your head slightly UP",       emoji: "☝️" },
// ];

// const DEPARTMENTS = ['CSE', 'ECE', 'EEE', 'ME', 'CE', 'IT', 'ISE', 'CSBS', 'AI&ML', 'Other'];

// const Addstudent = () => {
//   const videoRef       = useRef(null);
//   const canvasRef      = useRef(null);
//   const overlayRef     = useRef(null);
//   const detectInterval = useRef(null);

//   const [isCameraReady, setIsCameraReady] = useState(false);
//   const [faceCount,     setFaceCount]     = useState(0);
//   const [eyeState,      setEyeState]      = useState("unknown");

//   const [poseIndex,   setPoseIndex]   = useState(0);
//   const [enrolling,   setEnrolling]   = useState(false);
//   const [doneSteps,   setDoneSteps]   = useState([]);
//   const [statusMsg,   setStatusMsg]   = useState("");
//   const [enrollDone,  setEnrollDone]  = useState(false);
//   const [training,    setTraining]    = useState(false);
//   const [trainResult, setTrainResult] = useState("");

//   // Removed: age, phone  |  Added: department, email
//   const [student, setStudent] = useState({
//     name: '', usn: '', department: '', course: '', email: ''
//   });

//   // ── Start camera ──
//   useEffect(() => {
//     let cancelled = false;
//     const getCameraStream = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//         if (cancelled) { stream.getTracks().forEach(t => t.stop()); return; }
//         if (videoRef.current) videoRef.current.srcObject = stream;
//       } catch (err) {
//         if (!cancelled) console.error("Camera error:", err);
//       }
//     };
//     getCameraStream();
//     return () => {
//       cancelled = true;
//       if (videoRef.current?.srcObject)
//         videoRef.current.srcObject.getTracks().forEach(t => t.stop());
//     };
//   }, []);

//   // ── Live detect loop ──
//   useEffect(() => {
//     if (!isCameraReady) return;
//     detectInterval.current = setInterval(async () => {
//       const video   = videoRef.current;
//       const overlay = overlayRef.current;
//       if (!video || !overlay || video.videoWidth === 0) return;

//       const tmp = document.createElement('canvas');
//       tmp.width  = video.videoWidth;
//       tmp.height = video.videoHeight;
//       tmp.getContext('2d').drawImage(video, 0, 0);

//       try {
//         const res    = await fetch('http://localhost:5000/detect', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ image: tmp.toDataURL('image/jpeg', 0.4) })
//         });
//         const result = await res.json();
//         setFaceCount(result.count);
//         if (result.faces?.[0]?.eye_state) setEyeState(result.faces[0].eye_state);

//         const ctx    = overlay.getContext('2d');
//         ctx.clearRect(0, 0, overlay.width, overlay.height);
//         const scaleX = overlay.width  / video.videoWidth;
//         const scaleY = overlay.height / video.videoHeight;

//         result.faces.forEach(face => {
//           const color = result.count > 1 ? '#ef4444' : '#22c55e';
//           ctx.strokeStyle = color;
//           ctx.lineWidth   = 2.5;
//           ctx.shadowColor = color;
//           ctx.shadowBlur  = 8;
//           ctx.strokeRect(face.x * scaleX, face.y * scaleY, face.w * scaleX, face.h * scaleY);
//           ctx.shadowBlur  = 0;
//           ctx.fillStyle   = color;
//           ctx.font        = 'bold 13px monospace';
//           ctx.fillText(
//             result.count > 1 ? '⚠ Multiple!' : `👁 ${face.eye_state ?? ''}`,
//             face.x * scaleX + 4, face.y * scaleY - 6
//           );
//         });
//       } catch (_) {}
//     }, 400);
//     return () => clearInterval(detectInterval.current);
//   }, [isCameraReady]);

//   const handleChange = (e) => setStudent({ ...student, [e.target.name]: e.target.value });

//   const validateForm = () => {
//     const { name, usn, department, course, email } = student;
//     if (!name || !usn || !department || !course || !email) {
//       setStatusMsg("Please fill in all student details."); return false;
//     }
//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//       setStatusMsg("Please enter a valid email address."); return false;
//     }
//     return true;
//   };

//   const captureCurrentPose = async () => {
//     if (!validateForm()) return;

//     const video  = videoRef.current;
//     const canvas = canvasRef.current;
//     const pose   = POSES[poseIndex];

//     if (!isCameraReady || video.videoWidth === 0) { setStatusMsg("Camera not ready."); return; }
//     if (faceCount === 0) { setStatusMsg("No face detected. Adjust your position."); return; }
//     if (faceCount > 1)   { setStatusMsg("Multiple faces detected!"); return; }
//     if (pose.key === "blink" && eyeState === "open") {
//       setStatusMsg("Eyes still open — please close or blink slowly."); return;
//     }

//     canvas.width  = video.videoWidth;
//     canvas.height = video.videoHeight;
//     canvas.getContext('2d').drawImage(video, 0, 0);

//     setEnrolling(true);
//     setStatusMsg(`Capturing ${pose.key} pose...`);

//     try {
//       const isFinal  = (poseIndex + 1) >= POSES.length;
//       const response = await fetch('http://localhost:5000/enroll', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           usn:      student.usn,
//           pose:     pose.key,
//           image:    canvas.toDataURL('image/jpeg'),
//           is_final: isFinal      // triggers immediate training on last pose
//         })
//       });
//       const result = await response.json();

//       if (!response.ok) { setStatusMsg(`⚠ ${result.message}`); setEnrolling(false); return; }

//       setDoneSteps(prev => [...prev, pose.key]);
//       setStatusMsg(`✅ ${pose.key.charAt(0).toUpperCase() + pose.key.slice(1)} done!`);

//       const nextIndex = poseIndex + 1;
//       if (nextIndex >= POSES.length) {
//         await saveStudentToDB();
//         setEnrollDone(true);
//         setStatusMsg("🎉 Enrollment complete!");
//       } else {
//         setPoseIndex(nextIndex);
//       }
//     } catch (err) {
//       console.error(err);
//       setStatusMsg("Failed to send to backend.");
//     }
//     setEnrolling(false);
//   };

//   const saveStudentToDB = async () => {
//     try {
//       const res  = await fetch('http://localhost:5001/api/students', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(student)  // name, usn, department, course, email
//       });
//       const data = await res.json();
//       console.log('DB:', data.message);
//     } catch (err) {
//       console.error('DB save error:', err);
//     }
//   };

//   const resetEnrollment = () => {
//     setPoseIndex(0); setDoneSteps([]); setEnrollDone(false); setStatusMsg("");
//     setTrainResult("");
//     setStudent({ name: '', usn: '', department: '', course: '', email: '' });
//   };

//   const handleTrain = async () => {
//     setTraining(true);
//     setTrainResult("");
//     try {
//       const res  = await fetch('http://localhost:5000/train', { method: 'POST' });
//       const data = await res.json();
//       setTrainResult(res.ok ? `✅ ${data.message}` : `⚠ ${data.message}`);
//     } catch (err) {
//       setTrainResult("❌ Could not reach Python server.");
//     }
//     setTraining(false);
//   };

//   const faceStatus = () => {
//     if (!isCameraReady)  return { text: 'Camera loading...', color: 'text-gray-400' };
//     if (faceCount === 0) return { text: 'No face detected', color: 'text-yellow-500' };
//     if (faceCount > 1)   return { text: `⚠ ${faceCount} faces detected!`, color: 'text-red-500' };
//     return { text: `✓ Face detected · Eyes: ${eyeState}`, color: 'text-green-500' };
//   };

//   const currentPose = POSES[poseIndex];
//   const status      = faceStatus();

//   return (
//     <div className="min-h-screen p-4 bg-split">
//       <div className="flex flex-col lg:flex-row gap-6">

//         {/* Sidebar */}
//         <div className="w-full lg:w-64 bg-white shadow-xl rounded-2xl p-4 flex flex-col justify-between min-h-[90vh]">
//           <div>
//             <h2 className="text-xl font-semibold text-center mb-6">Admin Page</h2>
//             <div className="flex flex-col gap-5">
//               <Link to="/dashboard"><button className="flex items-center space-x-2 w-full text-left py-2 px-4 rounded-xl hover:bg-gray-100 transition-all duration-300"><FaHome className="text-purple-600" /><span>Home</span></button></Link>
//               <Link to="/Addstudent"><button className="flex items-center space-x-2 w-full text-left py-2 px-4 rounded-xl hover:bg-gray-100 transition-all duration-300"><FaUser className="text-black" /><span>Add Students</span></button></Link>
//               <Link to="/Enrolled"><button className="flex items-center space-x-2 w-full text-left py-2 px-4 rounded-xl hover:bg-gray-100 transition-all duration-300"><FaFileAlt className="text-red-500" /><span>Enrolled</span></button></Link>
//               <Link to="/Period"><button className="flex items-center space-x-2 w-full text-left py-2 px-4 rounded-xl hover:bg-gray-100 transition-all duration-300"><FaClock className="text-green-500" /><span>Period Wise</span></button></Link>
//             </div>
//           </div>
//           <Link to='/signin'>
//             <button className="w-full py-2 rounded-xl bg-[#1E2A78] text-white flex items-center justify-center space-x-2 hover:bg-[#16239D] transition-all duration-300">
//               <FaDownload /><span>LogOut</span>
//             </button>
//           </Link>
//         </div>

//         {/* Main */}
//         <div className="flex-1">
//           <div className="bg-white rounded-[1.1rem] shadow-md p-4">
//             <h1 className="text-gray-900 font-semibold mb-4 ml-2">Add Students Here</h1>

//             {/* ── Form ── */}
//             <div className="w-full grid gap-5 grid-cols-2 mt-5 p-5">
//               <input type="text" name="name" value={student.name} onChange={handleChange}
//                 className="placeholder:text-gray-700 rounded-xl bg-[#F7F7F7] px-4 py-2"
//                 placeholder="Student name" />

//               <input type="text" name="usn" value={student.usn} onChange={handleChange}
//                 className="placeholder:text-gray-700 rounded-xl bg-[#F7F7F7] px-4 py-2"
//                 placeholder="USN" />

//               {/* Department dropdown */}
//               <select name="department" value={student.department} onChange={handleChange}
//                 className="rounded-xl bg-[#F7F7F7] px-4 py-2 text-gray-700">
//                 <option value="">Select Department</option>
//                 {DEPARTMENTS.map(dept => <option key={dept} value={dept}>{dept}</option>)}
//               </select>

//               <input type="text" name="course" value={student.course} onChange={handleChange}
//                 className="placeholder:text-gray-700 rounded-xl bg-[#F7F7F7] px-4 py-2"
//                 placeholder="Course (e.g. ECEN4149)" />

//               {/* Email — full width */}
//               <input type="email" name="email" value={student.email} onChange={handleChange}
//                 className="placeholder:text-gray-700 rounded-xl bg-[#F7F7F7] px-4 py-2 col-span-2"
//                 placeholder="Student email (used for low-attendance alerts)" />
//             </div>

//             <div className="flex flex-col lg:flex-row w-full gap-4 mt-6">

//               {/* Camera */}
//               <div className="w-full lg:w-1/2 h-[53vh] bg-white/20 rounded-2xl p-2 flex justify-center items-center overflow-hidden">
//                 <div className="relative w-full h-full bg-black rounded-2xl shadow-2xl overflow-hidden">
//                   <video ref={videoRef} autoPlay playsInline muted
//                     onLoadedMetadata={() => setIsCameraReady(true)}
//                     className="w-full h-full object-cover" />
//                   <canvas ref={overlayRef} width={640} height={480}
//                     className="absolute top-0 left-0 w-full h-full"
//                     style={{ pointerEvents: 'none' }} />
//                 </div>
//               </div>

//               {/* Right panel */}
//               <div className="w-full lg:w-1/2 flex flex-col justify-start mt-4 items-center text-center gap-3">
//                 <p className={`text-sm font-semibold ${status.color}`}>{status.text}</p>

//                 {!enrollDone ? (
//                   <>
//                     <div className="flex gap-2 mt-2">
//                       {POSES.map((p, i) => (
//                         <div key={p.key} className="flex flex-col items-center">
//                           <div className={`w-9 h-9 rounded-full flex items-center justify-center text-lg border-2 transition-all
//                             ${doneSteps.includes(p.key) ? 'bg-green-500 border-green-500 text-white'
//                               : i === poseIndex ? 'bg-blue-600 border-blue-600 text-white scale-110'
//                               : 'bg-gray-100 border-gray-300 text-gray-400'}`}>
//                             {doneSteps.includes(p.key) ? '✓' : p.emoji}
//                           </div>
//                           <span className="text-[10px] text-gray-500 mt-1 capitalize">{p.key}</span>
//                         </div>
//                       ))}
//                     </div>

//                     <div className="mt-3 px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl max-w-xs">
//                       <p className="text-4xl mb-1">{currentPose.emoji}</p>
//                       <p className="text-blue-800 font-semibold text-sm">{currentPose.instruction}</p>
//                       {currentPose.key === "blink" && (
//                         <p className="text-xs text-blue-500 mt-1">
//                           Eyes: <span className={eyeState === 'closed' ? 'text-green-600 font-bold' : 'text-red-500'}>{eyeState}</span>
//                         </p>
//                       )}
//                     </div>

//                     {statusMsg && <p className="text-sm text-gray-600 max-w-xs">{statusMsg}</p>}

//                     <button onClick={captureCurrentPose} disabled={enrolling || faceCount !== 1}
//                       className={`mt-2 w-64 rounded-xl px-8 py-3 font-bold text-white transition-all
//                         ${enrolling || faceCount !== 1
//                           ? 'bg-gray-400 cursor-not-allowed opacity-60'
//                           : 'bg-gradient-to-r from-blue-700 to-blue-600 hover:opacity-90 hover:shadow-lg'}`}>
//                       {enrolling ? 'Capturing...' : `Capture — ${currentPose.key.toUpperCase()}`}
//                     </button>

//                     <p className="text-xs text-gray-400">Step {poseIndex + 1} of {POSES.length}</p>
//                   </>
//                 ) : (
//                   <div className="flex flex-col items-center gap-3 mt-4">
//                     <div className="text-5xl">🎉</div>
//                     <p className="text-green-600 font-bold text-lg">Enrollment Complete!</p>
//                     <p className="text-gray-500 text-sm max-w-xs">
//                       All {POSES.length} poses captured — <strong>{POSES.length * 20} total training images</strong>.
//                       Model was trained automatically.
//                     </p>

//                     {/* Manual retrain button */}
//                     <button onClick={handleTrain} disabled={training}
//                       className={`px-6 py-2 rounded-xl font-semibold text-white transition-all
//                         ${training ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}>
//                       {training ? 'Training...' : '🔄 Retrain Model'}
//                     </button>
//                     {trainResult && (
//                       <p className="text-sm text-gray-700 max-w-xs text-center">{trainResult}</p>
//                     )}

//                     <button onClick={resetEnrollment}
//                       className="px-6 py-2 rounded-xl bg-[#1E2A78] text-white font-semibold hover:bg-[#16239D] transition-all">
//                       Enroll Another Student
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <canvas ref={canvasRef} className="hidden" />
//     </div>
//   );
// };

// export default Addstudent;

/************************************************************** */


import "./App.css";
import { FaHome, FaFileAlt, FaUser, FaDownload, FaClock } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';

const DEPARTMENTS = ['CSE', 'ECE', 'EEE', 'ME', 'CE', 'IT', 'ISE', 'CSBS', 'AI&ML', 'Other'];

// Quality gate — button stays locked below this score
const QUALITY_THRESHOLD = 55;

// Compute 0–100 quality score from a single detected face
function computeQuality(face, videoW, videoH) {
  if (!face || videoW === 0) return 0;

  // Size score: face should cover ~15–45% of frame area
  const sizeRatio = (face.w * face.h) / (videoW * videoH);
  const sizeScore = Math.min(100, Math.round(sizeRatio * 550));

  // Centering score: penalise faces close to edges
  const cx = face.x + face.w / 2;
  const cy = face.y + face.h / 2;
  const dx = Math.abs(cx - videoW / 2) / (videoW / 2);   // 0=center, 1=edge
  const dy = Math.abs(cy - videoH / 2) / (videoH / 2);
  const centerScore = Math.max(0, Math.round(100 - (dx + dy) * 55));

  return Math.min(100, Math.round(sizeScore * 0.65 + centerScore * 0.35));
}

// Draw bounding box + quality bar onto overlay canvas
function drawOverlay(ctx, faces, overlayW, overlayH, videoW, videoH, quality) {
  ctx.clearRect(0, 0, overlayW, overlayH);
  if (!faces.length) return;

  const sx = overlayW / videoW;
  const sy = overlayH / videoH;
  const multi = faces.length > 1;

  faces.forEach(face => {
    const color = multi ? '#ef4444' : quality >= QUALITY_THRESHOLD ? '#22c55e' : '#f59e0b';
    ctx.strokeStyle = color;
    ctx.lineWidth   = 2.5;
    ctx.shadowColor = color;
    ctx.shadowBlur  = 6;
    ctx.strokeRect(face.x * sx, face.y * sy, face.w * sx, face.h * sy);
    ctx.shadowBlur = 0;

    if (multi) {
      ctx.fillStyle = '#ef4444';
      ctx.font      = 'bold 13px monospace';
      ctx.fillText('Multiple faces!', face.x * sx + 4, face.y * sy - 6);
    }
  });

  if (!multi && faces.length === 1) {
    // Quality bar — bottom of the face box
    const face  = faces[0];
    const barX  = face.x * sx;
    const barY  = (face.y + face.h) * sy + 8;
    const barW  = face.w * sx;
    const barH  = 7;
    const fill  = quality >= QUALITY_THRESHOLD ? '#22c55e' : '#f59e0b';

    // Track
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.beginPath();
    ctx.roundRect(barX, barY, barW, barH, 4);
    ctx.fill();

    // Fill
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.roundRect(barX, barY, barW * quality / 100, barH, 4);
    ctx.fill();

    // Label
    ctx.fillStyle = '#fff';
    ctx.font      = 'bold 11px monospace';
    ctx.fillText(`Quality ${quality}%`, barX + 3, barY - 4);
  }
}

const Addstudent = () => {
  const videoRef       = useRef(null);
  const canvasRef      = useRef(null);   // hidden capture canvas
  const overlayRef     = useRef(null);   // visible overlay canvas
  const detectInterval = useRef(null);

  const [isCameraReady, setIsCameraReady] = useState(false);
  const [faceCount,     setFaceCount]     = useState(0);
  const [faceQuality,   setFaceQuality]   = useState(0);

  const [enrolling,   setEnrolling]   = useState(false);
  const [enrollDone,  setEnrollDone]  = useState(false);
  const [statusMsg,   setStatusMsg]   = useState('');
  const [training,    setTraining]    = useState(false);
  const [trainResult, setTrainResult] = useState('');

  const [student, setStudent] = useState({
    name: '', usn: '', department: '', course: '', email: ''
  });

  // ── Camera start ──────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (cancelled) { stream.getTracks().forEach(t => t.stop()); return; }
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        console.error('Camera error:', err);
      }
    })();
    return () => {
      cancelled = true;
      videoRef.current?.srcObject?.getTracks().forEach(t => t.stop());
    };
  }, []);

  // ── Live detect loop — polls /detect every 450ms ───────────────
  useEffect(() => {
    if (!isCameraReady) return;

    detectInterval.current = setInterval(async () => {
      const video   = videoRef.current;
      const overlay = overlayRef.current;
      if (!video || !overlay || video.videoWidth === 0) return;

      // Low-quality JPEG for speed
      const tmp = document.createElement('canvas');
      tmp.width  = video.videoWidth;
      tmp.height = video.videoHeight;
      tmp.getContext('2d').drawImage(video, 0, 0);

      try {
        const res    = await fetch('http://localhost:5000/detect', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ image: tmp.toDataURL('image/jpeg', 0.4) })
        });
        const result = await res.json();

        const count   = result.count ?? 0;
        const quality = count === 1
          ? computeQuality(result.faces[0], video.videoWidth, video.videoHeight)
          : 0;

        setFaceCount(count);
        setFaceQuality(quality);

        drawOverlay(
          overlay.getContext('2d'),
          result.faces ?? [],
          overlay.width, overlay.height,
          video.videoWidth, video.videoHeight,
          quality
        );
      } catch (_) { /* backend not running yet — silent */ }
    }, 450);

    return () => clearInterval(detectInterval.current);
  }, [isCameraReady]);

  const handleChange = (e) => setStudent(s => ({ ...s, [e.target.name]: e.target.value }));

  const validateForm = () => {
    const { name, usn, department, course, email } = student;
    if (!name || !usn || !department || !course || !email) {
      setStatusMsg('Please fill in all student details.'); return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatusMsg('Please enter a valid email address.'); return false;
    }
    setStatusMsg('');
    return true;
  };

  // ── Single-click enroll ────────────────────────────────────────
  const captureAndEnroll = async () => {
    if (!validateForm()) return;

    const video  = videoRef.current;
    const canvas = canvasRef.current;

    if (!isCameraReady || video.videoWidth === 0) {
      setStatusMsg('Camera not ready yet. Please wait.'); return;
    }

    // Capture full-res frame
    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);

    setEnrolling(true);
    setStatusMsg('Enrolling...');

    try {
      const response = await fetch('http://localhost:5000/enroll', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          usn:   student.usn,
          image: canvas.toDataURL('image/jpeg')
        })
      });
      const result = await response.json();

      if (!response.ok) {
        setStatusMsg(`⚠ ${result.message}`);
        setEnrolling(false);
        return;
      }

      // Save details to student DB
      try {
        await fetch('http://localhost:5001/api/students', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify(student)
        });
      } catch (dbErr) {
        console.error('DB save error:', dbErr);
      }

      setEnrollDone(true);
      setStatusMsg('');

    } catch (err) {
      console.error(err);
      setStatusMsg('Failed to reach the backend.');
    }
    setEnrolling(false);
  };

  const handleTrain = async () => {
    setTraining(true);
    setTrainResult('');
    try {
      const res  = await fetch('http://localhost:5000/train', { method: 'POST' });
      const data = await res.json();
      setTrainResult(res.ok ? `✅ ${data.message}` : `⚠ ${data.message}`);
    } catch {
      setTrainResult('❌ Could not reach Python server.');
    }
    setTraining(false);
  };

  const resetEnrollment = () => {
    setEnrollDone(false);
    setStatusMsg('');
    setTrainResult('');
    setFaceQuality(0);
    setStudent({ name: '', usn: '', department: '', course: '', email: '' });
  };

  // ── Status badge text + colour ─────────────────────────────────
  const statusBadge = () => {
    if (!isCameraReady)  return { text: 'Camera loading…',               color: 'text-gray-400' };
    if (faceCount === 0) return { text: 'No face detected',              color: 'text-yellow-500' };
    if (faceCount > 1)   return { text: `⚠ ${faceCount} faces — move others away`, color: 'text-red-500' };
    if (faceQuality < QUALITY_THRESHOLD)
      return { text: `Quality ${faceQuality}% — move closer / centre`, color: 'text-amber-500' };
    return { text: `✓ Ready — quality ${faceQuality}%`, color: 'text-green-600' };
  };

  const canCapture = faceCount === 1 && faceQuality >= QUALITY_THRESHOLD && !enrolling;
  const badge      = statusBadge();

  return (
    <div className="min-h-screen p-4 bg-split">
      <div className="flex flex-col lg:flex-row gap-6">

        {/* ── Sidebar ────────────────────────────────────────────── */}
        <div className="w-full lg:w-64 bg-white shadow-xl rounded-2xl p-4 flex flex-col justify-between min-h-[90vh]">
          <div>
            <h2 className="text-xl font-semibold text-center mb-6">Admin Page</h2>
            <div className="flex flex-col gap-5">
              <Link to="/dashboard">
                <button className="flex items-center space-x-2 w-full text-left py-2 px-4 rounded-xl hover:bg-gray-100 transition-all duration-300">
                  <FaHome className="text-purple-600" /><span>Home</span>
                </button>
              </Link>
              <Link to="/Addstudent">
                <button className="flex items-center space-x-2 w-full text-left py-2 px-4 rounded-xl hover:bg-gray-100 transition-all duration-300">
                  <FaUser className="text-black" /><span>Add Students</span>
                </button>
              </Link>
              <Link to="/Enrolled">
                <button className="flex items-center space-x-2 w-full text-left py-2 px-4 rounded-xl hover:bg-gray-100 transition-all duration-300">
                  <FaFileAlt className="text-red-500" /><span>Enrolled</span>
                </button>
              </Link>
              <Link to="/Period">
                <button className="flex items-center space-x-2 w-full text-left py-2 px-4 rounded-xl hover:bg-gray-100 transition-all duration-300">
                  <FaClock className="text-green-500" /><span>Period Wise</span>
                </button>
              </Link>
            </div>
          </div>
          <Link to="/signin">
            <button className="w-full py-2 rounded-xl bg-[#1E2A78] text-white flex items-center justify-center space-x-2 hover:bg-[#16239D] transition-all duration-300">
              <FaDownload /><span>LogOut</span>
            </button>
          </Link>
        </div>

        {/* ── Main ───────────────────────────────────────────────── */}
        <div className="flex-1">
          <div className="bg-white rounded-[1.1rem] shadow-md p-4">
            <h1 className="text-gray-900 font-semibold mb-4 ml-2">Add Students Here</h1>

            {/* Form */}
            <div className="w-full grid gap-5 grid-cols-2 mt-5 p-5">
              <input type="text" name="name" value={student.name} onChange={handleChange}
                className="placeholder:text-gray-700 rounded-xl bg-[#F7F7F7] px-4 py-2"
                placeholder="Student name" />

              <input type="text" name="usn" value={student.usn} onChange={handleChange}
                className="placeholder:text-gray-700 rounded-xl bg-[#F7F7F7] px-4 py-2"
                placeholder="USN" />

              <select name="department" value={student.department} onChange={handleChange}
                className="rounded-xl bg-[#F7F7F7] px-4 py-2 text-gray-700">
                <option value="">Select Department</option>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>

              <input type="text" name="course" value={student.course} onChange={handleChange}
                className="placeholder:text-gray-700 rounded-xl bg-[#F7F7F7] px-4 py-2"
                placeholder="Course (e.g. ECEN4149)" />

              <input type="email" name="email" value={student.email} onChange={handleChange}
                className="placeholder:text-gray-700 rounded-xl bg-[#F7F7F7] px-4 py-2 col-span-2"
                placeholder="Student email (used for low-attendance alerts)" />
            </div>

            {/* Camera + panel */}
            <div className="flex flex-col lg:flex-row w-full gap-4 mt-6">

              {/* Camera with overlay */}
              <div className="w-full lg:w-1/2 h-[53vh] bg-white/20 rounded-2xl p-2 flex justify-center items-center overflow-hidden">
                <div className="relative w-full h-full bg-black rounded-2xl shadow-2xl overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay playsInline muted
                    onLoadedMetadata={() => setIsCameraReady(true)}
                    className="w-full h-full object-cover"
                  />
                  {/* Bounding box + quality bar overlay */}
                  <canvas
                    ref={overlayRef}
                    width={640} height={480}
                    className="absolute top-0 left-0 w-full h-full"
                    style={{ pointerEvents: 'none' }}
                  />
                </div>
              </div>

              {/* Right panel */}
              <div className="w-full lg:w-1/2 flex flex-col justify-center items-center text-center gap-4 px-4">

                {!enrollDone ? (
                  <>
                    {/* Quality ring */}
                    <div className="relative w-24 h-24">
                      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                        <circle
                          cx="18" cy="18" r="15.9" fill="none"
                          stroke={faceQuality >= QUALITY_THRESHOLD ? '#22c55e' : '#f59e0b'}
                          strokeWidth="3"
                          strokeDasharray={`${faceQuality} 100`}
                          strokeLinecap="round"
                          style={{ transition: 'stroke-dasharray 0.3s ease' }}
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-gray-800">
                        {faceQuality}%
                      </span>
                    </div>

                    {/* Status text */}
                    <p className={`text-sm font-semibold ${badge.color}`}>{badge.text}</p>

                    {/* Instruction */}
                    <p className="text-gray-500 text-sm max-w-xs">
                      {faceCount === 1 && faceQuality < QUALITY_THRESHOLD
                        ? 'Move your face closer to the camera and centre it in the frame.'
                        : faceCount === 1
                          ? 'Good position. Click Enroll to capture.'
                          : 'Position your face inside the camera view.'}
                    </p>

                    {statusMsg && (
                      <p className="text-sm text-red-500 max-w-xs">{statusMsg}</p>
                    )}

                    {/* Single enroll button */}
                    <button
                      onClick={captureAndEnroll}
                      disabled={!canCapture}
                      className={`w-64 rounded-xl px-8 py-3 font-bold text-white transition-all duration-200
                        ${canCapture
                          ? 'bg-gradient-to-r from-blue-700 to-blue-600 hover:opacity-90 hover:shadow-lg active:scale-95'
                          : 'bg-gray-300 cursor-not-allowed opacity-60'}`}
                    >
                      {enrolling ? 'Enrolling…' : 'Enroll Face'}
                    </button>

                    <p className="text-xs text-gray-400">
                      24 augmented images will be saved automatically
                    </p>
                  </>
                ) : (
                  /* ── Success screen ─────────────────────────────── */
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                      <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>

                    <p className="text-green-600 font-bold text-lg">Enrollment Complete!</p>
                    <p className="text-gray-500 text-sm max-w-xs">
                      24 training images saved and model updated automatically.
                    </p>

                    <button
                      onClick={handleTrain}
                      disabled={training}
                      className={`px-6 py-2 rounded-xl font-semibold text-white transition-all
                        ${training ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                    >
                      {training ? 'Training…' : '↺ Retrain Model'}
                    </button>

                    {trainResult && (
                      <p className="text-sm text-gray-700 max-w-xs text-center">{trainResult}</p>
                    )}

                    <button
                      onClick={resetEnrollment}
                      className="px-6 py-2 rounded-xl bg-[#1E2A78] text-white font-semibold hover:bg-[#16239D] transition-all"
                    >
                      Enroll Another Student
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden full-res capture canvas */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default Addstudent;