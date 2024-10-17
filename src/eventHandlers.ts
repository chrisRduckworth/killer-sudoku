import type KillerSudoku from "./KillerSudoku";

function handleCellClick(e: MouseEvent, sudoku: KillerSudoku) {
	// this is a mousedown event so that it fires before focus

	// e.target can be the table data element or any child, so we must find
	// check if it is in that list of elements
	let sameCellTargets: Element[] = [];
	if (document.activeElement && document.activeElement.tagName === "TD") {
		sameCellTargets = [
			...document.activeElement.getElementsByTagName("*"),
			document.activeElement,
		];
	}
	const match = sameCellTargets.find((el) => el === e.target);

	if (match) {
		// i.e. if we've clicked on a cell already focused on

		// find the table data element holding e.target
		let td: Element = match;
		while (td.tagName !== "TD") {
			td = td.parentElement as Element;
		}

		// we want to switch from notes to values or vice versa
		sudoku.notes = !sudoku.notes;
		const cell = sudoku.cells.find(
			(c) => (td as HTMLTableCellElement) === c.element
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

	switch (e.key) {
		case "Enter":
			// swap from notes to values or vice versa
			sudoku.notes = !sudoku.notes;
			table.classList.add(sudoku.notes ? "notes" : "values");
			table.classList.remove(sudoku.notes ? "values" : "notes");
			break;
		case "ArrowUp":
		case "ArrowDown":
		case "ArrowLeft":
		case "ArrowRight":
			// move focus around
			const [condition, pos] = {
				ArrowUp: [cell.position > 8, -9],
				ArrowDown: [cell.position < 72, 9],
				ArrowRight: [cell.position % 9 < 8, 1],
				ArrowLeft: [cell.position % 9 > 0, -1],
			}[e.key] as [boolean, number];
			if (condition) {
				sudoku.cells[cell.position + pos].element.focus();
			}
			break;
		case "1":
		case "2":
		case "3":
		case "4":
		case "5":
		case "6":
		case "7":
		case "8":
		case "9":
			// add/remove value
			const value = parseInt(e.key);
			if (sudoku.notes) {
				cell.setPossVal(value);
			} else {
				if (value === cell.value) {
					cell.setValue(0);
				} else {
					cell.setValue(value);
				}
			}
			break;
		case "Backspace":
		case "Delete":
			// remove value
			if (!sudoku.notes) {
				cell.setValue(0);
			}
			break;
	}
}

export { handleCellClick, handleKeypress };
