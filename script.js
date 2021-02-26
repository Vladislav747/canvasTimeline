const configCanvas = {
	canvasFont: "10px Arial",
	//Масштаб
	canvasDpr: 1,
	canvasStrokeStyle: "grey",
	canvasFillStyle: "#fff",
	canvasTexAlign: "center",
	canwasWidthCell: 2,
  //Должно соотвествовать ширине style у canvas
	width: 850,
	height: 50,
	x: 0,
	y: 20,
	//Скорость перемещения
	speed: 1,
	//Количество меток - если обновляешь количество меток то обнови offset минут 
	numberOfMarks: 60 * 8,
  minuteOffset: 8,
};

let offset = 0
var isMouseDown = false;
var lastX = 0 
var _element
var isDown = false
var offsetX
var canvasOffsetOnPage

const _canvas = document.getElementById("canvas");
const _timelinePointer = document.getElementById("vc-timeline__slider-pointer");
const _currentPointer = document.getElementById("current-pointer");

const ctx = setupCanvas(canvas);



/**
 * Начальная установка canvas
 * @param canvas
 */
function setupCanvas(canvas) {
	//Для масштаба таймлайна
	// dpr {number}
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

/**
 * Нарисовать таймлайн линию
 * @param {*} ctx 
 */
function drawHorizontalLine(ctx){
    ctx.beginPath();
    ctx.moveTo(0, 0 + configCanvas.y); 
    ctx.lineTo(canvas.width - 240, 0 + configCanvas.y);
    ctx.stroke()
    ctx.closePath();
}

/**
 * Нарисовать метки
 */
function drawTicks() {

    const context = _canvas.getContext("2d")

    /*
    Отрезок времени для таймлайна
    Текущее время минус 12 минут
*/
const currentTime = new Date();
const timeStart = new Date(
    new Date().setMinutes(currentTime.getMinutes() - configCanvas.minuteOffset)
);

    context.clearRect(0, 0, canvas.width, canvas.height)
    context.translate(0, 0)
    context.lineWidth = 1
    //drawHorizontalLine(context);
    context.beginPath()
    
    let position = 0
    for (let i = offset; i < configCanvas.numberOfMarks + 1 + offset; i++) {
    context.moveTo(position+0.5, 0 + configCanvas.y )
    if (i % 60 === 0) {
        let timeMarker = timeStart.valueOf() + i * 1000;
        let timeMarkerHours = new Date(timeMarker).getHours();
        let timeMarkerMinutes = new Date(timeMarker).getMinutes();
        timeMarkerMinutes = timeMarkerMinutes < 10 ? `0${timeMarkerMinutes}` : timeMarkerMinutes;
        
        context.lineTo(position, 20 + configCanvas.y);
        
        
        context.fillText (`${timeMarkerHours}:${timeMarkerMinutes}`, position, 20 + 15 + configCanvas.y, 20)
    } else if (i % 10 === 0) {
        
        context.lineTo(position, 10 + configCanvas.y)
    } 
        
    
    position = position + configCanvas.canwasWidthCell;

    context.stroke()
    context.translate(0, 0)
    }
    
    context.moveTo(offsetX+0.5, 0 + configCanvas.y)
    context.lineTo(offsetX+0.5, 25 + configCanvas.y)
    context.stroke();
    context.translate(0, 0)
}

  setInterval(() => {
    if (offset == 60) {
      offset = 0
    } else {
      offset++;
    }
    
    drawTicks();
    showCurrentTime();
  }, 400)


  function showCurrentTime(){
    var currentdate = new Date(); 
    var datetime = "Last Sync: " + currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();

    const timeDiv = document.getElementById("current-time");
    timeDiv.innerText = datetime;

  }


  _timelinePointer.addEventListener("mousemove", function(e){
    _timelinePointer.classList.add("hovered")
  });

  _timelinePointer.addEventListener("mouseleave", function(e){
    _timelinePointer.classList.remove("hovered")
  })

  // _timelinePointer.onmousedown = function(e){
  //   console.log(e.clientX);
  //   // 1 % =  850 / 71% = 11,97
   
  // }


  const slideEl = document.querySelector(".vc-timeline__slider-time");
  _timelinePointer.onmouseup = function(e){
    debugger;
    const pxToProcent = 850 / 71;
    
    const leftOffset = 7.3 + ((e.clientX - 110) / pxToProcent);
    
    _timelinePointer.style.left = `${leftOffset}%`;
  }

  _canvas.onmouseover = function(e){
    _currentPointer.style.opacity = 1;
  }

  _canvas.onmousemove = function(e){
    _currentPointer.style.opacity = 1;
    const pxToProcent = 850 / 71;
    
    const leftOffset = e.clientX;
    slideEl.style.left =  `${leftOffset - 50}px`;
    _currentPointer.style.left = `${leftOffset - 50}px`;
  }

  _canvas.onmouseout = function(e){
    _currentPointer.style.opacity = 0;
  }
 
