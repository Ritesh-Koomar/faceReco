const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 5001;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect("mongodb://127.0.0.1:27017/yourDB")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB Error:", err));

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'crickettrains433@gmail.com',
    pass: 'mdqyvyaetojyfdnx'
  }
});

transporter.verify((err, success) => {
  if (err) console.error('[EMAIL] Transporter verification failed:', err.message);
  else     console.log('[EMAIL] Transporter ready ✓');
});

async function sendAttendanceAlert(studentName, studentEmail, usn, percentage) {
  const mailOptions = {
    from: 'crickettrains433@gmail.com',
    to: studentEmail,
    subject: `Low Attendance Alert for Roll No. — ${usn}`,
    html: `
      <div style="font-family: sans-serif; padding: 20px; background: #fff3f3; border-radius: 10px;">
        <h2 style="color: #dc2626;">Attendance Warning!</h2>
        <p>Dear <strong>${studentName}</strong>,</p>
        <p>Your current attendance has dropped to 
          <strong style="color: #dc2626;">${percentage.toFixed(1)}%</strong>, 
          which is below the required <strong>75%</strong>.
        </p>
        <p>Please attend classes regularly to avoid being debarred from the semester exam.</p>
        <br/>
        <p style="color: #888; font-size: 12px;">— Regards, Controller Of Examination</p>
        <p style="color: #888; font-size: 12px;">Heritage Institute Of Technology, Kolkata - 700107</p>
      </div>
    `
  };
  await transporter.sendMail(mailOptions);
  console.log(`[EMAIL] Alert sent to ${studentEmail}`);
}

async function sendAttendanceGood(studentName, studentEmail, usn, percentage) {
  const mailOptions = {
    from: 'crickettrains433@gmail.com',
    to: studentEmail,
    subject: `✅ Attendance Update — ${usn}`,
    html: `
      <div style="font-family: sans-serif; padding: 20px; background: #f0fff4; border-radius: 10px;">
        <h2 style="color: #16a34a;">✅ Attendance Status</h2>
        <p>Dear <strong>${studentName}</strong>,</p>
        <p>Your current attendance is 
          <strong style="color: #16a34a;">${percentage.toFixed(1)}%</strong>, 
          which is above the required <strong>75%</strong>. Keep it up!
        </p>
        <br/>
        <p style="color: #888; font-size: 12px;">— Smart Attendance System</p>
      </div>
    `
  };
  await transporter.sendMail(mailOptions);
  console.log(`[EMAIL] Good attendance status sent to ${studentEmail}`);
}


// ─────────────────────────────────────────────
// Schemas
// ─────────────────────────────────────────────
const studentSchema = new mongoose.Schema({
  name:       String,
  usn:        String,
  department: String,
  course:     String,
  email:      String,
  enrolledAt: { type: Date, default: Date.now }
});
const Student = mongoose.model('Student', studentSchema);

const attendanceLogSchema = new mongoose.Schema({
  usn:          String,
  name:         String,
  course:       String,
  recognizedAt: { type: Date, default: Date.now }
});
const AttendanceLog = mongoose.model('AttendanceLog', attendanceLogSchema);

const periodwiseAttendanceLogSchema = new mongoose.Schema({
  usn:          String,
  name:         String,
  course:       String,
  period:       String,
  recognizedAt: { type: Date, default: Date.now }
});
const PeriodwiseAttendanceLog = mongoose.model('PeriodwiseAttendanceLog', periodwiseAttendanceLogSchema);

const AdminSchema = new mongoose.Schema({
  username: String,
  email:    String,
  password: String,
});
const Admin = mongoose.model("Admin", AdminSchema);


