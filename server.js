const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const otpStore = {};

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Serve HTML files from "public" folder

// Replace with your real Gmail + App Password
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'np8989898989@gmail.com', // <-- your Gmail here
    pass: 'myyq gutw btit lnek' // <-- Gmail app password here
  }
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.post('/send-otp', (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000);
  otpStore[email] = otp;

  const mailOptions = {
    from: 'np8989898989@gmail.com',
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.json({ success: false });
    }
    res.json({ success: true });
  });
});

app.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  if (otpStore[email] && otpStore[email] == otp) {
    delete otpStore[email];
    return res.json({ success: true, message: 'OTP Verified!' });
  }
  res.json({ success: false, message: 'Invalid OTP' });
});

app.listen(3000, () => console.log('✅ Server running on http://localhost:3000'));
