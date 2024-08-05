import "./style.css";
import KillerSudoku from "./KillerSudoku";
import { handleCellClick, handleKeypress } from "./eventHandlers";

const shapes: Array<[number, number[]]> = [
	[20, [0, 1, 2, 9]],
	[10, [3, 12, 13]],
	[13, [4, 5]],
	[8, [6, 7, 8]],
	[12, [10, 19]],
	[10, [11, 20]],
	[26, [14, 15, 16, 17]],
	[8, [18, 27]],
	[23, [21, 22, 30]],
	[16, [23, 24, 25, 26]],
	[19, [28, 29, 38, 47]],
	[20, [31, 40, 49, 50]],
	[12, [32, 33]],
	[20, [34, 35, 43, 44]],
	[30, [36, 45, 54, 63]],
	[10, [37, 46, 55, 64]],
	[20, [39, 48, 57, 56]],
	[12, [41, 42]],
	[14, [51, 60]],
	[8, [52, 53]],
	[7, [58, 59]],
	[8, [61, 62]],
	[4, [65, 66]],
	[20, [67, 68, 69, 78]],
	[13, [70, 79]],
	[10, [71, 80]],
	[18, [72, 73, 74]],
	[14, [75, 76, 77]],
];

const sudoku = new KillerSudoku(shapes);

const elements = [...document.getElementsByTagName("td")];

elements.forEach((element, i) => {
	const cell = sudoku.cells[i];
	cell.element = element;
	cell.element.addEventListener("mousedown", (e) => {
		handleCellClick(e, sudoku);
	});
	cell.draw();
});

document.body.addEventListener("keydown", (e) => {
	handleKeypress(e, sudoku);
});
