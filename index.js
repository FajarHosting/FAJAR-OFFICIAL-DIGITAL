const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.static('public'));

const upload = multer({ storage: multer.memoryStorage() });

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/hd', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).send('No image uploaded');

    const image = sharp(req.file.buffer);
    const metadata = await image.metadata();

    // Perbesar maksimal 3x lipat agar tidak pecah
    const maxScale = 3;
    const newWidth = Math.min(metadata.width * maxScale, 3840); // Batas atas: 4K
    const newHeight = Math.round((newWidth / metadata.width) * metadata.height);

    const buffer = await image
      .resize(newWidth, newHeight)
      .sharpen(2) // Penajaman sedang
      .jpeg({ quality: 95 }) // Kualitas tinggi
      .toBuffer();

    res.set('Content-Type', 'image/jpeg');
    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error processing image');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
