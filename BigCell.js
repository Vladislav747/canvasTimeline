/**
 * Класс BigCell - ячейка Timeline
 */
class BigCell {
	constructor(x, y, dx, dy) {
		this.x = x;
		this.y = y;
		this.dx = dx;
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
	 * Создать большую ячейку
	 */
	drawBigCell(timeMarkerHours, timeMarkerMinutes) {
		ctx.beginPath();
		ctx.moveTo(this.x, this.y + 40);
		ctx.lineTo(this.x, this.y + 20);
		const xPos = this.x;
		const yPosText = this.y + 55;

		ctx.fillText(`${timeMarkerHours}:${timeMarkerMinutes}`, xPos, yPosText);
		ctx.lineTo(this.x + CELL_WIDTH, this.y + 20);
		ctx.stroke();
	}
}