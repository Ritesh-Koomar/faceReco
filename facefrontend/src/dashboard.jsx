import "./App.css";
import { FaHome, FaFileAlt, FaUser, FaDownload } from 'react-icons/fa';
import { FaUserGraduate, FaClipboardList, FaUsers, FaClock } from "react-icons/fa";
import { Link } from 'react-router-dom';
import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { FaQrcode } from 'react-icons/fa';



const toLocalDate = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
};

const Dashboard = () => {
    const [attendance, setAttendance] = useState([]);
    const [students, setStudents] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(4);
    const [selectedCourse, setSelectedCourse] = useState("All");
    const [scanMode, setScanMode] = useState('manual'); // 'manual' | 'qr'
    const [qrResult, setQrResult]   = useState(null);
    const html5QrRef                = useRef(null);

   const today = toLocalDate(new Date());

    const presentToday = attendance.filter((student) => {
    const attendedDate = toLocalDate(student.recognizedAt);
    return attendedDate === today;
});
const registeredUSNs = new Set(students.map(s => s.usn));
const uniquePresentToday = [...new Set(
    presentToday.filter(a => registeredUSNs.has(a.usn)).map(a => a.usn)
)];

    const handleManualAttendance = async () => {
        const name = document.querySelector('input[name="manual_name"]').value;
        const usn = document.querySelector('input[name="manual_usn"]').value;
        const course = document.querySelector('input[name="manual_course"]').value;
        const recognizedAtInput = document.querySelector('input[name="recognizedAt"]').value;
            const startQrScanner = () => {
    setQrResult(null);
    setTimeout(async () => {
        const { Html5Qrcode } = await import('html5-qrcode');
        const scanner = new Html5Qrcode("qr-reader-dashboard");
        html5QrRef.current = scanner;
        await scanner.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: { width: 220, height: 220 } },
            async (usn) => {
                await stopQrScanner();
                try {
                    const res = await axios.post('http://localhost:5001/api/qr-attendance', { usn: usn.trim() });
                    setQrResult({ success: true, message: res.data.message, percentage: res.data.percentage });
                    const updated = await axios.get('http://localhost:5001/api/attendance');
                    setAttendance(updated.data);
                } catch (err) {
                    setQrResult({ success: false, message: err.response?.data?.message || "Failed" });
                }
            },
            () => {}
        );
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
        try {
    const res = await axios.post("http://localhost:5001/api/attendance", {
        name, usn, course,
        recognizedAt: recognizedAtInput || undefined
    });
    alert(res.data.message);
    const updated = await axios.get('http://localhost:5001/api/attendance');
    setAttendance(updated.data);  // ← refreshes the count instantly
} catch (err) {
    alert(err.response?.data?.message || "Something went wrong");
}
    };

    const totalStudents = students.length;
    const absentStudents = Math.max(0, totalStudents - uniquePresentToday.length);


    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/attendance');
                setAttendance(response.data);
            } catch (err) {
                console.error("Error fetching attendance:", err);
            }
        };

        const fetchStudents = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/students');
                setStudents(response.data);
            } catch (err) {
                console.error("Error fetching students:", err);
            }
        };

        fetchAttendance();
        fetchStudents();
    }, []);

    const courseList = ["All", ...new Set(attendance.map((student) => student.course))];

    const filteredAttendance = selectedCourse === "All"
        ? attendance
        : attendance.filter((student) => student.course === selectedCourse);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentAttendance = filteredAttendance.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="min-h-screen p-4 bg-split">
            <div className="flex flex-col lg:flex-row gap-6">

                <div className="w-full lg:w-64 bg-white shadow-xl rounded-2xl p-4 flex flex-col justify-between min-h-[90vh]">
                    <div>
                        <h2 className="text-xl mt-5 font-bold text-center  mb-6">Admin Page</h2>
                        <div className="flex flex-col gap-5">
                                      <Link to="/dashboard">
                                        <button className="flex items-center space-x-2 w-full text-left py-2 px-4 rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-all duration-300">
                                          <FaHome className="text-purple-600" />
                                          <span>Home</span>
                                        </button>
                                      </Link>
                                      <Link to="/Addstudent">
                                        <button className="flex items-center space-x-2 w-full text-left py-2 px-4 rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-all duration-300">
                                          <FaUser className="text-black" />
                                          <span>Add Students</span>
                                        </button>
                                      </Link>
                                      <Link to="/Enrolled">
                                        <button className="flex items-center space-x-2 w-full text-left py-2 px-4 rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-all duration-300">
                                          <FaFileAlt className="text-red-500" />
                                          <span>Enrolled</span>
                                        </button>
                                      </Link>
                                      <Link to="/Period">
                                        <button className="flex items-center space-x-2 w-full text-left py-2 px-4 rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-all duration-300">
                                          <FaClock className="text-green-500" />
                                          <span>Period Wise</span>
                                        </button>
                                      </Link>
                                      <Link to="/QRScan">
  <button className="flex items-center space-x-2 w-full text-left py-2 px-4 rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-all duration-300">
    <FaQrcode className="text-blue-500" /><span>QR Scan</span>
  </button>
