import type { Player } from "./player";

export interface Room {
    id: number,
    players: Player[],
    spectators: Player[]
}
