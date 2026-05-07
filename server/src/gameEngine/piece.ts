import { type PieceId, pieces } from "@shared/pieces";
import { type RotationId, rotations } from "@shared/rotations";

export class Piece {
    pieceId: PieceId;
    cells: string[];
    x: number;
    y: number;
    width: number;
    height: number;
    rotationId?: RotationId;

    constructor(pieceId: PieceId, gridWidth?: number) {
        try {
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
        catch (e) {
            this.pieceId = pieceId;
            this.cells = [];
            this.x = 0;
            this.y = 0;
            this.width = 0;
            this.height = 0;
            this.rotationId = undefined;
        }
    }

    rotate() {
        if (this.rotationId == null) return;
        this.cells = rotations[this.rotationId](this.cells);
    }

    mergeWith(piece: Piece) {
        // Create empty 5x5 cells
    let cells: string[] = Array(25).fill(' ');

    // Merge first piece
    const offset1 = computeOffset(this.width);
    for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
            const index1 = x + y * this.width;
            if (this.cells[index1] == ' ') continue;

            const index = (x + offset1) + (y + offset1) * 5;
            cells[index] = this.cells[index1];
        }
    }

    // Merge second piece
    const offset2 = computeOffset(piece.width);
    for (let y = 0; y < piece.height; y++) {
        for (let x = 0; x < piece.width; x++) {
            const index2 = x + y * piece.width;
            if (piece.cells[index2] == ' ') continue;

            const index = (x + offset2) + (y + offset2) * 5;
            if (cells[index] != ' ') continue;

            cells[index] = piece.cells[index2];
        }
    }

    this.cells = cells,
    this.x = this.x! - offset1,
    this.y = this.y! - offset1,
    this.width = 5,
    this.height = 5,
    this.rotationId = '5x5'
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
}


function computeOffset(pieceSize: number): number {
    switch (pieceSize) {
        case 1:
            return 2;
        case 2:
            return 1;
        case 3:
            return 1;
    }
    return 0;
}
