const tools = [
["compress","image","📉","Image Compressor","Reduce JPG, PNG and WEBP file size."],
["resize","image","📐","Image Resizer","Resize images by pixels or percentage."],
["convert","image","🔄","Image Converter","Convert JPG, PNG and WEBP."],
["crop","image","✂️","Image Cropper","Crop an image quickly."],
["passport","image","🪪","Passport Photo","Prepare a passport-size portrait."],
["signature","image","✍️","Signature Resizer","Resize your signature image."],
["rotate","image","🔃","Rotate & Flip","Rotate or flip an image."],
["pdf","pdf","📄","Image to PDF","Make a PDF from an image."],
["pdfcompress","pdf","📦","PDF Compressor","Compress a PDF file."],
["mergepdf","pdf","📚","Merge PDF","Merge multiple PDF files."],
["ocr","document","🔤","Image OCR","Extract text from an image."],
["word","document","📝","Text Formatter","Format plain text."],
["qr","utility","▦","QR Generator","Create a QR code from text or URL."],
["base64","utility","🔐","Base64 Encoder","Encode text to Base64."],
["color","utility","🎨","Color Picker","Pick a color and copy its value."],
["grayscale","image","⚫","Grayscale Image","Convert image to grayscale."],
["blur","image","🌫️","Blur Image","Apply blur to an image."],
["pixelate","image","🔳","Pixelate Image","Pixelate an image."],
["watermark","image","💧","Watermark Image","Add watermark text to an image."],
["textimage","image","🔤","Add Text to Image","Add text to an image."],
["logo","image","🏷️","Add Logo","Add a logo to an image."],
["border","image","⬜","Add Border","Add a border to an image."],
["round","image","⭕","Round Corners","Round image corners."],
["flip","image","↔️","Flip Image","Flip image horizontally or vertically."],
["metadata","image","ℹ️","View Metadata","View image information."],
["removemetadata","image","🧹","Remove Metadata","Remove image metadata."],
["jpgpng","image","🖼️","JPG to PNG","Convert JPG to PNG."],
["pngjpg","image","🖼️","PNG to JPG","Convert PNG to JPG."],
["webpjpg","image","🖼️","WEBP to JPG","Convert WEBP to JPG."],
["heicjpg","image","🖼️","HEIC to JPG","Convert HEIC images to JPG."],
["pdfjpg","pdf","📄","PDF to JPG","Convert PDF pages to JPG."],
["jpgpdf","pdf","📑","JPG to PDF","Convert JPG images to PDF."],
["resizecm","image","📏","Resize in Centimeters","Resize image in centimeters."],
["resizemm","image","📏","Resize in Millimeters","Resize image in millimeters."],
["resizeinch","image","📏","Resize in Inches","Resize image in inches."],
["dpi","image","🎯","Convert DPI","Set image DPI to 200, 300 or 600."],
["checkdpi","image","🔍","Check Image DPI","Check image DPI."],
["upscale","image","✨","AI Upscale","Upscale an image."],
["superres","image","🚀","Super Resolution","Improve image resolution."],
["a4","document","📄","A4 Size","Resize image to A4."],
["ssc","document","🪪","SSC Photo Resize","Prepare SSC photo size."],
["psc","document","🪪","PSC Photo","Prepare PSC photo."],
["pancard","document","💳","PAN Card Photo","Prepare PAN card photo."],
["upsc","document","🪪","UPSC Photo","Prepare UPSC photo."],
["whatsapp","social","💬","WhatsApp DP","Resize for WhatsApp DP."],
["instagram","social","📷","Instagram Resize","Resize for Instagram."],
["youtube","social","▶️","YouTube Banner","Resize for YouTube banner."],
["jpegkb","image","📦","JPEG to KB","Reduce JPEG to target KB."],
["compress50","image","📉","Compress to 50KB","Compress image to about 50KB."],
["compress100","image","📉","Compress to 100KB","Compress image to about 100KB."],
["compress200","image","📉","Compress image to 200KB","Compress image to about 200KB."]
];

let mode = null;
let file = null;
let img = null;
let rotation = 0;

const grid = document.getElementById("grid");
const modal = document.getElementById("modal");
const mtitle = document.getElementById("mtitle");
const mdesc = document.getElementById("mdesc");
const controls = document.getElementById("controls");
const preview = document.getElementById("preview");
const run = document.getElementById("run");
const fileInput = document.getElementById("file");
const searchInput = document.getElementById("search");

function esc(s) {
  return String(s).replace(/[&<>"']/g, c =>
    ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]
  );
}

function draw(list = tools) {
  if (!grid) return;

  grid.innerHTML = list.map(t => `
    <article class="card"
      data-name="${esc(t[3].toLowerCase())} ${esc(t[4].toLowerCase())}"
      data-cat="${esc(t[1])}">

      <div class="ico">${t[2]}</div>
      <h3>${esc(t[3])}</h3>
      <p>${esc(t[4])}</p>

      <button type="button" onclick="openTool('${t[0]}')">
        Open Tool →
      </button>

    </article>
  `).join("");
}

draw();

function filterTools() {
  const q = searchInput
    ? searchInput.value.toLowerCase().trim()
    : "";

  draw(
    tools.filter(t =>
      (t[3] + " " + t[4])
        .toLowerCase()
        .includes(q)
    )
  );
}

function cat(category, button) {
  document
    .querySelectorAll(".categories button")
    .forEach(x => x.classList.remove("active"));

  if (button) {
    button.classList.add("active");
  }

  draw(
    category === "all"
      ? tools
      : tools.filter(t => t[1] === category)
  );
}

function openTool(m) {
  mode = m;
  file = null;
  img = null;
  rotation = 0;

  const tool = tools.find(x => x[0] === m);

  if (!tool) return;

  if (mtitle) mtitle.textContent = tool[3];
  if (mdesc) mdesc.textContent = tool[4];

  if (controls) controls.innerHTML = "";

  if (preview) {
    preview.innerHTML = "Select a file to begin";
  }

  if (fileInput) {
    fileInput.value = "";
    fileInput.accept =
      m === "pdfcompress" || m === "mergepdf"
        ? ".pdf"
        : "image/*";
  }

  if (run) {
    run.disabled = true;
  }

  if (m === "resize" || m === "signature") {
    controls.innerHTML = `
      <div class="ctrl">
        Width
        <input id="w" type="number" placeholder="px">

        Height
        <input id="h" type="number" placeholder="px">
      </div>
    `;
  }

  if (
    m === "compress" ||
    m === "compress50" ||
    m === "compress100" ||
    m === "compress200" ||
    m === "jpegkb"
  ) {
    controls.innerHTML = `
      <div class="ctrl">
        Quality
        <input
          id="quality"
          type="range"
          min="10"
          max="100"
          value="75"
        >
        <span id="qv">75%</span>
      </div>
    `;
  }

  if (m === "convert") {
    controls.innerHTML = `
      <div class="ctrl">
        Format
        <select id="fmt">
          <option value="image/jpeg">JPG</option>
          <option value="image/png">PNG</option>
          <option value="image/webp">WEBP</option>
        </select>
      </div>
    `;
  }

 if (m === "rotate") {
  controls.innerHTML = `
    <div class="ctrl">
      <button type="button" onclick="rotatePreview(-90)">
        ↶ Rotate Left
      </button>
      <button type="button" onclick="rotatePreview(90)">
        ↷ Rotate Right
      </button>
      <button type="button" onclick="flipPreview('x')">
        ↔️ Flip Horizontal
      </button>
      <button type="button" onclick="flipPreview('y')">
        ↕️ Flip Vertical
      </button>
    </div>
  `;
}

if (fileInput) {
  fileInput.addEventListener("change", function (e) {
    file = e.target.files[0];

    if (!file) return;

    run.disabled = false;

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();

      reader.onload = function (event) {
        img = new Image();

        img.onload = function () {
          preview.innerHTML = "";

          const p = document.createElement("img");
          p.src = event.target.result;
          p.id = "previewImg";
          p.style.maxWidth = "100%";
          p.style.maxHeight = "400px";

          preview.appendChild(p);
        };

        img.src = event.target.result;
      };

      reader.readAsDataURL(file);
    } else {
      preview.textContent = file.name;
    }
  });
}

document.addEventListener("input", function (e) {
  if (e.target.id === "quality") {
    const qv = document.getElementById("qv");

    if (qv) {
      qv.textContent = e.target.value + "%";
    }
  }
});

function canvasFromImage() {
  if (!img) {
    throw new Error("Please select an image first.");
  }

  const canvas = document.createElement("canvas");

  const w = img.naturalWidth || img.width;
  const h = img.naturalHeight || img.height;

  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext("2d");

  ctx.drawImage(img, 0, 0, w, h);

  return canvas;
}

function downloadBlob(blob, name) {
  const a = document.createElement("a");

  a.href = URL.createObjectURL(blob);
  a.download = name;

  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);

  setTimeout(function () {
    URL.revokeObjectURL(a.href);
  }, 1000);
}

function downloadCanvas(
  canvas,
  name = "premtools.jpg",
  type = "image/jpeg",
  quality = 0.85
) {
  canvas.toBlob(function (blob) {
    if (blob) {
      downloadBlob(blob, name);
    }
  }, type, quality);
}

