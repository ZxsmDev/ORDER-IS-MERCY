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
    // Draw interaction tooltip from interaction system so it's rendered in UI layer
    if (
      this.game.interaction &&
      typeof this.game.interaction.render === "function"
    ) {
      this.game.interaction.render();
    }
  }
  handleCursorMove(movementX, movementY) {
    // Handle cursor movement logic here
    // For example, you could update a custom cursor position or trigger UI interactions
  }
}
