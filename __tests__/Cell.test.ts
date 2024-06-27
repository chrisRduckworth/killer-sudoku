const Cell = require("../src/Cell");

describe("Constructor", () => {
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
