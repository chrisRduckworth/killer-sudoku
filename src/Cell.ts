class Cell {
	readonly position: number;
	constructor(position: number) {
		if (typeof position !== "number" || Math.floor(position) !== position) {
			throw new TypeError("Position must be an integer");
		}
		if (position < 0 || position >= 81) {
			throw new RangeError("Position must be 0 and 80 inclusive");
		}
		this.position = position;
	}
}

module.exports = Cell;
