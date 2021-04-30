/**
 * Класс Timemarker
 */
export default class Timemarker {
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