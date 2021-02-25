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

/**
 * Настройки метки времени
 */
const configCurrentTimeline = {
	x: 0,
	y: 0,
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
 * Создать ячейку
 */
function drawCell(x, y, cellWidth) {
	ctx.beginPath();
	ctx.moveTo(x, y + 30);
	ctx.lineTo(x, y + 20);
	ctx.lineTo(x + cellWidth, y + 20);
	ctx.stroke();
}

/**
 * Создать большую ячейку
 */
function drawBigCell(x, y, timeMarkerHours, timeMarkerMinutes, cellWidth) {
	ctx.beginPath();
	ctx.moveTo(x, y + 40);
	ctx.lineTo(x, y + 20);
	const xPos = x;
	const yPosText = y + 55;

	ctx.fillText(`${timeMarkerHours}:${timeMarkerMinutes}`, xPos, yPosText);
	ctx.lineTo(x + cellWidth, y + 20);
	ctx.stroke();
}

/**
 * Сгенерировать ячейки Timeline
 */
function createCells(x, y, timePiece, timeStart, offset) {
	const teamPieceSeconds = timePiece / 1000;
	
	for (let i = offset; i <= teamPieceSeconds; i += 10) {
		if (i % 60 === 0) {
			let timeMarker = timeStart.valueOf() + i * 1000;
			let timeMarkerHours = new Date(timeMarker).getHours();
			let timeMarkerMinutes = new Date(timeMarker).getMinutes();

			drawBigCell(i, y, timeMarkerHours, timeMarkerMinutes, configCanvas.canwasWidthCell);
		}  else {
			drawCell(i, y, configCanvas.canwasWidthCell);
		}
		if (i === teamPieceSeconds) {
			createCurrentTimeMaker(i, y);
		}
	}
	
}

/**
 * Создать сам таймлайн
 */
function createTimeline() {
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
	let offset = configCanvas.x;
		createCells(0, 60, roundTo10(timePiece), timeStart, offset);
		offset += configCanvas.speed;
}

let fps, fpsInterval, startTime, now, then, elapsed;

/**
 * Тормозить анимацию
 * @param {*} fps
 */
function startAnimating(fps) {
	fpsInterval = 1000 / fps;
	then = Date.now();
	startTime = then;
	animate();
}

const cells = [];

/**
 * Главная функция
 */
function animate() {
	requestAnimationFrame(animate);
	now = Date.now();
	elapsed = now - then;
	//Если время бежит слишком быстро то мы его уменьшаем
	if (elapsed > fpsInterval) {
		then = now - (elapsed % fpsInterval);
		//Очистить canvas от старых данных
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		//createTimeline();
		ctx.beginPath()
	let position = 0
      for (let i = 0; i < 720 + 1; i++) {
        ctx.moveTo(position +0.5, 0)
        if (i % 60 === 0) {
          ctx.lineTo(position +0.5, 15)
          ctx.fillText ("10:00", position, 15 + 10 + 10, 20)
        } else if (i % 10 === 0) {
          ctx.lineTo(position +0.5, 10)
        } else {
          ctx.lineTo(position +0.5, 5)
        }
        
        position += configCanvas.speed;
		console.log(position);
        //ctx.strokeStyle = TICK_COLOR
        ctx.stroke()
        ctx.translate(0, 0)
      }
      ctx.moveTo(0.5, 0)
      ctx.lineTo(0.5, 25)
      ctx.stroke()
      ctx.translate(0, 0)

		
	}
}


startAnimating(5);




/*
 Округлять на 10
*/
function roundTo10(num) {
	return Math.round(num / 10) * 10;
}

function createCurrentTimeMaker(x, y) {

	const xPos = x;
	const yPos = y;
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

/**
 * Выбрать время метка
 * @param {*} cursorX 
 * @param {*} x 
 * @param {*} y 
 */
function createChooseTimeMaker(cursorX, x, y) {

	const xPos = cursorX - 20;
	const yPos = 50;
	ctx.beginPath();

	ctx.moveTo(xPos + 5, yPos);
	ctx.lineTo(xPos + 5, yPos + 40);
	// timemarkerObj.setX(xPos + 5);
	// timemarkerObj.setY(yPos);
	ctx.stroke();
}

// canvas.addEventListener("mousemove", function (e) {
// 	console.log(e.clientX, "mousemove");
// 	console.log(e.clientY, "mousemove");
// 	createChooseTimeMaker(e.clientX, timeMarker);
// });

canvas.addEventListener("click", function (e) {
	console.log("click");
});

// canvas.addEventListener("mouseout", function (e) {
// 	//console.log("mouseout");
// });

animate();
