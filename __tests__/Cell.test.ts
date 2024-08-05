import Cell from "../src/Cell";
import Shape from "../src/Shape";
import KillerSudoku from "../src/KillerSudoku";
import shapes from "./shapes";

function createTd() {
	const td = document.createElement("td")
	td.innerHTML = `<div>
		<div class="value"></div>
		<div class="walls-holder"></div>
		<ol class="possible-values"></ol>
	</div>`
	return td
}

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
		cell.element = createTd()
		cell.value = 5;
		cell.isValid = false;

		cell.setIsValid();

		expect(cell).toHaveProperty("isValid", true);
	});
	it("should set isValid to false for both cells if there is a cell in the same row with the same value", () => {
		const sudoku = new KillerSudoku(shapes);
		const cell1 = sudoku.cells[0];
		const cell2 = sudoku.cells[7];
		cell1.element = createTd()
		cell1.value = 5;
		cell2.element = createTd()
		cell2.value = 5;

		cell1.setIsValid();

		expect(cell1).toHaveProperty("isValid", false);
		expect(cell2).toHaveProperty("isValid", false);
	});
	it("should set isValid to false for both cells if there is a cell in the same column with the same value", () => {
		const sudoku = new KillerSudoku(shapes);
		const cell1 = sudoku.cells[0];
		const cell2 = sudoku.cells[63];
		cell1.element = createTd()
		cell1.value = 5;
		cell2.element = createTd()
		cell2.value = 5;

		cell1.setIsValid();

		expect(cell1).toHaveProperty("isValid", false);
		expect(cell2).toHaveProperty("isValid", false);
	});
	it("should set isValid to false for both cells if there is a cell in the same box with the same value", () => {
		const sudoku = new KillerSudoku(shapes);
		const cell1 = sudoku.cells[0];
		const cell2 = sudoku.cells[20];
		cell1.element = createTd()
		cell1.value = 5;
		cell2.element = createTd()
		cell2.value = 5;

		cell1.setIsValid();

		expect(cell1).toHaveProperty("isValid", false);
		expect(cell2).toHaveProperty("isValid", false);
	});
	it("should set isValid to false for both cells if there is a cell in the same shape with the same value", () => {
		const sudoku = new KillerSudoku(shapes);
		const cell1 = sudoku.cells[56];
		const cell2 = sudoku.cells[39];
		cell1.element = createTd()
		cell1.value = 5;
		cell2.element = createTd()
		cell2.value = 5;

		cell1.setIsValid();

		expect(cell1).toHaveProperty("isValid", false);
		expect(cell2).toHaveProperty("isValid", false);
	});
	it("should set isValid for all cells with invalid", () => {
		const sudoku = new KillerSudoku(shapes);
		const cell1 = sudoku.cells[56];
		cell1.element = createTd()
		cell1.value = 3;
		const cell2 = sudoku.cells[32];
		cell2.element = createTd()
		cell2.value = 3;
		const cell3 = sudoku.cells[12];
		cell3.element = createTd()
		cell3.value = 3;
		const cell4 = sudoku.cells[43];
		cell4.element = createTd()
		cell4.value = 3;

		const cell5 = sudoku.cells[39];
		cell5.element = createTd()
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
		cell1.element = createTd()
		cell1.value = 3;
		const cell2 = sudoku.cells[32];
		cell2.element = createTd()
		cell2.value = 4;
		const cell3 = sudoku.cells[12];
		cell3.element = createTd()
		cell3.value = 5;
		const cell4 = sudoku.cells[43];
		cell4.element = createTd()
		cell4.value = 6;

		const cell5 = sudoku.cells[39];
		cell5.element = createTd()
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
		cell1.element = createTd()
		cell1.value = 5;
		cell2.element = createTd()
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
		cell1.element = createTd()
		cell1.value = 5;
		cell2.element = createTd()
		cell2.value = 5;
		cell3.element = createTd()
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
		cell1.element = createTd()
		cell1.value = 9;
		cell2.element = createTd()
		cell2.value = 8;

		cell1.setIsValid();

		expect(cell1.shape).toHaveProperty("isValid", false);
	});
	it("should set the shape isValid to true if the sum is set lower again", () => {
		const sudoku = new KillerSudoku(shapes);
		const cell1 = sudoku.cells[4];
		const cell2 = sudoku.cells[5];
		cell1.element = createTd()
		cell1.value = 9;
		cell2.element = createTd()
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
		cell1.element = createTd()
		cell1.value = 9;
		cell2.element = createTd()
		cell2.value = 8;
		cell3.element = createTd()
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
		cell.element = createTd()

		for (let i = 0; i < 10; i++) {
			cell.setValue(i);
			expect(cell).toHaveProperty("value", i);
		}
	});
	it("should throw if given wrong type", () => {
		const sudoku = new KillerSudoku(shapes);
		const cell = sudoku.cells[0];
		cell.element = createTd()

		expect(() => cell.setValue("bananas" as any)).toThrow(
			"value must be an integer between 0 and 9"
		);
	});
	it("should throw if given non-integer type", () => {
		const sudoku = new KillerSudoku(shapes);
		const cell = sudoku.cells[0];
		cell.element = createTd()

		expect(() => cell.setValue(4.5)).toThrow(
			"value must be an integer between 0 and 9"
		);
	});
	it("should throw if given integer outside range type", () => {
		const sudoku = new KillerSudoku(shapes);
		const cell = sudoku.cells[0];
		cell.element = createTd()

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
		cell1.element = createTd()
		cell2.element = createTd()
		cell3.element = createTd()

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
		cell1.element = createTd()
		cell2.element = createTd()
		cell3.element = createTd()

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
		cell1.element = createTd()
		cell2.element = createTd()
		cell3.element = createTd()

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
		cell1.element = createTd()
		cell2.element = createTd()

		cell2.possibleValues.add(8);

		cell1.setValue(8);

		expect(cell2.possibleValues).toEqual(new Set());
	});
	it("should set isValid in case of conflict", () => {
		const sudoku = new KillerSudoku(shapes);
		const cell1 = sudoku.cells[0];
		const cell2 = sudoku.cells[4];
		cell1.element = createTd()
		cell2.element = createTd()
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
		cell1.element = createTd()
		cell2.element = createTd()
		cell1.setValue(5);
		cell2.setValue(5);

		cell1.setValue(6);

		expect(cell1).toHaveProperty("isValid", true);
		expect(cell2).toHaveProperty("isValid", true);
	});
});

