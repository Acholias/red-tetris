/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Spectator.tsx                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: lumugot <lumugot@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/04/28 12:25:03 by lumugot           #+#    #+#             */
/*   Updated: 2026/06/16 18:55:02 by lumugot          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import './Spectator.css'
import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from '../../store/store';
import { createGameTheme } from '../../theme/theme';
import { renderSpectrum } from '../../gameEngine/render/render';
import { clearSpectrums, initSpectrums } from '../../gameEngine/logic/spectrumsSlice';

export default function Spectator() {
    const navigate = useNavigate();

    // Get game and theme from store
    const spectrums = useSelector((state: RootState) => state.spectrums);
    const room = useSelector((state: RootState) => state.room);
    const currentTheme = useSelector((state: RootState) => state.theme);
    const dispatch = useDispatch();

    const activePlayers = useMemo(() => {
        return room.players
            .map((player) => ({
                player,
                spectrum: spectrums[player.id],
            }))
            .filter((entry) => entry.spectrum != null)
    }, [room.players, spectrums])

    // Init spectrums if needed
    useEffect(() => {
        if (room.id == '') {
            return;
        }

        dispatch(clearSpectrums());
        if (room.players.length > 0) {
            dispatch(initSpectrums({room: room, skipCurrentPlayer: false}));
        }
    }, [dispatch, room.id, room.size.h, room.size.w, room.players.map((player) => `${player.id}:${player.name}`).join('|')]);

    // Variables computes
    const cellSize = useMemo(() => {
        const base = room.size.w >= 18 || room.size.h >= 28 ? 1.0 : 1.25;
        const crowdFactor = Math.max(0.85, 1 - Math.max(0, activePlayers.length - 3) * 0.05);
        return Math.max(0.9, Math.min(1.6, base * crowdFactor));
    }, [activePlayers.length, room.size.h, room.size.w]);

    // Style define
    const spectrumStyle = createGameTheme(currentTheme, cellSize);
    const orbitDuration = Math.max(18, 8 + activePlayers.length * 4);
    const orbitRadius = Math.max(14, Math.min(24, 12 + activePlayers.length * 1.7));

    const spectatorStyle = {
        ...spectrumStyle,
        '--orbit-duration': `${orbitDuration}s`,
        '--orbit-radius': `${orbitRadius}vmin`,
        '--spectator-count': `${Math.max(activePlayers.length, 1)}`,
      '--spectator-accent-1': currentTheme.themeGame.color_I,
      '--spectator-accent-2': currentTheme.themeGame.color_J,
      '--spectator-accent-3': currentTheme.themeGame.color_O,
      '--spectator-accent-strong': currentTheme.themeGame.color_T,
    } as React.CSSProperties;

    const playerSummary = room.players.length === 1 ? '1 player' : `${room.players.length} players`;

    return (
      <main className="page spectator-page" style={spectatorStyle}>
        <section className="spectator-shell">
          <header className="spectator-header">
            <h1>{room.id || 'Spectator'}</h1>
          </header>

          <div className="spectator-stage">
            <div className="spectator-orbit">
              <div className="spectator-core" aria-hidden="true" />

              {activePlayers.length > 0 ? activePlayers.map(({ player, spectrum }, index) => {
                const orbitDelay = -(orbitDuration / Math.max(activePlayers.length, 1)) * index;

                return (
                  <div
                    key={player.id}
                    className="spectator-orbit-item"
                    style={{
                      '--orbit-delay': `${orbitDelay}s`,
                    } as React.CSSProperties}
                  >
                    <div className="spectator-card">
                      {renderSpectrum(spectrum)}
                    </div>
                  </div>
                )
              }) : (
                <div className="spectator-empty">
                  <p>No player board available yet.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    )
}
