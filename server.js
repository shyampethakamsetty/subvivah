const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const fs = require('fs');

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

app.listen(3001, () => {
  console.log('Server running on port 3001');
  
}); 