</Link>
                                    </div>
                    </div>
                    <Link to='/signin'>
                        <button className="w-full py-2 rounded-xl bg-[#1E2A78] text-white shadow-md flex items-center justify-center space-x-2 hover:bg-[#16239D] active:bg-[#0f1c77] transition-all duration-300">
                            <FaDownload />
                            <span>LogOut</span>
                        </button>
                    </Link>
                </div>

                <div className="flex-1">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center text-white mb-6 gap-4">
                        <div>
                            <p>Pages / Dashboard</p>
                            <h1 className="text-lg font-semibold">Dashboard</h1>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                        {/* Total Students */}
                        <div className="bg-white rounded-[1.1rem] p-4 shadow-sm space-y-2.5 flex items-center justify-between">
                            <div className="flex flex-col space-y-1">
                                <div className="w-9 h-9 bg-green-100 text-green-600 flex items-center justify-center rounded-md">
                                    <FaUserGraduate className="text-lg" />
                                </div>
                                <p className="text-xs font-semibold text-gray-600">TOTAL</p>
                                <p className="text-green-600 text-md font-semibold mt-1">Students in the class</p>
                            </div>
                            <h3 className="text-5xl font-bold text-gray-800 px-6">{totalStudents}</h3>
                        </div>

                        {/* Present Today */}
                        <div className="bg-white rounded-[1.1rem] p-4 shadow-sm space-y-2.5 flex items-center justify-between">
                            <div className="flex flex-col space-y-1">
                                <div className="w-9 h-9 bg-blue-100 text-blue-600 flex items-center justify-center rounded-md">
                                    <FaClipboardList className="text-lg" />
                                </div>
                                <p className="text-xs font-semibold text-gray-600">TOTAL</p>
                                <p className="text-blue-600 text-md font-semibold mt-1">Students Present Today</p>
                            </div>
                            <p className="text-5xl font-bold text-gray-800 px-6">{uniquePresentToday.length}</p>
                        </div>

                        {/* Absent Today */}
                        <div className="bg-white rounded-[1.1rem] p-4 shadow-sm space-y-2.5 flex items-center justify-between">
                            <div className="flex flex-col space-y-1">
                                <div className="w-9 h-9 bg-red-100 text-red-600 flex items-center justify-center rounded-md">
                                    <FaUsers className="text-lg" />
                                </div>
                                <p className="text-xs font-semibold text-gray-600">TOTAL</p>
                                <p className="text-red-600 text-md font-semibold mt-1">Students Absent Today</p>
                            </div>
                            <h3 className="text-5xl font-bold text-gray-800 px-6">{absentStudents}</h3>
                        </div>
                    </div>

                    <div className="w-full flex flex-row gap-5">
                       
                        <div className="bg-white w-1/2 rounded-[1.1rem] shadow-md p-4">
                            <h1 className="text-gray-800 ml-2 text-md font-bold mb-2">Logs of Student Attendance</h1>
                            <div className="flex justify-end mb-2">
                                <label htmlFor="filter" className="text-sm text-gray-700 mr-2 font-semibold">Sort by Course:</label>
                                <select
                                    id="filter"
                                    value={selectedCourse}
                                    onChange={(e) => {
                                        setSelectedCourse(e.target.value);
                                        setCurrentPage(1); 
                                    }}
                                    className="border px-3 py-1 rounded-md text-sm"
                                >
                                    {courseList.map((course, idx) => (
                                        <option key={idx} value={course}>{course}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="overflow-x-auto mt-2">
                                <table className="min-w-full table-auto border-separate border-spacing-y-2 text-sm text-gray-900">
                                    <thead>
                                        <tr className="bg-[#F7F7F7] text-gray-900">
                                            <th className="text-left px-4 py-3 rounded-l-lg">Name</th>
                                            <th className="text-left px-4 py-3">USN</th>
                                            <th className="text-left px-4 py-3">Course</th>
                                            <th className="text-left px-4 py-3 rounded-r-lg">Timings</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentAttendance.length > 0 ? (
                                            currentAttendance.map((student, index) => (
                                                <tr key={index} className="hover:bg-[#f0f4f8] transition-colors duration-200 rounded-lg">
                                                    <td className="px-4 py-3">{student.name}</td>
                                                    <td className="px-4 py-3">{student.usn}</td>
                                                    <td className="px-4 py-3">{student.course}</td>
                                                    <td className="px-4 py-3">{new Date(student.recognizedAt).toLocaleString()}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="text-center text-gray-400">No attendance logs available</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                       
                        {/* REPLACE WITH THIS */}
<div className="bg-white w-1/2 h-auto rounded-[1.1rem] shadow-md p-5">
    <div className="flex gap-2 mb-4">
        <button
            onClick={() => { stopQrScanner(); setScanMode('manual'); setQrResult(null); }}
            className={`flex-1 py-1.5 rounded-lg text-sm font-semibold transition-all ${scanMode === 'manual' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
            Manual
        </button>
        <button
            onClick={() => { setScanMode('qr'); startQrScanner(); }}
            className={`flex-1 py-1.5 rounded-lg text-sm font-semibold transition-all ${scanMode === 'qr' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
            QR Scan
        </button>
    </div>

    {scanMode === 'manual' && (
        <>
            <h1 className="text-gray-800 text-md font-semibold mb-3">Add Attendance Manually</h1>
            <div className="grid grid-cols-2 gap-2">
                <input type="text" name="manual_name" className="w-full placeholder:text-gray-700 rounded-xl bg-[#F7F7F7] px-4 py-2" placeholder="Enter the student's name" />
                <input type="text" name="manual_usn" className="w-full placeholder:text-gray-700 rounded-xl bg-[#F7F7F7] px-4 py-2" placeholder="Enter the student's Usn" />
                <input type="text" name="manual_course" className="w-full placeholder:text-gray-700 rounded-xl bg-[#F7F7F7] px-4 py-2" placeholder="Enter the student's Course" />
                <input type="datetime-local" name="recognizedAt" className="w-full placeholder:text-gray-700 rounded-xl bg-[#F7F7F7] px-4 py-2" />
            </div>
            <button onClick={handleManualAttendance} className="w-[12rem] mt-4 rounded-xl p-2 bg-gradient-to-r from-blue-700 to-blue-600 font-bold text-white transition-all hover:opacity-90 hover:shadow-lg">
                Mark Attendance
            </button>
        </>
    )}

    {scanMode === 'qr' && (
        <>
            <h1 className="text-gray-800 text-md font-semibold mb-3">Scan Student QR Code</h1>
            <div id="qr-reader-dashboard" className="w-full rounded-xl overflow-hidden bg-gray-100" />
            {qrResult && (
                <div className={`mt-3 p-3 rounded-xl text-sm font-semibold ${qrResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                    {qrResult.message}
                    {qrResult.success && <span className="ml-2">· {qrResult.percentage}%</span>}
                </div>
            )}
            <button
                onClick={() => { stopQrScanner(); setScanMode('manual'); setQrResult(null); }}
                className="w-full mt-3 rounded-xl p-2 bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-all">
                Stop & Go Back
            </button>
        </>
    )}
</div>
                    </div>

                    {/* Pagination */}
                    <div className="text-center text-gray-600 mt-4">
                        <span
                            onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                            className={`mr-2 cursor-pointer hover:underline ${currentPage === 1 ? 'cursor-not-allowed text-gray-300' : ''}`}
                        >
                            Prev
                        </span>
                        <span className="font-semibold">Page {currentPage}</span>
                        <span
                            onClick={() => indexOfLastItem < filteredAttendance.length && paginate(currentPage + 1)}
                            className={`ml-2 cursor-pointer hover:underline ${indexOfLastItem >= filteredAttendance.length ? 'cursor-not-allowed text-gray-300' : ''}`}
                        >
                            Next
                        </span>
                    </div>

                    {/* Footer */}
                    <div className="text-center text-sm text-gray-500 mt-6">
                        <span className="font-semibold text-gray-700">© ALL RIGHTS RESERVED</span>
                        <div className="text-right text-xs underline mt-1 cursor-pointer"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