describe("render", () => {
	
	it("should set the node empty if there are no possible values or value", () => {
		const sudoku = new KillerSudoku(shapes);
		const cell = sudoku.cells[0];
		cell.element = createTd()
		cell.render();

		const value = cell.element.getElementsByClassName("value")[0]
		const possibleValues = cell.element.getElementsByClassName("possible-values")[0]
		expect(value).toHaveProperty("innerHTML", "")
		expect(possibleValues.hasChildNodes()).toBe(false)
	});
	it("should set the element to the value of the cell if one is present", () => {
		const sudoku = new KillerSudoku(shapes);
		const cell = sudoku.cells[0];
		cell.element = createTd()
		cell.render();

		cell.value = 5;
		cell.render();

		const value = cell.element.getElementsByClassName("value")[0]
		const possibleValues = cell.element.getElementsByClassName("possible-values")[0]
		expect(value).toHaveProperty("innerHTML", "5")
		expect(possibleValues.hasChildNodes()).toBe(false)
	});
	it("should set the element to a list of possible values if no value is present", () => {
		const sudoku = new KillerSudoku(shapes);
		const cell = sudoku.cells[0];
		cell.element = createTd()
		cell.possibleValues.add(1);
		cell.possibleValues.add(6);
		cell.possibleValues.add(9);

		cell.render();

		const value = cell.element.getElementsByClassName("value")[0]
		const possibleValues = cell.element.getElementsByClassName("possible-values")[0]
		expect(value).toHaveProperty("innerHTML", "")

		expect(possibleValues.children).toHaveLength(3)
		expect(possibleValues.children[0]).toHaveProperty("innerHTML", "1")
		expect(possibleValues.children[1]).toHaveProperty("innerHTML", "6")
		expect(possibleValues.children[2]).toHaveProperty("innerHTML", "9")
	});
	it("should set the element to the value if one is present even if there are possible values", () => {
		const sudoku = new KillerSudoku(shapes);
		const cell = sudoku.cells[0];
		cell.element = createTd()
		cell.possibleValues.add(1);
		cell.possibleValues.add(6);
		cell.possibleValues.add(9);
		cell.render();

		cell.value = 5;
		cell.render();

		const value = cell.element.getElementsByClassName("value")[0]
		const possibleValues = cell.element.getElementsByClassName("possible-values")[0]
		expect(value).toHaveProperty("innerHTML", "5")
		expect(possibleValues.hasChildNodes()).toBe(false)
	});
	it("should remove the value if it is set to 0", () => {
		const sudoku = new KillerSudoku(shapes);
		const cell = sudoku.cells[0];
		cell.element = createTd()
		cell.value = 5;
		cell.render();

		cell.value = 0;
		cell.render();

		const value = cell.element.getElementsByClassName("value")[0]
		const possibleValues = cell.element.getElementsByClassName("possible-values")[0]
		expect(value).toHaveProperty("innerHTML", "")
		expect(possibleValues.hasChildNodes()).toBe(false)
	});
	it("should return to possible values if value is set to 0", () => {
		const sudoku = new KillerSudoku(shapes);
		const cell = sudoku.cells[0];
		cell.element = createTd()
		cell.possibleValues.add(1);
		cell.possibleValues.add(7);
		cell.possibleValues.add(4);
		cell.possibleValues.add(2);
		cell.value = 5;
		cell.render();

		cell.value = 0;
		cell.render();

		const value = cell.element.getElementsByClassName("value")[0]
		const possibleValues = cell.element.getElementsByClassName("possible-values")[0]
		expect(value).toHaveProperty("innerHTML", "")
		
		expect(possibleValues.children).toHaveLength(4)
		expect(possibleValues.children[0]).toHaveProperty("innerHTML", "1")
		expect(possibleValues.children[1]).toHaveProperty("innerHTML", "2")
		expect(possibleValues.children[2]).toHaveProperty("innerHTML", "4")
		expect(possibleValues.children[3]).toHaveProperty("innerHTML", "7")
	});
	it("should add class invalid if isValid is set to false", () => {
		const sudoku = new KillerSudoku(shapes);
		const cell = sudoku.cells[0];
		cell.element = createTd()
		cell.value = 4;
		cell.isValid = false;

		cell.render();

		expect(cell.element.classList.contains("invalid")).toBe(true);
	});
	it("should remove class invalid if it is set to true", () => {
		const sudoku = new KillerSudoku(shapes);
		const cell = sudoku.cells[0];
		cell.element = createTd()
		cell.value = 4;
		cell.isValid = false;
		cell.render();

		cell.isValid = true;
		cell.render();

		expect(cell.element.classList.contains("invalid")).toBe(false);
	});
	it("should be run when setIsValid is called", () => {
		const sudoku = new KillerSudoku(shapes);
		const cell1 = sudoku.cells[0];
		const cell2 = sudoku.cells[4];
		cell1.element = createTd()
		cell1.value = 4;
		cell2.element = createTd()
		cell2.value = 4;
		const renderMock = jest.spyOn(Cell.prototype, "render");

		cell1.setIsValid();

		expect(renderMock).toHaveBeenCalled();
	});
	it("should add an extra div element in the list of possible values if there is a sum element", () => {
		const sudoku = new KillerSudoku(shapes)
		const cell = sudoku.cells[0]
		cell.element = document.createElement("td")
		new Shape(5, [cell])
		cell.draw()

		cell.possibleValues.add(1)
		cell.possibleValues.add(2)
		cell.possibleValues.add(3)
		cell.render()

		const possibleValues = cell.element.getElementsByClassName("possible-values")[0]
		expect(possibleValues.children).toHaveLength(4)
		expect(possibleValues.firstElementChild).toHaveProperty("tagName", "DIV")
		expect(possibleValues.firstElementChild).toHaveProperty("innerHTML", "")
	})
});

