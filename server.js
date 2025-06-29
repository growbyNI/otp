const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Create uploads folder if it doesn't exist
const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueName = Date.now() + '_' + sanitizedName;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const fileUrl = `${req.protocol}://${req.get('host')}/files/${req.file.filename}`;
  res.status(200).json({ message: '✅ File uploaded!', url: fileUrl });
});

// Serve uploaded files
app.use('/files', express.static(UPLOAD_DIR));

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
