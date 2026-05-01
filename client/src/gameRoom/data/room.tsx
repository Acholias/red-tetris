import type { Player } from "./player";

export interface Room {
    id: string,
    isSocketConnected: boolean,
    isAdmin: boolean,
    isPlaying: boolean,
    players: Player[],
    spectators: Player[]
}
