import Cell = require("./Cell");

class Shape {
	readonly sum: number;
	constructor(sum: number, cells: Cell[]) {
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
		console.log(cells);
	}
}

export = Shape;
