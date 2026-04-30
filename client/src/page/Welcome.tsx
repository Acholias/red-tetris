/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Welcome.tsx                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: gugus <gugus@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/04/30 13:05:38 by lumugot           #+#    #+#             */
/*   Updated: 2026/04/30 21:59:42 by gugus            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { useLocation, useNavigate } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { TetrisRain } from '../components/TetrisRain'

function sanitizeSegment(value: string) {
	return value.trim().replaceAll('/', '').replaceAll(' ', '-')
}

type WelcomeProps = {
	playerName: string
	setPlayerName: React.Dispatch<React.SetStateAction<string>>
	avatar: string | null
	isDevProfile: boolean
}

export default function Welcome({ playerName, setPlayerName, avatar, isDevProfile }: WelcomeProps) {
	const navigate = useNavigate()
	const location = useLocation()
	const [room, setRoom] = useState('')

	const cleanPlayer = useMemo(() => sanitizeSegment(playerName), [playerName])
	const cleanRoom = useMemo(() => sanitizeSegment(room), [room])

	return (
		<main className="page">
			<button
				type="button"
				className={`floating-btn profile-button ${avatar ? 'profile-avatar-button' : ''} ${isDevProfile ? 'is-dev-profile' : ''}`}
				onClick={() => navigate('/profile', { state: { backgroundLocation: location } })}
				aria-label="Open profile"
			>
				{avatar ? <img className="profile-avatar-image" src={avatar} alt="Current avatar" /> : 'Profile'}
			</button>
			<button className="floating-btn dev-button" onClick={() => navigate('/dev')}>Devs</button>
			<TetrisRain />
			<h1>Blue Tetris</h1>

			<section className="card">
				<label className="field">
					<span>Player name</span>
					<input
						className={isDevProfile ? 'dev-name-input dev-name-input--gold' : ''}
						value={playerName}
						onChange={(e) => {
							console.log('Welcome: player input', e.target.value)
							setPlayerName(e.target.value)
						}}
						placeholder="PlayerName"
						autoComplete="nickname"
					/>
				</label>

				<label className="field">
					<span>Room</span>
					<input
						value={room}
						onChange={(e) => {
							console.log('Welcome: room input', e.target.value)
							setRoom(e.target.value)
						}}
						placeholder="42"
					/>
				</label>

				<div className="actions">
					<button
						type="button"
						disabled={!cleanPlayer}
						onClick={() => navigate('/game', { state: { mode: 'solo', playerName } })}
					>
						Play solo
					</button>

					<button
						type="button"
						disabled={!cleanPlayer || !cleanRoom}
						onClick={() => navigate(`/${room}/${playerName}`, { state: { mode: 'multi', playerName, room } })}
					>
						Play multi
					</button>

					<button
						type="button"
						disabled={!cleanPlayer || !cleanRoom}
						onClick={() => navigate('/spectator')}
						className="spectator-btn"
					>
						Spectator
					</button>
				</div>
			</section>
		</main>
	)
}

