/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Spectator.tsx                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: gugus <gugus@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/04/28 12:25:03 by lumugot           #+#    #+#             */
/*   Updated: 2026/05/05 10:47:03 by gugus            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from '../../store/store';
import { createSpectrumTheme } from '../../theme/theme';
import { renderSpectrum } from '../../gameEngine/render/render';
import { initSpectrums } from '../../gameEngine/logic/spectrumsSlice';

export default function Spectator() {
    const navigate = useNavigate();

    // Get game and theme from store
    const spectrums = useSelector((state: RootState) => state.spectrums);
    const room = useSelector((state: RootState) => state.room);
    const currentTheme = useSelector((state: RootState) => state.theme);
    const dispatch = useDispatch();

    function goToRoom() {
      if (room.id == '') {
        navigate('/');
        return;
      }
      for (const player of room.players) {
        if (player.id == room.yourId) {
          navigate(`/${room.id}/${player.name}`);
          return;
        }
      }
      navigate('/');
    }

    // Init spectrums if needed
    useEffect(() => {
        if (Object.values(spectrums).length == 0) {
            dispatch(initSpectrums({room: room, skipCurrentPlayer: false}));
        }
    }, [dispatch, spectrums]);

    // Variables computes
    const cellSize = 3;

    // Style define
    const spectrumStyle = createSpectrumTheme(currentTheme, 0, cellSize / 2, room);

    return (
      <main className="dev-page">
        <p>{room.players.length == 1 ? 'Solo game' : 'Multi player game'}</p>
        {!room.isPlaying && <button
          type="button"
          onClick={() => goToRoom()}
        >
          Go back to room
        </button>}
        <div className='spectrums'style={spectrumStyle}>
          {Object.values(spectrums).map((spectrumData) => renderSpectrum(spectrumData))}
        </div>
      </main>
    )
}
