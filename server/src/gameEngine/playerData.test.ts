import { describe, it, expect } from 'vitest';
import { MalusEvent, PlayerData } from './playerData.js';
import { Piece } from './piece.js';

describe('setNextPiece', () => {
    it('simple next', () => {
        // 1. Setup
        const playerData: PlayerData = new PlayerData('id', {w: 5, h: 5}, 'l', 'z');

        // 2. Action
        playerData.setNextPiece('t', false);

        // 3. Assert
        const expected: PlayerData = new PlayerData('id', {w: 5, h: 5}, 'z', 't');
        expected.nextPieceIndex = 3;

        expect(playerData).toEqual(expected);
    });

    it('next without update', () => {
        // 1. Setup
        const playerData: PlayerData = new PlayerData('id', {w: 5, h: 5}, 'l', 'z');

        // 2. Action
        playerData.setNextPiece('t', true, false);

        // 3. Assert
        const expected: PlayerData = new PlayerData('id', {w: 5, h: 5}, 'l', 't');
        expected.nextPieceIndex = 3;

        expect(playerData).toEqual(expected);
    });

    it('next not alive', () => {
        // 1. Setup
        const playerData: PlayerData = new PlayerData('id', {w: 5, h: 5}, 'l', 'z');
        playerData.alive = false;

        // 2. Action
        playerData.setNextPiece('t', true);

        // 3. Assert
        const expected: PlayerData = new PlayerData('id', {w: 5, h: 5}, 'l', 'z');
        expected.alive = false;

        expect(playerData).toEqual(expected);
    });

    it('next dead', () => {
        // 1. Setup
        const playerData: PlayerData = new PlayerData('id', {w: 2, h: 2}, 'l', 'z');

        // 2. Action
        playerData.setNextPiece('t', true);

        // 3. Assert
        const expected: PlayerData = new PlayerData('id', {w: 2, h: 2}, 'z', 't');
        expected.nextPieceIndex = 3;
        expected.alive = false;

        expect(playerData).toEqual(expected);
    });
});


describe('leftPiece', () => {
    it('basic', () => {
        // 1. Setup
        const playerData: PlayerData = new PlayerData('id', {w: 5, h: 5}, 'l', 'z');
        playerData.piece.x = 1;

        // 2. Action
        playerData.leftPiece();

        // 3. Assert
        const expected: PlayerData = new PlayerData('id', {w: 5, h: 5}, 'l', 'z');
        expected.piece.x = 0;

        expect(playerData).toEqual(expected);
    });

    it('basic collid', () => {
        // 1. Setup
        const playerData: PlayerData = new PlayerData('id', {w: 5, h: 5}, 'l', 'z');
        playerData.piece.x = 0;

        // 2. Action
        playerData.leftPiece();

        // 3. Assert
        const expected: PlayerData = new PlayerData('id', {w: 5, h: 5}, 'l', 'z');
        expected.piece.x = 0;

        expect(playerData).toEqual(expected);
    });

    it('drunk', () => {
        // 1. Setup
        const playerData: PlayerData = new PlayerData('id', {w: 5, h: 5}, 'l', 'z');
        playerData.piece.x = 1;
        playerData.controlReverseTick = 1;

        // 2. Action
        playerData.leftPiece();

        // 3. Assert
        const expected: PlayerData = new PlayerData('id', {w: 5, h: 5}, 'l', 'z');
        expected.piece.x = 2;
        expected.controlReverseTick = 1;

        expect(playerData).toEqual(expected);
    });

    it('drunk collid', () => {
        // 1. Setup
        const playerData: PlayerData = new PlayerData('id', {w: 5, h: 5}, 'l', 'z');
        playerData.piece.x = 2;
        playerData.controlReverseTick = 1;

        // 2. Action
        playerData.leftPiece();

        // 3. Assert
        const expected: PlayerData = new PlayerData('id', {w: 5, h: 5}, 'l', 'z');
        expected.piece.x = 2;
        expected.controlReverseTick = 1;

        expect(playerData).toEqual(expected);
    });

    it('not alive', () => {
        // 1. Setup
        const playerData: PlayerData = new PlayerData('id', {w: 5, h: 5}, 'l', 'z');
        playerData.piece.x = 2;
        playerData.alive = false;

        // 2. Action
        playerData.leftPiece();

        // 3. Assert
        const expected: PlayerData = new PlayerData('id', {w: 5, h: 5}, 'l', 'z');
        expected.piece.x = 2;
        expected.alive = false;

        expect(playerData).toEqual(expected);
    });
});


