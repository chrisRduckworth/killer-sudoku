import type Shape from "./Shape";
import type KillerSudoku from "./KillerSudoku";

class Cell {
	readonly position: number;
	readonly row: number;
	readonly column: number;
	readonly box: number;

	value = 0;
	possibleValues: Set<number> = new Set();
	shape!: Shape;
	walls = [false, false, false, false]; // Going clockwise starting at north, true if a wall is present
	isValid = true;
	sudoku!: KillerSudoku;
	element!: HTMLTableCellElement;

	constructor(position: number) {
		if (typeof position !== "number" || Math.floor(position) !== position) {
			throw new TypeError("Position must be an integer");
		}
		if (position < 0 || position >= 81) {
			throw new RangeError("Position must be 0 and 80 inclusive");
		}
		this.position = position;

		// rows are counted 0 - 8 left to right
		this.row = Math.floor(position / 9);
		// columns are counted 0 - 8 top to bottom
		this.column = position % 9;
		// boxs are counted 0 - 8 left to right and wrapping down
		this.box = Math.floor((position % 9) / 3) + 3 * Math.floor(position / 27);
	}

	findWalls() {
		// finds which walls are at the edge of a shape, for drawing with CSS
		if (!this.shape) {
			throw new Error("Cannot find walls without shape property");
		}

		const pos = [-9, 1, 9, -1];
		for (let i = 0; i < pos.length; i++) {
			if (
				!this.shape.cells.some(
					(cell) => cell.position === this.position + pos[i]
				)
			) {
				this.walls[i] = true;
			}
		}
	}

	setIsValid() {
		// checks the cell's row, column, box, and shape to for conflicts and sets isValid accordingly
		this.isValid = true;
		this.shape.isValid = true;

		if (this.value === 0) {
			const nonZeroRow = this.sudoku
				.getRow(this.row)
				.filter((cell) => cell.value !== 0);
			nonZeroRow.forEach((cell) => cell.setIsValid());

			const nonZeroColumn = this.sudoku
				.getColumn(this.column)
				.filter((cell) => cell.value !== 0);
			nonZeroColumn.forEach((cell) => cell.setIsValid());

			const nonZeroBox = this.sudoku
				.getBox(this.box)
				.filter((cell) => cell.value !== 0);
			nonZeroBox.forEach((cell) => cell.setIsValid());

			const nonZeroShape = this.shape.cells.filter((cell) => cell.value !== 0);
			nonZeroShape.forEach((cell) => cell.setIsValid());

			this.render();

			return;
		}

		const rowMatches = this.sudoku
			.getRow(this.row)
			.filter((cell) => cell.value === this.value);
		if (rowMatches.length > 1) {
			rowMatches.forEach((cell) => {
				cell.isValid = false;
				if (cell.position !== this.position) {
					cell.render();
				}
			});
		}

		const columnMatches = this.sudoku
			.getColumn(this.column)
			.filter((cell) => cell.value === this.value);
		if (columnMatches.length > 1) {
			// columnMatches.forEach((cell) => (cell.isValid = false));
			columnMatches.forEach((cell) => {
				cell.isValid = false;
				if (cell.position !== this.position) {
					cell.render();
				}
			});
		}

		const boxMatches = this.sudoku
			.getBox(this.box)
			.filter((cell) => cell.value === this.value);
		if (boxMatches.length > 1) {
			// boxMatches.forEach((cell) => (cell.isValid = false));
			boxMatches.forEach((cell) => {
				cell.isValid = false;
				if (cell.position !== this.position) {
					cell.render();
				}
			});
		}

		const shapeMatches = this.shape.cells.filter(
			(cell) => cell.value === this.value
		);
		if (shapeMatches.length > 1) {
			// shapeMatches.forEach((cell) => (cell.isValid = false));
			shapeMatches.forEach((cell) => {
				cell.isValid = false;
				if (cell.position !== this.position) {
					cell.render();
				}
			});
		}

		const shapeSum = this.shape.cells.reduce(
			(sum, cell) => sum + cell.value,
			0
		);
		if (shapeSum > this.shape.sum) {
			this.shape.isValid = false;
		}
		this.render();
	}

