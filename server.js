const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 3000;

// Enable CORS
app.use(cors());

// Upload to D: drive folder (must exist)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'D:/vchat-uploads');
  },
  filename: function (req, file, cb) {
    // 🧼 Remove special characters from filename (keep letters, numbers, dots, dashes)
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueName = Date.now() + '_' + sanitizedName;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// Upload route
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const fileUrl = `http://localhost:${PORT}/files/${req.file.filename}`;
  res.status(200).json({ message: '✅ File uploaded!', url: fileUrl });
});

// Serve uploaded files
app.use('/files', express.static('D:/vchat-uploads'));

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
