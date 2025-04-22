document.addEventListener("DOMContentLoaded", () => {
  const music = document.getElementById("bgMusic");
  if (music) music.volume = 0.2;
});
async function enhancePhoto() {
  const input = document.getElementById("photoInput");
  const preview = document.getElementById("photoPreview");
  if (!input.files.length) {
    alert("Pilih foto terlebih dahulu!");
    return;
  }
  const file = input.files[0];
  const formData = new FormData();
  formData.append("image", file);
  preview.innerHTML = "Memproses foto...";
  try {
    const response = await fetch(IMAGE_API_URL, {
      method: "POST",
      headers: {
        "api-key": IMAGE_API_KEY
      },
      body: formData
    });
    const result = await response.json();
    if (result.output_url) {
      preview.innerHTML = `<img src="${result.output_url}" alt="Foto HD" />`;
    } else {
      preview.innerHTML = "Gagal memproses foto.";
    }
  } catch (error) {
    preview.innerHTML = "Terjadi kesalahan.";
  }
}
function downloadVideo() {
  const url = document.getElementById("videoUrl").value;
  if (!url) {
    alert("Masukkan URL video!");
    return;
  }
  const fullApiUrl = VIDEO_API_BASE + encodeURIComponent(url);
  window.open(fullApiUrl, "_blank");
}
