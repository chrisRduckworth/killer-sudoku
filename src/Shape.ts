import Cell = require("./Cell");

class Shape {
	readonly sum: number;
	readonly cells: Cell[];
	constructor(sum: number, cells: Cell[]) {
		// Cells property:

		if (!Array.isArray(cells) || !cells.every((c) => c instanceof Cell)) {
			throw new TypeError("Cells must be an array of cell instances");
		}

		if (cells.length === 0 || cells.length > 9) {
			throw new Error("cells must be length between 1 and 9");
		}

		if (
			cells.some(
				(c, i, arr) => i !== arr.findIndex((d) => d.position === c.position)
			)
		) {
			throw new Error("cells cannot contain duplicates");
		}

		// perform a flood fill to check the positions of the cells are continuous
		const checked: Cell[] = [];
		const queue = [cells[0]];
		while (queue.length > 0) {
			const cell = queue.shift()!;
			// get cell above and check if it's in the shape
			const cellAbove = cells.find((c) => c.position === cell.position - 9);
			if (cellAbove && !checked.includes(cellAbove)) {
				queue.push(cellAbove);
			}
			// below
			const cellBelow = cells.find((c) => c.position === cell.position + 9);
			if (cellBelow && !checked.includes(cellBelow)) {
				queue.push(cellBelow);
			}
			// left
			if (cell.column > 0) {
				// because shapes can't wrap
				const cellLeft = cells.find((c) => c.position === cell.position - 1);
				if (cellLeft && !checked.includes(cellLeft)) {
					queue.push(cellLeft);
				}
			}
			// right
			if (cell.column < 8) {
				const cellRight = cells.find((c) => c.position === cell.position + 1);
				if (cellRight && !checked.includes(cellRight)) {
					queue.push(cellRight);
				}
			}
			checked.push(cell);
		}
		if (checked.length < cells.length) {
			throw new Error("cells must form a continuous shape");
		}

		this.cells = cells;

		for (const cell of cells) {
			cell.shape = this;
		}

		// sum property:
		if (typeof sum !== "number" || Math.floor(sum) !== sum) {
			throw new TypeError("Sum must be an integer");
		}

		// minimum value for n cells is 1 + 2 + ... + n
		const minSum = (cells.length * (cells.length + 1)) / 2;
		// max value for n cells is 9 + 8 + ... (9 - n + 1)
		const maxSum = (-(cells.length - 19) * cells.length) / 2;
		if (sum < minSum || sum > maxSum) {
			throw new RangeError("Sum must be valid for number of cells");
		}

		this.sum = sum;
	}
}

export = Shape;
