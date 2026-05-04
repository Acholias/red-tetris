import { PieceId, pieces } from "./pieces.js";
import { RotationId, rotations } from "./rotations.js";

export class Piece {
    pieceId: PieceId;
    cells: string[];
    x: number;
    y: number;
    width: number;
    height: number;
    rotationId?: RotationId;

    constructor(pieceId: PieceId, gridWidth?: number){
        this.pieceId = pieceId;
        const piece = pieces[pieceId];
        this.cells = [...piece.cells];
        if (gridWidth != undefined) {
            this.x = Math.floor(gridWidth / 2) - Math.ceil(piece.size / 2);
        } else {
            this.x = 0;
        }
        this.y = 0;
        this.width = piece.size;
        this.height = piece.size;
        this.rotationId = piece.rotationId;
    }

    rotate() {
        if (this.rotationId == null) return;
        this.cells = rotations[this.rotationId](this.cells);
    }

    copyWith(param: {x?: number, y?: number}) {
        const piece = new Piece(this.pieceId);

        if (param.x != null) {
            piece.x = param.x;
        } else {
            piece.x = this.x;
        }
        if (param.y != null) {
            piece.y = param.y;
        } else {
            piece.y = this.y;
        }

        piece.cells = [...this.cells];

        return piece;
    }

    print() {
        console.log(`Piece ${this.pieceId}, pos (${this.x}, ${this.y})`);
        let start = 0;
        let end = this.width;
        for (let y = 0; y < this.height; y++) {
            console.log(`|${this.cells.slice(start, end).join()}|`);
            start += this.width;
            end += this.width;
        }
    }
}
