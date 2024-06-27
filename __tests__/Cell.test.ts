const Cell = require("../src/Cell");

describe("Constructor", () => {
	describe("position property", () => {
		it("should create a position property", () => {
			const cell = new Cell(5);
			expect(cell).toHaveProperty("position");
		});
		it("should create a position property as given", () => {
			const cell = new Cell(5);
			expect(cell.position).toBe(5);
		});
		it("should only accept numerical arguments for position", () => {
			const position = "bananas" as any;
			expect(() => new Cell(position)).toThrow(TypeError);
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
			expect(cell1.row).toBe(0);
			expect(cell2.row).toBe(1);
			expect(cell3.row).toBe(6);
		});
		it("should calculate column property", () => {
			const cell1 = new Cell(5);
			const cell2 = new Cell(11);
			const cell3 = new Cell(63);
			expect(cell1.column).toBe(5);
			expect(cell2.column).toBe(2);
			expect(cell3.column).toBe(0);
		});
		it("should calculate box property", () => {
			const cell1 = new Cell(5);
			const cell2 = new Cell(35);
			const cell3 = new Cell(63);
			expect(cell1.box).toBe(1);
			expect(cell2.box).toBe(5);
			expect(cell3.box).toBe(6);
		});
	});
});
