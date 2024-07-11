import type Shape = require("./Shape");
import type KillerSudoku = require("./KillerSudoku");

class Cell {
	readonly position: number;
	readonly row: number;
	readonly column: number;
	readonly box: number;

	value = 0;
	possibleValues: Set<number> = new Set();
	shape!: Shape;
	walls = [false, false, false, false]; // Going clockwise starting at north, true if a wall is present
	isValid = true;
	sudoku!: KillerSudoku;

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

	setIsValid() {
		// checks the cell's row, column, box, and shape to for conflicts and sets isValid accordingly
		this.isValid = true;
		this.shape.isValid = true;

		if (this.value === 0) {
			const nonZeroRow = this.sudoku
				.getRow(this.row)
				.filter((cell) => cell.value !== 0);
			nonZeroRow.forEach((cell) => cell.setIsValid());

			const nonZeroColumn = this.sudoku
				.getColumn(this.column)
				.filter((cell) => cell.value !== 0);
			nonZeroColumn.forEach((cell) => cell.setIsValid());

			const nonZeroBox = this.sudoku
				.getBox(this.box)
				.filter((cell) => cell.value !== 0);
			nonZeroBox.forEach((cell) => cell.setIsValid());

			const nonZeroShape = this.shape.cells.filter((cell) => cell.value !== 0);
			nonZeroShape.forEach((cell) => cell.setIsValid());

			return;
		}

		const rowMatches = this.sudoku
			.getRow(this.row)
			.filter((cell) => cell.value === this.value);
		if (rowMatches.length > 1) {
			rowMatches.forEach((cell) => (cell.isValid = false));
		}

		const columnMatches = this.sudoku
			.getColumn(this.column)
			.filter((cell) => cell.value === this.value);
		if (columnMatches.length > 1) {
			columnMatches.forEach((cell) => (cell.isValid = false));
		}

		const boxMatches = this.sudoku
			.getBox(this.box)
			.filter((cell) => cell.value === this.value);
		if (boxMatches.length > 1) {
			boxMatches.forEach((cell) => (cell.isValid = false));
		}

		const shapeMatches = this.shape.cells.filter(
			(cell) => cell.value === this.value
		);
		if (shapeMatches.length > 1) {
			shapeMatches.forEach((cell) => (cell.isValid = false));
		}

		const shapeSum = this.shape.cells.reduce(
			(sum, cell) => sum + cell.value,
			0
		);
		if (shapeSum > this.shape.sum) {
			this.shape.isValid = false;
		}
	}

	setValue(n: number) {
		if (typeof n !== "number" || Math.floor(n) !== n || n < 0 || n >= 10) {
			throw TypeError("value must be an integer between 0 and 9");
		}

		// remove n from possibleValues of cells in the same row/column/box/shape
		const row = this.sudoku.getRow(this.row);
		row.forEach((cell) => cell.possibleValues.delete(n));

		const column = this.sudoku.getColumn(this.column);
		column.forEach((cell) => cell.possibleValues.delete(n));

		const box = this.sudoku.getBox(this.box);
		box.forEach((cell) => cell.possibleValues.delete(n));

		this.shape.cells.forEach((cell) => cell.possibleValues.delete(n));

		this.value = 0;
		this.setIsValid();
		if (n !== 0) {
			this.value = n;
			this.setIsValid();
		}
	}
}

export = Cell;
