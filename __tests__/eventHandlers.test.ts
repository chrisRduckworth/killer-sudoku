import {
	handleCellClick,
	handleKeypress,
	handleNumberButtonPress,
} from "../src/eventHandlers";
import KillerSudoku from "../src/KillerSudoku";
import shapes from "./shapes";
import "@testing-library/jest-dom";
import userEvent, { UserEvent } from "@testing-library/user-event";

let sudoku = new KillerSudoku(shapes);
let user: UserEvent;

beforeEach(() => {
	// add table and cells
	const table = document.createElement("table");
	table.classList.add("values");
	table.appendChild(document.createElement("tbody"));
	for (let i = 0; i < 9; i++) {
		const row = document.createElement("tr");
		for (let j = 0; j < 9; j++) {
			const td = document.createElement("td");
			const value = document.createElement("div");
			value.classList.add("value");
			const poss = document.createElement("div");
			poss.classList.add("possible-values");
			td.appendChild(value);
			td.appendChild(poss);
			td.tabIndex = 0;
			sudoku.cells[9 * i + j].element = td;
			td.addEventListener("mousedown", (e) => {
				handleCellClick(e, sudoku);
			});
			row.appendChild(td);
		}
		table.firstElementChild!.appendChild(row);
	}

	document.body.replaceChildren(table);

	document.body.addEventListener("keydown", (e) => {
		handleKeypress(e, sudoku);
	});

	// add buttons
	for (let i = 0; i < 9; i++) {
		const button = document.createElement("button");
		button.classList.add("number-button");
		button.addEventListener("click", (_e) => {
			handleNumberButtonPress(i + 1, sudoku);
		});
	}

	user = userEvent.setup();
});

afterEach(() => {
	sudoku = new KillerSudoku(shapes);
	document.getElementsByTagName("html")[0].innerHTML = "";
});

describe("handleCellClick", () => {
	it("clicking on the same cell should set notes to true", async () => {
		await user.click(sudoku.cells[5].element);
		await user.click(sudoku.cells[5].element);

		expect(sudoku).toHaveProperty("notes", true);
	});
	it("clicking on the same cell should set notes to false if already true", async () => {
		await user.click(sudoku.cells[5].element);
		await user.click(sudoku.cells[5].element);
		await user.click(sudoku.cells[5].element);

		expect(sudoku).toHaveProperty("notes", false);
	});
	it("clicking on another cell should not change notes value", async () => {
		await user.click(sudoku.cells[5].element);
		await user.click(sudoku.cells[5].element);

		await user.click(sudoku.cells[20].element);
		expect(sudoku).toHaveProperty("notes", true);
		await user.click(sudoku.cells[20].element);

		await user.click(sudoku.cells[5].element);
		expect(sudoku).toHaveProperty("notes", false);
	});
	it("clicking on the same cell should add the notes class to the table", async () => {
		const table = document.getElementsByTagName("table")[0];

		expect(table).toHaveClass("values");
		expect(table).not.toHaveClass("notes");

		await user.click(sudoku.cells[5].element);
		await user.click(sudoku.cells[5].element);

		expect(table).toHaveClass("notes");
		expect(table).not.toHaveClass("values");
	});
	it("clicking on the cell once in notes should change to the values class", async () => {
		const table = document.getElementsByTagName("table")[0];

		await user.click(sudoku.cells[5].element);
		await user.click(sudoku.cells[5].element);
		await user.click(sudoku.cells[5].element);

		expect(table).toHaveClass("values");
		expect(table).not.toHaveClass("notes");
	});
	it("clicking on a different cell should not change the notes/values classes", async () => {
		const table = document.getElementsByTagName("table")[0];

		await user.click(sudoku.cells[1].element);
		await user.click(sudoku.cells[5].element);
		expect(table).toHaveClass("values");
		await user.click(sudoku.cells[5].element);
		await user.click(sudoku.cells[2].element);
		expect(table).toHaveClass("notes");
	});
});

