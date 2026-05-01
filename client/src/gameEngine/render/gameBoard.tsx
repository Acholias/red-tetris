import './gameBoard.css'
import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from '../../store/store';
import { initGame, movePiece, rotatePiece, softDrop, hardDrop, tick } from '../logic/gameSlice';
import { useEffect } from 'react';
import { io, type Socket } from "socket.io-client";
import { createInterval } from '../utils/intervals';
import { renderCells } from './render';

export default function GameBoard() {
  // Get game from store
  const game = useSelector((state: RootState) => state.game);
  const dispatch = useDispatch();

  // Set game tick interval
  createInterval(() => {
      dispatch(tick());
    },
    game.isEnd ? null : game.speed * 1000);

  // Keyboard mapping
  useEffect(() => {
    // Init game at page start
    dispatch(initGame({
      speed: 0.5,
      allPieces: true,
      width: 10,
      height: 20,
      pieceId: 's',
      nextPieceId: 't',
    }));

    // Key handler
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          dispatch(rotatePiece());
          break
        case 'ArrowLeft':
          event.preventDefault();
          dispatch(movePiece({right: false}));
          break
        case 'ArrowRight':
          event.preventDefault();
          dispatch(movePiece({right: true}));
          break
        case 'ArrowDown':
          event.preventDefault();
          dispatch(softDrop());
          break
        case ' ':
          event.preventDefault();
          dispatch(hardDrop());
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
  const gameStyle = {
    '--cell-size': `${cellSize}vh`,
    '--color-E' : '#646464',
    '--color-I' : '#01EDFA',
    '--color-J' : '#485DC5',
    '--color-L' : '#FFC82E',
    '--color-M' : '#969696',
    '--color-O' : '#FEFB34',
    '--color-S' : '#53DA3F',
    '--color-T' : '#EA141C',
    '--color-U' : '#323232',
    '--color-V' : '#39892F',
    '--color-Z' : '#DD0AB2',
    '--texture-E' : "url('/styles/basic/empty.png')",
    '--texture-I' : "url('/styles/basic/cell.png')",
    '--texture-J' : "url('/styles/basic/cell.png')",
    '--texture-L' : "url('/styles/basic/cell.png')",
    '--texture-M' : "url('/styles/basic/cell.png')",
    '--texture-O' : "url('/styles/basic/cell.png')",
    '--texture-S' : "url('/styles/basic/cell.png')",
    '--texture-T' : "url('/styles/basic/cell.png')",
    '--texture-U' : "url('/styles/basic/cell.png')",
    '--texture-V' : "url('/styles/basic/cell.png')",
    '--texture-Z' : "url('/styles/basic/cell.png')",
  } as React.CSSProperties;

  return (
    <>
      <div className='game-board' style={gameStyle}>
        {renderCells(grid.cells, 0, 0, grid.width, grid.height)}
        {renderCells(piece.cells, pieceX, pieceY, piece.width, piece.height)}
        {renderCells(previewGrid, previewX, 0, 5, 5)}
        {renderCells(nextPiece.cells, previewX + previewOffset, previewOffset, nextPiece.width, nextPiece.height)}
      </div>
    </>
  )
}
