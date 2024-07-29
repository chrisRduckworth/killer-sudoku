import { handleCellClick } from "../src/eventHandlers";
import KillerSudoku from "../src/KillerSudoku";
import shapes from "./shapes";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

function setupTable() {
  const sudoku = new KillerSudoku(shapes)
  const table = document.createElement("table")
  table.classList.add("values")
  table.appendChild(document.createElement("tbody"))
  for (let i = 0; i < 9; i++) {
    const row = document.createElement("tr")
    for (let j = 0; j < 9; j++) {
      const td = document.createElement("td")
      sudoku.cells[9 * i + j].element = td
      td.addEventListener("click", (e) => {
        handleCellClick(e, sudoku, 9 * i + j)
      })
      row.appendChild(td)
    }
    table.firstElementChild!.appendChild(row)
  }

  return sudoku
}

describe("handleCellClick", () => {
	it("should set the currCell property to the clicked cell", async () => {
		const user = userEvent.setup();
		const sudoku = setupTable()
    
		await user.click(sudoku.cells[5].element);

		expect(sudoku.currCell).toHaveProperty("position", 5);
	});
	it("clicking on the same cell should set notes to true", async () => {
		const user = userEvent.setup();
		const sudoku = setupTable()

		await user.click(sudoku.cells[5].element);
		await user.click(sudoku.cells[5].element);

		expect(sudoku).toHaveProperty("notes", true);
	});
  it("clicking on the same cell should set notes to false if already true", async () => {
		const user = userEvent.setup();
		const sudoku = setupTable()

		await user.click(sudoku.cells[5].element);
		await user.click(sudoku.cells[5].element);
		await user.click(sudoku.cells[5].element);
    
    expect(sudoku).toHaveProperty("notes", false)
  })
  it("clicking on another cell should not change notes value", async () => {
		const user = userEvent.setup();
		const sudoku = setupTable()

    await user.click(sudoku.cells[5].element)
    await user.click(sudoku.cells[5].element)

    await user.click(sudoku.cells[20].element)
    expect(sudoku).toHaveProperty("notes", true)
    await user.click(sudoku.cells[20].element)

    await user.click(sudoku.cells[5].element)
    expect(sudoku).toHaveProperty("notes", false)
  })
  it("clicking on the same cell should add the notes class to the table", async () => {
    const user = userEvent.setup()
		const sudoku = setupTable()
    const table = sudoku.cells[0].element.parentElement!.parentElement!.parentElement!

    expect(table).toHaveClass("values")
    expect(table).not.toHaveClass("notes")

    await user.click(sudoku.cells[5].element)
    await user.click(sudoku.cells[5].element)

    expect(table).toHaveClass("notes")
    expect(table).not.toHaveClass("values")
  })
  it("clicking on the cell once in notes should change to the values class", async () => {
    const user = userEvent.setup()
		const sudoku = setupTable()
    const table = sudoku.cells[0].element.parentElement!.parentElement!.parentElement!

    await user.click(sudoku.cells[5].element)
    await user.click(sudoku.cells[5].element)
    await user.click(sudoku.cells[5].element)

    expect(table).toHaveClass("values")
    expect(table).not.toHaveClass("notes")
  })
  it("clicking on a different cell should not change the notes/values classes", async () => {
    const user = userEvent.setup()
		const sudoku = setupTable()
    const table = sudoku.cells[0].element.parentElement!.parentElement!.parentElement!

    await user.click(sudoku.cells[1].element)
    await user.click(sudoku.cells[5].element)
    expect(table).toHaveClass("values")
    await user.click(sudoku.cells[5].element)
    await user.click(sudoku.cells[2].element)
    expect(table).toHaveClass("notes")
  })
});
