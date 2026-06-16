/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Lobby.tsx                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: lumugot <lumugot@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/04/29 11:05:43 by lumugot           #+#    #+#             */
/*   Updated: 2026/06/16 19:10:33 by lumugot          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import './Lobby.css'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { renderPlayer } from '../../gameRoom/render/render'
import { initRoom } from '../../gameRoom/logic/roomSlice'
import { canYouPlay, canYouSpectate } from '../../gameRoom/utils/functions'
import { type RootState } from '../../store/store'
import { createRoomTheme } from '../../theme/theme'
import {
    maxGridHeight,
    maxGridWidth,
    maxSpeed,
    maxSpeedFrequency,
    maxSpeedRate,
    minGridHeight,
    minGridWidth,
    minSpeed,
    minSpeedFrequency,
    minSpeedRate,
} from '@shared/defines'
import type { BodyRoomSettings } from '@shared/requestBody'

function clampNumber(value: number, min: number, max: number) {
    return Math.min(max, Math.max(min, value))
}

export default function Lobby() {
    const navigate = useNavigate();
    const { room: urlRoom, playerName: urlPlayer } = useParams();

    const room = useSelector((state: RootState) => state.room);
    const currentTheme = useSelector((state: RootState) => state.theme);
    const dispatch = useDispatch();

    useEffect(() => {
        if (room.isSocketConnected && room.id == '' && urlRoom != null && urlPlayer != null) {
            dispatch(initRoom({id: urlRoom, playerName: urlPlayer}));
            dispatch({'type': 'room/join', 'payload': {
                'roomId': urlRoom,
                'playerName': urlPlayer,
            }});
        }
    }, [dispatch, room.isSocketConnected, room.id, urlRoom, urlPlayer]);

    useEffect(() => {
        if (!room.isPlaying) return;

        for (const player of room.players) {
        if (player.id == room.yourId) {
            navigate('/game');
            return;
        }
        }

        navigate('/spectator');
    }, [dispatch, room.isPlaying]);

    function updateSettings(payload: Partial<BodyRoomSettings>) {
        if (urlRoom == null) {
            return;
        }

        dispatch({
            'type' : 'room/settings',
            'payload' : {
                'roomId': urlRoom,
                ...payload,
            }
        });
    }

    function changePlayerMode(spectate: boolean) {
        dispatch({
            'type' : 'room/playerMode',
            'payload' : {
                'roomId': urlRoom,
                'spectate' : spectate,
            }
        });
    }

    function startGame() {
        dispatch({
            'type' : 'room/startGame',
            'payload' : {
                'roomId': urlRoom,
            }
        });
    }

    function quitRoom() {
        dispatch({
            'type' : 'room/leave',
            'payload' : {
                'roomId': urlRoom,
            }
        });
        navigate('/');
    }

    function updateRoomSize(field: 'w' | 'h', value: number) {
        updateSettings({
            size: {
                ...room.size,
                [field]: value,
            },
        });
    }

    function updateGameSpeed(field: 'speed' | 'acceleration' | 'frequency' | 'rate' | 'max', value: number | boolean) {
        updateSettings({
            gameSpeed: {
                ...room.gameSpeed,
                [field]: value,
            },
        });
    }

    function stepRoomSize(field: 'w' | 'h', delta: number) {
        const nextValue = field === 'w'
            ? clampNumber(room.size.w + delta, minGridWidth, maxGridWidth)
            : clampNumber(room.size.h + delta, minGridHeight, maxGridHeight)

        updateRoomSize(field, nextValue)
    }

    function stepGameSpeed(field: 'speed' | 'frequency' | 'rate' | 'max', delta: number) {
        const bounds = {
            speed: { min: minSpeed, max: maxSpeed },
            frequency: { min: minSpeedFrequency, max: maxSpeedFrequency },
            rate: { min: minSpeedRate, max: maxSpeedRate },
            max: { min: minSpeed, max: maxSpeed },
        }[field]

        const nextValue = clampNumber(room.gameSpeed[field] + delta, bounds.min, bounds.max)

        updateGameSpeed(field, nextValue)
    }

    const isLocalAdmin = room.yourId === 0
    const canEditRoom = room.isAdmin || isLocalAdmin

    const roomId = urlRoom ?? '';
    const roomLabel = roomId.length > 0 ? `Lobby ${roomId}` : 'Lobby';
    const playerCount = room.players.length;
    const gameModeLabel = playerCount > 1 ? 'Multi' : 'Solo';
    const pieceSetLabel = room.allPieces ? 'Basics + bonus' : 'Basics';
    const malusLabel = room.malus ? 'ON' : 'OFF';
    const speedLabel = `${room.gameSpeed.speed} ticks / sec`;
    const gridLabel = `${room.size.w} x ${room.size.h}`;

    const roomStyle = createRoomTheme(currentTheme);

    const lobbyStyle = {
        ...roomStyle,
        '--lobby-hero-bg': currentTheme.themeRoom.you_background,
        '--lobby-button-bg': currentTheme.themeGame.color_J,
        '--lobby-button-bg-2': currentTheme.themeGame.color_I,
        '--lobby-button-border': currentTheme.themeGame.color_O,
        '--lobby-button-shadow': currentTheme.themeGame.color_T,
    } as React.CSSProperties

    return (
        <main className="page lobby-page" style={lobbyStyle}>
            <section className="lobby-shell">
                <header className="lobby-hero">
                    <div className="lobby-hero-copy">
                        <span className="lobby-kicker">Game room</span>
                        <h1>{roomLabel}</h1>
                    </div>

                    <div className="lobby-hero-meta">
                        <span className="status-pill">{gameModeLabel}</span>
                        <span className="status-pill">{playerCount} players</span>
                        <span className="status-pill">{gridLabel}</span>
                        <span className="status-pill">{speedLabel}</span>
                        <span className={`status-pill ${room.isPlaying ? 'status-pill--live' : 'status-pill--waiting'}`}>
                            {room.isPlaying ? 'In game' : 'Waiting room'}
                        </span>
                    </div>
                </header>

                <div className="lobby-layout">
                    <section className="lobby-panel lobby-panel--settings">
                        <div className="panel-heading">
                            <div>
                                <span className="panel-eyebrow">Parameters</span>
                                <h2>Match setup</h2>
                            </div>
                            <p>
                                {canEditRoom ? 'Admin controls are live.' : 'View-only for non-admin players.'}
                            </p>
                        </div>

                        <div className="settings-summary">
                            <div>
                                <span>Grid</span>
                                <strong>{gridLabel}</strong>
                            </div>
                            <div>
                                <span>Speed</span>
                                <strong>{speedLabel}</strong>
                            </div>
                            <div>
                                <span>Pieces</span>
                                <strong>{pieceSetLabel}</strong>
                            </div>
                            <div>
                                <span>Malus</span>
                                <strong>{malusLabel}</strong>
                            </div>
                        </div>

                        <div className="settings-stack">
                            <article className="setting-card">
                                <div className="setting-card__header">
                                    <div>
                                        <span className="setting-label">Pieces</span>
                                        <h3>Set selection</h3>
                                    </div>
                                    <span className="setting-state">{pieceSetLabel}</span>
                                </div>
                                {canEditRoom ? (
                                    <div className="toggle-group" role="group" aria-label="Piece set selection">
                                        <button
                                            type="button"
                                            className={!room.allPieces ? 'is-active' : ''}
                                            onClick={() => updateSettings({ allPieces: false })}
                                        >
                                            Basics
                                        </button>
                                        <button
                                            type="button"
                                            className={room.allPieces ? 'is-active' : ''}
                                            onClick={() => updateSettings({ allPieces: true })}
                                        >
                                            Basics + bonus
                                        </button>
                                    </div>
                                ) : (
                                    <p className="setting-copy">{pieceSetLabel}</p>
                                )}
                            </article>

                            <article className="setting-card">
                                <div className="setting-card__header">
                                    <div>
                                        <span className="setting-label">Malus</span>
                                        <h3>Enabled effects</h3>
                                    </div>
                                    <span className={`setting-state ${room.malus ? 'is-on' : 'is-off'}`}>
                                        {malusLabel}
                                    </span>
                                </div>
                                {canEditRoom ? (
                                    <div className="toggle-group" role="group" aria-label="Malus toggle">
                                        <button
                                            type="button"
                                            className={!room.malus ? 'is-active' : ''}
                                            onClick={() => updateSettings({ malus: false })}
                                        >
                                            OFF
                                        </button>
                                        <button
                                            type="button"
                                            className={room.malus ? 'is-active' : ''}
                                            onClick={() => updateSettings({ malus: true })}
                                        >
                                            ON
                                        </button>
                                    </div>
                                ) : (
                                    <p className="setting-copy">{malusLabel}</p>
                                )}
                            </article>

                            <article className="setting-card">
                                <div className="setting-card__header">
                                    <div>
                                        <span className="setting-label">Grid</span>
                                        <h3>Board size</h3>
                                    </div>
                                    <span className="setting-state">{gridLabel}</span>
                                </div>
                                {canEditRoom ? (
                                    <div className="grid-editor">
                                        <div className="stepper-field">
                                            <span>Width</span>
                                            <div className="stepper">
                                                <button type="button" onClick={() => stepRoomSize('w', -1)} aria-label="Decrease width">−</button>
                                                <strong>{room.size.w}</strong>
                                                <button type="button" onClick={() => stepRoomSize('w', 1)} aria-label="Increase width">+</button>
                                            </div>
                                        </div>
                                        <div className="stepper-field">
                                            <span>Height</span>
                                            <div className="stepper">
                                                <button type="button" onClick={() => stepRoomSize('h', -1)} aria-label="Decrease height">−</button>
                                                <strong>{room.size.h}</strong>
                                                <button type="button" onClick={() => stepRoomSize('h', 1)} aria-label="Increase height">+</button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="setting-copy">{gridLabel}</p>
                                )}
                            </article>

                            <article className="setting-card setting-card--full">
                                <div className="setting-card__header">
                                    <div>
                                        <span className="setting-label">Speed</span>
                                        <h3>Ticks per second</h3>
                                    </div>
                                    <span className="setting-state">{speedLabel}</span>
                                </div>

                                {canEditRoom ? (
                                    <>
                                        <div className="grid-editor grid-editor--speed">
                                            <div className="stepper-field">
                                                <span>Base speed</span>
                                                <div className="stepper">
                                                    <button type="button" onClick={() => stepGameSpeed('speed', -1)} aria-label="Decrease speed">−</button>
                                                    <strong>{room.gameSpeed.speed}</strong>
                                                    <button type="button" onClick={() => stepGameSpeed('speed', 1)} aria-label="Increase speed">+</button>
                                                </div>
                                            </div>

                                            <div className="field compact-field field--toggle">
                                                <span>Acceleration</span>
                                                <button
                                                    type="button"
                                                    className={`toggle-pill ${room.gameSpeed.acceleration ? 'is-on' : ''}`}
                                                    onClick={() => updateGameSpeed('acceleration', !room.gameSpeed.acceleration)}
                                                >
                                                    {room.gameSpeed.acceleration ? 'Enabled' : 'Disabled'}
                                                </button>
                                            </div>
                                        </div>

                                        {room.gameSpeed.acceleration && (
                                            <div className="advanced-grid">
                                                <div className="stepper-field">
                                                    <span>Frequency</span>
                                                    <div className="stepper">
                                                        <button type="button" onClick={() => stepGameSpeed('frequency', -1)} aria-label="Decrease frequency">−</button>
                                                        <strong>{room.gameSpeed.frequency}</strong>
                                                        <button type="button" onClick={() => stepGameSpeed('frequency', 1)} aria-label="Increase frequency">+</button>
                                                    </div>
                                                </div>
                                                <div className="stepper-field">
                                                    <span>Rate</span>
                                                    <div className="stepper">
                                                        <button type="button" onClick={() => stepGameSpeed('rate', -1)} aria-label="Decrease rate">−</button>
                                                        <strong>{room.gameSpeed.rate}</strong>
                                                        <button type="button" onClick={() => stepGameSpeed('rate', 1)} aria-label="Increase rate">+</button>
                                                    </div>
                                                </div>
                                                <div className="stepper-field">
                                                    <span>Max speed</span>
                                                    <div className="stepper">
                                                        <button type="button" onClick={() => stepGameSpeed('max', -1)} aria-label="Decrease max speed">−</button>
                                                        <strong>{room.gameSpeed.max}</strong>
                                                        <button type="button" onClick={() => stepGameSpeed('max', 1)} aria-label="Increase max speed">+</button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="speed-summary">
                                        <p>{speedLabel}</p>
                                        {room.gameSpeed.acceleration ? (
                                            <>
                                                <p>Acceleration: enabled</p>
                                                <p>Frequency: every {room.gameSpeed.frequency} ticks</p>
                                                <p>Rate: {room.gameSpeed.rate} ticks / sec</p>
                                                <p>Max speed: {room.gameSpeed.max} ticks / sec</p>
                                            </>
                                        ) : (
                                            <p>Acceleration: disabled</p>
                                        )}
                                    </div>
                                )}
                            </article>
                        </div>
                    </section>

                    <section className="lobby-panel lobby-panel--side">
                        <div className="panel-heading">
                            <div>
                                <span className="panel-eyebrow">Room</span>
                            </div>
                        </div>

                        <div className="room-info">
                            <div className="player-list">
                                <h3>Players</h3>
                                {room.players.length > 0 ? room.players.map((player) => (
                                    renderPlayer(player, room.yourId)
                                )) : <p className="player-empty">No players yet.</p>}
                            </div>
                            <div className="player-list">
                                <h3>Spectators</h3>
                                {room.spectators.length > 0 ? room.spectators.map((player) => (
                                    renderPlayer(player, room.yourId)
                                )) : <p className="player-empty">No spectators yet.</p>}
                            </div>
                        </div>
                    </section>
                </div>

                <section className="lobby-panel lobby-actions">
                    <button
                        type="button"
                        className="secondary-action"
                        onClick={() => {quitRoom()}}
                    >
                        Quit room
                    </button>
                    {canYouPlay(room) && <button
                        type="button"
                        className="secondary-action"
                        onClick={() => {changePlayerMode(false)}}
                    >
                        Play
                    </button>}
                    {canYouSpectate(room) && <button
                        type="button"
                        className="secondary-action"
                        onClick={() => {changePlayerMode(true)}}
                    >
                        Spectate
                    </button>}
                    {canEditRoom && !room.isPlaying && room.players.length > 0 && <button
                        type="button"
                        className="primary-action"
                        onClick={() => startGame()}
                    >
                        Start game
                    </button>}
                </section>
            </section>
        </main>
    )
}
