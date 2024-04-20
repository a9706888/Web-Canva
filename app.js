const canvas = document.getElementById("cvs");
const ctx = canvas.getContext("2d");

const canvas2 = document.getElementById("cvs2");
const ctx2 = canvas2.getContext("2d");

const tempCanvas = document.createElement('canvas');
const tempCtx = tempCanvas.getContext('2d');
tempCanvas.width = canvas2.width;
tempCanvas.height = canvas2.height;
tempCanvas.style.display = 'none';

canvas.setAttribute("id", "pencilIcon");
canvas2.setAttribute("id", "pencilIcon");

let x1 = 0
let y1 = 0
let x2 = 0
let y2 = 0

//是否在畫布上動作
let isDrawing = false

let isPen = true
let isEraser = false
let isRectangle = false;
let isTriangle=false;
let isCircle=false;
let isFill=false;
let drawingHistory = [];
let historyIndex = -1;
let isTyping = false;
let isSticker = false;
let currentText = "";
let brushSize = 5;
let eraserSize = 5;

function getCanvasMousePosition(e) {
    const rect = canvas2.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

function pen() {
    isPen = true;
    isEraser = false;
    isRectangle = false;
    isTriangle=false;
    isCircle=false;
    isTyping = false;
    isSticker = false;

    canvas.setAttribute("id", "pencilIcon");
    canvas2.setAttribute("id", "pencilIcon");   
}

function eraser() {
    isPen = false;
    isEraser = true;
    isRectangle = false;
    isTriangle=false;
    isCircle=false;
    isTyping = false;
    isSticker = false;

    canvas.setAttribute("id", "eraserIcon");
    canvas2.setAttribute("id", "eraserIcon");
}

function rectangle() {
    isPen = false;
    isEraser = false;
    isRectangle = true;
    isTriangle=false;
    isCircle=false;
    isTyping = false;
    isSticker = false;
    
    canvas.setAttribute("id", "rectangleIcon");
    canvas2.setAttribute("id", "rectangleIcon");
}

function triangle() {
    isPen = false;
    isEraser = false;
    isRectangle = false;
    isTriangle=true;
    isCircle=false;
    isSticker = false;
    
    canvas.setAttribute("id", "triangleIcon");
    canvas2.setAttribute("id", "triangleIcon");
}

function circle() {
    isPen = false;
    isEraser = false;
    isRectangle = false;
    isTriangle=false;
    isCircle=true;
    isTyping = false;
    isSticker = false;
    
    canvas.setAttribute("id", "circleIcon");
    canvas2.setAttribute("id", "circleIcon");
}

function sticker() {
    isPen = false;
    isEraser = false;
    isRectangle = false;
    isTriangle=false;
    isCircle=false;
    isTyping = false;
    isSticker = true;
    
    canvas.setAttribute("id", "stickerIcon");
    canvas2.setAttribute("id", "stickerIcon");

}

const stickerBtn = document.getElementById("stickerBtn");
stickerBtn.addEventListener("click", sticker);

//reset
const resetBtn = document.getElementById("resetBtn");
resetBtn.addEventListener("click", function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawingHistory = [];
    historyIndex = -1;
    isTyping = false;
    isPen = true;
})

//undo redo ---------------------------------------
document.getElementById("undoBtn").addEventListener("click", function () {
    if (historyIndex >= 0) {
        historyIndex--;
        redraw();
    }
});

document.getElementById("redoBtn").addEventListener("click", function () {
    if (historyIndex < drawingHistory.length - 1) {
        historyIndex++;
        redraw();
    }
});

function saveDraw() {
    const drawState = ctx.getImageData(0, 0, canvas.width, canvas.height);
    drawingHistory.push(drawState);
    historyIndex = drawingHistory.length - 1;
}

function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);;
    if (historyIndex >= 0) {
        ctx.putImageData(drawingHistory[historyIndex], 0, 0);
    }
}
//-------------------------------------------------------------

canvas.addEventListener("mousedown", function (e) {
    isDrawing = true;
    const pos = getCanvasMousePosition(e);
    x1 = pos.x;
    y1 = pos.y;
    drawingHistory.length = historyIndex + 1;
    historyIndex++;
})