describe('rightPiece', () => {
    it('basic', () => {
        // 1. Setup
        const playerData: PlayerData = new PlayerData('id', {w: 5, h: 5}, 'l', 'z');
        playerData.piece.x = 1;

        // 2. Action
        playerData.rightPiece();

        // 3. Assert
        const expected: PlayerData = new PlayerData('id', {w: 5, h: 5}, 'l', 'z');
        expected.piece.x = 2;

        expect(playerData).toEqual(expected);
    });

    it('basic collid', () => {
        // 1. Setup
        const playerData: PlayerData = new PlayerData('id', {w: 5, h: 5}, 'l', 'z');
        playerData.piece.x = 2;

        // 2. Action
        playerData.rightPiece();

        // 3. Assert
        const expected: PlayerData = new PlayerData('id', {w: 5, h: 5}, 'l', 'z');
        expected.piece.x = 2;

        expect(playerData).toEqual(expected);
    });

    it('drunk', () => {
        // 1. Setup
        const playerData: PlayerData = new PlayerData('id', {w: 5, h: 5}, 'l', 'z');
        playerData.piece.x = 1;
        playerData.controlReverseTick = 1;

        // 2. Action
        playerData.rightPiece();

        // 3. Assert
        const expected: PlayerData = new PlayerData('id', {w: 5, h: 5}, 'l', 'z');
        expected.piece.x = 0;
        expected.controlReverseTick = 1;

        expect(playerData).toEqual(expected);
    });

    it('drunk collid', () => {
        // 1. Setup
        const playerData: PlayerData = new PlayerData('id', {w: 5, h: 5}, 'l', 'z');
        playerData.piece.x = 0;
        playerData.controlReverseTick = 1;

        // 2. Action
        playerData.rightPiece();

        // 3. Assert
        const expected: PlayerData = new PlayerData('id', {w: 5, h: 5}, 'l', 'z');
        expected.piece.x = 0;
        expected.controlReverseTick = 1;

        expect(playerData).toEqual(expected);
    });

    it('not alive', () => {
        // 1. Setup
        const playerData: PlayerData = new PlayerData('id', {w: 5, h: 5}, 'l', 'z');
        playerData.piece.x = 0;
        playerData.alive = false;

        // 2. Action
        playerData.rightPiece();

        // 3. Assert
        const expected: PlayerData = new PlayerData('id', {w: 5, h: 5}, 'l', 'z');
        expected.piece.x = 0;
        expected.alive = false;

        expect(playerData).toEqual(expected);
    });
});


describe('rotatePiece', () => {
    it('no kick', () => {
        // 1. Setup
        const playerData: PlayerData = new PlayerData('id', {w: 5, h: 5}, 'l', 'z');

        // 2. Action
        playerData.rotatePiece();

        // 3. Assert
        const expected: PlayerData = new PlayerData('id', {w: 5, h: 5}, 'l', 'z');
        expected.piece.rotate();

        expect(playerData).toEqual(expected);
    });

    it('kick', () => {
        // 1. Setup
        const playerData: PlayerData = new PlayerData('id', {w: 5, h: 5}, 'l', 'z');
        playerData.piece.rotate();
        playerData.piece.x = -1;

        // 2. Action
        playerData.rotatePiece();

        // 3. Assert
        const expected: PlayerData = new PlayerData('id', {w: 5, h: 5}, 'l', 'z');
        expected.piece.rotate();
        expected.piece.rotate();

        expect(playerData).toEqual(expected);
    });

    it('not alive', () => {
        // 1. Setup
        const playerData: PlayerData = new PlayerData('id', {w: 5, h: 5}, 'l', 'z');
        playerData.alive = false;

        // 2. Action
        playerData.rotatePiece();

        // 3. Assert
        const expected: PlayerData = new PlayerData('id', {w: 5, h: 5}, 'l', 'z');
        expected.alive = false;

        expect(playerData).toEqual(expected);
    });
});


