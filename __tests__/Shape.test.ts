import Shape = require("../src/Shape");
import Cell = require("../src/Cell");

describe("Constructor", () => {
	describe("Sum property", () => {
		it("should create a sum property", () => {
			const cell = new Cell(5);

			const shape = new Shape(4, [cell]);

			expect(shape).toHaveProperty("sum");
		});
		it("should create a sum property as given", () => {
			const cell = new Cell(5);

			const shape = new Shape(4, [cell]);

			expect(shape).toHaveProperty("sum", 4);
		});
		it("should only accept numbers for sum", () => {
			const cell = new Cell(5);

			expect(() => new Shape("bananas" as any, [cell])).toThrow(TypeError);
		});
		it("should only accept integers for sum", () => {
			const cell = new Cell(5);

			expect(() => new Shape(4.5, [cell])).toThrow(TypeError);
		});
		it("should only accept a possible sum for the number of cells provided", () => {
			const cell1 = new Cell(0);
			const cell2 = new Cell(1);
			const cell3 = new Cell(1);
			const cell4 = new Cell(1);

			// Too low for 2 cells (minimum is 3)
			expect(() => new Shape(2, [cell1, cell2])).toThrow(RangeError);
			// Too low for 4 cells (min is 10)
			expect(() => new Shape(8, [cell1, cell2, cell3, cell4])).toThrow(
				RangeError
			);

			// Too high for 1 cells (max is 9)
			expect(() => new Shape(11, [cell1])).toThrow(RangeError);
			// Too high for 3 cells (max is 24)
			expect(() => new Shape(26, [cell1, cell2, cell3])).toThrow(RangeError);
		});
	});
});
