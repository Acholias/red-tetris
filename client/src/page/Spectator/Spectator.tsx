import '../Game/Game.css';
import './Spectator.css';

import { useEffect, useMemo } from 'react';
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

    const spectrumStyle = createSpectrumTheme(
        currentTheme,
        32,
        18,
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
                        <div className="game-frame">
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
                    style={spectrumStyle}>
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
