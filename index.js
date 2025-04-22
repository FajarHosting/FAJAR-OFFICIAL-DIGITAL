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
    
    // Menentukan ukuran baru (misalnya 4K atau HD)
    const width = 3840;  // Resolusi lebar 4K (3840px)
    const height = null; // Tinggi otomatis untuk mempertahankan rasio aspek asli

    // Resize gambar ke ukuran yang lebih besar (misalnya 4K) dan menajamkannya
    const buffer = await sharp(req.file.buffer)
      .resize(width, height, { withoutEnlargement: false }) // Menjaga gambar tetap besar meskipun lebih kecil dari ukuran target
      .sharpen() // Menajamkan gambar untuk meningkatkan detail setelah diresize
      .toBuffer();

    // Mengirimkan gambar yang sudah diproses
    res.set('Content-Type', 'image/jpeg');
    res.send(buffer);
  } catch (err) {
    res.status(500).send('Error processing image');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