// ─────────────────────────────────────────────
// Attendance % calculator
// Counts unique days present vs total days any
// attendance was recorded across all students
// ─────────────────────────────────────────────
async function calculateAttendancePercentage(usn) {
  // All logs across all students — find unique days school was held
  const allLogs = await PeriodwiseAttendanceLog.find({});

  const uniqueDays = new Set();
  allLogs.forEach(log => {
    const date = new Date(log.recognizedAt).toISOString().split('T')[0];
    uniqueDays.add(date);
  });

  const totalDays = uniqueDays.size;
  if (totalDays === 0) return 100;

  // Days this specific student was present
  const studentLogs = await PeriodwiseAttendanceLog.find({ usn });
  const studentDays = new Set();
  studentLogs.forEach(log => {
    const date = new Date(log.recognizedAt).toISOString().split('T')[0];
    studentDays.add(date);
  });

  const percentage = (studentDays.size / totalDays) * 100;
  console.log(`[ATTENDANCE] ${usn} — ${studentDays.size}/${totalDays} days = ${percentage.toFixed(1)}%`);
  return percentage;
}


// ─────────────────────────────────────────────
// Routes
// ─────────────────────────────────────────────

// Test email
app.get('/api/test-email', async (req, res) => {
  try {
    await transporter.sendMail({
      from:    'crickettrains433@gmail.com',
      to:      'crickettrains433@gmail.com',
      subject: 'Test Email — Smart Attendance',
      text:    'If you see this, Gmail auth is working correctly.'
    });
    res.json({ message: 'Test email sent! Check your inbox.' });
  } catch (err) {
    console.error('[TEST EMAIL] Error:', err);
    res.status(500).json({ error: err.message, code: err.code, response: err.response });
  }
});

// Fix missing email for a student by USN
app.patch('/api/students/:usn/email', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });
  try {
    const updated = await Student.findOneAndUpdate(
      { usn: req.params.usn },
      { email },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Email updated", student: updated });
  } catch (err) {
    res.status(500).json({ message: "Failed to update email" });
  }
});

app.get('/api/attendance-percentage/:usn', async (req, res) => {
  const { usn } = req.params;
  try {
    const percentage = await calculateAttendancePercentage(usn);
    const student    = await Student.findOne({ usn });
    res.json({
      usn,
      name:       student?.name || 'Unknown',
      percentage: parseFloat(percentage.toFixed(1))
    });
  } catch (err) {
    console.error("Error calculating percentage:", err);
    res.status(500).json({ message: "Failed to calculate attendance" });
  }
});

app.post('/api/students', async (req, res) => {
  const { name, usn, department, course, email } = req.body;
  if (!name || !usn || !department || !course || !email) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const existing = await Student.findOne({ usn });
    if (existing) {
      return res.status(400).json({ message: `A student with USN "${usn}" already exists.` });
    }
    const newStudent = new Student({ name, usn, department, course, email });
    await newStudent.save();
    res.status(200).json({ message: "Student saved to database!" });
  } catch (err) {
    console.error("Error saving student:", err);
    res.status(500).json({ message: "Failed to save student" });
  }
});

app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find().sort({ enrolledAt: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch students" });
  }
});

app.delete('/api/students/:id', async (req, res) => {
  try {
    const deleted = await Student.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete student" });
  }
});