describe('softDrop', () => {
    it('no fix piece', () => {
        // 1. Setup
        const playerData: PlayerData = new PlayerData('id', {w: 5, h: 5}, 'l', 'z');

        // 2. Action
        const result = playerData.softDrop();

        // 3. Assert
        const expectedResult: boolean = false;
        const expectedPlayerData: PlayerData = new PlayerData('id', {w: 5, h: 5}, 'l', 'z');
        expectedPlayerData.piece.y = 1;

        expect(result).toEqual(expectedResult);
        expect(playerData).toEqual(expectedPlayerData);
    });

    it('fix piece', () => {
        // 1. Setup
        const playerData: PlayerData = new PlayerData('id', {w: 5, h: 5}, 'l', 'z');
        playerData.piece.y = 3;

        // 2. Action
        const result = playerData.softDrop();

        // 3. Assert
        const expectedResult: boolean = true;
        const expectedPlayerData: PlayerData = new PlayerData('id', {w: 5, h: 5}, 'l', 'z');
        expectedPlayerData.piece.y = 3;
        expectedPlayerData.grid.cells = [
            'E', 'E', 'E', 'E', 'E',
            'E', 'E', 'E', 'E', 'E',
            'E', 'E', 'E', 'E', 'E',
            'E', 'E', 'L', 'E', 'E',
            'L', 'L', 'L', 'E', 'E',
        ];
        expectedPlayerData.grid.spectrum.heights = [
            1, 1, 2, 0, 0,
        ];

        expect(result).toEqual(expectedResult);
        expect(playerData).toEqual(expectedPlayerData);
    });

    it('fix piece dead', () => {
        // 1. Setup
        const playerData: PlayerData = new PlayerData('id', {w: 5, h: 5}, 'l', 'z');
        playerData.piece.x = -1;
        playerData.piece.y = 3;

        // 2. Action
        const result = playerData.softDrop();

        // 3. Assert
        const expectedResult: boolean = true;
        const expectedPlayerData: PlayerData = new PlayerData('id', {w: 5, h: 5}, 'l', 'z');
        expectedPlayerData.piece.x = -1;
        expectedPlayerData.piece.y = 3;
        expectedPlayerData.grid.cells = [
            'E', 'E', 'E', 'E', 'E',
            'E', 'E', 'E', 'E', 'E',
            'E', 'E', 'E', 'E', 'E',
            'E', 'L', 'E', 'E', 'E',
            'E', 'E', 'E', 'E', 'E',
        ];
        expectedPlayerData.grid.spectrum.heights = [
            0, 2, 0, 0, 0,
        ];
        expectedPlayerData.alive = false;

        expect(result).toEqual(expectedResult);
        expect(playerData).toEqual(expectedPlayerData);
    });

    it('not alive', () => {
        // 1. Setup
        const playerData: PlayerData = new PlayerData('id', {w: 5, h: 5}, 'l', 'z');
        playerData.alive = false;

        // 2. Action
        const result = playerData.softDrop();

        // 3. Assert
        const expectedResult: boolean = false;
        const expectedPlayerData: PlayerData = new PlayerData('id', {w: 5, h: 5}, 'l', 'z');
        expectedPlayerData.alive = false;

        expect(result).toEqual(expectedResult);
        expect(playerData).toEqual(expectedPlayerData);
    });
});


describe('hardDrop', () => {
    it('fix piece', () => {
        // 1. Setup
        const playerData: PlayerData = new PlayerData('id', {w: 5, h: 5}, 'l', 'z');

        // 2. Action
        playerData.hardDrop();

        // 3. Assert
        const expected: PlayerData = new PlayerData('id', {w: 5, h: 5}, 'l', 'z');
        expected.piece.y = 3;
        expected.grid.cells = [
            'E', 'E', 'E', 'E', 'E',
            'E', 'E', 'E', 'E', 'E',
            'E', 'E', 'E', 'E', 'E',
            'E', 'E', 'L', 'E', 'E',
            'L', 'L', 'L', 'E', 'E',
        ];
        expected.grid.spectrum.heights = [
            1, 1, 2, 0, 0,
        ];

        expect(playerData).toEqual(expected);
    });

    it('fix piece dead', () => {
        // 1. Setup
        const playerData: PlayerData = new PlayerData('id', {w: 5, h: 5}, 'l', 'z');
        playerData.piece.x = -1;
        playerData.piece.y = 3;

        // 2. Action
        playerData.hardDrop();

        // 3. Assert
        const expected: PlayerData = new PlayerData('id', {w: 5, h: 5}, 'l', 'z');
        expected.piece.x = -1;
        expected.piece.y = 3;
        expected.grid.cells = [
            'E', 'E', 'E', 'E', 'E',
            'E', 'E', 'E', 'E', 'E',
            'E', 'E', 'E', 'E', 'E',
            'E', 'L', 'E', 'E', 'E',
            'E', 'E', 'E', 'E', 'E',
        ];
        expected.grid.spectrum.heights = [
            0, 2, 0, 0, 0,
        ];
        expected.alive = false;

        expect(playerData).toEqual(expected);
    });

    it('not alive', () => {
        // 1. Setup
        const playerData: PlayerData = new PlayerData('id', {w: 5, h: 5}, 'l', 'z');
        playerData.alive = false;

        // 2. Action
        playerData.hardDrop();

        // 3. Assert
        const expected: PlayerData = new PlayerData('id', {w: 5, h: 5}, 'l', 'z');
        expected.alive = false;

        expect(playerData).toEqual(expected);
    });
});


