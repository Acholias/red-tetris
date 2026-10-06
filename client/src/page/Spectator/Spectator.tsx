import '../Game/Game.css';
import './Spectator.css';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store/store';
import { createSpectrumTheme } from '../../theme/theme';
import { renderSpectrum } from '../../gameEngine/render/render';
import { clearSpectrums, initSpectrums } from '../../gameEngine/logic/spectrumsSlice';

export default function Spectator() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const room = useSelector((state: RootState) => state.room);
    const spectrums = useSelector((state: RootState) => state.spectrums);
    const currentTheme = useSelector((state: RootState) => state.theme);

    const centerSpectatorRef = useRef<HTMLElement | null>(null);
    const [centerSpectatorSize, setcenterSpectatorSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

    const spectatorPanelRef = useRef<HTMLDivElement | null>(null);
    const [spectatorPanelSize, setspectatorPanelSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

    useEffect(() => {
        if (typeof ResizeObserver === 'undefined') return;

        const ro = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const rect = entry.contentRect;

                if (entry.target === centerSpectatorRef.current) {
                    setcenterSpectatorSize({ width: rect.width, height: rect.height });
                }
                else if (entry.target === spectatorPanelRef.current) {
                    setspectatorPanelSize({ width: rect.width, height: rect.height });
                }
            }
        });

        if (centerSpectatorRef.current) ro.observe(centerSpectatorRef.current);
        if (spectatorPanelRef.current) ro.observe(spectatorPanelRef.current);

        return () => ro.disconnect();
    }, []);

    useEffect(() => {
        if (room.id === '') {
            return;
        }

        dispatch(clearSpectrums());

        if (room.players.length > 0) {
            dispatch(
                initSpectrums({
                    room,
                    skipCurrentPlayer: false,
                })
            );
        }
    }, [
        dispatch,
        room.id,
        room.size.w,
        room.size.h,
        room.players.map(
            (player) => `${player.id}:${player.name}`
        ).join('|'),
    ]);

    const allSpectrums = useMemo(() => {
        return room.players
            .map((player) => ({
                player,
                spectrum: spectrums[player.id],
            }))
            .filter((entry) => entry.spectrum != null);
    }, [room.players, spectrums]);

    const centerSpectrum = allSpectrums[0]?.spectrum;
    const sideSpectrums = allSpectrums
        .slice(1)
        .map((entry) => entry.spectrum);

    const centerSpectrumCellSize = useMemo(() => {
        const width = centerSpectatorSize.width;
        const height = centerSpectatorSize.height;
        if (width <= 0 || height <= 0 || !centerSpectrum) return 32;

        const safeWidth = Math.max(0, width - 24);
        const safeHeight = Math.max(0, height - 80);

        const boardCellsX = centerSpectrum.grid.width;
        const boardCellsY = Math.max(centerSpectrum.grid.height, 5);
        const cellPx = Math.min(safeWidth / boardCellsX, safeHeight / boardCellsY);

        return Math.max(10, Math.min(80, cellPx));
    }, [centerSpectrum?.grid.height, centerSpectrum?.grid.width, centerSpectatorSize.height, centerSpectatorSize.width]);

    const spectrumCellSize = useMemo(() => {
        const width = spectatorPanelSize.width;
        const height = spectatorPanelSize.height;
        if (width <= 0 || height <= 0 || !centerSpectrum) return 16;

        const safeWidth = Math.max(0, width - 24);
        const safeHeight = Math.max(0, height - 80);

        const boardCellsX = centerSpectrum.grid.width;
        const boardCellsY = Math.max(centerSpectrum.grid.height, 5);
        const cellPx = Math.min(safeWidth / boardCellsX, safeHeight / boardCellsY);

        return Math.max(5, Math.min(40, cellPx));
    }, [centerSpectrum?.grid.height, centerSpectrum?.grid.width, spectatorPanelSize.height, spectatorPanelSize.width]);

    const centerSpectrumStyle = createSpectrumTheme(
        currentTheme,
        0,
        centerSpectrumCellSize,
        room
    );

    const spectrumStyle = createSpectrumTheme(
        currentTheme,
        0,
        spectrumCellSize,
        room
    );

    // Navigate back to lobby
    function goToRoom() {
        if (room.id == '') {
            navigate('/');
            return;
        }
        for (const player of room.spectators) {
            if (player.id == room.yourId) {
                navigate(`/${room.id}/${player.name}`);
                return;
            }
        }
        navigate('/');
    }

    return (
        <main className="game-page">
            <h1>Spectator</h1>

            <div className="game-top">
                <p className="game-mode">
                    Room: {room.id}
                </p>

                <p className="game-mode">
                    {room.players.length} player
                    {room.players.length > 1 ? 's' : ''}
                </p>

                {!room.isPlaying && <button
                    type="button"
                    onClick={() => goToRoom()}
                >
                    Go back to room
                </button>}
            </div>

            <div className="game-split">
                <section
                    className="game-panel game-side"
                    style={spectrumStyle}
                >
                    <div className="game-side-stack">
                        <div className="game-frame" ref={spectatorPanelRef}>
                            {sideSpectrums[0]
                                ? renderSpectrum(
                                      sideSpectrums[0]
                                  )
                                : (
                                    <div className="game-frame-empty" />
                                )}
                        </div>

                        <div className="game-frame">
                            {sideSpectrums[1]
                                ? renderSpectrum(
                                      sideSpectrums[1]
                                  )
                                : (
                                    <div className="game-frame-empty" />
                                )}
                        </div>
                    </div>
                </section>

                <div className="game-divider" />

                <section
                  className="game-panel game-center"
                    style={centerSpectrumStyle} ref={centerSpectatorRef}>
                    <div className="game-left-stage">
                        <div
                            className="game-frame spectator-main-frame"
                        >
                            {centerSpectrum
                                ? renderSpectrum(
                                      centerSpectrum
                                  )
                                : (
                                    <div className="game-frame-empty" />
                                )}
                        </div>
                    </div>
                </section>

                <div className="game-divider" />

                <section
                    className="game-panel game-side"
                    style={spectrumStyle}
                >
                    <div className="game-side-stack">
                        <div className="game-frame">
                            {sideSpectrums[2]
                                ? renderSpectrum(
                                      sideSpectrums[2]
                                  )
                                : (
                                    <div className="game-frame-empty" />
                                )}
                        </div>

                        <div className="game-frame">
                            {sideSpectrums[3]
                                ? renderSpectrum(
                                      sideSpectrums[3]
                                  )
                                : (
                                    <div className="game-frame-empty" />
                                )}
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
