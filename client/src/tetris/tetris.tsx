import './tetris.css'
import { type GameData, initGame } from './gameEngine/gameData.tsx'
import { useState } from 'react';

function renderCells(
          cells: Array<string>,
          x: number, y: number,
          w: number, h: number) {
  const gridStyle = {
    '--x': `${x}vh`,
    '--y': `${y}vh`,
    '--width': w,
    '--height': h,
  } as React.CSSProperties;

  return (
    <div className='game-grid' style={gridStyle}>
      {cells.map((cell, index) => (
        <div key={index} className={`game-cell cell-${cell}`}/>
      ))}
    </div>
  )
}


function Tetris() {
  const [gameData, setGame] = useState<GameData | null>(null);

  const startGame = () => {
    const game = initGame([10, 20], 0.5, true, 0, 0);
    setGame(game);
  };

  // Grid get from back
  const grid = Array(200).fill('E');
  const gridSize = [10, 20];

  // Piece get from back
  const piece = [
    ' ', 'T', ' ',
    'T', 'T', 'T',
    ' ', ' ', ' ',
  ];
  const piecePos = [5, 3];
  const pieceSize = [3, 3];

  // Preview get from back
  const previewPiece = [
    ' ', 'Z', 'Z',
    'Z', 'Z', ' ',
    ' ', ' ', ' ',
  ];
  const previewPieceSize = [3, 3];

  // Variables computes
  const cellSize = 3;

  const pieceX = piecePos[0] * cellSize;
  const pieceY = piecePos[1] * cellSize;

  const previewX = (gridSize[0] + 1) * cellSize;
  const previewGrid = Array(previewPieceSize[0] * previewPieceSize[1]).fill('E');

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
      <h1>Tetris</h1>
      <div className='game-board' style={gameStyle}>
        {renderCells(grid, 0, 0, gridSize[0], gridSize[1])}
        {renderCells(piece, pieceX, pieceY, pieceSize[0], pieceSize[1])}
        {renderCells(previewGrid, previewX, 0, pieceSize[0], pieceSize[1])}
        {renderCells(previewPiece, previewX, 0, pieceSize[0], pieceSize[1])}
      </div>
    </>
  )
}

export default Tetris
