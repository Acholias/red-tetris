import { Player } from "../room/player.js";
import { nbLoopPieceAll, nbLoopPieceBasic } from "./defines.js";
import { allPieceIds, basicPieceIds, PieceId } from "./pieces.js";
import { PlayerData } from "./playerData.js";

export class GameData {
    solo: boolean;
    pieces: PieceId[];
    playerDatas: Map<string, PlayerData>;

    constructor() {
        this.solo = true;
        this.pieces = [];
        this.playerDatas = new Map();
    }

    startGame(
        allPieces: boolean,
        gridSize: {w: number, h: number},
        players: Player[],
    ) {
        this.solo = players.length == 0;

        this.pieces = [];
        if (allPieces) {
            let bucket = [...allPieceIds]

            for (let i = 0; i < nbLoopPieceAll; i++) {
                while (bucket.length > 0) {
                    const randomIndex = Math.floor(Math.random() * bucket.length);
                    const pieceId = bucket.splice(randomIndex, 1)[0];
                    this.pieces.push(pieceId);
                }
                bucket = [...allPieceIds]
            }
        } else {
            let bucket = [...basicPieceIds]

            for (let i = 0; i < nbLoopPieceBasic; i++) {
                while (bucket.length > 0) {
                    const randomIndex = Math.floor(Math.random() * bucket.length);
                    const pieceId = bucket.splice(randomIndex, 1)[0];
                    this.pieces.push(pieceId);
                }
                bucket = [...basicPieceIds]
            }
        }
        const pieceId = this.pieces[0];
        const nextPieceId = this.pieces[1];

        this.playerDatas = new Map();
        for (const player of players) {
            this.playerDatas.set(player.id, new PlayerData(player.id, gridSize, pieceId, nextPieceId));
        }
    }
}
