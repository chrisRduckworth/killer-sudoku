import { handleCellClick, handleKeypress } from "../src/eventHandlers";
import KillerSudoku from "../src/KillerSudoku";
import shapes from "./shapes";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

function setupTable() {
	const sudoku = new KillerSudoku(shapes);
	const table = document.createElement("table");
	table.classList.add("values");
	table.appendChild(document.createElement("tbody"));
	for (let i = 0; i < 9; i++) {
		const row = document.createElement("tr");
		for (let j = 0; j < 9; j++) {
			const td = document.createElement("td");
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

	return sudoku;
}

describe("handleCellClick", () => {
	it("clicking on the same cell should set notes to true", async () => {
		const user = userEvent.setup();
		const sudoku = setupTable();

		await user.click(sudoku.cells[5].element);
		await user.click(sudoku.cells[5].element);

		expect(sudoku).toHaveProperty("notes", true);
	});
	it("clicking on the same cell should set notes to false if already true", async () => {
		const user = userEvent.setup();
		const sudoku = setupTable();

		await user.click(sudoku.cells[5].element);
		await user.click(sudoku.cells[5].element);
		await user.click(sudoku.cells[5].element);

		expect(sudoku).toHaveProperty("notes", false);
	});
	it("clicking on another cell should not change notes value", async () => {
		const user = userEvent.setup();
		const sudoku = setupTable();

		await user.click(sudoku.cells[5].element);
		await user.click(sudoku.cells[5].element);

		await user.click(sudoku.cells[20].element);
		expect(sudoku).toHaveProperty("notes", true);
		await user.click(sudoku.cells[20].element);

		await user.click(sudoku.cells[5].element);
		expect(sudoku).toHaveProperty("notes", false);
	});
	it("clicking on the same cell should add the notes class to the table", async () => {
		const user = userEvent.setup();
		const sudoku = setupTable();
		const table =
			sudoku.cells[0].element.parentElement!.parentElement!
				.parentElement!;

		expect(table).toHaveClass("values");
		expect(table).not.toHaveClass("notes");

		await user.click(sudoku.cells[5].element);
		await user.click(sudoku.cells[5].element);

		expect(table).toHaveClass("notes");
		expect(table).not.toHaveClass("values");
	});
	it("clicking on the cell once in notes should change to the values class", async () => {
		const user = userEvent.setup();
		const sudoku = setupTable();
		const table =
			sudoku.cells[0].element.parentElement!.parentElement!
				.parentElement!;

		await user.click(sudoku.cells[5].element);
		await user.click(sudoku.cells[5].element);
		await user.click(sudoku.cells[5].element);

		expect(table).toHaveClass("values");
		expect(table).not.toHaveClass("notes");
	});
	it("clicking on a different cell should not change the notes/values classes", async () => {
		const user = userEvent.setup();
		const sudoku = setupTable();
		const table =
			sudoku.cells[0].element.parentElement!.parentElement!
				.parentElement!;

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
			const user = userEvent.setup();
			const sudoku = setupTable();
			await user.tab();

			await user.keyboard("{enter}");
			expect(sudoku).toHaveProperty("notes", true);
			await user.keyboard("{enter}");
			expect(sudoku).toHaveProperty("notes", false);
		});
		it("should change the class of table to notes", async () => {
			const user = userEvent.setup();
			const sudoku = setupTable();
			const table =
				sudoku.cells[0].element.parentElement!.parentElement!
					.parentElement!;
			await user.tab();

			await user.keyboard("{enter}");

			expect(table).toHaveClass("notes");
			expect(table).not.toHaveClass("values");
		});
		it("should change the class of table back to values", async () => {
			const user = userEvent.setup();
			const sudoku = setupTable();
			const table =
				sudoku.cells[0].element.parentElement!.parentElement!
					.parentElement!;
			await user.tab();

			await user.keyboard("{enter}");
			await user.keyboard("{enter}");

			expect(table).toHaveClass("values");
			expect(table).not.toHaveClass("notes");
		});
		it("should not change notes or classes if the table is not focused on", async () => {
			const user = userEvent.setup();
			const sudoku = setupTable();
			const table =
				sudoku.cells[0].element.parentElement!.parentElement!
					.parentElement!;

			await user.keyboard("{enter}");
			expect(table).toHaveClass("values");
			expect(table).not.toHaveClass("notes");
			expect(sudoku).toHaveProperty("notes", false);
		});
	});
	describe("arrow keys", () => {
		it("up arrow should move focus to the cell above", async () => {
			const user = userEvent.setup();
			const sudoku = setupTable();
			sudoku.cells[21].element.focus();

			await user.keyboard("{ArrowUp}");

			const focusedElement = sudoku.cells.find(
				(c) => c.element === document.activeElement
			);

			expect(focusedElement).toHaveProperty("position", 12);
		});
		it("up arrow should not change focus if focused cell is on top row", async () => {
			const user = userEvent.setup();
			const sudoku = setupTable();
			sudoku.cells[5].element.focus();

			await user.keyboard("{ArrowUp}");

			const focusedElement = sudoku.cells.find(
				(c) => c.element === document.activeElement
			);

			expect(focusedElement).toHaveProperty("position", 5);
		});
		it("down arrow should move focus to the cell below", async () => {
			const user = userEvent.setup();
			const sudoku = setupTable();
			sudoku.cells[34].element.focus();

			await user.keyboard("{ArrowDown}");

			const focusedElement = sudoku.cells.find(
				(c) => c.element === document.activeElement
			);

			expect(focusedElement).toHaveProperty("position", 43);
		});
		it("down arrow should not change focus if focused cell is on bottom row", async () => {
			const user = userEvent.setup();
			const sudoku = setupTable();
			sudoku.cells[77].element.focus();

			await user.keyboard("{ArrowDown}");

			const focusedElement = sudoku.cells.find(
				(c) => c.element === document.activeElement
			);

			expect(focusedElement).toHaveProperty("position", 77);
		});
		it("right arrow should move focus to the cell right", async () => {
			const user = userEvent.setup();
			const sudoku = setupTable();
			sudoku.cells[14].element.focus();

			await user.keyboard("{ArrowRight}");

			const focusedElement = sudoku.cells.find(
				(c) => c.element === document.activeElement
			);

			expect(focusedElement).toHaveProperty("position", 15);
		});
		it("right arrow should not change focus if focused cell is on right column", async () => {
			const user = userEvent.setup();
			const sudoku = setupTable();
			sudoku.cells[53].element.focus();

			await user.keyboard("{ArrowRight}");

			const focusedElement = sudoku.cells.find(
				(c) => c.element === document.activeElement
			);

			expect(focusedElement).toHaveProperty("position", 53);
		});
		it("left arrow should move focus to the cell left", async () => {
			const user = userEvent.setup();
			const sudoku = setupTable();
			sudoku.cells[60].element.focus();

			await user.keyboard("{ArrowLeft}");

			const focusedElement = sudoku.cells.find(
				(c) => c.element === document.activeElement
			);

			expect(focusedElement).toHaveProperty("position", 59);
		});
		it("left arrow should not change focus if focused cell is on left column", async () => {
			const user = userEvent.setup();
			const sudoku = setupTable();
			sudoku.cells[45].element.focus();

			await user.keyboard("{ArrowLeft}");

			const focusedElement = sudoku.cells.find(
				(c) => c.element === document.activeElement
			);

			expect(focusedElement).toHaveProperty("position", 45);
		});
		it("should not change focus if the table is not focused on", async () => {
			const user = userEvent.setup();
			setupTable();
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
	});
});
