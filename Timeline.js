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