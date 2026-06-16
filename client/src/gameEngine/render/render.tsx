import type { SpectrumData } from "../logic/spectrumsSlice";

export function renderCells(
          cells: string[],
          x: number, y: number,
          w: number, h: number) {
  const gridStyle = {
    '--x': `${x}px`,
    '--y': `${y}px`,
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

export function renderSpectrum(spectrum: SpectrumData) {
  const gridStyle = {
    '--x': `${0}px`,
    '--y': `${0}px`,
    '--width': spectrum.grid.width,
    '--height': spectrum.grid.height,
  } as React.CSSProperties;

  return (
    <div className="spectrum">
      <p>{spectrum.playerName}</p>
      <div className="game-board">
        <div className='game-grid' style={gridStyle}>
          {spectrum.grid.cells.map((cell, index) => (
            <div key={index} className={`game-cell cell-${cell}`}/>
          ))}
        </div>
      </div>
    </div>
  )
}
