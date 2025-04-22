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

    // Tentukan ukuran resolusi lebih tinggi (misalnya HD atau 4K)
    const width = 1920;  // Resolusi lebar HD (1920px), ganti menjadi 3840 untuk 4K
    const height = null; // Tinggi otomatis agar rasio gambar tetap terjaga

    // Resize gambar menjadi lebih besar (misalnya HD atau 4K)
    const buffer = await sharp(req.file.buffer)
      .resize(width, height, { withoutEnlargement: false }) // Gambar diperbesar meskipun ukuran aslinya lebih kecil
      .sharpen(3)  // Menggunakan level sharpen yang lebih tinggi untuk ketajaman
      .withMetadata()  // Menyertakan metadata gambar
      .toBuffer();

    // Mengirim gambar dalam format JPEG
    res.set('Content-Type', 'image/jpeg');
    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error processing image');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
