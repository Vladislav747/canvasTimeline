/**
 * Значения из компонента Timeline
 */

//  min={start}
//  max={end}
//  ValueLabelComponent={ValueLabelComponent}
//  valueLabelFormat={(value: number) =>
//    formatTimestampForHuman(value * 1000)
//  }
//  marks={generateMarks(start, end)}
//  value={current}
//  onChangeCommitted={changeCommitted}
//  valueLabelDisplay="on"
//  getAriaValueText={showValueText}

const CONFIG_CANVAS = {
  CANVAS_FONT: "10px Arial",
  //Масштаб
  DPR: 1,
  CANVAS_STROKE_STYLE: "grey",
  CANVAS_FILL_STYLE: "#fff",
  CANVAS_TEXT_ALIGN: "center",
  CANVAS_CELL_WIDTH: 2,
  WIDTH: 850,
  HEIGHT: 100,
  //НАЧАЛЬНЫЕ КООРДИНЫ РАЗМЕЩЕНИЯ X, Y
  x: 0,
  y: 20,
  //Скорость перемещения
  SPEED: 1,
  //Количество меток - если обновляешь количество меток то обнови offset минут 
  NUMBER_OF_MARKS: 60 * 8,
  MINUTE_OFFSET: 8,
  IS_ADD_MINUTE: false,
};
let offset = 0;
var isMouseDown = false;
var lastX = 0;
var _element;
var isDown = false;
var offsetX;
var canvasOffsetOnPage;

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
  var dpr = CONFIG_CANVAS.DPR || window.devicePixelRatio;
  canvas.width = Math.floor(CONFIG_CANVAS.WIDTH * dpr);
  canvas.height = Math.floor(CONFIG_CANVAS.HEIGHT * dpr);

  var ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.scale(dpr, dpr);
  ctx.strokeStyle = CONFIG_CANVAS.CANVAS_STROKE_STYLE;
  ctx.font = CONFIG_CANVAS.CANVAS_FONT;
  ctx.fillStyle = CONFIG_CANVAS.CANVAS_FILL_STYLE;
  ctx.textAlign = CONFIG_CANVAS.CANVAS_TEXT_ALIGN;
  ctx.lineWidth = 1;
  return ctx;
}


function handleMouseDown(e) {

  // if we're not dragging, just exit
  /*if (!isDown) {
      return;
  }*/
  isDown = true;

  // tell the browser we'll handle this event
  e.preventDefault();
  e.stopPropagation();

  // get the current mouse position
  offsetX = parseInt(e.clientX - canvasOffsetOnPage);
  drawTicks();

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
  offset = parseInt(e.clientX - canvasOffsetOnPage);

  drawTicks();
}

/**
 * Нарисовать таймлайн линию
 * @param {*} ctx 
 */
function drawHorizontalLine(ctx) {
  ctx.beginPath();
  ctx.moveTo(0, 0 + CONFIG_CANVAS.y);
  ctx.lineTo(canvas.width - 240, 0 + CONFIG_CANVAS.y);
  ctx.stroke();
  ctx.closePath();
}

/**
 * Нарисовать метки
 */
