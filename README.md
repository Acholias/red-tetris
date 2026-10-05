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

Tests
```bash
npm run coverage
```


# Server
Build
```bash
npm install
```

Run
```bash
npm run dev
```

Tests
```bash
npm run coverage
```

# Shared
Tests
```bash
npm run coverage
```


## Note

- mode spectateur (rejoins une game en cours)
- power down (malus adversaire)
- mode de difficulté
- thèmes
- pièces customs (Du jeu blocus)


tests : npm run coverage must show at least 70% coverage for statements, functions, lines, and 50% for branches.

tests unitaire pour le jeu
tests intégrations pour les endpoint api

mock call db et sous fonctions

websockets with socket.io

verification des types : dur (config react)


Pages :
- welcome (button play solo and multi)
- dev (OUR credits, background of a random falling tetriminos)
- room (see name, people inside, button start game)
- game (modal for win/loose)
- spectator

Modal for username (save in cookie)
