interface ThemeRoom {
    'player_background' : string,
    'you_background' : string,
    'player_color' : string,
}

interface ThemeGame {
    'color_E' : string,
    'color_I' : string,
    'color_J' : string,
    'color_L' : string,
    'color_M' : string,
    'color_O' : string,
    'color_S' : string,
    'color_T' : string,
    'color_U' : string,
    'color_V' : string,
    'color_Z' : string,
    'texture_E' : string,
    'texture_I' : string,
    'texture_J' : string,
    'texture_L' : string,
    'texture_M' : string,
    'texture_O' : string,
    'texture_S' : string,
    'texture_T' : string,
    'texture_U' : string,
    'texture_V' : string,
    'texture_Z' : string,
}

export interface ThemeData {
    'themeRoom': ThemeRoom,
    'themeGame': ThemeGame
}


// Themes
export const themesData = new Map<string, ThemeData>();

export const blueTetrisTheme: ThemeData = {
    'themeRoom': {
        'player_background' : '#646464',
        'you_background' : '#284169',
        'player_color' : '#EEEEEE',
    },
    'themeGame': {
        'color_E' : '#646464',
        'color_I' : '#01EDFA',
        'color_J' : '#485DC5',
        'color_L' : '#FFC82E',
        'color_M' : '#969696',
        'color_O' : '#FEFB34',
        'color_S' : '#53DA3F',
        'color_T' : '#EA141C',
        'color_U' : '#323232',
        'color_V' : '#39892F',
        'color_Z' : '#DD0AB2',
        'texture_E' : "url('/styles/basic/empty.png')",
        'texture_I' : "url('/styles/basic/cell.png')",
        'texture_J' : "url('/styles/basic/cell.png')",
        'texture_L' : "url('/styles/basic/cell.png')",
        'texture_M' : "url('/styles/basic/cell.png')",
        'texture_O' : "url('/styles/basic/cell.png')",
        'texture_S' : "url('/styles/basic/cell.png')",
        'texture_T' : "url('/styles/basic/cell.png')",
        'texture_U' : "url('/styles/basic/cell.png')",
        'texture_V' : "url('/styles/basic/cell.png')",
        'texture_Z' : "url('/styles/basic/cell.png')",
    }
};
themesData.set('blue-tetris', blueTetrisTheme);
