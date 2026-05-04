import type { BodyGameSpectrum, Spectrum } from "@shared/requestBody";
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Room } from "../../gameRoom/data/room";
import type { Grid } from "./grid";

export interface SpectrumData {
    playerName: string,
    spectrum : Spectrum,
    grid: Grid,
}

const initialState: {[key: number]: SpectrumData} = {};

export const spectrumsSlice = createSlice({
    name: 'spectrums',
    initialState,
    reducers: {
        initSpectrums: (
                state,
                action: PayloadAction<Room>) => {
            const gridWidth = action.payload.size.w;
            const gridHeight = action.payload.size.h;

            for (const player of action.payload.players) {
                if (player.id == action.payload.yourId) continue;
                state[player.id] = {
                    playerName: player.name,
                    spectrum: {
                        heights: Array(gridWidth).fill(0),
                        unbreakableLines: 0,
                    },
                    grid: {
                        width: gridWidth,
                        height: gridHeight,
                        cells: Array(gridWidth * gridHeight).fill('E')
                    }
                }
            }
        },
        updateSpectrum: (state, action: PayloadAction<BodyGameSpectrum>) => {
            const spectrumData = state[action.payload.playerId];
            if (spectrumData == null) return;

            spectrumData.spectrum = action.payload.spectrum;


            const unbreakableHeight = spectrumData.grid.height - spectrumData.spectrum.unbreakableLines;
            const fillHeights = spectrumData.spectrum.heights.map((height) => unbreakableHeight - height);

            let startX = 0;
            let endX = spectrumData.grid.width;

            for (let y = 0; y < spectrumData.grid.height; y++) {
                if (y >= unbreakableHeight) {
                    for (let i = startX; i < endX; i++) {
                        spectrumData.grid.cells[i] = 'U';
                    }
                }
                else {
                    for (let x = 0; x < spectrumData.grid.width; x++) {
                        if (y >= fillHeights[x]) {
                            spectrumData.grid.cells[startX + x] = 'M';
                        } else {
                            spectrumData.grid.cells[startX + x] = 'E';
                        }
                    }
                }

                startX += spectrumData.grid.width;
                endX += spectrumData.grid.width;
            }
        },
        clearSpectrums: (_) => {
            return {};
        },
    }
});

export const {
    initSpectrums, updateSpectrum, clearSpectrums
} = spectrumsSlice.actions;
export default spectrumsSlice.reducer;
