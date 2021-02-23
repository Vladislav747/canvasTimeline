/**
 * Класс Cell - ячейка Timeline
 */
class Cell {
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
	 * Создать ячейку
	 */
	drawCell() {
		ctx.beginPath();
		ctx.moveTo(this.x, this.y + 30);
		ctx.lineTo(this.x, this.y + 20);
		ctx.lineTo(this.x + CELL_WIDTH, this.y + 20);
		ctx.stroke();
	}

	/**
	 * Обновлять координаты timeline
	 */
	update(dx) {
		this.x -= dx;
	}
}