canvas.addEventListener("mousemove", function (e) {
    if (isDrawing) {
        const pos = getCanvasMousePosition(e);
        if (isPen || isEraser) {
            x2 = pos.x;
            y2 = pos.y;
            draw();
            x1 = x2;
            y1 = y2;
        }
        else if (isRectangle && isFill===false) {
            ctx2.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
            ctx2.beginPath();
            ctx2.rect(x1, y1, pos.x - x1, pos.y - y1);
            ctx2.stroke();

            tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
            tempCtx.beginPath();
            tempCtx.rect(x1, y1, pos.x - x1, pos.y - y1);
            tempCtx.stroke();
        }
        else if (isTriangle && isFill===false) {
            ctx2.clearRect(0, 0, canvas.width, canvas.height);
            ctx2.beginPath();
            ctx2.moveTo(x1, y1);
            ctx2.lineTo(pos.x, pos.y);
            ctx2.lineTo(x1 - (pos.x - x1), pos.y);
            ctx2.closePath();
            ctx2.stroke();

            tempCtx.clearRect(0, 0, canvas.width, canvas.height);
            tempCtx.beginPath();
            tempCtx.moveTo(x1, y1);
            tempCtx.lineTo(pos.x, pos.y);
            tempCtx.lineTo(x1 - (pos.x - x1), pos.y);
            tempCtx.closePath();
            tempCtx.stroke();
        }
        else if (isCircle && isFill===false) {
            ctx2.clearRect(0, 0, canvas.width, canvas.height);
            ctx2.beginPath();
            ctx2.ellipse((x1 + pos.x) / 2, (y1 + pos.y) / 2, Math.abs(pos.x - x1) / 2, Math.abs(pos.y - y1) / 2, 0, 0, 2 * Math.PI);
            ctx2.stroke();

            tempCtx.clearRect(0, 0, canvas.width, canvas.height);
            tempCtx.beginPath();
            tempCtx.ellipse((x1 + pos.x) / 2, (y1 + pos.y) / 2, Math.abs(pos.x - x1) / 2, Math.abs(pos.y - y1) / 2, 0, 0, 2 * Math.PI);
            tempCtx.stroke();
        }
        else if (isRectangle && isFill===true) {
            ctx2.clearRect(0, 0, canvas.width, canvas.height);
            ctx2.fillRect(x1, y1, pos.x - x1, pos.y - y1);

            tempCtx.clearRect(0, 0, canvas.width, canvas.height);
            tempCtx.fillRect(x1, y1, pos.x - x1, pos.y - y1);
        }
        else if (isTriangle && isFill===true) {
            ctx2.clearRect(0, 0, canvas.width, canvas.height);
            ctx2.beginPath();
            ctx2.moveTo(x1, y1);
            ctx2.lineTo(pos.x, pos.y);
            ctx2.lineTo(x1 - (pos.x - x1), pos.y);
            ctx2.closePath();
            ctx2.stroke();
            ctx2.fill();

            tempCtx.clearRect(0, 0, canvas.width, canvas.height);
            tempCtx.beginPath();
            tempCtx.moveTo(x1, y1);
            tempCtx.lineTo(pos.x, pos.y);
            tempCtx.lineTo(x1 - (pos.x - x1), pos.y);
            tempCtx.closePath();
            tempCtx.stroke();
            tempCtx.fill();
        }
        else if (isCircle && isFill===true) {
            ctx2.clearRect(0, 0, canvas.width, canvas.height);
            ctx2.beginPath();
            ctx2.ellipse((x1 + pos.x) / 2, (y1 + pos.y) / 2, Math.abs(pos.x - x1) / 2, Math.abs(pos.y - y1) / 2, 0, 0, 2 * Math.PI);
            ctx2.stroke();
            ctx2.fill();

            tempCtx.clearRect(0, 0, canvas.width, canvas.height);
            tempCtx.beginPath();
            tempCtx.ellipse((x1 + pos.x) / 2, (y1 + pos.y) / 2, Math.abs(pos.x - x1) / 2, Math.abs(pos.y - y1) / 2, 0, 0, 2 * Math.PI);
            tempCtx.stroke();
            tempCtx.fill();
        }
    }
    if (isSticker) {
        x2 = e.offsetX;
        y2 = e.offsetY;
    }

})

