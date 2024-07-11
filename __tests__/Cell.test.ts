import Cell = require("../src/Cell");
import Shape = require("../src/Shape");
import KillerSudoku = require("../src/KillerSudoku");
const shapes: Array<[number, number[]]> = require("./shapes");

describe("Constructor", () => {
	describe("position property", () => {
		it("should create a position property", () => {
			const cell = new Cell(5);
			expect(cell).toHaveProperty("position");
		});
		it("should create a position property as given", () => {
			const cell = new Cell(5);
			expect(cell).toHaveProperty("position", 5);
		});
		it("should only accept numerical arguments for position", () => {
			expect(() => new Cell("bananas" as any)).toThrow(TypeError);
		});
		it("should only accept numbers between 0 and 81", () => {
			expect(() => new Cell(900)).toThrow(RangeError);
		});
		it("should only accept integers", () => {
			expect(() => new Cell(25.5)).toThrow(TypeError);
		});
	});

	describe("row, column, box properties", () => {
		it("should create a row property", () => {
			const cell = new Cell(5);
			expect(cell).toHaveProperty("row");
		});
		it("should create a column property", () => {
			const cell = new Cell(5);
			expect(cell).toHaveProperty("column");
		});
		it("should create a box property", () => {
			const cell = new Cell(5);
			expect(cell).toHaveProperty("box");
		});
		it("should calculate row property", () => {
			const cell1 = new Cell(5);
			const cell2 = new Cell(14);
			const cell3 = new Cell(55);
			expect(cell1).toHaveProperty("row", 0);
			expect(cell2).toHaveProperty("row", 1);
			expect(cell3).toHaveProperty("row", 6);
		});
		it("should calculate column property", () => {
			const cell1 = new Cell(5);
			const cell2 = new Cell(11);
			const cell3 = new Cell(63);
			expect(cell1).toHaveProperty("column", 5);
			expect(cell2).toHaveProperty("column", 2);
			expect(cell3).toHaveProperty("column", 0);
		});
		it("should calculate box property", () => {
			const cell1 = new Cell(5);
			const cell2 = new Cell(35);
			const cell3 = new Cell(63);
			expect(cell1).toHaveProperty("box", 1);
			expect(cell2).toHaveProperty("box", 5);
			expect(cell3).toHaveProperty("box", 6);
		});
	});
	describe("value and possibleValues", () => {
		it("should initialize with a value of 0", () => {
			const cell1 = new Cell(20);
			const cell2 = new Cell(35);
			const cell3 = new Cell(0);
			expect(cell1).toHaveProperty("value", 0);
			expect(cell2).toHaveProperty("value", 0);
			expect(cell3).toHaveProperty("value", 0);
		});
		it("should initialize with no possible values", () => {
			const expected = new Set();
			const cell1 = new Cell(29);
			const cell2 = new Cell(78);
			const cell3 = new Cell(2);
			expect(cell1.possibleValues).toEqual(expected);
			expect(cell2.possibleValues).toEqual(expected);
			expect(cell3.possibleValues).toEqual(expected);
		});
	});
	describe("isValid property", () => {
		it("should initialize with the isValid property", () => {
			const cell = new Cell(0);

			expect(cell).toHaveProperty("isValid", true);
		});
	});
});

