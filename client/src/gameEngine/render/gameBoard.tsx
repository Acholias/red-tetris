import './gameBoard.css'
import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from '../../store/store';
import { movePiece, rotatePiece, softDrop, hardDrop, tick } from '../logic/gameSlice';
import { useEffect } from 'react';
import { createInterval } from '../utils/intervals';
import { renderCells } from './render';
import { createGameTheme } from '../../theme/theme';

export default function GameBoard() {
  // Get game and theme from store
  const game = useSelector((state: RootState) => state.game);
  const currentTheme = useSelector((state: RootState) => state.theme);
  const dispatch = useDispatch();

  // Set game tick interval
  createInterval(() => {
      dispatch(tick());
    },
    game.isEnd ? null : game.speed * 1000);

  // Keyboard mapping
  useEffect(() => {
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
  const gameStyle = createGameTheme(currentTheme, cellSize);

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
