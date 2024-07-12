import Cell from "./Cell";
import Shape from "./Shape";

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
		this.cells.forEach((cell) => {
			cell.sudoku = this;
			cell.findWalls();
		});
		this.shapes.forEach((shape) => {
			shape.sudoku = this;
		});
	}

	getRow(n: number): Cell[] {
		if (typeof n !== "number" || Math.floor(n) !== n || n < 0 || n >= 9) {
			throw new TypeError("row must be an integer between 0 and 8");
		}
		return this.cells.filter((cell) => cell.row === n);
	}

	getColumn(n: number): Cell[] {
		if (typeof n !== "number" || Math.floor(n) !== n || n < 0 || n >= 9) {
			throw new TypeError("column must be an integer between 0 and 8");
		}
		return this.cells.filter((cell) => cell.column === n);
	}

	getBox(n: number): Cell[] {
		if (typeof n !== "number" || Math.floor(n) !== n || n < 0 || n >= 9) {
			throw new TypeError("box must be an integer between 0 and 8");
		}
		return this.cells.filter((cell) => cell.box === n);
	}
}

export default KillerSudoku;
