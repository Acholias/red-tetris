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
