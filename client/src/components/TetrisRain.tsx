/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   TetrisRain.tsx                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: lumugot <lumugot@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/04/26 22:40:15 by lumugot           #+#    #+#             */
/*   Updated: 2026/04/28 11:27:11 by lumugot          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import type { CSSProperties } from "react";

type TetriminoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L'
type Cell = readonly [number, number]

const BASE: Record<TetriminoType, Cell[]> = {
  I: [[0, 1], [1, 1], [2, 1], [3, 1]],
  O: [[1, 1], [2, 1], [1, 2], [2, 2]],
  T: [[1, 1], [0, 2], [1, 2], [2, 2]],
  S: [[1, 1], [2, 1], [0, 2], [1, 2]],
  Z: [[0, 1], [1, 1], [1, 2], [2, 2]],
  J: [[0, 1], [0, 2], [1, 2], [2, 2]],
  L: [[2, 1], [0, 2], [1, 2], [2, 2]],
}

function rotate90([x, y]: Cell): Cell {
	return [y, 3 - x]
}

function rotateCells(cells: Cell[], turns: number): Cell[] {
	const t = ((turns % 4) + 4) % 4
	let out = cells

	for (let i = 0; i < t; i++) 
    out = out.map(rotate90)
		
	return out
}

function clamp01(n: number) {
	return Math.max(0, Math.min(1, n))
}

function makePieces(count: number) {
	  const types: TetriminoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L']
  
    return Array.from({ length: count }).map((_, i) => {
    const type = types[i % types.length]
    const turns = Math.floor(Math.random() * 4)
    const cells = rotateCells(BASE[type], turns)

    const x = `${Math.round(clamp01(Math.random()) * 92 + 4)}%`
    const delay = `${-(Math.random() * 26).toFixed(2)}s`
    const dur = `${(10 + Math.random() * 20).toFixed(2)}s`
    const size = `${Math.round(10 + Math.random() * 18)}px`
    const drift = `${(Math.random() * 160 - 20).toFixed(0)}px`

    return { id: `${type}-${i}`, type, cells, x, delay, dur, size, drift }
  })
}

export function TetrisRain() {
	const pieces = makePieces(18)

	return (
    <div className="tetrisRain" aria-hidden="true">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="tetroWrap"
          style={
            {
              ['--x' as never]: p.x,
              ['--dur' as never]: p.dur,
              ['--delay' as never]: p.delay,
              ['--drift' as never]: p.drift,
            } as CSSProperties
          }
        >
          <div
            className={`tetro t-${p.type}`}
            style={
              {
                ['--cell' as never]: p.size,
              } as CSSProperties
            }
          >
            {p.cells.map(([cx, cy], idx) => (
              <span
                key={idx}
                className="cell"
                style={
                  {
                    gridColumn: cx + 1,
                    gridRow: cy + 1,
                  } as CSSProperties
                }
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}