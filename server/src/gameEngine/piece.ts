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

    constructor(pieceId: PieceId){
        this.pieceId = pieceId;
        const piece = pieces[pieceId];
        this.cells = [...piece.cells];
        this.x = 0;
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
        if (param.x != null) piece.x = param.x;
        if (param.y != null) piece.y = param.y;
        return piece;
    }
}
