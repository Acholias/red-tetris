/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Game.tsx                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: lumugot <lumugot@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/04/28 10:25:02 by lumugot           #+#    #+#             */
/*   Updated: 2026/05/14 14:35:37 by lumugot          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import './Game.css'
import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from '../../store/store';
import { movePiece, rotatePiece, softDrop, hardDrop, tick } from '../../gameEngine/logic/gameSlice';
import { useEffect, useMemo, useRef } from 'react';
import { createInterval } from '../../gameEngine/utils/intervals';
import { renderCells, renderSpectrum } from '../../gameEngine/render/render';
import { createGameTheme, createSpectrumTheme } from '../../theme/theme';
import { useLocation, useNavigate } from 'react-router-dom';
import { initSpectrums } from '../../gameEngine/logic/spectrumsSlice';
import { initRoom } from '../../gameRoom/logic/roomSlice';

type GameNavState = {
    mode?: 'solo' | 'multi'
    playerName?: string
}

export default function Game() {
    const navigate = useNavigate();
    const location = useLocation();
    const navState = (location.state ?? {}) as GameNavState;

    const soloRoomIdRef = useRef<string>('');
    const soloJoinedRef = useRef<boolean>(false);

    // Get game and theme from store
    const game = useSelector((state: RootState) => state.game);
    const spectrums = useSelector((state: RootState) => state.spectrums);
    const room = useSelector((state: RootState) => state.room);
    const currentTheme = useSelector((state: RootState) => state.theme);
    const dispatch = useDispatch();

    // Set game tick interval
    createInterval(
        () => {
            dispatch(tick());
        },
        (!room.isPlaying || game.isEnd || game.speed.speed <= 0)
            ? null
            : (1 / game.speed.speed) * 1000
    );

    // Build solo room id
    function getSoloRoomId(): string {
        if (soloRoomIdRef.current) return soloRoomIdRef.current;
        const rand = Math.random().toString(36).slice(2, 8);
        soloRoomIdRef.current = `solo-${Date.now().toString(36)}-${rand}`;
        return soloRoomIdRef.current;
    }

    // Join solo room socket
    function joinSoloRoom(roomId: string, playerName: string) {
        dispatch(initRoom({id: roomId, playerName}));
        dispatch({
            'type': 'room/join',
            'payload': {
                'roomId': roomId,
                'playerName': playerName,
            }
        });
    }

    // Start solo game socket
    function startSoloGame(roomId: string) {
        dispatch({
            'type': 'room/startGame',
            'payload': {
                'roomId': roomId,
            }
        });
    }

    // Send action to server
    function sendAction(action: string) {
        if (!room.id) return;
        dispatch({
            'type' : 'game/action',
            'payload' : {
                'roomId': room.id,
                'action' : action
            }
        });
    }

    // Navigate back to lobby
    function goToRoom() {
        if (room.id == '') {
            navigate('/');
            return;
        }
        for (const player of room.players) {
            if (player.id == room.yourId) {
                navigate(`/${room.id}/${player.name}`);
                return;
            }
        }
        navigate('/');
    }

    // Ensure socket is connected
    useEffect(() => {
        if (navState.mode !== 'solo') return;
        if (room.isSocketConnected) return;
        dispatch({'type': 'socket/connect'});
    }, [dispatch, navState.mode, room.isSocketConnected]);

    // Auto join solo room
    useEffect(() => {
        if (navState.mode !== 'solo') return;
        if (!room.isSocketConnected) return;
        if (soloJoinedRef.current) return;
        if (room.id) return;

        const roomId = getSoloRoomId();
        const playerName = (navState.playerName ?? 'solo').trim() || 'solo';
        soloJoinedRef.current = true;
        joinSoloRoom(roomId, playerName);
    }, [dispatch, navState.mode, navState.playerName, room.isSocketConnected, room.id]);

    // Auto start solo game
    useEffect(() => {
        if (navState.mode !== 'solo') return;
        if (!room.id) return;
        if (room.isPlaying) return;
        if (!room.isAdmin) return;

        startSoloGame(room.id);
    }, [dispatch, navState.mode, room.id, room.isPlaying, room.isAdmin]);

    // Init spectrums if needed
    useEffect(() => {
        if (Object.values(spectrums).length == 0 && room.players.length > 1) {
            dispatch(initSpectrums({room: room, skipCurrentPlayer: true}));
        }
    }, [dispatch, spectrums, room]);

    // Keyboard mapping
    useEffect(() => {
        // Handle keyboard input
        const handleKeyDown = (event: KeyboardEvent) => {
        switch (event.key) {
            case 'ArrowUp':
                event.preventDefault();
                dispatch(rotatePiece());
                sendAction('rotate');
            break
            case 'ArrowLeft':
                event.preventDefault();
                dispatch(movePiece({right: false}));
                sendAction('left');
            break
            case 'ArrowRight':
                event.preventDefault();
                dispatch(movePiece({right: true}));
                sendAction('right');
            break
            case 'ArrowDown':
                event.preventDefault();
                dispatch(softDrop());
                sendAction('soft-drop');
            break
            case ' ':
                event.preventDefault();
                dispatch(hardDrop());
                sendAction('hard-drop');
            break
        }
        };

        // Add event listener
        window.addEventListener('keydown', handleKeyDown);

        // Remove event listener on page quit
        return () => {
        window.removeEventListener('keydown', handleKeyDown);
        };
    }, [dispatch, room.id]);

    // Get grid, piece and next piece from game
    const grid = game.grid;
    const piece = game.piece;
    const nextPiece = game.nextPiece;

    // Variables computes
    const cellSize = 3;

    const pieceX = (piece?.x ?? 0) * cellSize;
    const pieceY = (piece?.y ?? 0) * cellSize;

    const previewX = (game.grid.width + 1) * cellSize;
    const previewGrid = useMemo(() => Array(25).fill('E'), []);
    let previewOffset = 0;
    switch (nextPiece.width) {
        case 1:
            previewOffset = 2 * cellSize;
            break;
        case 2:
            previewOffset = 1 * cellSize;
            break;
        case 3:
            previewOffset = 1 * cellSize;
            break;
    }

    // Style define
    const gameStyle = createGameTheme(currentTheme, cellSize);
    const spectrumStyle = createSpectrumTheme(currentTheme, cellSize, cellSize / 2, room);

    const boardWidthVh = (grid.width + 6) * cellSize;
    const boardHeightVh = Math.max(grid.height, 5) * cellSize;
    const gameBoardStyle = {
        ...gameStyle,
        width: `${boardWidthVh}vh`,
        height: `${boardHeightVh}vh`,
    } as React.CSSProperties;

    const spectrumList = Object.values(spectrums).slice(0, 4);

    return (
        <main className="game-page">
            <h1>Game Page</h1>

            <div className="game-top">
                <p className="game-mode">{room.players.length == 1 ? 'Solo game' : 'Multi player game'}</p>
                {!room.isPlaying && <button type="button" onClick={() => goToRoom()}>Go back to room</button>}
            </div>

            {game.win != undefined && <p className="game-result">You {game.win ? 'win !' : 'lose -_-'}</p>}

            <div className="game-split" aria-label="Game layout">
                <section className="game-left" aria-label="Your game">
                    <header className="game-left-head">
                        <h2 className="game-left-title">Tetris</h2>
                        <div className="game-left-badge" aria-hidden="true" />
                    </header>

                    <div className="game-left-stage">
                        <div className='game-board game-center-board' style={gameBoardStyle}>
                            {renderCells(grid.cells, 0, 0, grid.width, grid.height)}
                            {renderCells(piece.cells, pieceX, pieceY, piece.width, piece.height)}
                            {renderCells(previewGrid, previewX, 0, 5, 5)}
                            {renderCells(nextPiece.cells, previewX + previewOffset, previewOffset, nextPiece.width, nextPiece.height)}
                        </div>
                    </div>
                </section>

                <div className="game-divider" aria-hidden="true" />

                <section className="game-right" aria-label="Other players" style={spectrumStyle}>
                    <div className="game-right-grid">
                        <div className="game-frame">
                            {spectrumList[0] ? renderSpectrum(spectrumList[0]) : <div className="game-frame-empty" />}
                        </div>
                        <div className="game-frame">
                            {spectrumList[1] ? renderSpectrum(spectrumList[1]) : <div className="game-frame-empty" />}
                        </div>
                        <div className="game-frame">
                            {spectrumList[2] ? renderSpectrum(spectrumList[2]) : <div className="game-frame-empty" />}
                        </div>
                        <div className="game-frame">
                            {spectrumList[3] ? renderSpectrum(spectrumList[3]) : <div className="game-frame-empty" />}
                        </div>
                    </div>
                </section>
            </div>
        </main>
    )
}