canvas.addEventListener("mouseup", function (e) {
    isDrawing = false;
    if (isRectangle||isCircle||isTriangle) {
        const pos = getCanvasMousePosition(e);
        if (x1 !== null && y1 !== null) {
            ctx.drawImage(tempCanvas, 0, 0);
            tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
            ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
            saveDraw();
        }
    }
    else if (isSticker) {
        const stickerSize = 50;
        const newStickerImg = new Image();
        newStickerImg.crossOrigin = '';
        newStickerImg.src = "https://i.ibb.co/RTjcvhw/love.png";
        newStickerImg.onload = function () {
            ctx.drawImage(newStickerImg, e.offsetX - stickerSize / 2, e.offsetY - stickerSize / 2, stickerSize, stickerSize);
            saveDraw();
        };
    }
    else if (isPen || isEraser) {
        isDrawing = false;
        saveDraw();
    }
})

function draw() {
    if (isPen) {
        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

    }
    else if (isEraser) {
        ctx.lineWidth = eraserSize;
        ctx.clearRect(x2 - eraserSize / 2, y2 - eraserSize / 2, eraserSize, eraserSize);
    }
}

document.getElementById("textBtn").addEventListener("click", function (e) {
    if (!isTyping) {
        canvas.setAttribute("id", "textIcon");
        canvas2.setAttribute("id", "textIcon");
        isTyping = true;
        isPen = false;
        isEraser = false;
        isSticker = false;
        isCircle=false;
        isRectangle=false;
        isTriangle=false;
        
    }
});

canvas.addEventListener("click", function (e) {
    if (isTyping) {
        const x = e.offsetX;
        const y = e.offsetY;
        createTextInput(x, y);
    }
});

function createTextInput(x, y) {
    console.log("Creating text input at:", x, y);
    
    const textBox = document.createElement('input');
    textBox.type = 'text';
    textBox.style.position = 'absolute';
    textBox.style.left = x + 'px'; 
    textBox.style.top = y + 'px'; 
    canvas.parentNode.appendChild(textBox); 

    textBox.addEventListener('blur', function() {
        const text = textBox.value;
        canvas.parentNode.removeChild(textBox);
    });

    // 添加事件监听器，以便在按下 Enter 键时处理文本
    textBox.addEventListener('keydown', function(event) {
        // 当按下 Enter 键时
        if (event.key === 'Enter') {
            // 获取输入的文本
            const text = textBox.value;
            // 绘制文本到画布上
            drawText(parseInt(textBox.style.left), parseInt(textBox.style.top), text);
            // 移除输入框
            canvas.parentNode.removeChild(textBox);
        }
    });

    // 设置焦点到文本框中
    textBox.focus();
    console.log("Text input created.");
}

function drawText(x, y, text) {
    if (text) {
        ctx.fillStyle = "#000000";
        ctx.fillText(text, x, y);
        saveDraw();
        //isTyping = false; 
    }
}

// 字體選擇器
const fontSelect = document.getElementById("fontSelect");
fontSelect.addEventListener("change", function () {
    updateFont();
});

// 字型大小選擇器
const fontSizeInput = document.getElementById("fontSizeInput");
fontSizeInput.addEventListener("input", function () {
    updateFont();
});

function updateFont() {
    const selectedFont = fontSelect.value;
    const selectedFontSize = fontSizeInput.value;
    ctx.font = selectedFontSize + "px " + selectedFont;
}

function loadfile(input) {
    var file = input.files[0];
    var src = URL.createObjectURL(file);
    var img = new Image();
    img.src = src;
    img.onload = function () {
        ctx.drawImage(this, 0, 0)
    }
}

function upload() {
    // 儲存當前畫布狀態
    saveDraw();

    // 創建下載鏈接
    const link = document.getElementById("download");
    link.download = "image.png";
    link.href = canvas.toDataURL("image/png");

    // 點擊下載鏈接
    link.click();
}

// 監聽筆刷粗細範圍的變化
const brushSizeInput = document.getElementById("brushSizeInput");
brushSizeInput.addEventListener("input", function () {
    brushSize = brushSizeInput.value;
});

// 監聽橡皮擦粗細範圍的變化
const eraserSizeInput = document.getElementById("eraserSizeInput");
eraserSizeInput.addEventListener("input", function () {
    eraserSize = parseInt(eraserSizeInput.value);
});

// 监听矩形绘制按钮点击事件
const rectangleBtn = document.getElementById("rectangleBtn");
rectangleBtn.addEventListener("click", function () {
    rectangle();
});

const triangleBtn = document.getElementById("triangleBtn");
triangleBtn.addEventListener("click", function () {
    triangle();
});

const circleBtn = document.getElementById("circleBtn");
circleBtn.addEventListener("click", function () {
    circle();
});

