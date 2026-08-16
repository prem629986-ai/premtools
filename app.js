const tools=[
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
let mode=null,file=null;
const grid=document.getElementById("grid");
function draw(list=tools){grid.innerHTML=list.map(t=>`<article class="card" data-name="${t[3].toLowerCase()} ${t[4].toLowerCase()}" data-cat="${t[1]}"><div class="ico">${t[2]}</div><h3>${t[3]}</h3><p>${t[4]}</p><button onclick="openTool('${t[0]}')">Open Tool →</button></article>`).join("")}
draw();
function filterTools(){let q=search.value.toLowerCase();draw(tools.filter(t=>(t[3]+" "+t[4]).toLowerCase().includes(q)))}
function cat(c,b){document.querySelectorAll(".categories button").forEach(x=>x.classList.remove("active"));b.classList.add("active");draw(c==="all"?tools:tools.filter(t=>t[1]===c))}
function openTool(m){mode=m;let t=tools.find(x=>x[0]===m);mtitle.textContent=t[3];mdesc.textContent=t[4];controls.innerHTML="";file=null;preview.innerHTML="Select a file to begin";document.getElementById("file").value="";run.disabled=true;
if(["resize","signature"].includes(m))controls.innerHTML='<div class="ctrl">Width <input id="w" type="number" placeholder="px"> Height <input id="h" type="number" placeholder="px"></div>';
if(m==="compress")controls.innerHTML='<div class="ctrl">Quality <input id="quality" type="range" min="10" max="100" value="75"><span id="qv">75%</span></div>';
if(m==="convert")controls.innerHTML='<div class="ctrl">Format <select id="fmt"><option value="image/jpeg">JPG</option><option value="image/png">PNG</option><option value="image/webp">WEBP</option></select></div>';
modal.classList.remove("hidden")}
function closeTool(){modal.classList.add("hidden")}
function pickFile(e){file=e.target.files[0];if(!file)return;if(file.type.startsWith("image/")){let r=new FileReader();r.onload=x=>{preview.innerHTML=`<img src="${x.target.result}" alt="preview">`;let im=new Image();im.onload=()=>{window.img=im;if(w){w.value=im.width;h.value=im.height}};im.src=x.target.result};r.readAsDataURL(file)}else preview.textContent=file.name;run.disabled=false}
function canvas(){let c=document.createElement("canvas"),ww=img.width,hh=img.height;if(w)ww=parseInt(w.value)||ww;if(h)hh=parseInt(h.value)||hh;c.width=ww;c.height=hh;c.getContext("2d").drawImage(img,0,0,ww,hh);return c}
function runTool(){if(!file)return;if(mode==="ocr"){alert("OCR engine can be connected during deployment.");return}if(["pdf","pdfcompress","mergepdf"].includes(mode)){alert("PDF engine can be connected during deployment. Your selected file is ready for processing.");return}if(!window.img){alert("Please choose an image.");return}let c=canvas(),type=document.getElementById("fmt")?.value||"image/jpeg",q=(parseInt(document.getElementById("quality")?.value||90))/100;c.toBlob(b=>{let a=document.createElement("a");a.href=URL.createObjectURL(b);a.download="premtools-"+mode+"."+({"image/png":"png","image/webp":"webp","image/jpeg":"jpg"}[type]||"jpg");a.click()},type,q)}
document.addEventListener("input",e=>{if(e.target.id==="quality")qv.textContent=e.target.value+"%"})
