import { PieceId } from "./pieces.js";
import { listLengthPieceAll, listLengthPieceBasic } from "./defines.js";
import { Grid } from "./grid.js";
import { Piece } from "./piece.js";

export class PlayerData {
    playerId: string;
    grid: Grid;
    piece: Piece;
    nextPieceId: PieceId;
    nextPieceIndex: number;
    alive: boolean;

    constructor(
        playerId: string,
        gridSize: {w: number, h: number},
        pieceId: PieceId,
        nextPieceId: PieceId
    ) {
        this.playerId = playerId;
        this.grid = new Grid(gridSize.w, gridSize.h);
        this.piece = new Piece(pieceId);
        this.nextPieceId = nextPieceId;
        this.nextPieceIndex = 2;
        this.alive = true;
    }

    setNextPiece(nextPieceId: PieceId, allPiece: boolean) {
        this.piece = new Piece(this.nextPieceId);
        this.nextPieceId = nextPieceId;

        if (allPiece) {
            this.nextPieceIndex = (this.nextPieceIndex + 1) % listLengthPieceBasic;
        } else {
            this.nextPieceIndex = (this.nextPieceIndex + 1) % listLengthPieceAll;
        }
    }
}
