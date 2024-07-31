import type KillerSudoku from "./KillerSudoku";

function handleCellClick(e: MouseEvent, sudoku: KillerSudoku) {
	// this is a mousedown event so that it fires before focus
	if (e.target === document.activeElement) {
		// i.e. if we've clicked on a cell already focused on
		// so we want to switch from notes to values or vice versa
		sudoku.notes = !sudoku.notes;
		const cell = sudoku.cells.find(
			(c) => (e.target as HTMLTableCellElement) === c.element
		);
		if (!cell) {
			throw new Error(
				"Somehow this listener got put on a cell outside the sudoku"
			);
		}
		const table = cell.element.parentElement!.parentElement!.parentElement!;
		table.classList.add(sudoku.notes ? "notes" : "values");
		table.classList.remove(sudoku.notes ? "values" : "notes");
	}
}

function handleKeypress(e: KeyboardEvent, sudoku: KillerSudoku) {
  if (document.activeElement!.tagName !== "TD") {
    return
  }
	const table =
		sudoku.cells[0].element.parentElement!.parentElement!.parentElement!;
	if (e.key === "Enter") {
		sudoku.notes = !sudoku.notes;
		table.classList.add(sudoku.notes ? "notes" : "values");
		table.classList.remove(sudoku.notes ? "values" : "notes");
	}
}

export { handleCellClick, handleKeypress };
