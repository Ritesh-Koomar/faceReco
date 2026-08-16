import "./App.css";
import { FaHome, FaFileAlt, FaUser, FaDownload, FaClock, FaQrcode, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import axios from 'axios';

const QRScan = () => {
  const [scanning, setScanning]     = useState(false);
  const [result, setResult]         = useState(null); // { success, message, name, percentage }
  const [loading, setLoading]       = useState(false);
  const scannerRef                  = useRef(null);
  const html5QrRef                  = useRef(null);

  const startScanner = async () => {
    setResult(null);
    setScanning(true);

    setTimeout(async () => {
      try {
        const html5Qr = new Html5Qrcode("qr-reader");
        html5QrRef.current = html5Qr;

        await html5Qr.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          async (decodedText) => {
            // decodedText is the USN
            await stopScanner();
            await markAttendance(decodedText.trim());
          },
          () => {} // ignore errors during scan
        );
      } catch (err) {
        console.error("Scanner error:", err);
        setScanning(false);
        setResult({ success: false, message: "Camera access denied or not available." });
      }
    }, 100);
  };

  const stopScanner = async () => {
    try {
      if (html5QrRef.current) {
        await html5QrRef.current.stop();
        html5QrRef.current = null;
      }
    } catch (e) {}
    setScanning(false);
  };

  const markAttendance = async (usn) => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5001/api/qr-attendance', { usn });
      setResult({
        success:    true,
        message:    res.data.message,
        name:       res.data.name,
        percentage: res.data.percentage,
        alertSent:  res.data.alertSent
      });
    } catch (err) {
      const msg = err.response?.data?.message || "Something went wrong";
      setResult({ success: false, message: msg });
    }
    setLoading(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => { stopScanner(); };
  }, []);

  return (
    <div className="min-h-screen p-4 bg-split">
      <div className="flex flex-col lg:flex-row gap-6">

        {/* Sidebar */}
        <div className="w-full lg:w-64 bg-white shadow-xl rounded-2xl p-4 flex flex-col justify-between min-h-[90vh]">
          <div>
            <h2 className="text-xl mt-5 font-bold text-center mb-6">Admin Page</h2>
            <div className="flex flex-col gap-5">
              <Link to="/dashboard">
                <button className="flex items-center space-x-2 w-full text-left py-2 px-4 rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-all duration-300">
                  <FaHome className="text-purple-600" /><span>Home</span>
                </button>
              </Link>
              <Link to="/Addstudent">
                <button className="flex items-center space-x-2 w-full text-left py-2 px-4 rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-all duration-300">
                  <FaUser className="text-black" /><span>Add Students</span>
                </button>
              </Link>
              <Link to="/Enrolled">
                <button className="flex items-center space-x-2 w-full text-left py-2 px-4 rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-all duration-300">
                  <FaFileAlt className="text-red-500" /><span>Enrolled</span>
                </button>
              </Link>
              <Link to="/Period">
                <button className="flex items-center space-x-2 w-full text-left py-2 px-4 rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-all duration-300">
                  <FaClock className="text-green-500" /><span>Period Wise</span>
                </button>
              </Link>
              <Link to="/QRScan">
                <button className="flex items-center space-x-2 w-full text-left py-2 px-4 rounded-xl bg-gray-50 hover:bg-gray-100 active:bg-gray-200 transition-all duration-300">
                  <FaQrcode className="text-blue-500" /><span>QR Scan</span>
                </button>
              </Link>
            </div>
          </div>
          <Link to='/signin'>
            <button className="w-full py-2 rounded-xl bg-[#1E2A78] text-white shadow-md flex items-center justify-center space-x-2 hover:bg-[#16239D] active:bg-[#0f1c77] transition-all duration-300">
              <FaDownload /><span>LogOut</span>
            </button>
          </Link>
        </div>

        {/* Main */}
        <div className="flex-1">
          <div className="text-white mb-6">
            <p>Pages / QR Scan</p>
            <h1 className="text-lg font-semibold">QR Code Attendance</h1>
          </div>

          <div className="bg-white rounded-[1.1rem] shadow-md p-6 max-w-xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <FaQrcode className="text-blue-600 text-2xl" />
              <h2 className="text-gray-800 font-bold text-lg">Scan Student QR Code</h2>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              Use this as a fallback when face recognition fails. Each student's QR code is available on the Enrolled page.
            </p>

            {/* Scanner box */}
            <div
              id="qr-reader"
              className="w-full rounded-xl overflow-hidden bg-gray-100"
              style={{ minHeight: scanning ? '300px' : '0px' }}
            />

            {/* Loading */}
            {loading && (
              <div className="text-center py-6 text-blue-600 font-semibold animate-pulse">
                Marking attendance...
              </div>
            )}

            {/* Result */}
            {result && !loading && (
              <div className={`mt-4 p-4 rounded-xl flex items-start gap-3 ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                {result.success
                  ? <FaCheckCircle className="text-green-500 text-xl mt-0.5 shrink-0" />
                  : <FaTimesCircle className="text-red-500 text-xl mt-0.5 shrink-0" />
                }
                <div>
                  <p className={`font-semibold ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                    {result.message}
                  </p>
                  {result.success && (
                    <div className="mt-1 text-sm text-gray-600 space-y-0.5">
                      <p>Student: <strong>{result.name}</strong></p>
                      <p>Attendance: <strong
                        className={result.percentage < 75 ? 'text-red-600' : 'text-green-600'}>
                        {result.percentage}%
                      </strong></p>
                      {result.alertSent && (
                        <p className="text-orange-500 text-xs mt-1">⚠️ Low attendance email alert sent to student.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 mt-6">
              {!scanning ? (
                <button
                  onClick={startScanner}
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-700 to-blue-600 font-bold text-white hover:opacity-90 hover:shadow-lg transition-all flex items-center justify-center gap-2">
                  <FaQrcode /> Start Scanning
                </button>
              ) : (
                <button
                  onClick={stopScanner}
                  className="flex-1 py-2.5 rounded-xl bg-gray-200 font-bold text-gray-700 hover:bg-gray-300 transition-all">
                  Stop Scanner
                </button>
              )}
              {result && (
                <button
                  onClick={() => { setResult(null); startScanner(); }}
                  className="flex-1 py-2.5 rounded-xl border border-blue-300 font-bold text-blue-600 hover:bg-blue-50 transition-all">
                  Scan Another
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRScan;