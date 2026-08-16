const tools = [
  ["compress","image","📉","Image Compressor","Reduce JPG, PNG and WEBP file size."],
  ["resize","image","📐","Image Resizer","Resize images by pixels or percentage."],
  ["convert","image","🔄","Image Converter","Convert JPG, PNG and WEBP."],
  ["crop","image","✂️","Image Cropper","Crop an image quickly."],
  ["passport","image","🪪","Passport Photo","Prepare a passport-size portrait."],
  ["signature","image","✍️","Signature Resizer","Resize your signature image."],
  ["rotate","image","🔃","Rotate & Flip","Rotate or flip an image."],
  ["pdf","pdf","📄","Image to PDF","Make a PDF from an image."],
  ["pdfcompress","pdf","📦","PDF Compressor","Choose a PDF and prepare it for compression."],
  ["mergepdf","pdf","📚","Merge PDF","Select PDF files for merging."],
  ["ocr","document","🔤","Image OCR","Extract text from an image."],
  ["word","document","📝","Text Formatter","Quickly format plain text."],
  ["qr","utility","▦","QR Generator","Create a QR code from text or a URL."],
  ["base64","utility","🔐","Base64 Encoder","Encode text to Base64."],
  ["color","utility","🎨","Color Picker","Pick a color and copy its value."]
];

let mode = null;
let file = null;
let img = null;

const grid = document.getElementById("grid");
const modal = document.getElementById("modal");
const mtitle = document.getElementById("mtitle");
const mdesc = document.getElementById("mdesc");
const controls = document.getElementById("controls");
const preview = document.getElementById("preview");
const run = document.getElementById("run");
const fileInput = document.getElementById("file");
const searchInput = document.getElementById("search");

function draw(list = tools) {
  grid.innerHTML = list.map(t => `
    <article class="card"
      data-name="${t[3].toLowerCase()} ${t[4].toLowerCase()}"
      data-cat="${t[1]}">
      <div class="ico">${t[2]}</div>
      <h3>${t[3]}</h3>
      <p>${t[4]}</p>
      <button onclick="openTool('${t[0]}')">Open Tool →</button>
    </article>
  `).join("");
}

draw();

function filterTools() {
  const q = searchInput.value.toLowerCase().trim();

  draw(
    tools.filter(t =>
      (t[3] + " " + t[4]).toLowerCase().includes(q)
    )
  );
}

function cat(category, button) {
  document
    .querySelectorAll(".categories button")
    .forEach(x => x.classList.remove("active"));

  button.classList.add("active");

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

  const tool = tools.find(x => x[0] === m);

  mtitle.textContent = tool[3];
  mdesc.textContent = tool[4];

  controls.innerHTML = "";
  preview.innerHTML = "Select a file to begin";
  fileInput.value = "";
  run.disabled = true;

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

  if (m === "compress") {
    controls.innerHTML = `
      <div class="ctrl">
        Quality
        <input id="quality" type="range" min="10" max="100" value="75">
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
        <button type="button" onclick="rotatePreview(-90)">↶ Rotate Left</button>
        <button type="button" onclick="rotatePreview(90)">↷ Rotate Right</button>
        <button type="button" onc…
