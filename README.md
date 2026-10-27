# Gourmet Guild Idle v0.2
Mobile-first zero-asset Canvas arcade-idle starter.

## Gameplay
- Left side drag: floating joystick
- Right side tap: sword slash
- Collect up to 30 food, serve it on the cashier ring, vacuum mana crystals, and fund three runic sockets
- Unlock the plains, clear herb bushes, auto-attack boars while standing nearby, and rescue a crystalised ally with hot food
- Sous-Chef and rescued allies become automated food runners
- Progress auto-saves locally using the v2 save schema

## Run
`python3 -m http.server 8000`, then open the served project URL. Relative paths are compatible with GitHub Pages.

## Character animation preview
Open `preview.html` through the same HTTP server. It provides live buttons for idle, run, carry, serve, attack, cheer, eat, and hurt states across all five placeholder characters.

## v0.5 playable build
- Animated original placeholder chibi characters are active in the main game.
- `preview.html` remains the animation-state showcase.
- `assets/original-character-concept-board.png` is included as the high-resolution visual direction board, not as a runtime sprite sheet.
- Tap the canvas to dismiss the start overlay. Drag on the left to move and tap on the right to slash. Use Reset to clear local progression.
