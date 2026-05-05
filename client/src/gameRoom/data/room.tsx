import type { GameSpeed } from "@shared/interfaces";
import type { Player } from "./player";

export interface Room {
    id: string,
    isSocketConnected: boolean,
    isAdmin: boolean,
    isPlaying: boolean,
    allPieces: boolean,
    malus: boolean,
    size: {w: number, h: number},
    gameSpeed: GameSpeed,
    players: Player[],
    spectators: Player[],
    yourId: number,
}