function rotatePreview(deg) {
  rotation = (rotation + deg) % 360;

  const p = document.getElementById("previewImg");

  if (p) {
    p.style.transform =
      "rotate(" + rotation + "deg)";
  }
}

function flipPreview(axis) {
  const p = document.getElementById("previewImg");

  if (!p) return;

  if (axis === "x") {
    p.style.transform =
      "rotate(" + rotation + "deg) scaleX(-1)";
  }

  if (axis === "y") {
    p.style.transform =
      "rotate(" + rotation + "deg) scaleY(-1)";
  }
}

function resizeImage() {
  if (!img) {
    alert("Please select an image first.");
    return;
  }

  const width =
    parseInt(document.getElementById("w").value) ||
    img.naturalWidth;

  const height =
    parseInt(document.getElementById("h").value) ||
    img.naturalHeight;

  const canvas =
    document.createElement("canvas");

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");

  ctx.drawImage(
    img,
    0,
    0,
    width,
    height
  );function addBorder() {
  if (!img) {
    alert("Please select an image first.");
    return;
  }

  const canvas = canvasFromImage();
  const size = 20;

  const output = document.createElement("canvas");
  output.width = canvas.width + size * 2;
  output.height = canvas.height + size * 2;

  const ctx = output.getContext("2d");

  ctx.fillStyle = "#000000";
  ctx.fillRect(
    0,
    0,
    output.width,
    output.height
  );

  ctx.drawImage(
    canvas,
    size,
    size
  );

  downloadCanvas(
    output,
    "premtools-border.jpg"
  );
}

function cropImage() {
  if (!img) {
    alert("Please select an image first.");
    return;
  }

  const canvas = canvasFromImage();

  const size = Math.min(
    canvas.width,
    canvas.height
  );

  const output =
    document.createElement("canvas");

  output.width = size;
  output.height = size;

  const ctx = output.getContext("2d");

  ctx.drawImage(
    canvas,
    (canvas.width - size) / 2,
    (canvas.height - size) / 2,
    size,
    size,
    0,
    0,
    size,
    size
  );

  downloadCanvas(
    output,
    "premtools-cropped.jpg"
  );
}

function flipImage() {
  if (!img) {
    alert("Please select an image first.");
    return;
  }

  const canvas = canvasFromImage();

  const output =
    document.createElement("canvas");

  output.width = canvas.width;
  output.height = canvas.height;

  const ctx = output.getContext("2d");

  ctx.translate(
    output.width,
    0
  );

  ctx.scale(-1, 1);

  ctx.drawImage(
    canvas,
    0,
    0
  );

  downloadCanvas(
    output,
    "premtools-flipped.jpg"
  );
}

function makeQR() {
  const text =
    document.getElementById(
      "qrText"
    )?.value.trim();

  if (!text) {
    alert("Enter text or URL.");
    return;
  }

  const qr =
    document.createElement("img");

  qr.src =
    "https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=" +
    encodeURIComponent(text);

  qr.style.maxWidth = "300px";

  preview.innerHTML = "";

  preview.appendChild(qr);
}

function makeBase64() {
  const text =
    document.getElementById(
      "base64Text"
    )?.value || "";

  const result =
    btoa(
      unescape(
        encodeURIComponent(text)
      )
    );

  preview.innerHTML = `
    <textarea
      rows="8"
      style="width:100%"
    >${esc(result)}</textarea>
  `;
}

function showMetadata() {
  if (!img) {
    alert("Please select an image first.");
    return;
  }

  preview.innerHTML = `
    <b>Image Information</b><br><br>
    Width: ${img.naturalWidth}px<br>
    Height: ${img.naturalHeight}px<br>
    Type: ${file ? file.type : "Unknown"}<br>
    File size: ${
      file
        ? (file.size / 1024).toFixed(2)
        : "0"
    } KB
  `;
}

function imageToPDF() {
  if (!img) {
    alert("Please select an image first.");
    return;
  }

  alert(
    "Image selected successfully. PDF engine can be connected later."
  );
}

function pdfMessage() {
  alert(
    "PDF processing requires a PDF library. The tool is ready for integration."
  );
}

function runTool() {
  if (!mode) return;

  try {

    if (mode === "color") {
      const color =
        document.getElementById(
          "colorPicker"
        )?.value || "#000000";

      if (
        navigator.clipboard
      ) {
        navigator.clipboard.writeText(
          color
        );
      }

      preview.textContent =
        "Copied: " + color;

      return;
    }

    if (mode === "base64") {
      makeBase64();
      return;
    }

    if (mode === "qr") {
      makeQR();
      return;
    }

    if (mode === "word") {
      const text =
        document.getElementById(
          "formatText"
        )?.value || "";

      const blob =
        new Blob(
          [text],
          {
            type:
              "text/plain"
          }
        );

      downloadBlob(
        blob,
