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
    
    // Tentukan ukuran yang lebih besar (misalnya HD atau 4K)
    const width = 1920;  // Resolusi lebar HD (1920px)
    const height = null; // Tinggi otomatis berdasarkan rasio aspek asli

    // Resize gambar menjadi HD (1920px) dan menajamkan dengan lebih kuat
    const buffer = await sharp(req.file.buffer)
      .resize(width, height, { withoutEnlargement: false }) // Ukuran gambar dapat diperbesar jika gambar lebih kecil dari target
      .sharpen(2) // Menajamkan gambar dengan level yang lebih tinggi
      .toBuffer();

    // Kirim hasil gambar dalam format JPEG
    res.set('Content-Type', 'image/jpeg');
    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error processing image');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