describe('applyMalus', () => {
    it('fastForward', () => {
        // 1. Setup
        const playerData: PlayerData = new PlayerData('id', {w: 5, h: 5}, 'l', 'z');

        // 2. Action
        const result = playerData.applyMalus('fastForward');

        // 3. Assert
        const expectedResult: MalusEvent = 'fix-piece';
        const expectedPlayerData: PlayerData = new PlayerData('id', {w: 5, h: 5}, 'l', 'z');
        expectedPlayerData.piece.y = 3;
        expectedPlayerData.grid.cells = [
            'E', 'E', 'E', 'E', 'E',
            'E', 'E', 'E', 'E', 'E',
            'E', 'E', 'E', 'E', 'E',
            'E', 'E', 'L', 'E', 'E',
            'L', 'L', 'L', 'E', 'E',
        ];
        expectedPlayerData.grid.spectrum.heights = [
            1, 1, 2, 0, 0,
        ];

        expect(result).toEqual(expectedResult);
        expect(playerData).toEqual(expectedPlayerData);
    });

    it('drunk', () => {
        // 1. Setup
        const playerData: PlayerData = new PlayerData('id', {w: 5, h: 5}, 'l', 'z');

        // 2. Action
        const result = playerData.applyMalus('drunk');

        // 3. Assert
        const expectedResult: MalusEvent = 'none';
        const expectedPlayerData: PlayerData = new PlayerData('id', {w: 5, h: 5}, 'l', 'z');
        expectedPlayerData.controlReverseTick = 10;

        expect(result).toEqual(expectedResult);
        expect(playerData).toEqual(expectedPlayerData);
    });

    it('merge', () => {
        // 1. Setup
        const playerData: PlayerData = new PlayerData('id', {w: 5, h: 5}, 'l', 'z');

        // 2. Action
        const result = playerData.applyMalus('merge');

        // 3. Assert
        const expectedResult: MalusEvent = 'next-piece';
        const expectedPlayerData: PlayerData = new PlayerData('id', {w: 5, h: 5}, 'l', 'z');
        expectedPlayerData.piece.mergeWith(new Piece('z', 5));

        expect(result).toEqual(expectedResult);
        expect(playerData).toEqual(expectedPlayerData);
    });

    it('invalid malus', () => {
        // 1. Setup
        const playerData: PlayerData = new PlayerData('id', {w: 5, h: 5}, 'l', 'z');

        // 2. Action
        const result = playerData.applyMalus(' ');

        // 3. Assert
        const expectedResult: MalusEvent = 'none';
        const expectedPlayerData: PlayerData = new PlayerData('id', {w: 5, h: 5}, 'l', 'z');

        expect(result).toEqual(expectedResult);
        expect(playerData).toEqual(expectedPlayerData);
    });

    it('not alive', () => {
        // 1. Setup
        const playerData: PlayerData = new PlayerData('id', {w: 5, h: 5}, 'l', 'z');
        playerData.alive = false;

        // 2. Action
        const result = playerData.applyMalus('merge');

        // 3. Assert
        const expectedResult: MalusEvent = 'none';
        const expectedPlayerData: PlayerData = new PlayerData('id', {w: 5, h: 5}, 'l', 'z');
        expectedPlayerData.alive = false;

        expect(result).toEqual(expectedResult);
        expect(playerData).toEqual(expectedPlayerData);
    });
});


describe('tickMalus', () => {
    it('nothing', () => {
        // 1. Setup
        const playerData: PlayerData = new PlayerData('id', {w: 5, h: 5}, 'l', 'z');

        // 2. Action
        playerData.tickMalus();

        // 3. Assert
        const expected: PlayerData = new PlayerData('id', {w: 5, h: 5}, 'l', 'z');

        expect(playerData).toEqual(expected);
    });

    it('remove controlReverseTick', () => {
        // 1. Setup
        const playerData: PlayerData = new PlayerData('id', {w: 5, h: 5}, 'l', 'z');
        playerData.controlReverseTick = 5;

        // 2. Action
        playerData.tickMalus();

        // 3. Assert
        const expected: PlayerData = new PlayerData('id', {w: 5, h: 5}, 'l', 'z');
        expected.controlReverseTick = 4;

        expect(playerData).toEqual(expected);
    });

    it('not alive', () => {
        // 1. Setup
        const playerData: PlayerData = new PlayerData('id', {w: 5, h: 5}, 'l', 'z');
        playerData.alive = false;

        // 2. Action
        playerData.tickMalus();

        // 3. Assert
        const expected: PlayerData = new PlayerData('id', {w: 5, h: 5}, 'l', 'z');
        expected.alive = false;

        expect(playerData).toEqual(expected);
    });
});
