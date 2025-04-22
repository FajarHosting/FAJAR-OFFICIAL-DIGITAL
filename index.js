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
    
    // Tentukan ukuran yang lebih besar, misalnya 4K untuk kualitas sangat tinggi
    const width = 3840;  // Resolusi lebar 4K (3840px), jika HD cukup dengan 1920px
    const height = null; // Tinggi otomatis agar rasio gambar tetap terjaga

    // Resize gambar menjadi 4K, dan lakukan penajaman ekstra untuk meningkatkan kualitas
    const buffer = await sharp(req.file.buffer)
      .resize(width, height, { withoutEnlargement: false }) // Resize hingga 4K
      .sharpen(5)  // Penajaman sangat tinggi untuk gambar yang lebih jelas
      .withMetadata() // Mempertahankan metadata gambar
      .toBuffer();

    // Kirim gambar dalam format JPEG
    res.set('Content-Type', 'image/jpeg');
    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error processing image');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