describe("findWalls", () => {
	it("should throw if no shape is currently set", () => {
		const cell = new Cell(0);
		expect(() => cell.findWalls()).toThrow(
			"Cannot find walls without shape property"
		);
	});
	it("should set the walls property to all 4 walls if a cell is the only one in a shape", () => {
		const cell = new Cell(1);
		new Shape(3, [cell]);

		cell.findWalls();

		expect(cell).toHaveProperty("walls");
		expect(cell.walls).toEqual([true, true, true, true]);
	});
	it("should set the walls to 3 sides if the cell is sticks out of the shape", () => {
		const expected = [
			[true, false, true, true],
			[true, true, true, false],
			[true, true, false, true],
			[false, true, true, true],
		];
		const cells = [new Cell(0), new Cell(1), new Cell(9), new Cell(18)];
		new Shape(3, [cells[0], cells[1]]);
		new Shape(3, [cells[2], cells[3]]);

		cells.forEach((cell) => cell.findWalls());

		expect(cells.map((cell) => cell.walls)).toEqual(expected);
	});
	it("should set the walls to 2 sides adjacent if the cell would have 2 sides at the edge of a shape", () => {
		const expected = [
			[true, false, false, true],
			[true, true, false, false],
			[false, false, true, true],
			[false, true, true, false],
		];
		const cells = [new Cell(0), new Cell(1), new Cell(9), new Cell(10)];
		new Shape(10, cells);

		cells.forEach((cell) => cell.findWalls());

		expect(cells.map((cell) => cell.walls)).toEqual(expected);
	});
	it("should set the walls opposite if the cell would have 2 sides opposite", () => {
		const expected = [
			[true, false, true, false],
			[false, true, false, true],
		];
		const cells = [
			new Cell(0),
			new Cell(1),
			new Cell(2),
			new Cell(9),
			new Cell(18),
			new Cell(27),
		];
		new Shape(7, [cells[0], cells[1], cells[2]]);
		new Shape(7, [cells[3], cells[4], cells[5]]);

		cells.forEach((cell) => cell.findWalls());

		expect([cells[1], cells[4]].map((cell) => cell.walls)).toEqual(expected);
	});
	it("should set the walls to 1 side if the cell would have 1 side at the edge of a shape", () => {
		const expected = [
			[true, false, false, false],
			[false, false, false, true],
			[false, true, false, false],
			[false, false, true, false],
		];
		const cells = [
			new Cell(0),
			new Cell(1),
			new Cell(2),
			new Cell(9),
			new Cell(10),
			new Cell(11),
			new Cell(18),
			new Cell(19),
			new Cell(20),
		];
		new Shape(45, cells);

		cells.forEach((cell) => cell.findWalls());

		expect(
			[cells[1], cells[3], cells[5], cells[7]].map((cell) => cell.walls)
		).toEqual(expected);
	});

	it("should keep the walls empty if the cell has no sides at the edge of the shape", () => {
		const expected = [false, false, false, false];
		const cells = [
			new Cell(1),
			new Cell(9),
			new Cell(10),
			new Cell(11),
			new Cell(19),
		]; // a cross shape

		new Shape(25, cells);

		expect(cells[2].walls).toEqual(expected);
	});
});