describe("setPossVal", () => {
	it("should add the value to the possible values list if it is not there", () => {
		const cell = new Cell(0);
		cell.element = createTd();

		cell.setPossVal(1);

		expect(cell.possibleValues).toEqual(new Set([1]));
	});
	it("should remove the value from the possible values if it is already present", () => {
		const cell = new Cell(0);
		cell.element = createTd();
		cell.possibleValues.add(5);

		cell.setPossVal(5);

		expect(cell.possibleValues).toEqual(new Set());
	});
	it("should run render", () => {
		const cell = new Cell(0);
		cell.element = createTd();
		const renderMock = jest.spyOn(Cell.prototype, "render");

		cell.setPossVal(4);

		expect(renderMock).toHaveBeenCalled();
	});
});

describe("drawCell", () => {
	it("should add a div element directly inside because firefox is a pissy bitch that doesn't like a td having position: relative for some ungodly reason", () => {
		const cell = new Cell(0);
		cell.element = document.createElement("td");
		new Shape(5, [cell]);

		cell.draw();

		expect(cell.element.childElementCount).toBe(1);
		expect(cell.element.firstElementChild).not.toBeNull();
		expect(cell.element.firstElementChild!.tagName).toBe("DIV");
	});
	it("should have a div which holds the div with walls", () => {
		const cell = new Cell(0);
		cell.element = document.createElement("td");
		new Shape(5, [cell]);

		cell.draw();
		const div = cell.element.firstElementChild!;
		const wallsHolder = div.children[1];

		expect(wallsHolder).not.toBeNull();
		expect(wallsHolder!.tagName).toBe("DIV");
		expect(wallsHolder!.classList.contains("walls-holder")).toBe(true);
	});
	it("should have the div with walls", () => {
		const cell = new Cell(0);
		cell.element = document.createElement("td")
		new Shape(5, [cell]);

		cell.draw();
		const div = cell.element.firstElementChild!;
		const wallsHolder = div.children[1];
		const walls = wallsHolder.firstElementChild;
		expect(walls).not.toBe(null);
		expect(walls!.tagName).toBe("DIV");
		expect(walls!.classList.contains("walls")).toBe(true);
	});
	it("should add classes to walls depending on if the cell has those walls", () => {
		const cell = new Cell(0);
		cell.element = document.createElement("td");
		new Shape(5, [cell]);
		cell.walls = [true, false, false, true];

		cell.draw();
		const walls = cell.element.getElementsByClassName("walls")[0]

		expect(walls.classList.contains("walls-top")).toBe(true);
		expect(walls.classList.contains("walls-right")).toBe(false);
		expect(walls.classList.contains("walls-bottom")).toBe(false);
		expect(walls.classList.contains("walls-left")).toBe(true);

		const cell2 = new Cell(1);
		cell2.element = document.createElement("td");
		new Shape(5, [cell2]);
		cell2.walls = [false, true, true, true];

		cell2.draw();
		const walls2 = cell2.element.getElementsByClassName("walls")[0]

		expect(walls2.classList.contains("walls-top")).toBe(false);
		expect(walls2.classList.contains("walls-right")).toBe(true);
		expect(walls2.classList.contains("walls-bottom")).toBe(true);
		expect(walls2.classList.contains("walls-left")).toBe(true);
	});
	it("should create a list element for possible values", () => {
		const cell = new Cell(0);
		cell.element = document.createElement("td");
		new Shape(5, [cell]);
		cell.findWalls();

		cell.draw();
		const list = cell.element.firstElementChild!.children[3];

		expect(list).not.toBeUndefined();
		expect(list!.tagName).toBe("OL");
		expect(list!.classList.contains("possible-values")).toBe(true);
	});
	it("should add a sum element if the cell is the top left of the shape", () => {
		const cell = new Cell(0);
		cell.element = document.createElement("td");
		new Shape(17, [cell, new Cell(1), new Cell(9)]);
		cell.findWalls();

		cell.draw();

		const label = cell.element.firstElementChild!.children[3];

		expect(label).not.toBeUndefined();
		expect(label!.tagName).toBe("LABEL");
		expect(label!.classList.contains("sum")).toBe(true);
	});
	it("should set the sum inner text to the sum of the shape", () => {
		const cell = new Cell(0);
		cell.element = document.createElement("td");
		new Shape(17, [cell, new Cell(1), new Cell(9)]);
		cell.findWalls();

		cell.draw();

		const label = cell.element.firstElementChild!.children[3]
		expect(label.textContent).toBe("17");
	});
	it("should not have a label element if the cell is not the top left cell of the shape", () => {
		const cell = new Cell(9);
		cell.element = document.createElement("td");
		new Shape(20, [cell, new Cell(0), new Cell(1)]);

		cell.draw();
		const div = cell.element.firstElementChild!;

		Array.from(div.children).forEach((child) => {
			expect(child.tagName).not.toBe("LABEL");
		});
	});
	it("should add corners when there are two adjacent walls and no cell opposite", () => {
		const cells = [new Cell(0), new Cell(1), new Cell(10), new Cell(9)];
		new Shape(20, [cells[0], new Cell(1), new Cell(9)]);
		new Shape(20, [cells[1], new Cell(0), new Cell(10)]);
		new Shape(20, [cells[2], new Cell(1), new Cell(9)]);
		new Shape(20, [cells[3], new Cell(10), new Cell(0)]);

		cells.forEach((cell) => {
			cell.element = document.createElement("td");
			cell.findWalls();
			cell.draw();
		});

		const corners = cells.map(
			(cell) => cell.element.firstElementChild!.children[2]
		);
		const expectedCorners = [
			["bottom", "right"],
			["bottom", "left"],
			["top", "left"],
			["top", "right"],
		];

		corners.forEach((corner, i) => {
			expect(corner).not.toBeUndefined();
			expect(corner.tagName).toBe("DIV");
			expect(corner.classList.contains("corner")).toBe(true);
			const dirs = ["left", "bottom", "top", "right"];
			dirs.forEach((dir) => {
				expect(corner.classList.contains(`corner-${dir}`)).toBe(
					expectedCorners[i].includes(dir)
				);
			});
		});
	});
	it("should not add a corner if there cell does not have two adjacent sides", () => {
		const cells = [
			new Cell(0),
			new Cell(1),
			new Cell(9),
			new Cell(18),
			new Cell(27),
			new Cell(2),
			new Cell(3),
		];
		new Shape(5, [cells[0]]); // four walls
		new Shape(10, [new Cell(0), cells[1], new Cell(2)]); // top and bottom walls
		new Shape(10, [new Cell(0), cells[2], new Cell(18)]); // l and r walls
		new Shape(16, [cells[3], cells[4]]); // 3 walls
		new Shape(16, [cells[5], cells[6]]); // 3 walls
		cells.forEach((cell) => {
			cell.element = document.createElement("td");
			cell.findWalls();
			cell.draw();

			const children = [...cell.element.firstElementChild!.children];
			children.forEach((element) => {
				expect(element.classList.contains("corner")).toBe(false);
			});
		});
	});
	it("should not add a corner if there are two adjacent walls but the opposite cell is part of the same shape", () => {
		const cells = [new Cell(0), new Cell(1), new Cell(9), new Cell(10)];
		new Shape(20, cells);
		cells.forEach((cell) => {
			cell.element = document.createElement("td");
			cell.findWalls();
			cell.draw();

			const children = [...cell.element.firstElementChild!.children];
			children.forEach((element) => {
				expect(element.classList.contains("corner")).toBe(false);
			});
		});
	});
});
