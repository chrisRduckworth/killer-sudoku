import Cell = require("./Cell");
class KillerSudoku {
	readonly cells: Cell[];
	constructor(shapes: Array<[number, number[]]>) {
		this.cells = [...Array(81).keys()].map((n) => new Cell(n));
	}
}

export = KillerSudoku;
