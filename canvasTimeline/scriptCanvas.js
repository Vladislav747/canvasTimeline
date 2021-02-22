const configCanvas = {
  canvasFont: "10px Arial",
  //Масштаб
  canvasDpr: 1,
  canvasStrokeStyle: "grey",
  canvasFillStyle: "#fff",
  canvasTexAlign: "center",
  canwasWidthCell: 15,
  //Скорость перемещения
};

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

const canvas = document.getElementById("canvas");
const ctx = setupCanvas(canvas);
const CELL_WIDTH = configCanvas.canwasWidthCell;

/**
 * Класс Timeline
 */
class Timeline {
  constructor(x, y, dx, dy) {
    this.x = x;
    this.y = y;
    //для движения
    this.dx = dx;
    this.dy = dy;
  }

  setX(newX) {
    this.x = newX;
  }

  setY(newY) {
    this.y = newY;
  }

  getPosition() {
    return [this.x, this.y];
  }

  render() {
    createTimeline(this);
  }
}

/**
 * Класс Timemarker
 */
class Timemarker {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.moveX = -1;
  }

  setX(newX) {
    this.x = newX;
  }

  setY(newY) {
    this.y = newY;
  }

  setWidth(width) {
    this.width = width;
  }

  setHeight(height) {
    this.height = height;
  }

  getPosition() {
    return [this.x, this.y];
  }
}

/**
 * Класс Cell - ячейка Timeline
 */
class Cell {
  constructor(x, y, dx, dy) {
    this.x = x;
    this.y = y;
  }

  setX(newX) {
    this.x = newX;
  }

  setY(newY) {
    this.y = newY;
  }

  getPosition() {
    return [this.x, this.y];
  }

  /**
   * Создать ячейку
   */
  drawCell(timeline) {
    const [lastX, lastY] = timeline.getPosition();
    ctx.beginPath();
    ctx.moveTo(lastX, lastY + 30);
    ctx.lineTo(lastX, lastY + 20);
    ctx.lineTo(lastX + CELL_WIDTH, lastY + 20);
    timeline.setX(lastX + CELL_WIDTH);
    ctx.stroke();
  }

  /**
   * Создать большую ячейку
   */
  drawBigCell(timeMarkerHours, timeMarkerMinutes, timeline) {
    const [lastX, lastY] = timeline.getPosition();
    ctx.beginPath();
    ctx.moveTo(lastX, lastY + 40);
    ctx.lineTo(lastX, lastY + 20);
    const xPos = lastX;
    const yPosText = lastY + 55;

    ctx.fillText(`${timeMarkerHours}:${timeMarkerMinutes}`, xPos, yPosText);
    ctx.lineTo(lastX + CELL_WIDTH, lastY + 20);

    timeline.setX(lastX + CELL_WIDTH);
    ctx.stroke();
  }
}

/**
 * Создать ячейку Timeline
 */
function drawCell(timeline) {
  const [lastX, lastY] = timeline.getPosition();
  ctx.beginPath();
  ctx.moveTo(lastX, lastY + 30);
  ctx.lineTo(lastX, lastY + 20);
  ctx.lineTo(lastX + CELL_WIDTH, lastY + 20);
  timeline.setX(lastX + CELL_WIDTH);
  ctx.stroke();
}

/**
 * Создать большую ячейку
 */
function drawBigCell(timeMarkerHours, timeMarkerMinutes, timeline) {
  const [lastX, lastY] = timeline.getPosition();
  ctx.beginPath();
  ctx.moveTo(lastX, lastY + 40);
  ctx.lineTo(lastX, lastY + 20);
  const xPos = lastX;
  const yPosText = lastY + 55;

  ctx.fillText(`${timeMarkerHours}:${timeMarkerMinutes}`, xPos, yPosText);
  ctx.lineTo(lastX + CELL_WIDTH, lastY + 20);

  timeline.setX(lastX + CELL_WIDTH);
  ctx.stroke();
}

/**
 * Сгенерировать ячейки Timeline
 */
function createCells(timePiece, timeStart, timelineObj) {
  const teamPieceSeconds = timePiece / 1000;

  for (let i = 0; i < teamPieceSeconds; i += 10) {
    if (i % 60 === 0) {
      let timeMarker = timeStart.valueOf() + i * 1000;
      let timeMarkerHours = new Date(timeMarker).getHours();
      let timeMarkerMinutes = new Date(timeMarker).getMinutes();

      drawBigCell(timeMarkerHours, timeMarkerMinutes, timelineObj);
    } else if (i === teamPieceSeconds - 10) {
      createCurrentTimeMaker(timelineObj);
    } else {
      drawCell(timelineObj);
    }
  }
}

/**
 * Создать сам таймлайн
 * @param {object} timelineObj - объект таймлайна
 */
function createTimeline(timelineObj) {
  const currentTime = new Date();

  //Количество мини делений между большими отделениями

  /*
      Отрезок времени для таймлайна
      Текущее время минус 12 минут
    */
  const timeStart = new Date(
    new Date().setMinutes(currentTime.getMinutes() - 12)
  );
  const timeEnd = new Date();
  const timePiece =
    new Date() -
    new Date(currentTime.setMinutes(currentTime.getMinutes() - 12)).valueOf();
  createCells(roundTo10(timePiece), timeStart, timelineObj);
}

/**
 * Главная функция
 */
function startRender() {
  //Очистить canvas от старых данных

  ctx.clearRect(0, 60, canvas.width + 1000, canvas.height + 200);
  //Изначальные координаты по x и по y для Timeline
  const timeline = new Timeline(15, 50);
  timeline.render();

  const timeStart = new Date();

  request = requestAnimationFrame(startRender);
}

/*
 Округлять на 10
*/
function roundTo10(num) {
  return Math.round(num / 10) * 10;
}

function createCurrentTimeMaker(timeline) {
  const [lastX, lastY] = timeline.getPosition();
  console.log(lastX, lastY);
  const xPos = lastX - 20;
  const yPos = lastY;
  ctx.beginPath();

  ctx.lineTo(xPos, yPos);
  ctx.lineTo(xPos + 5, yPos + 5);
  ctx.lineTo(xPos + 10, yPos);
  ctx.fill();
  ctx.closePath();
  ctx.beginPath();
  ctx.moveTo(xPos + 5, yPos + 5);
  ctx.lineTo(xPos + 5, yPos + 45);
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.lineWidth = 1;
}

function createChooseTimeMaker(cursorX, timemarkerObj) {
  const [lastX, lastY] = timemarkerObj.getPosition();

  ctx.clearRect(lastX, lastY, 2, lastY + 40);
  const xPos = cursorX - 20;
  const yPos = 50;
  ctx.beginPath();

  ctx.moveTo(xPos + 5, yPos);
  ctx.lineTo(xPos + 5, yPos + 40);
  timemarkerObj.setX(xPos + 5);
  timemarkerObj.setY(yPos);
  ctx.stroke();
}

const timeMarker = new Timemarker(0, 0);

// canvas.addEventListener("mousemove", function (e) {
// 	console.log(e.clientX, "mousemove");
// 	console.log(e.clientY, "mousemove");
// 	createChooseTimeMaker(e.clientX, timeMarker);
// });

canvas.addEventListener("click", function (e) {
  console.log("click");
});

canvas.addEventListener("mouseout", function (e) {
  console.log("mouseout");
});

startRender();