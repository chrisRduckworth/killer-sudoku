import Shape = require("../src/Shape");
import Cell = require("../src/Cell");
const shapes: Array<[number, number[]]> = require("./shapes");

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
			const cell3 = new Cell(2);
			const cell4 = new Cell(3);

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
	describe("cells property", () => {
		it("should create a cells property", () => {
			const cell = new Cell(5);

			const shape = new Shape(4, [cell]);

			expect(shape).toHaveProperty("cells");
		});
		it("should create a cells property with the given cells", () => {
			const cells = [new Cell(0), new Cell(1), new Cell(2)];

			const shape = new Shape(10, cells);

			expect(shape.cells).toEqual(cells);
		});
		it("should set the shape property of each of the given cells", () => {
			const cells = [new Cell(0), new Cell(1), new Cell(2)];

			const shape = new Shape(10, cells);

			expect(cells[0]).toHaveProperty("shape", shape);
			expect(cells[1]).toHaveProperty("shape", shape);
			expect(cells[2]).toHaveProperty("shape", shape);
		});
		it("should only accept an array of Cells", () => {
			expect(() => new Shape(4, "bananas" as any)).toThrow(TypeError);
			expect(() => new Shape(7, [9, 2, 5] as any)).toThrow(TypeError);
		});
		it("should not accept empty cells array", () => {
			expect(() => new Shape(0, [])).toThrow(
				"cells must be length between 1 and 9"
			);
		});
		it("should not accept more than 9 cells", () => {
			const cells = [...Array(10).keys()].map((p) => new Cell(p));
			expect(() => new Shape(45, cells)).toThrow(
				"cells must be length between 1 and 9"
			);
		});
		it("should not accept duplicate cells", () => {
			const cells = [new Cell(0), new Cell(1), new Cell(0)];
			expect(() => new Shape(12, cells)).toThrow(
				"cells cannot contain duplicates"
			);
		});
		it("should not accept cells which do not form a continuous shape vertically", () => {
			const cells = [new Cell(0), new Cell(9), new Cell(36)];
			expect(() => new Shape(8, cells)).toThrow(
				"cells must form a continuous shape"
			);
		});
		it("should not accept cells which do not form a continuous shape horizontally", () => {
			const cells = [new Cell(0), new Cell(1), new Cell(5)];
			expect(() => new Shape(8, cells)).toThrow(
				"cells must form a continuous shape"
			);
		});
		it("corner case: cell above/below on row 0/8", () => {
			const cells = [new Cell(0), new Cell(9), new Cell(63), new Cell(72)];
			expect(() => new Shape(15, cells)).toThrow(
				"cells must form a continuous shape"
			);
			const cells2 = [new Cell(72), new Cell(0), new Cell(9), new Cell(63)];
			expect(() => new Shape(15, cells2)).toThrow(
				"cells must form a continuous shape"
			);
		});
		it("corner case: cell left/right on column 0/8", () => {
			const cells = [new Cell(18), new Cell(19), new Cell(16), new Cell(17)];
			expect(() => new Shape(15, cells)).toThrow(
				"cells must form a continuous shape"
			);
			const cells2 = [new Cell(17), new Cell(18), new Cell(19), new Cell(16)];
			expect(() => new Shape(15, cells2)).toThrow(
				"cells must form a continuous shape"
			);
		});
		it("should handle complex shapes", () => {
			for (const s of shapes) {
				const cells = s[1].map((p) => new Cell(p));
				const shape = new Shape(s[0], cells);
				expect(shape.cells).toEqual(cells);
			}
		});
	});
	describe("isValid property", () => {
		it("should initialize with isValid set to true", () => {
			const cell = new Cell(0);
			const shape = new Shape(5, [cell]);

			expect(shape.isValid).toBe(true);
		});
	});
});