function drawTicks() {

  const context = _canvas.getContext("2d");

  /*
  Отрезок времени для таймлайна
  */
  const currentTime = new Date();
  // const timeStart = new Date(
  //   new Date().setMinutes(currentTime.getMinutes() - CONFIG_CANVAS.MINUTE_OFFSET)
  // );

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.translate(0, 0);
  context.lineWidth = 1;
  //drawHorizontalLine(context);
  context.beginPath();

  let timeStart = new Date();

  console.log(timeStart.valueOf(), "curr");

  if (CONFIG_CANVAS.IS_ADD_MINUTE) {
    timeStart = timeStart.setMinutes(timeStart.getMinutes() + 1);
  }
  console.log(timeStart.valueOf(), "+ 1 min");
  console.log(CONFIG_CANVAS.IS_ADD_MINUTE);

  let position = 0;
  const arr1 = generateMarks(timeStart.valueOf(), CONFIG_CANVAS.NUMBER_OF_MARKS);
  for (let i = offset; i < arr1.length + offset; i++) {
    context.moveTo(position + 0.5, 0 + CONFIG_CANVAS.y);
    if (arr1[i]?.draw && arr1[i]?.text) {
      context.lineTo(position, 20 + CONFIG_CANVAS.y);
      context.fillText(arr1[i].text, position, 20 + 15 + CONFIG_CANVAS.y, 20);
    } else if (arr1[i]?.draw) {
      context.lineTo(position, 10 + CONFIG_CANVAS.y);
    }


    position = position + CONFIG_CANVAS.CANVAS_CELL_WIDTH;

    context.stroke();
    context.translate(0, 0);
  }

  context.moveTo(offsetX + 0.5, 0 + CONFIG_CANVAS.y);
  context.lineTo(offsetX + 0.5, 25 + CONFIG_CANVAS.y);
  context.stroke();
  context.translate(0, 0);
}

setInterval(() => {
  if (offset == 60) {
    offset = 0;
    CONFIG_CANVAS.IS_ADD_MINUTE = true;
    console.log(CONFIG_CANVAS.IS_ADD_MINUTE, "interval");
  } else {
    offset++;
  }
  console.log(offset);

  drawTicks();
  showCurrentTime();
}, 400);


function showCurrentTime() {
  var currentdate = new Date();
  var datetime = "Last Sync: " + currentdate.getDate() + "/"
    + (currentdate.getMonth() + 1) + "/"
    + currentdate.getFullYear() + " @ "
    + currentdate.getHours() + ":"
    + currentdate.getMinutes() + ":"
    + currentdate.getSeconds();

  const timeDiv = document.getElementById("current-time");
  timeDiv.innerText = datetime;

}


_timelinePointer.addEventListener("mousemove", function (e) {
  _timelinePointer.classList.add("hovered");
});

_timelinePointer.addEventListener("mouseleave", function (e) {
  _timelinePointer.classList.remove("hovered");
});

// _timelinePointer.onmousedown = function(e){
//   console.log(e.clientX);
//   // 1 % =  850 / 71% = 11,97

// }


const slideEl = document.querySelector(".vc-timeline__slider-time");
_timelinePointer.onmouseup = function (e) {

  const pxToProcent = 850 / 71;

  const leftOffset = 7.3 + ((e.clientX - 110) / pxToProcent);

  _timelinePointer.style.left = `${leftOffset}%`;
};

_canvas.onmouseover = function (e) {
  _currentPointer.style.opacity = 1;
};

_canvas.onmousemove = function (e) {
  _currentPointer.style.opacity = 1;
  const pxToProcent = 850 / 71;

  const leftOffset = e.clientX;
  slideEl.style.left = `${leftOffset - 50}px`;
  _currentPointer.style.left = `${leftOffset - 50}px`;
};

_canvas.onmouseout = function (e) {
  _currentPointer.style.opacity = 0;
};

function generateMarks(currentTimestamp, numberOfMarks) {

  let arr = [];
  let startTimestamp = currentTimestamp - 1000 * 60 * CONFIG_CANVAS.MINUTE_OFFSET;
  for (i = 0; i <= numberOfMarks; i++) {
    if (i % 60 == 0) {
      let timeMarker = startTimestamp.valueOf() + i * 1000;
      let timeMarkerHours = new Date(timeMarker).getHours();
      let timeMarkerMinutes = new Date(timeMarker).getMinutes();
      timeMarkerMinutes = timeMarkerMinutes < 10 ? `0${timeMarkerMinutes}` : timeMarkerMinutes;
      let timeMarkerText = `${timeMarkerHours}:${timeMarkerMinutes}`;
      arr.push({ i: i, text: timeMarkerText, draw: true });
    } else if (i % 10 == 0) {
      arr.push({ i: i, draw: true });
    } else {
      arr.push({ i: i });
    }

  }
  return arr;

}

