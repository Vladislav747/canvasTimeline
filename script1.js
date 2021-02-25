const configCanvas = {
	canvasFont: "10px Arial",
	//Масштаб
	canvasDpr: 1,
	canvasStrokeStyle: "grey",
	canvasFillStyle: "#fff",
	canvasTexAlign: "center",
	canwasWidthCell: 15,
	width: 1280,
	height: 120,
	x: 0,
	y: 60,
	//Скорость перемещения
	speed: 1,
	//Количество меток
	numberOfMarks: 6 * 12,
};

let offset = 0
var isMouseDown = false;
var lastX = 0 
var _element
var isDown = false
var offsetX
var canvasOffsetOnPage
const risksNumForDraw = 60 * 5;
const _canvas = document.getElementById("canvas");
const ctx = setupCanvas(canvas);



/**
 * Начальная установка canvas
 * @param canvas
 */
function setupCanvas(canvas) {
	//Для масштаба таймлайна
	// dpr {number}
	//ТУт спецом поменял
	var dpr = configCanvas.canvasDpr || window.devicePixelRatio;
	var rect = canvas.getBoundingClientRect();
	canvas.width = Math.floor(rect.width * dpr);
	canvas.height = Math.floor(rect.height * dpr);

	var ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.scale(dpr, dpr);
	ctx.strokeStyle = configCanvas.canvasStrokeStyle;
	ctx.font = configCanvas.canvasFont;
	ctx.fillStyle = configCanvas.canvasFillStyle;
	ctx.textAlign = configCanvas.canvasTexAlign;
	ctx.lineWidth = 1;
	return ctx;
}


function handleMouseDown(e) {

  // if we're not dragging, just exit
  /*if (!isDown) {
      return;
  }*/
  isDown = true

  // tell the browser we'll handle this event
  e.preventDefault();
  e.stopPropagation();

  // get the current mouse position
  offsetX = parseInt(e.clientX - canvasOffsetOnPage);
  drawTicks()

}

function handleMouseUp(e) {
  // tell the browser we'll handle this event
  e.preventDefault();
  e.stopPropagation();

  // stop the drag
  isDown = false;
}

function handleMouseMove(e) {

  // if we're not dragging, just exit
  if (!isDown) {
      return;
  }

  // tell the browser we'll handle this event
  e.preventDefault();
  e.stopPropagation();

  // get the current mouse position
  offset = parseInt(e.clientX - canvasOffsetOnPage)

  drawTicks()
}

  function drawTicks() {

      const context = _canvas.getContext("2d")

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      context.translate(0, 0)
      context.lineWidth = 1
      context.beginPath()
      
      let position = 0
      for (let i = offset; i < risksNumForDraw + 1 + offset; i++) {
        console.log(i, "i")
        context.moveTo(position+0.5, 0)
        if (i % 60 === 0) {
          context.lineTo(position, 15)
          context.fillText ("10:00", position, 15 + 15, 20)
        } else if (i % 10 === 0) {
          context.lineTo(position, 10)
          context.fillText ("10", position, 15 + 10, 20)
        } 
        
        position = position + 3

        //context.strokeStyle = TICK_COLOR
        context.stroke()
        context.translate(0, 0)
      }
      context.moveTo(offsetX+0.5, 0)
      context.lineTo(offsetX+0.5, 25)
      context.stroke()
      context.translate(0, 0)
  }

  setInterval(() => {
    if (offset == 60) {
      offset = 0
    } else {
      offset = offset + 1
    }
    
    drawTicks()
  }, 1000)