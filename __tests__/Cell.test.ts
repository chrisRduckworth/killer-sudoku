import Cell = require("../src/Cell")

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
});
