// Client -> server
export interface BodyRoomJoin {
    roomId: string,
    playerName: string,
};

export interface BodyRoomLeave {
    roomId: string,
};

export interface BodyRoomSettings {
    roomId: string,
    allPieces?: boolean,
    malus?: boolean,
    size?: {w: number, h: number},
    gameSpeed?: number,
};

export interface BodyRoomPlayerMode {
    roomId: string,
    spectate: boolean,
};


// Server -> client
export interface BodyRoomUpdate {
    isAdmin?: boolean,
    isPlaying?: boolean,
    allPieces?: boolean,
    malus?: boolean,
    size?: {w: number, h: number},
    gameSpeed?: number,
    players?: {id: number, name: string}[],
    spectators?: {id: number, name: string}[],
    yourId?: number,
};
