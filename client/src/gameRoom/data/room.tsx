import type { Player } from "./player";

export interface Room {
    id: string,
    isSocketConnected: boolean,
    isAdmin: boolean,
    isPlaying: boolean,
    allPieces: boolean,
    size: {w: number, h: number},
    gameSpeed: number,
    players: Player[],
    spectators: Player[],
}