describe("handleKeypress", () => {
	describe("Enter key", () => {
		it("should change the value of notes", async () => {
			await user.tab();

			await user.keyboard("{enter}");
			expect(sudoku).toHaveProperty("notes", true);
			await user.keyboard("{enter}");
			expect(sudoku).toHaveProperty("notes", false);
		});
		it("should change the class of table to notes", async () => {
			const table = document.getElementsByTagName("table")[0];
			await user.tab();

			await user.keyboard("{enter}");

			expect(table).toHaveClass("notes");
			expect(table).not.toHaveClass("values");
		});
		it("should change the class of table back to values", async () => {
			const table = document.getElementsByTagName("table")[0];
			await user.tab();

			await user.keyboard("{enter}");
			await user.keyboard("{enter}");

			expect(table).toHaveClass("values");
			expect(table).not.toHaveClass("notes");
		});
		it("should not change notes or classes if the table is not focused on", async () => {
			const table = document.getElementsByTagName("table")[0];

			await user.keyboard("{enter}");
			expect(table).toHaveClass("values");
			expect(table).not.toHaveClass("notes");
			expect(sudoku).toHaveProperty("notes", false);
		});
	});
	describe("arrow keys", () => {
		it("up arrow should move focus to the cell above", async () => {
			sudoku.cells[21].element.focus();

			await user.keyboard("{ArrowUp}");

			const focusedElement = sudoku.cells.find(
				(c) => c.element === document.activeElement
			);

			expect(focusedElement).toHaveProperty("position", 12);
		});
		it("up arrow should not change focus if focused cell is on top row", async () => {
			sudoku.cells[5].element.focus();

			await user.keyboard("{ArrowUp}");

			const focusedElement = sudoku.cells.find(
				(c) => c.element === document.activeElement
			);

			expect(focusedElement).toHaveProperty("position", 5);
		});
		it("down arrow should move focus to the cell below", async () => {
			sudoku.cells[34].element.focus();

			await user.keyboard("{ArrowDown}");

			const focusedElement = sudoku.cells.find(
				(c) => c.element === document.activeElement
			);

			expect(focusedElement).toHaveProperty("position", 43);
		});
		it("down arrow should not change focus if focused cell is on bottom row", async () => {
			sudoku.cells[77].element.focus();

			await user.keyboard("{ArrowDown}");

			const focusedElement = sudoku.cells.find(
				(c) => c.element === document.activeElement
			);

			expect(focusedElement).toHaveProperty("position", 77);
		});
		it("right arrow should move focus to the cell right", async () => {
			sudoku.cells[14].element.focus();

			await user.keyboard("{ArrowRight}");

			const focusedElement = sudoku.cells.find(
				(c) => c.element === document.activeElement
			);

			expect(focusedElement).toHaveProperty("position", 15);
		});
		it("right arrow should not change focus if focused cell is on right column", async () => {
			sudoku.cells[53].element.focus();

			await user.keyboard("{ArrowRight}");

			const focusedElement = sudoku.cells.find(
				(c) => c.element === document.activeElement
			);

			expect(focusedElement).toHaveProperty("position", 53);
		});
		it("left arrow should move focus to the cell left", async () => {
			sudoku.cells[60].element.focus();

			await user.keyboard("{ArrowLeft}");

			const focusedElement = sudoku.cells.find(
				(c) => c.element === document.activeElement
			);

			expect(focusedElement).toHaveProperty("position", 59);
		});
		it("left arrow should not change focus if focused cell is on left column", async () => {
			sudoku.cells[45].element.focus();

			await user.keyboard("{ArrowLeft}");

			const focusedElement = sudoku.cells.find(
				(c) => c.element === document.activeElement
			);

			expect(focusedElement).toHaveProperty("position", 45);
		});
		it("should not change focus if the table is not focused on", async () => {
			document.body.focus();

			await user.keyboard("{ArrowLeft}");

			expect(document.activeElement).toHaveProperty("tagName", "BODY");

			await user.keyboard("{ArrowRight}");

			expect(document.activeElement).toHaveProperty("tagName", "BODY");

			await user.keyboard("{ArrowUp}");

			expect(document.activeElement).toHaveProperty("tagName", "BODY");

			await user.keyboard("{ArrowDown}");

			expect(document.activeElement).toHaveProperty("tagName", "BODY");
		});
	});
	describe("number keys", () => {
		it("should not change anything if the table is not focused on", async () => {
			document.body.focus();

			for (let i = 1; i < 10; i++) {
				await user.keyboard(`${i}`);
				expect(sudoku.cells.every((c) => c.value === 0)).toBe(true);
			}
		}),
			it("should set the value if a number key is pressed", async () => {
				const cell = sudoku.cells[0];
				cell.element.focus();

				for (let i = 1; i < 10; i++) {
					await user.keyboard(`${i}`);
					expect(cell.value).toBe(i);
				}
			});
		it("should unset the value if they key pressed is equal to the value", async () => {
			const cell = sudoku.cells[54];
			cell.element.focus();

			for (let i = 1; i < 10; i++) {
				await user.keyboard(`${i}`);
				await user.keyboard(`${i}`);
				expect(cell.value).toBe(0);
			}
		});
		it("should add the value to possible values if notes is true", async () => {
			sudoku.notes = true;
			const cell = sudoku.cells[33];
			cell.element.focus();

			for (let i = 1; i < 10; i++) {
				await user.keyboard(`${i}`);
				expect(cell.possibleValues.has(i)).toBe(true);
			}
		});
		it("should remove the value from possible values if notes is true", async () => {
			sudoku.notes = true;
			const cell = sudoku.cells[12];
			cell.element.focus();

			for (let i = 1; i < 10; i++) {
				await user.keyboard(`${i}`);
				await user.keyboard(`${i}`);
				expect(cell.possibleValues.has(i)).toBe(false);
			}
		});
		it("should not change possible values when in notes and there is a value", async () => {
			const cell = sudoku.cells[12];
			cell.setValue(4);
			sudoku.notes = true;
			cell.element.focus();

			await user.keyboard("5");
			expect(cell.possibleValues.has(5)).toBe(false);

			cell.setPossVal(5);
			await user.keyboard("5");
			expect(cell.possibleValues.has(5)).toBe(true);
		});
	});
	describe("backspace/delete", () => {
		it("should do nothing if a cell is not focused", async () => {
			document.body.focus();
			sudoku.cells[45].setValue(5);

			await user.keyboard("{Backspace}");
			expect(sudoku.cells[45].value).toBe(5);

			await user.keyboard("{Delete}");
			expect(sudoku.cells[45].value).toBe(5);
		});
		it("should set the value to 0 if there is a value in the cell", async () => {
			const cell = sudoku.cells[5];
			cell.setValue(6);
			cell.element.focus();

			await user.keyboard("{Backspace}");
			expect(cell).toHaveProperty("value", 0);

			cell.setValue(3);
			await user.keyboard("{Delete}");
			expect(cell).toHaveProperty("value", 0);
		});
		it("should do nothing if in notes mode", async () => {
			const cell = sudoku.cells[16];
			cell.setValue(3);
			cell.element.focus();
			sudoku.notes = true;

			await user.keyboard("{Backspace}");
			expect(cell).toHaveProperty("value", 3);

			await user.keyboard("{Delete}");
			expect(cell).toHaveProperty("value", 3);
		});
		it("should not change the value if it is already 0", async () => {
			const cell = sudoku.cells[26];
			cell.element.focus();

			await user.keyboard("{Backspace}");
			expect(cell).toHaveProperty("value", 0);

			await user.keyboard("{Delete}");
			expect(cell).toHaveProperty("value", 0);
		});
	});
});