describe("setIsValid", () => {
	it("should set isValid to true if there are no mistakes", () => {
		const sudoku = new KillerSudoku(shapes);
		const cell = sudoku.cells[0];
		cell.value = 5;
		cell.isValid = false;

		cell.setIsValid();

		expect(cell).toHaveProperty("isValid", true);
	});
	it("should set isValid to false for both cells if there is a cell in the same row with the same value", () => {
		const sudoku = new KillerSudoku(shapes);
		const cell1 = sudoku.cells[0];
		const cell2 = sudoku.cells[7];
		cell1.value = 5;
		cell2.value = 5;

		cell1.setIsValid();

		expect(cell1).toHaveProperty("isValid", false);
		expect(cell2).toHaveProperty("isValid", false);
	});
	it("should set isValid to false for both cells if there is a cell in the same column with the same value", () => {
		const sudoku = new KillerSudoku(shapes);
		const cell1 = sudoku.cells[0];
		const cell2 = sudoku.cells[63];
		cell1.value = 5;
		cell2.value = 5;

		cell1.setIsValid();

		expect(cell1).toHaveProperty("isValid", false);
		expect(cell2).toHaveProperty("isValid", false);
	});
	it("should set isValid to false for both cells if there is a cell in the same box with the same value", () => {
		const sudoku = new KillerSudoku(shapes);
		const cell1 = sudoku.cells[0];
		const cell2 = sudoku.cells[20];
		cell1.value = 5;
		cell2.value = 5;

		cell1.setIsValid();

		expect(cell1).toHaveProperty("isValid", false);
		expect(cell2).toHaveProperty("isValid", false);
	});
	it("should set isValid to false for both cells if there is a cell in the same shape with the same value", () => {
		const sudoku = new KillerSudoku(shapes);
		const cell1 = sudoku.cells[56];
		const cell2 = sudoku.cells[39];
		cell1.value = 5;
		cell2.value = 5;

		cell1.setIsValid();

		expect(cell1).toHaveProperty("isValid", false);
		expect(cell2).toHaveProperty("isValid", false);
	});
	it("should set isValid for all cells with invalid", () => {
		const sudoku = new KillerSudoku(shapes);
		const cell1 = sudoku.cells[56];
		cell1.value = 3;
		const cell2 = sudoku.cells[32];
		cell2.value = 3;
		const cell3 = sudoku.cells[12];
		cell3.value = 3;
		const cell4 = sudoku.cells[43];
		cell4.value = 3;

		const cell5 = sudoku.cells[39];
		cell5.value = 3;
		cell5.setIsValid();

		expect(cell1).toHaveProperty("isValid", false);
		expect(cell2).toHaveProperty("isValid", false);
		expect(cell3).toHaveProperty("isValid", false);
		expect(cell4).toHaveProperty("isValid", false);
		expect(cell5).toHaveProperty("isValid", false);
	});
	it("should not affect cells with different values", () => {
		const sudoku = new KillerSudoku(shapes);
		const cell1 = sudoku.cells[56];
		cell1.value = 3;
		const cell2 = sudoku.cells[32];
		cell2.value = 4;
		const cell3 = sudoku.cells[12];
		cell3.value = 5;
		const cell4 = sudoku.cells[43];
		cell4.value = 6;

		const cell5 = sudoku.cells[39];
		cell5.value = 7;
		cell5.setIsValid();

		expect(cell1).toHaveProperty("isValid", true);
		expect(cell2).toHaveProperty("isValid", true);
		expect(cell3).toHaveProperty("isValid", true);
		expect(cell4).toHaveProperty("isValid", true);
		expect(cell5).toHaveProperty("isValid", true);
	});
	it("should set both to true if the value is set to zero and there was previously a duplicate value", () => {
		const sudoku = new KillerSudoku(shapes);
		const cell1 = sudoku.cells[0];
		const cell2 = sudoku.cells[1];
		cell1.value = 5;
		cell2.value = 5;
		cell1.setIsValid();

		cell1.value = 0;
		cell1.setIsValid();

		expect(cell1).toHaveProperty("isValid", true);
		expect(cell2).toHaveProperty("isValid", true);
	});
	it("should not change isValid to true if a cell is set to zero but there are still duplicate values", () => {
		const sudoku = new KillerSudoku(shapes);
		const cell1 = sudoku.cells[0];
		const cell2 = sudoku.cells[5];
		const cell3 = sudoku.cells[36];
		cell1.value = 5;
		cell2.value = 5;
		cell3.value = 5;
		cell1.setIsValid();

		cell2.value = 0;
		cell2.setIsValid();

		expect(cell1).toHaveProperty("isValid", false);
		expect(cell2).toHaveProperty("isValid", true);
		expect(cell3).toHaveProperty("isValid", false);
	});
	it("should set the shape isValid to false if the sum is too high", () => {
		const sudoku = new KillerSudoku(shapes);
		const cell1 = sudoku.cells[4];
		const cell2 = sudoku.cells[5];
		cell1.value = 9;
		cell2.value = 8;

		cell1.setIsValid();

		expect(cell1.shape).toHaveProperty("isValid", false);
	});
	it("should set the shape isValid to true if the sum is set lower again", () => {
		const sudoku = new KillerSudoku(shapes);
		const cell1 = sudoku.cells[4];
		const cell2 = sudoku.cells[5];
		cell1.value = 9;
		cell2.value = 8;
		cell1.setIsValid();

		cell1.value = 0;
		cell1.setIsValid();

		expect(cell1.shape).toHaveProperty("isValid", true);
	});
	it("should keep the shape isValid to false if the sum is still over after lowering", () => {
		const sudoku = new KillerSudoku(shapes);
		const cell1 = sudoku.cells[3];
		const cell2 = sudoku.cells[12];
		const cell3 = sudoku.cells[13];
		cell1.value = 9;
		cell2.value = 8;
		cell3.value = 7;
		cell1.setIsValid();

		cell1.value = 0;
		cell1.setIsValid();

		expect(cell1.shape).toHaveProperty("isValid", false);
	});
});

