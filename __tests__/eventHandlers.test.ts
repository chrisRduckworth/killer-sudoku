import { handleCellClick } from "../src/eventHandlers";
import KillerSudoku from "../src/KillerSudoku";
import shapes from "./shapes";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

describe("handleCellClick", () => {
	it("should set the currCell property to the clicked cell", async () => {
		const user = userEvent.setup();

		const sudoku = new KillerSudoku(shapes);
		const td = document.createElement("td");
		sudoku.cells[5].element = td;
		td.addEventListener("click", (e) => {
			handleCellClick(e, sudoku, 5);
		});

		await user.click(td);

		expect(sudoku.currCell).toHaveProperty("position", 5);
	});
	it("should add the selected-value class to the clicked cell", async () => {
		const user = userEvent.setup();

		const sudoku = new KillerSudoku(shapes);
		const td = document.createElement("td");
		sudoku.cells[5].element = td;
		td.addEventListener("click", (e) => {
			handleCellClick(e, sudoku, 5);
		});

		await user.click(td);

		expect(td).toHaveClass("selected-value");
	});
	it("moving from one cell to the next should remove class from old cell", async () => {
		const user = userEvent.setup();

		const sudoku = new KillerSudoku(shapes);
		const td1 = document.createElement("td");
		const td2 = document.createElement("td");
		sudoku.cells[5].element = td1;
		sudoku.cells[45].element = td2;
		td1.addEventListener("click", (e) => {
			handleCellClick(e, sudoku, 5);
		});
		td2.addEventListener("click", (e) => {
			handleCellClick(e, sudoku, 45);
		});

		await user.click(td1);
		await user.click(td2);

		expect(sudoku.currCell).toHaveProperty("position", 45);
		expect(td2).toHaveClass("selected-value");
		expect(td1).not.toHaveClass("selected-value");
	});
	it("clicking on the same cell should set notes to true", async () => {
		const user = userEvent.setup();

		const sudoku = new KillerSudoku(shapes);
		const td = document.createElement("td");
		sudoku.cells[5].element = td;
		td.addEventListener("click", (e) => {
			handleCellClick(e, sudoku, 5);
		});

		await user.click(td);
		await user.click(td);

		expect(sudoku).toHaveProperty("notes", true);
	});
	it("clicking on same cell should remove selected-value and add selected-notes", async () => {
		const user = userEvent.setup();

		const sudoku = new KillerSudoku(shapes);
		const td = document.createElement("td");
		sudoku.cells[5].element = td;
		td.addEventListener("click", (e) => {
			handleCellClick(e, sudoku, 5);
		});

		await user.click(td);
		await user.click(td);

		expect(td).not.toHaveClass("selected-value");
		expect(td).toHaveClass("selected-notes");
	});
	it("clicking on same cell again agains should set notes to false and remove selected-notes and add selected-value", async () => {
		const user = userEvent.setup();

		const sudoku = new KillerSudoku(shapes);
		const td = document.createElement("td");
		sudoku.cells[5].element = td;
		td.addEventListener("click", (e) => {
			handleCellClick(e, sudoku, 5);
		});

		await user.click(td);
		await user.click(td);
		await user.click(td);

		expect(sudoku).toHaveProperty("notes", false);
		expect(td).toHaveClass("selected-value");
		expect(td).not.toHaveClass("selected-notes");
	});
	it("clicking on another cell when notes is true should do change the current cell and switch the classes", async () => {
		const user = userEvent.setup();

		const sudoku = new KillerSudoku(shapes);
		const td1 = document.createElement("td");
		const td2 = document.createElement("td");
		sudoku.cells[5].element = td1;
		sudoku.cells[45].element = td2;
		td1.addEventListener("click", (e) => {
			handleCellClick(e, sudoku, 5);
		});
		td2.addEventListener("click", (e) => {
			handleCellClick(e, sudoku, 45);
		});

		await user.click(td1);
		await user.click(td1);
		await user.click(td2);

		expect(sudoku.currCell).toHaveProperty("position", 45);
		expect(td2).toHaveClass("selected-notes");
		expect(td1).not.toHaveClass("selected-notes");
	});
});
