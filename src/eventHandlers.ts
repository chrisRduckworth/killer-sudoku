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
	const table =
		sudoku.cells[0].element.parentElement!.parentElement!.parentElement!;
	const cell = sudoku.cells.find((c) => c.element === document.activeElement);

	if (!cell) {
		// the document is focused on an element outside the sudoku
		return;
	}

	// on enter, swap from notes to values or vice versa
	if (e.key === "Enter") {
		sudoku.notes = !sudoku.notes;
		table.classList.add(sudoku.notes ? "notes" : "values");
		table.classList.remove(sudoku.notes ? "values" : "notes");
		return;
	}

	// on arrow key, move focus as appropriate
	if (e.key === "ArrowUp") {
		if (cell.position > 8) {
			// cell is not in top row
			const newPosition = cell.position - 9;
			sudoku.cells[newPosition].element.focus();
		}
		return;
	}

	if (e.key === "ArrowDown") {
		if (cell.position < 72) {
			const newPosition = cell.position + 9;
			sudoku.cells[newPosition].element.focus();
		}
		return;
	}

	if (e.key === "ArrowRight") {
		if (cell.position % 9 < 8) {
			const newPosition = cell.position + 1;
			sudoku.cells[newPosition].element.focus();
		}
		return;
	}

	if (e.key === "ArrowLeft") {
		if (cell.position % 9 > 0) {
			const newPosition = cell.position - 1;
			sudoku.cells[newPosition].element.focus();
		}
		return;
	}
}

export { handleCellClick, handleKeypress };
