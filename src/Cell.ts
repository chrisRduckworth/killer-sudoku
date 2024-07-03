import type Shape = require("./Shape");

class Cell {
	readonly position: number;
	readonly row: number;
	readonly column: number;
	readonly box: number;

	value = 0;
	possibleValues: Set<number> = new Set();
	shape!: Shape;
	walls = [false, false, false, false]; // Going clockwise starting at north, true if a wall is present

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

	findWalls() {
		// finds which walls are at the edge of a shape, for drawing with CSS
		if (!this.shape) {
			throw new Error("Cannot find walls without shape property");
		}

		const pos = [-9, 1, 9, -1];
		for (let i = 0; i < pos.length; i++) {
			if (
				!this.shape.cells.some(
					(cell) => cell.position === this.position + pos[i]
				)
			) {
				this.walls[i] = true;
			}
		}
	}
}

export = Cell;
