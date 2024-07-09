import Cell = require("../src/Cell");
import Shape = require("../src/Shape");

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
