class Cell {
	readonly position: number;
	readonly row: number;
	readonly column: number;
	readonly box: number;
	value = 0;
	possibleValues = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
	constructor(position: number) {
		if (typeof position !== "number" || Math.floor(position) !== position) {
			throw new TypeError("Position must be an integer");
		}
		if (position < 0 || position >= 81) {
			throw new RangeError("Position must be 0 and 80 inclusive");
		}
		this.position = position;

		// rows are counted 0 - 8 left to right
		this.row = Math.floor(position / 9);
		// columns are counted 0 - 8 top to bottom
		this.column = position % 9;
		// boxs are counted 0 - 8 left to right and wrapping down
		this.box = Math.floor((position % 9) / 3) + 3 * Math.floor(position / 27);
	}
}

module.exports = Cell;
export type { Cell };
