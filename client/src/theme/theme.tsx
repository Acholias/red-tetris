import type { Room } from "../gameRoom/data/room";
import type { ThemeData } from "./themeData";

export function createRoomTheme(
                    themeData: ThemeData
                    ): React.CSSProperties {
    return {
        '--player-background' : themeData.themeRoom.player_background,
        '--you-background' : themeData.themeRoom.you_background,
        '--player-color' : themeData.themeRoom.player_color,
        '--lobby-accent-1': themeData.themeGame.color_I,
        '--lobby-accent-2': themeData.themeGame.color_J,
        '--lobby-accent-3': themeData.themeGame.color_O,
        '--lobby-accent-strong': themeData.themeGame.color_T,
    } as React.CSSProperties;
}

export function createGameTheme(
                    themeData: ThemeData,
                    cellSize: number
                    ): React.CSSProperties {
    return {
    '--cell-size': `${cellSize}px`,
        '--color-E' : themeData.themeGame.color_E,
        '--color-I' : themeData.themeGame.color_I,
        '--color-J' : themeData.themeGame.color_J,
        '--color-L' : themeData.themeGame.color_L,
        '--color-M' : themeData.themeGame.color_M,
        '--color-O' : themeData.themeGame.color_O,
        '--color-S' : themeData.themeGame.color_S,
        '--color-T' : themeData.themeGame.color_T,
        '--color-U' : themeData.themeGame.color_U,
        '--color-V' : themeData.themeGame.color_V,
        '--color-Z' : themeData.themeGame.color_Z,
        '--texture-E' : themeData.themeGame.texture_E,
        '--texture-I' : themeData.themeGame.texture_I,
        '--texture-J' : themeData.themeGame.texture_J,
        '--texture-L' : themeData.themeGame.texture_L,
        '--texture-M' : themeData.themeGame.texture_M,
        '--texture-O' : themeData.themeGame.texture_O,
        '--texture-S' : themeData.themeGame.texture_S,
        '--texture-T' : themeData.themeGame.texture_T,
        '--texture-U' : themeData.themeGame.texture_U,
        '--texture-V' : themeData.themeGame.texture_V,
        '--texture-Z' : themeData.themeGame.texture_Z,
    } as React.CSSProperties;
}

export function createSpectrumTheme(
                    themeData: ThemeData,
                    gameCellSize: number,
                    cellSize: number,
                    room: Room,
                    ): React.CSSProperties {
    return {
    '--cell-size': `${cellSize}px`,
    '--margin': `${gameCellSize * (room.size.w + 10)}px`,
    '--spectrum-w': `${cellSize * (room.size.w + 5)}px`,
    '--spectrum-h': `${cellSize * (room.size.h + 7)}px`,
        '--color-E' : themeData.themeGame.color_E,
        '--color-M' : themeData.themeGame.color_M,
        '--color-U' : themeData.themeGame.color_U,
        '--texture-E' : themeData.themeGame.texture_E,
        '--texture-M' : themeData.themeGame.texture_M,
        '--texture-U' : themeData.themeGame.texture_U,
    } as React.CSSProperties;
}