describe("setValue", () => {
	it("should set the value property", () => {
		const sudoku = new KillerSudoku(shapes);
		const cell = sudoku.cells[0];

		for (let i = 0; i < 10; i++) {
			cell.setValue(i);
			expect(cell).toHaveProperty("value", i);
		}
	});
	it("should throw if given wrong type", () => {
		const sudoku = new KillerSudoku(shapes);
		const cell = sudoku.cells[0];

		expect(() => cell.setValue("bananas" as any)).toThrow(
			"value must be an integer between 0 and 9"
		);
	});
	it("should throw if given non-integer type", () => {
		const sudoku = new KillerSudoku(shapes);
		const cell = sudoku.cells[0];

		expect(() => cell.setValue(4.5)).toThrow(
			"value must be an integer between 0 and 9"
		);
	});
	it("should throw if given integer outside range type", () => {
		const sudoku = new KillerSudoku(shapes);
		const cell = sudoku.cells[0];

		expect(() => cell.setValue(-3)).toThrow(
			"value must be an integer between 0 and 9"
		);
		expect(() => cell.setValue(11)).toThrow(
			"value must be an integer between 0 and 9"
		);
	});
	it("should remove the value from possible values of cells in the same row", () => {
		const sudoku = new KillerSudoku(shapes);
		const cell1 = sudoku.cells[0];
		const cell2 = sudoku.cells[3];
		const cell3 = sudoku.cells[7];

		cell2.possibleValues.add(1);
		cell3.possibleValues.add(1);

		cell1.setValue(1);

		expect(cell2.possibleValues).toEqual(new Set());
		expect(cell3.possibleValues).toEqual(new Set());
	});
	it("should remove the value from possible values of cells in the same column", () => {
		const sudoku = new KillerSudoku(shapes);
		const cell1 = sudoku.cells[5];
		const cell2 = sudoku.cells[32];
		const cell3 = sudoku.cells[77];

		cell2.possibleValues.add(5);
		cell3.possibleValues.add(5);

		cell1.setValue(5);

		expect(cell2.possibleValues).toEqual(new Set());
		expect(cell3.possibleValues).toEqual(new Set());
	});
	it("should remove the value from possible values of cells in the same box", () => {
		const sudoku = new KillerSudoku(shapes);
		const cell1 = sudoku.cells[30];
		const cell2 = sudoku.cells[40];
		const cell3 = sudoku.cells[50];

		cell2.possibleValues.add(7);
		cell3.possibleValues.add(7);

		cell1.setValue(7);

		expect(cell2.possibleValues).toEqual(new Set());
		expect(cell3.possibleValues).toEqual(new Set());
	});
	it("should remove the value from possible values of cells in the same shape", () => {
		const sudoku = new KillerSudoku(shapes);
		const cell1 = sudoku.cells[39];
		const cell2 = sudoku.cells[56];

		cell2.possibleValues.add(8);

		cell1.setValue(8);

		expect(cell2.possibleValues).toEqual(new Set());
	});
	it("should set isValid in case of conflict", () => {
		const sudoku = new KillerSudoku(shapes);
		const cell1 = sudoku.cells[0];
		const cell2 = sudoku.cells[4];
		cell2.setValue(5);
		const setIsValidMock = jest.spyOn(Cell.prototype, "setIsValid");

		cell1.setValue(5);

		expect(setIsValidMock).toHaveBeenCalled();
		expect(cell1).toHaveProperty("isValid", false);
		expect(cell2).toHaveProperty("isValid", false);
	});
	it("should set isValid to true if there is no longer a conflict", () => {
		const sudoku = new KillerSudoku(shapes);
		const cell1 = sudoku.cells[0];
		const cell2 = sudoku.cells[4];
		cell1.setValue(5);
		cell2.setValue(5);

		cell1.setValue(6);

		expect(cell1).toHaveProperty("isValid", true);
		expect(cell2).toHaveProperty("isValid", true);
	});
});
