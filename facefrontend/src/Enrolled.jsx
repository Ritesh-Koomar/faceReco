
import "./App.css";
import { FaHome, FaFileAlt, FaUser, FaDownload, FaClock, FaTrash, FaQrcode } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';




const Enrolled = () => {
  const [students,           setStudents]           = useState([]);
  const [attendanceLogs,     setAttendanceLogs]     = useState([]);
  const [search,             setSearch]             = useState('');
  const [filteredSuggestions,setFilteredSuggestions]= useState([]);
  const [selectedStudent,    setSelectedStudent]    = useState(null);
  // qr changes made here -------------------------------------------------
  const [qrStudent,           setQrStudent]           = useState(null);

  const toLocalDate = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
};

  useEffect(() => {
    const fetchStudentsAndAttendance = async () => {
      try {
        const [studentsRes, attendanceRes] = await Promise.all([
          axios.get('http://localhost:5001/api/students'),
          axios.get('http://localhost:5001/api/attendance'),
        ]);
        setStudents(studentsRes.data);
        setAttendanceLogs(attendanceRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchStudentsAndAttendance();
  }, []);


const todayDate = toLocalDate(new Date());

const getAttendanceStatus = (usn) => {
    const hasLogToday = attendanceLogs.some(log => {
        const logDate = toLocalDate(log.recognizedAt);
        return log.usn === usn && logDate === todayDate;
    });
    return hasLogToday ? "Present" : "Absent";
};


  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);
    if (!query) {
      setFilteredSuggestions([]);
    } else {
      const suggestions = students.filter((student) => {
        const nameMatch  = student.name?.toLowerCase().includes(query);
        const usnMatch   = student.usn?.toLowerCase().includes(query);
        const deptMatch  = student.department?.toLowerCase().includes(query);
        return nameMatch || usnMatch || deptMatch;
      });
      setFilteredSuggestions(suggestions);
    }
  };

  const handleSuggestionClick = (student) => {
    setSelectedStudent(student);
    setSearch('');
    setFilteredSuggestions([]);
  };

  // Delete student by ID
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      await axios.delete(`http://localhost:5001/api/students/${id}`);
      setStudents(prev => prev.filter(s => s._id !== id));
    } catch (err) {
      console.error("Error deleting student:", err);
      alert("Failed to delete student. Please try again.");
    }
  };

  const closeModal = () => setSelectedStudent(null);

  return (
    <div className="min-h-screen p-4 bg-split relative">
    
      {qrStudent && (
  <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
    <div className="bg-white rounded-xl p-6 w-72 shadow-lg relative text-center">
      <button onClick={() => setQrStudent(null)} className="absolute top-2 right-3 text-xl text-gray-600 hover:text-black">
        &times;
      </button>
      <h2 className="text-lg font-semibold mb-1">{qrStudent.name}</h2>
      <p className="text-sm text-gray-500 mb-4">USN: {qrStudent.usn}</p>
      <div className="flex justify-center">
        <QRCodeSVG value={qrStudent.usn} size={180} />
      </div>
      <p className="text-xs text-gray-400 mt-4">Show this QR to the teacher for manual scan</p>
    </div>
  </div>
)}








      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-96 shadow-lg relative">
            <button onClick={closeModal} className="absolute top-2 right-3 text-xl text-gray-600 hover:text-black">
              &times;
            </button>
            <h2 className="text-lg font-semibold mb-4">Student Details</h2>
            <div className="space-y-2 text-sm text-gray-800">
              <p><strong>Name:</strong>        {selectedStudent.name}</p>
              <p><strong>USN:</strong>         {selectedStudent.usn}</p>
              <p><strong>Department:</strong>  {selectedStudent.department || 'N/A'}</p>
              <p><strong>Course:</strong>      {selectedStudent.course}</p>
              <p><strong>Email:</strong>       {selectedStudent.email || 'N/A'}</p>
              <p><strong>Enrolled At:</strong> {new Date(selectedStudent.enrolledAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">

        {/* Sidebar */}
        <div className="w-full lg:w-64 bg-white shadow-xl rounded-2xl p-4 flex flex-col justify-between min-h-[90vh]">
          <div>
            <h2 className="text-xl font-semibold text-center mb-6">Admin Page</h2>
            <div className="flex flex-col gap-5">
              <Link to="/dashboard">
                <button className="flex items-center space-x-2 w-full text-left py-2 px-4 rounded-xl hover:bg-gray-100">
                  <FaHome className="text-purple-600" /><span>Home</span>
                </button>
              </Link>
              <Link to="/Addstudent">
                <button className="flex items-center space-x-2 w-full text-left py-2 px-4 rounded-xl hover:bg-gray-100">
                  <FaUser className="text-black" /><span>Add Students</span>
                </button>
              </Link>
              <Link to="/Enrolled">
                <button className="flex items-center space-x-2 w-full text-left py-2 px-4 rounded-xl hover:bg-gray-100 bg-gray-50">
                  <FaFileAlt className="text-red-500" /><span>Enrolled</span>
                </button>
              </Link>
              <Link to="/Period">
                <button className="flex items-center space-x-2 w-full text-left py-2 px-4 rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-all duration-300">
                  <FaClock className="text-green-500" /><span>Period Wise</span>
                </button>
              </Link>
            </div>
          </div>
          <Link to='/signin'>
            <button className="w-full py-2 rounded-xl bg-[#1E2A78] text-white shadow-md flex items-center justify-center space-x-2 hover:bg-[#16239D]">
              <FaDownload /><span>LogOut</span>
            </button>
          </Link>
        </div>

        {/* Main content */}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center text-white mb-6 gap-4">
            <div>
              <p>Pages / Enrolled</p>
              <h1 className="text-lg font-semibold">Enrolled Students</h1>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Student Here"
                value={search}
                onChange={handleSearchChange}
                className="text-gray-900 placeholder:text-gray-700 rounded-xl bg-[#F7F7F7] px-4 py-2 focus:ring-2 focus:ring-blue-500 w-80"
              />
              {filteredSuggestions.length > 0 && (
                <div className="absolute w-full mt-1 bg-white shadow-lg rounded-lg max-h-60 overflow-auto z-10">
                  <ul className="text-sm text-gray-800">
                    {filteredSuggestions.map((student) => (
                      <li key={student._id}
                        className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleSuggestionClick(student)}>
                        {student.name} ({student.usn})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Students Table */}
          <div className="bg-white rounded-[1.1rem] shadow-md p-4">
            <h1 className="text-gray-900 ml-2 font-bold">List of Enrolled Students</h1>
            <div className="overflow-x-auto mt-5">
              <table className="min-w-full table-auto border-separate border-spacing-y-2 text-sm text-gray-900">
                <thead>
                  <tr className="bg-[#F7F7F7] text-gray-900">
                    <th className="text-left px-4 py-3 rounded-l-lg">Name</th>
                    <th className="text-left px-4 py-3">USN</th>
                    <th className="text-left px-4 py-3">Department</th>
                    <th className="text-left px-4 py-3">Course</th>
                    <th className="text-left px-4 py-3">Email</th>
                    <th className="text-left px-4 py-3">Enrolled At</th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="text-left px-4 py-3 rounded-r-lg">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {students.length > 0 ? (
                    students.map((student) => (
                      <tr key={student._id} className="hover:bg-[#f0f4f8] transition duration-200">
                        <td className="px-4 py-3">{student.name}</td>
                        <td className="px-4 py-3">{student.usn}</td>
                        <td className="px-4 py-3">{student.department || 'N/A'}</td>
                        <td className="px-4 py-3">{student.course}</td>
                        {/* Fallback to phone for old records without email */}
                        <td className="px-4 py-3">{student.email || student.phone || 'N/A'}</td>
                        <td className="px-4 py-3">{new Date(student.enrolledAt).toLocaleDateString()}</td>
                        <td className="px-4 py-3 font-semibold">
                          <span className={getAttendanceStatus(student.usn) === "Present" ? "text-green-600" : "text-red-500"}>
                            {getAttendanceStatus(student.usn)}
                          </span>
                        </td>
                        <td className="px-4 py-3 rounded-r-lg">
                          <button
                            onClick={() => handleDelete(student._id)}
                            className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1.5 rounded-lg transition duration-200">
                            <FaTrash className="text-xs" /> Delete
                          </button>
                        </td>
                        
                        <button onClick={() => setQrStudent(student)}
                      className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg transition duration-200 mt-1">
                          <FaQrcode className="text-xs" /> QR
                            </button> 
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-4 text-gray-500">No students enrolled.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Enrolled;
