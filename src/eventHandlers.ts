import type KillerSudoku from "./KillerSudoku";

function handleCellClick(_e: MouseEvent, sudoku: KillerSudoku, pos: number) {
	const oldCell = sudoku.currCell;
	const newCell = sudoku.cells[pos];

	// for when we click on the same cell
	if (oldCell && oldCell.position === newCell.position) {
		sudoku.notes = !sudoku.notes;
		if (sudoku.notes) {
			oldCell.element.classList.remove("selected-value");
			oldCell.element.classList.add("selected-notes");
		} else {
			oldCell.element.classList.remove("selected-notes");
			oldCell.element.classList.add("selected-value");
		}
		return;
	}

	const className = sudoku.notes ? "selected-notes" : "selected-value";
	if (oldCell !== undefined) {
		oldCell.element.classList.remove(className);
	}
	sudoku.currCell = newCell;
	newCell.element.classList.add(className);
	return;
}

function handleKeydown() {}

export { handleCellClick, handleKeydown };
