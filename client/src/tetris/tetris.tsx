import './tetris.css'

function Tetris() {
  const grid = Array(200).fill('E');
  const piece = [
    ' ', 'T', ' ',
    'T', 'T', 'T',
    ' ', ' ', ' ',
  ];

  const gridSize = [10, 20];
  const piecePos = [5, 3];
  const pieceSize = [3, 3];
  const cellSize = 2;

  const gameStyle = {
    '--cell-size': `${cellSize}em`,
    '--color-U' : '#323232',
    '--color-E' : '#646464',
    '--color-I' : '#01EDFA',
    '--color-J' : '#485DC5',
    '--color-L' : '#FFC82E',
    '--color-O' : '#FEFB34',
    '--color-S' : '#53DA3F',
    '--color-T' : '#EA141C',
    '--color-V' : '#39892F',
    '--color-Z' : '#DD0AB2',
  } as React.CSSProperties;

  const gridStyle = {
    '--width': gridSize[0],
    '--height': gridSize[1],
  } as React.CSSProperties;

  const pieceStyle = {
    '--x': `${piecePos[0] * cellSize}em`,
    '--y': `-${(gridSize[1] - piecePos[1]) * cellSize}em`,
    '--width': pieceSize[0],
    '--height': pieceSize[1],
  } as React.CSSProperties;

  return (
    <>
      <h1>Tetris</h1>
      <div className='game-board' style={gameStyle}>
        <div className='game-grid' style={gridStyle}>
          {grid.map((cell, index) => (
            <div key={index} className={`game-cell cell-${cell}`}/>
          ))}
        </div>
        <div className='game-piece' style={pieceStyle}>
          {piece.map((cell, index) => (
            <div key={index} className={`game-cell cell-${cell}`}/>
          ))}
        </div>
      </div>
    </>
  )
}

export default Tetris
