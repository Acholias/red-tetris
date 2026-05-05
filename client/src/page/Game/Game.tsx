/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Game.tsx                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: gugus <gugus@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/04/28 10:25:02 by lumugot           #+#    #+#             */
/*   Updated: 2026/05/05 10:47:28 by gugus            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import './Game.css'
import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from '../../store/store';
import { movePiece, rotatePiece, softDrop, hardDrop, tick } from '../../gameEngine/logic/gameSlice';
import { useEffect } from 'react';
import { createInterval } from '../../gameEngine/utils/intervals';
import { renderCells, renderSpectrum } from '../../gameEngine/render/render';
import { createGameTheme, createSpectrumTheme } from '../../theme/theme';
import { useNavigate } from 'react-router-dom';
import { initSpectrums } from '../../gameEngine/data/spectrumsSlice';

export default function Game() {
    const navigate = useNavigate();

    // Get game and theme from store
    const game = useSelector((state: RootState) => state.game);
    const spectrums = useSelector((state: RootState) => state.spectrums);
    const room = useSelector((state: RootState) => state.room);
    const currentTheme = useSelector((state: RootState) => state.theme);
    const dispatch = useDispatch();

    // Set game tick interval
    createInterval(() => {
        dispatch(tick());
    },
    game.isEnd ? null : game.speed * 1000);

    function sendAction(action: string) {
        dispatch({
        'type' : 'game/action',
        'payload' : {
            'roomId': room.id,
            'action' : action
        }
        });
    }

    function goToRoom() {
        if (room.id == '') {
        navigate('/42/gugus'); // TODO: REMOVE
        // navigate('/');
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

    // Init spectrums if needed
    useEffect(() => {
        if (Object.values(spectrums).length == 0 && room.players.length > 1) {
            dispatch(initSpectrums({room: room, skipCurrentPlayer: true}));
        }
    }, [dispatch, spectrums]);

    // Keyboard mapping
    useEffect(() => {
        // Key handler
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
    }, [dispatch]);

    // Get grid, piece and next piece from game
    const grid = game.grid;
    const piece = game.piece;
    const nextPiece = game.nextPiece;

    // Variables computes
    const cellSize = 3;

    const pieceX = (piece?.x ?? 0) * cellSize;
    const pieceY = (piece?.y ?? 0) * cellSize;

    const previewX = (game.grid.width + 1) * cellSize;
    const previewGrid = Array(25).fill('E');
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
    const spectrumStyle = createSpectrumTheme(currentTheme, cellSize, cellSize / 4, room);

    return (
        <main className="dev-page">
        <p>{room.players.length == 1 ? 'Solo game' : 'Multi player game'}</p>
        {game.win != undefined && <p>You {game.win ? 'win !' : 'lose -_-'}</p>}
        {!room.isPlaying && <button
            type="button"
            onClick={() => goToRoom()}
        >
            Go back to room
        </button>}
        <div className='game-board' style={gameStyle}>
            {renderCells(grid.cells, 0, 0, grid.width, grid.height)}
            {renderCells(piece.cells, pieceX, pieceY, piece.width, piece.height)}
            {renderCells(previewGrid, previewX, 0, 5, 5)}
            {renderCells(nextPiece.cells, previewX + previewOffset, previewOffset, nextPiece.width, nextPiece.height)}
        </div>
        <div className='spectrums'style={spectrumStyle}>
            {Object.values(spectrums).map((spectrumData) => renderSpectrum(spectrumData))}
        </div>
        </main>
    )
}
