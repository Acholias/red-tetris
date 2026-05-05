import type { GameSpeed, Spectrum } from "./interfaces";
import type { PieceId } from "./pieces";

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
    gameSpeed?: GameSpeed,
};

export interface BodyRoomPlayerMode {
    roomId: string,
    spectate: boolean,
};

export interface BodyRoomStartGame {
    roomId: string,
};

export interface BodyGameAction {
    roomId: string,
    action: string,
};


// Server -> client
export interface BodyRoomUpdate {
    isAdmin?: boolean,
    isPlaying?: boolean,
    allPieces?: boolean,
    malus?: boolean,
    size?: {w: number, h: number},
    gameSpeed?: GameSpeed,
    players?: {id: number, name: string}[],
    spectators?: {id: number, name: string}[],
    yourId?: number,
};

export interface BodyGameStarted {
    allPieces: boolean,
    malus: boolean,
    size: {w: number, h: number},
    gameSpeed: GameSpeed,
    pieceId: PieceId,
    nextPieceId: PieceId,
};

export interface BodyGameUpdate {
    grid: string[],
    nextPiece?: PieceId,
};

export interface BodyGameSpectrum {
    playerId: number,
    spectrum: Spectrum,
};

export interface BodyGameEnd {
    win: boolean,
};
