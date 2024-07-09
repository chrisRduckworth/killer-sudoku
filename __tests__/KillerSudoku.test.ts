import KillerSudoku = require("../src/KillerSudoku");
import Cell = require("../src/Cell");
import Shape = require("../src/Shape")

const shapes: Array<[number, number[]]> = [
	[20, [0, 1, 2, 9]],
	[10, [3, 12, 13]],
	[13, [4, 5]],
	[8, [6, 7, 8]],
	[12, [10, 19]],
	[10, [11, 20]],
	[26, [14, 15, 16, 17]],
	[8, [18, 27]],
	[23, [21, 22, 30]],
	[16, [23, 24, 25, 26]],
	[19, [28, 29, 38, 47]],
	[20, [31, 40, 49, 50]],
	[12, [32, 33]],
	[20, [34, 35, 43, 44]],
	[30, [36, 45, 54, 63]],
	[10, [37, 46, 55, 64]],
	[20, [39, 48, 57, 56]],
	[12, [41, 42]],
	[14, [51, 60]],
	[8, [52, 53]],
	[7, [58, 59]],
	[8, [61, 62]],
	[4, [65, 66]],
	[20, [67, 68, 69, 78]],
	[13, [70, 79]],
	[10, [71, 80]],
	[18, [72, 73, 74]],
	[14, [75, 76, 77]],
];

describe("constructor", () => {
	it("should initialize with a cells property", () => {
		const sudoku = new KillerSudoku(shapes);

		expect(sudoku).toHaveProperty("cells");
	});
	it("should initialize with 81 cells", () => {
		const sudoku = new KillerSudoku(shapes);

		expect(sudoku.cells).toHaveLength(81);
	});
	it("each cell should be a cell instance", () => {
		const sudoku = new KillerSudoku(shapes);

		sudoku.cells.forEach((cell) => {
			expect(cell).toBeInstanceOf(Cell);
		});
	});
	it("each cell should have different position from 0 thru 80", () => {
		const sudoku = new KillerSudoku(shapes);

		for (let i = 0; i < 81; i++) {
			expect(sudoku.cells).toContainEqual(new Cell(i));
      expect(sudoku.cells[i]).toHaveProperty("position", i)
		}
	});
});
