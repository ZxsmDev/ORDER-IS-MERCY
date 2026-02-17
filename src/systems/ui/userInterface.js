import HUD from "./hud.js";

export default class UserInterface {
  constructor(gameManager) {
    this.game = gameManager;
    this.hud = new HUD(gameManager);
    // Listen for custom cursor movement events
    document.addEventListener("cursorMove", (e) => {
      this.handleCursorMove(e.detail.movementX, e.detail.movementY);
    });
  }
  render() {
    this.hud.render(this.game.ctx);
    // Render other UI elements here, such as inventory, minimap, etc.
  }
  handleCursorMove(movementX, movementY) {
    // Handle cursor movement logic here
    // For example, you could update a custom cursor position or trigger UI interactions
  }
}
