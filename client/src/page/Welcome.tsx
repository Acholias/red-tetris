/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Welcome.tsx                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: lumugot <lumugot@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/04/30 13:05:38 by lumugot           #+#    #+#             */
/*   Updated: 2026/06/16 23:03:42 by lumugot          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { useLocation, useNavigate } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { TetrisRain } from '../components/TetrisRain'
import { useDispatch } from 'react-redux';
import { initRoom } from '../gameRoom/logic/roomSlice';

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
	const [roomId, setRoomId] = useState('')

	const cleanPlayer = useMemo(() => sanitizeSegment(playerName), [playerName])
	const cleanRoom = useMemo(() => sanitizeSegment(roomId), [roomId])

	const dispatch = useDispatch();

	function joinRoomMulti() {
		dispatch(initRoom({id: roomId, playerName: playerName}));
		dispatch({'type': 'room/join', 'payload': {
			'roomId': roomId,
			'playerName': playerName,
		}});
		navigate(`/${roomId}/${playerName}`);
	}

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
							setPlayerName(e.target.value)
						}}
						placeholder="PlayerName"
						autoComplete="nickname"
					/>
				</label>

				<label className="field">
					<span>Room</span>
					<input
						value={roomId}
						onChange={(e) => {
							setRoomId(e.target.value)
						}}
						placeholder="42"
					/>
				</label>

				<div className="actions">
					<button
						type="button"
						disabled={!cleanPlayer || !cleanRoom}
						onClick={joinRoomMulti}
					>
						Play
					</button>
				</div>
			</section>
		</main>
	)
}

