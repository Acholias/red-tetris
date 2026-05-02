/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Game.tsx                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: lumugot <lumugot@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/04/28 10:25:02 by lumugot           #+#    #+#             */
/*   Updated: 2026/04/29 11:49:55 by lumugot          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { useLocation } from 'react-router-dom'
import GameBoard from '../gameEngine/render/gameBoard'

type GameState = {
  mode?: 'solo' | 'multi'
  playerName?: string
  room?: string
}

export default function Game() {
  const location = useLocation()
  const state = (location.state as GameState | undefined) || undefined

  return (
    <main className="dev-page">
      <p>{state?.mode === 'multi' ? 'Multi player game' : 'Solo game'}</p>
      <GameBoard/>
    </main>
  )
}
