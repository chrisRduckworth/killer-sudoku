import type KillerSudoku from "./KillerSudoku";

function handleCellClick(_e: MouseEvent, sudoku: KillerSudoku, pos: number) {
	const oldCell = sudoku.currCell;
	const newCell = sudoku.cells[pos];

	// for when we click on the same cell
	if (oldCell && oldCell.position === newCell.position) {
		sudoku.notes = !sudoku.notes;
		const table = newCell.element.parentElement!.parentElement!.parentElement!;
		table.classList.add(sudoku.notes ? "notes" : "values");
		table.classList.remove(sudoku.notes ? "values" : "notes");
	}

	sudoku.currCell = newCell;
	return;
}

function handleKeydown() {}

export { handleCellClick, handleKeydown };