	setValue(n: number) {
		if (typeof n !== "number" || Math.floor(n) !== n || n < 0 || n >= 10) {
			throw TypeError("value must be an integer between 0 and 9");
		}

		const inPoss = this.possibleValues.has(n);

		// remove n from possibleValues of cells in the same row/column/box/shape
		const row = this.sudoku.getRow(this.row);
		row.forEach((cell) => {
			if (cell.possibleValues.has(n)) {
				cell.setPossVal(n);
			}
		});

		const column = this.sudoku.getColumn(this.column);
		column.forEach((cell) => {
			if (cell.possibleValues.has(n)) {
				cell.setPossVal(n);
			}
		});

		const box = this.sudoku.getBox(this.box);
		box.forEach((cell) => {
			if (cell.possibleValues.has(n)) {
				cell.setPossVal(n);
			}
		});

		this.shape.cells.forEach((cell) => {
			if (cell.possibleValues.has(n)) {
				cell.setPossVal(n);
			}
		});

		this.value = 0;
		this.setIsValid();
		if (n !== 0) {
			this.value = n;
			this.setIsValid();
		}

		if (inPoss) {
			// re-adds to possible values for if it got deleted
			this.setPossVal(n);
		}
	}

	render() {
		// updates the html element with current cell info
		// first clear out the current children
		const possValsList = this.element.getElementsByClassName("possible-values")[0]
		const textElement = this.element.getElementsByClassName("value")[0]
		textElement.replaceChildren()
		possValsList.replaceChildren()

		if (this.value > 0) {
			// then the value has been set and that's what needs to be shown
			textElement.replaceChildren(document.createTextNode(`${this.value}`))
		} else if (this.possibleValues.size > 0) {
			if (this.element.getElementsByClassName("sum").length > 0) {
				possValsList.appendChild(document.createElement("div"))
			}
			// we need to display the list of possible values
			const possValsSorted = [...this.possibleValues.values()].sort((a, b) =>
				a < b ? -1 : 1
			);
			for (const val of possValsSorted) {
				const item = document.createElement("li");
				item.replaceChildren(document.createTextNode(`${val}`))
				possValsList.appendChild(item);
			}
		}
		// if there are neither value or possVals then it is left blank

		if (!this.isValid) {
			this.element.classList.add("invalid");
		} else {
			this.element.classList.remove("invalid");
		}
	}

	setPossVal(n: number) {
		if (this.possibleValues.has(n)) {
			this.possibleValues.delete(n);
		} else {
			this.possibleValues.add(n);
		}
		this.render();
		return;
	}

	draw() {
		// there is a sum if the element is the top left of the shape
		// <=> it has the lowest position
		const hasSum =
			this.position ===
			Math.min(...this.shape.cells.map((cell) => cell.position));

		// there is a corner if there are exactly 2 walls
		// the walls are adjacent (i.e. not opposite)
		// the cell across from this one is not in the shape
		const wallsLength = this.walls.filter((w) => w).length;
		const opposite =
			(this.walls[0] && this.walls[2]) || (this.walls[1] && this.walls[3]);
		let hasCorner = false;
		if (wallsLength === 2 && !opposite) {
			const cellMod = [9, -1, -9, 1];
			const cellDiagPosition = cellMod.reduce(
				(acc, c, i) => acc + (this.walls[i] ? c : 0),
				this.position
			);
			const shapePositions = this.shape.cells.map((cell) => cell.position);
			if (!shapePositions.includes(cellDiagPosition)) {
				hasCorner = true;
			}
		}

		this.element.innerHTML = `<div>
			<div class="value"></div>
      <div class="walls-holder">
        <div class="walls
          ${this.walls[0] ? "walls-top " : ""} 
          ${this.walls[1] ? "walls-right " : ""} 
          ${this.walls[2] ? "walls-bottom " : ""} 
          ${this.walls[3] ? "walls-left " : ""} 
          ">
        </div>
      </div>
		</div>`;

		if (hasCorner) {
			this.element.firstElementChild!.innerHTML += `<div class="corner 
				 ${this.walls[0] ? "corner-bottom " : ""}
         ${this.walls[1] ? "corner-left " : ""}
         ${this.walls[2] ? "corner-top " : ""}
         ${this.walls[3] ? "corner-right " : ""}
			"></div>`;
		}

		if (hasSum) {
			this.element.firstElementChild!.innerHTML += `<label class="sum">${this.shape.sum}</label>`;
		}

		this.element.firstElementChild!.innerHTML += `<ol class="possible-values"></ol>`;
	}
}

export default Cell;
