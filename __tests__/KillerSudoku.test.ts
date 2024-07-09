import KillerSudoku = require("../src/KillerSudoku");
import Cell = require("../src/Cell");
import Shape = require("../src/Shape");

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
	describe("cells property", () => {
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
				expect(sudoku.cells[i]).toHaveProperty("position", i);
			}
		});
		it("should run findWalls on each cell", () => {
			const findWallsMock = jest.spyOn(Cell.prototype, "findWalls");
			new KillerSudoku(shapes);

			expect(findWallsMock).toHaveBeenCalledTimes(81);
		});
	});
	describe("shapes property", () => {
		it("should initialize with a shapes property", () => {
			const sudoku = new KillerSudoku(shapes);

			expect(sudoku).toHaveProperty("shapes");
		});
		it("shapes should be an array of shape objects", () => {
			const sudoku = new KillerSudoku(shapes);

			expect(Array.isArray(sudoku.shapes)).toBe(true);
			sudoku.shapes.forEach((shape) => {
				expect(shape).toBeInstanceOf(Shape);
			});
		});
		it("shapes should have same length as input", () => {
			const sudoku = new KillerSudoku(shapes);

			expect(sudoku.shapes).toHaveLength(shapes.length);
		});
		it("each shape should be initialized correctly", () => {
			const sudoku = new KillerSudoku(shapes);

			shapes.forEach(([sum, pos], i) => {
				expect(sudoku.shapes[i]).toHaveProperty("sum", sum);
				expect(sudoku.shapes[i].cells.map((c) => c.position)).toEqual(pos);
			});
		});
		it("should throw if not all cells have shapes", () => {
			const shapes: Array<[number, number[]]> = [
				[6, [0, 1, 2]],
				[10, [3, 4, 5, 6]],
			];

			expect(() => new KillerSudoku(shapes)).toThrow(
				"each cell must have a shape"
			);
		});
		it("should throw if a cell has more than one shape", () => {
			const shapes2 = JSON.parse(JSON.stringify(shapes));
			shapes2.push([6, [1, 2, 3]]);

			expect(() => new KillerSudoku(shapes2)).toThrow(
				"each cell cannot have more than one cell"
			);
		});
		it("should throw if given invalid cell positions", () => {
			const shapes2 = JSON.parse(JSON.stringify(shapes));
			shapes2.push([6, ["bananas"]]);

			expect(() => new KillerSudoku(shapes2)).toThrow();

			shapes2.pop();
			shapes2.push([6, [-1, -2]]);

			expect(() => new KillerSudoku(shapes2)).toThrow();
		});
		it("should throw if given an invalid shape", () => {
			const shapes2 = JSON.parse(JSON.stringify(shapes));
			shapes2.pop();
			shapes2.push("bananas");

			expect(() => new KillerSudoku(shapes2 as any)).toThrow();
		});
	});
});

describe("getRow", () => {
  it("should return 9 cells in an array", () => {
    const sudoku = new KillerSudoku(shapes)

    const row = sudoku.getRow(0)

    expect(Array.isArray(row)).toBe(true)
    expect(row).toHaveLength(9)
  })
  it("should return the correct cells", () => {
    const sudoku = new KillerSudoku(shapes)

    const row1 = sudoku.getRow(0)
    const row2 = sudoku.getRow(3)
    const row3 = sudoku.getRow(7)

    expect(row1.map((c) => c.position)).toEqual([0,1,2,3,4,5,6,7,8])
    expect(row2.map((c) => c.position)).toEqual([27,28,29,30,31,32,33,34,35])
    expect(row3.map((c) => c.position)).toEqual([63,64,65,66,67,68,69,70,71])

  })
  it("should throw if given an invalid row type", () => {
    const sudoku = new KillerSudoku(shapes)

    expect(() => sudoku.getRow("bananas" as any)).toThrow("row must be an integer between 0 and 8")
  })
  it("should throw if given a non-integer row", () => {
    const sudoku = new KillerSudoku(shapes)

    expect(() => sudoku.getRow(4.5)).toThrow("row must be an integer between 0 and 8")
  })
  it("should throw if given a row outside 0 and 8", () => {
    const sudoku = new KillerSudoku(shapes)

    expect(() => sudoku.getRow(-2)).toThrow("row must be an integer between 0 and 8")
    expect(() => sudoku.getRow(11)).toThrow("row must be an integer between 0 and 8")
  })
})