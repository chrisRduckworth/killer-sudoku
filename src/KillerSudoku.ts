import Cell = require("./Cell");
import Shape = require("./Shape");

class KillerSudoku {
	readonly cells: Cell[];
	readonly shapes: Shape[];

	constructor(shapes: Array<[number, number[]]>) {
		const positions = shapes.map(([_s, pos]) => pos).flat();
		// I'd love to use Set.symmetricDifference() here but it's very new
		if ([...Array(81).keys()].some((i) => !positions.includes(i))) {
			throw new Error("each cell must have a shape");
		}
		if (positions.length > 81) {
			throw new Error("each cell cannot have more than one cell");
		}

		this.cells = [...Array(81).keys()].map((n) => new Cell(n));
		this.shapes = shapes.map(
			([sum, pos]) =>
				new Shape(
					sum,
					pos.map((p) => this.cells[p])
				)
		);
		this.cells.forEach((cell) => cell.findWalls());
	}
}

export = KillerSudoku;