const fillRect = document.getElementById("fillRect");
fillRect.addEventListener("click", function () {
    if(isFill){
        isFill=false;
        const circleButton = document.getElementById("circleBtn");
        const triangleButton = document.getElementById("triangleBtn");
        const rectangleButton = document.getElementById("rectangleBtn");
        const imgElement1 = circleButton.querySelector("img");
        const imgElement2 = triangleButton.querySelector("img");
        const imgElement3 = rectangleButton.querySelector("img");
        imgElement1.src = "icon\\circle.png";
        imgElement2.src = "icon\\triangle.png";
        imgElement3.src = "icon\\square.png";
    } 
    else{
        isFill=true;
        const circleButton = document.getElementById("circleBtn");
        const triangleButton = document.getElementById("triangleBtn");
        const rectangleButton = document.getElementById("rectangleBtn");
        const imgElement1 = circleButton.querySelector("img");
        const imgElement2 = triangleButton.querySelector("img");
        const imgElement3 = rectangleButton.querySelector("img");
        imgElement1.src = "icon\\circlefill.png";
        imgElement2.src = "icon\\trianglefill.png";
        imgElement3.src = "icon\\squarefill.png";
    } 
});

//color selector------------------------------------------------
var colorBlock = document.getElementById('color-block');
var ctx1 = colorBlock.getContext('2d');
var width1 = colorBlock.width;
var height1 = colorBlock.height;

var colorStrip = document.getElementById('color-strip');
var ctx_2 = colorStrip.getContext('2d');
var width2 = colorStrip.width;
var height2 = colorStrip.height;

var colorLabel = document.getElementById('color-label');

var x = 0;
var y = 0;
var drag = false;
var rgbaColor = 'rgba(255,0,0,1)';

ctx1.rect(0, 0, width1, height1);
fillGradient();

ctx_2.rect(0, 0, width2, height2);
var grd1 = ctx_2.createLinearGradient(0, 0, 0, height1);
grd1.addColorStop(0, 'rgba(255, 0, 0, 1)');
grd1.addColorStop(0.17, 'rgba(255, 255, 0, 1)');
grd1.addColorStop(0.34, 'rgba(0, 255, 0, 1)');
grd1.addColorStop(0.51, 'rgba(0, 255, 255, 1)');
grd1.addColorStop(0.68, 'rgba(0, 0, 255, 1)');
grd1.addColorStop(0.85, 'rgba(255, 0, 255, 1)');
grd1.addColorStop(1, 'rgba(255, 0, 0, 1)');
ctx_2.fillStyle = grd1;
ctx_2.fill();

function click(e) {
  x = e.offsetX;
  y = e.offsetY;
  var imageData = ctx_2.getImageData(x, y, 1, 1).data;
  rgbaColor = 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';
  fillGradient();
}

function fillGradient() {
  ctx1.fillStyle = rgbaColor;
  ctx1.fillRect(0, 0, width1, height1);

  var grdWhite = ctx_2.createLinearGradient(0, 0, width1, 0);
  grdWhite.addColorStop(0, 'rgba(255,255,255,1)');
  grdWhite.addColorStop(1, 'rgba(255,255,255,0)');
  ctx1.fillStyle = grdWhite;
  ctx1.fillRect(0, 0, width1, height1);

  var grdBlack = ctx_2.createLinearGradient(0, 0, 0, height1);
  grdBlack.addColorStop(0, 'rgba(0,0,0,0)');
  grdBlack.addColorStop(1, 'rgba(0,0,0,1)');
  ctx1.fillStyle = grdBlack;
  ctx1.fillRect(0, 0, width1, height1);
}

function mousedown(e) {
  drag = true;
  changeColor(e);
}

function mousemove(e) {
  if (drag) {
    changeColor(e);
  }
}

function mouseup(e) {
  drag = false;
}

function changeColor(e) {
  x = e.offsetX;
  y = e.offsetY;
  var imageData = ctx1.getImageData(x, y, 1, 1).data;
  rgbaColor = 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';
  colorLabel.style.backgroundColor = rgbaColor;
  ctx.strokeStyle = rgbaColor;
  ctx.fillStyle = rgbaColor;
}

colorStrip.addEventListener("click", click, false);

colorBlock.addEventListener("mousedown", mousedown, false);
colorBlock.addEventListener("mouseup", mouseup, false);
colorBlock.addEventListener("mousemove", mousemove, false);
//--------------------------------------------------------------------
