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

    const newWidth = metadata.width * 3;
    const newHeight = metadata.height * 3;

    const buffer = await image
      .resize({
        width: newWidth,
        height: newHeight,
        fit: 'inside',
        kernel: sharp.kernel.lanczos3, // scaling terbaik
      })
      .sharpen({
        sigma: 1,
        m1: 2,
        m2: 1,
        x1: 2,
        x2: 2,
        y2: 2,
      })
      .withMetadata()
      .jpeg({ quality: 100 })
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
