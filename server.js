const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const fs = require('fs');
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const app = express();
const upload = multer({ dest: 'uploads/' });

AWS.config.update({ region: 'us-west-2' });
const rekognition = new AWS.Rekognition();

// Removed the video verification endpoint
// app.post('/api/upload-video', upload.single('video'), (req, res) => {
//   const videoPath = req.file.path;

//   // Here you would extract frames and use rekognition to verify
//   // For simplicity, we'll just simulate a successful verification
//   fs.unlinkSync(videoPath); // Clean up the uploaded file
//   res.json({ message: 'Video uploaded and verified successfully!' });
// });

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const PORT = 3001;

nextApp.prepare().then(() => {
  // Handle Next.js requests
  app.all('*', (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  // Create HTTP server
  createServer(app).listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
}); 