export function renderCells(
          cells: string[],
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
