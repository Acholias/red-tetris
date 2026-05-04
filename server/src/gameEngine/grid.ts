import { Piece } from "./piece.js";

export class Grid {
    width: number;
    height: number;
    nbCells: number;
    cells: string[];

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.nbCells = width * height;
        this.cells = [];
        for (let i = 0; i < this.nbCells; i++) {
            this.cells.push('E');
        }
    }

    isPieceOverlap(piece: Piece): boolean {
        const length = piece.width * piece.height;
        for (let i = 0; i < length; i++) {
            if (piece.cells[i] == ' ') continue;

            const cx = (i % piece.width) + piece.x;
            if (cx < 0 || cx >= this.width) return true;

            const cy = Math.floor(i / piece.width) + piece.y;
            if (cy < 0 || cy >= this.height) return true;

            if (this.cells[cx + cy * this.width] != 'E') return true;
        }
        return false;
    }

    fixPiece(piece: Piece): boolean {
        const length = piece.width * piece.height;
        for (let i = 0; i < length; i++) {
            if (piece.cells[i] == ' ') continue;

            const cx = (i % piece.width) + piece.x;
            if (cx < 0 || cx >= this.width) return true;

            const cy = Math.floor(i / piece.width) + piece.y;
            if (cy < 0 || cy >= this.height) return true;

            if (this.cells[cx + cy * this.width] != 'E') return true;
            this.cells[cx + cy * this.width] = piece.cells[i];
        }
        return false;
    }

    clearLines(): number {
        let nbLinesClear = 0;
        let lineFull;

        for (let y = 0; y < this.height; y++) {
            lineFull = true;
            const endI = (y + 1) * this.width;

            // Check if line is fill
            for (let i = y * this.width; i < endI; i++) {
                if (this.cells[i] == 'E' || this.cells[i] == 'U') {
                    lineFull = false;
                    break;
                }
            }

            if (!lineFull) continue;
            nbLinesClear++;

            // Move lines down
            for (let i = endI - 1; i >= this.width; i--) {
                this.cells[i] = this.cells[i - this.width];
            }

            // Clear top line
            for (let i = 0; i < this.width; i++) {
                this.cells[i] = 'E';
            }
        }

        return nbLinesClear;
    }

    addUnbreakableLines(nbLines: number) {
        if (nbLines < 0 || nbLines > 5) return;

        const offset = this.width * nbLines;
        const endI = this.nbCells - offset;

        // Push lines
        for (let i = 0; i < endI; i++) {
            this.cells[i] = this.cells[i + offset];
        }

        // Add unbreakable lines
        for (let i = endI; i < this.nbCells; i++) {
            this.cells[i] = 'U';
        }
    }

    print() {
        console.log('Grid');
        let start = 0;
        let end = this.width;
        for (let y = 0; y < this.height; y++) {
            console.log(`|${this.cells.slice(start, end).join()}|`);
            start += this.width;
            end += this.width;
        }
    }
}