app.get('/api/attendance', async (req, res) => {
  try {
    const logs = await PeriodwiseAttendanceLog.find().sort({ recognizedAt: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch attendance logs" });
  }
});

app.post('/api/attendance', async (req, res) => {
  const { usn, name, course, recognizedAt } = req.body;
  if (!usn) return res.status(400).json({ message: "USN is required" });
  try {
    let student = await Student.findOne({ usn });
    if (!student && (!name || !course)) {
      return res.status(404).json({ message: "Student not found" });
    }
    const recognizedDate = recognizedAt ? new Date(recognizedAt) : new Date();
    const log = new AttendanceLog({
      usn,
      name:         student ? student.name   : name,
      course:       student ? student.course : course,
      recognizedAt: recognizedDate
    });
    await log.save();
    res.status(200).json({ message: "Attendance logged successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to log attendance" });
  }
});

app.post('/api/qr-attendance', async (req, res) => {
  const { usn } = req.body;
  if (!usn) return res.status(400).json({ message: "USN is required" });

  try {
    const student = await Student.findOne({ usn });
    if (!student) return res.status(404).json({ message: "Student not found. Invalid QR code." });

    const now      = new Date();
    const today    = new Date(now.toISOString().split('T')[0]);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // One mark per day
    const existing = await PeriodwiseAttendanceLog.findOne({
      usn,
      recognizedAt: { $gte: today, $lt: tomorrow }
    });

    if (existing) {
      const percentage = await calculateAttendancePercentage(usn);
      return res.status(400).json({
        message: `Attendance already marked for ${student.name} today.`,
        percentage: parseFloat(percentage.toFixed(1))
      });
    }

    const log = new PeriodwiseAttendanceLog({
      usn,
      name:         student.name,
      course:       student.course,
      period:       'QR Scan',
      recognizedAt: now
    });
    await log.save();

    const percentage = await calculateAttendancePercentage(usn);


let alertSent = false;
if (student.email) {
  try {
    if (percentage <= 100) {
      await sendAttendanceAlert(student.name, student.email, usn, percentage);
    } else {
      await sendAttendanceGood(student.name, student.email, usn, percentage);
    }
    alertSent = true;
  } catch (emailErr) {
    console.error('[EMAIL] Failed to send email:', emailErr.message);
  }
} else {
  console.warn(`[EMAIL] Skipped — student ${usn} has no email in database`);
}

    res.status(200).json({
      message:    `Attendance marked for ${student.name} via QR`,
      name:       student.name,
      percentage: parseFloat(percentage.toFixed(1)),
      alertSent
    });

  } catch (err) {
    console.error("QR attendance error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ─────────────────────────────────────────────
// Periodwise attendance — no time restriction
// One mark allowed per USN per day
// ─────────────────────────────────────────────
app.post('/api/periodwise-attendance', async (req, res) => {
  const { usn, recognizedAt } = req.body;
  if (!usn) return res.status(400).json({ message: "USN is required" });

  try {
    const student = await Student.findOne({ usn });
    if (!student) return res.status(404).json({ message: "Student not found" });

    const now      = recognizedAt ? new Date(recognizedAt) : new Date();
    const today    = new Date(now.toISOString().split('T')[0]);   // midnight today (UTC)
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // ── One mark per USN per day ─────────────────────────────────────────
    const existingLog = await PeriodwiseAttendanceLog.findOne({
      usn,
      recognizedAt: { $gte: today, $lt: tomorrow }
    });

    if (existingLog) {
      const percentage = await calculateAttendancePercentage(usn);
      return res.status(400).json({
        message:    `Attendance already marked for ${student.name} today.`,
        percentage: parseFloat(percentage.toFixed(1)),
        alertSent:  false
      });
    }

    // ── Save the log ─────────────────────────────────────────────────────
    const log = new PeriodwiseAttendanceLog({
      usn,
      name:         student.name,
      course:       student.course,
      period:       'Marked',        // no period restriction — generic label
      recognizedAt: now
    });
    await log.save();

    const percentage = await calculateAttendancePercentage(usn);
    console.log(`[DEBUG] usn=${usn}, email="${student.email}", percentage=${percentage.toFixed(1)}%`);

    // ── Send email if below 75% ──────────────────────────────────────────
    // AFTER
let alertSent = false;
if (student.email) {
  try {
    if (percentage <= 100) {
      await sendAttendanceAlert(student.name, student.email, usn, percentage);
    } else {
      await sendAttendanceGood(student.name, student.email, usn, percentage);
    }
    alertSent = true;
  } catch (emailErr) {
    console.error('[EMAIL] Failed to send email:', emailErr.message);
  }
} else {
  console.warn(`[EMAIL] Skipped — student ${usn} has no email in database`);
}

    res.status(200).json({
      message:    `Attendance marked for ${student.name}`,
      percentage: parseFloat(percentage.toFixed(1)),
      alertSent,
      log
    });

  } catch (err) {
    console.error("Error logging periodwise attendance:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get('/api/periodwise-attendance', async (req, res) => {
  try {
    const logs = await PeriodwiseAttendanceLog.find().sort({ recognizedAt: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch periodwise attendance logs" });
  }
});

app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) return res.status(400).json({ message: "Email already registered" });
    const newAdmin = new Admin({ username, email, password });
    await newAdmin.save();
    res.status(201).json({ message: "Admin created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin)                      return res.status(404).json({ message: "Admin not found" });
    if (admin.password !== password) return res.status(401).json({ message: "Invalid password" });
    res.status(200).json({ message: "Signin successful", admin: { username: admin.username, email: admin.email } });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

