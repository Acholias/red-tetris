# Client
Build
```bash
npm install
npm run build
```

Run
```bash
npm run dev
```


# Server
Build
```bash
npm install
```

Run
```bash
node src/index.js
```


## Note

Bonus :
- mode spectateur (rejoins une game en cours)
- power down
- mode de difficulté
- thèmes
- pièces customs (Du jeu blocus) (Plateau plus grand ?)
- succès


tests : npm run coverage must show at least 70% coverage for statements, functions, lines, and 50% for branches.
￼
• Statements: statement coverage rate -> or dans un if
• Functions: functions coverage rate
• Lines: coverage rate of lines of code
• Branches: coverage rate of code execution paths -> try/catch, if


tests unitaire pour le jeu
tests intégrations pour les endpoint api

mock call db et sous fonctions


websockets with socket.io

verification des types : dur (config react)


## TODO
Pages :
- welcome (button play solo and multi)
- dev (OUR credits, background of a random falling tetriminos)
- room (see name, people inside, button start game)
- game (modal for win/loose)
- spectator

Modal for username (save in cookie)


## Pieces
| size | rotation | basic | familly | id | name |
|------|----------|-------|---------|----|------|
| 1x1  | no       | no    | F_O     | 1  | 1    |
| 2x2  | yes      | no    | F_I     | 2  | 2    |
| 2x2  | yes      | no    | F_V     | v  | V3   |
| 3x3  | yes      | no    | F_I     | 3  | I3   |
| 3x3  | yes      | no    | F_V     | V  | V5   |
| 3x3  | yes      | yes   | F_L     | l  | L4   |
| 3x3  | yes      | yes   | F_J     | j  | J4   | ~L4
| 3x3  | yes      | no    | F_T     | t  | T4   |
| 3x3  | yes      | yes   | F_T     | T  | T5   |
| 3x3  | yes      | yes   | F_S     | s  | S4   | ~Z4
| 3x3  | yes      | yes   | F_Z     | z  | Z4   |
| 3x3  | yes      | no    | F_O     | U  | U    |
| 3x3  | yes      | no    | F_O     | P  | P    |
| 3x3  | yes      | no    | F_O     | Q  | Q    | ~P
| 3x3  | yes      | no    | F_V     | W  | W    |
| 3x3  | no       | no    | F_V     | X  | X    |
| 3x3  | yes      | no    | F_S     | S  | S5   | ~Z5
| 3x3  | yes      | no    | F_Z     | Z  | Z5   |
| 3x3  | yes      | no    | F_L     | F  | F    |
| 3x3  | yes      | no    | F_J     | f  | ~F   |
| 4x2  | no       | yes   | F_O     | O  | O    |
| 4x4  | yes      | yes   | F_I     | 4  | I4   |
| 4x4  | yes      | no    | F_L     | L  | L5   |
| 4x4  | yes      | no    | F_J     | J  | J5   | ~J5
| 4x4  | yes      | no    | F_S     | N  | N    |
| 4x4  | yes      | no    | F_Z     | n  | ~N   |
| 4x4  | yes      | no    | F_T     | Y  | Y    |
| 4x4  | yes      | no    | F_T     | y  | ~Y   |
| 5x5  | yes      | no    | F_I     | 5  | I5   |

## Piece families
| familly | basic color           |
|---------|-----------------------|
| F_I     | light blue  #01EDFA |
| F_J     | dark blue   #485DC5 |
| F_L     | orange      #FFC82E |
| F_O     | yellow      #FEFB34 |
| F_S     | light green #53DA3F |
| F_T     | red         #EA141C |
| F_V     | dark green  #39892F |
| F_Z     | magenta     #DD0AB2 |
|---------|-----------------------|
| F_E     | light blue  #646464 | Empty cells !
| F_U     | light blue  #323232 | Unbreakable cells !
|---------|-----------------------|
