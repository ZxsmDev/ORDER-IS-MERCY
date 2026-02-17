export default class StateManager {
  constructor(gameManager) {
    this.game = gameManager;
    this.states = {
      menu: {
        name: "MENU",
        update: () => {
          // Update menu state
        },
        render: () => {
          // Render menu state
        },
      },
      game: {
        name: "RUNNING",
        update: () => {
          // Update game state
          this.game.entityManager.update();
          this.game.camera.update(this.game.ctx);
        },
        render: () => {
          // Render game state
          this.game.camera.applyTransform(this.game.ctx);
          this.game.level.renderGeometry();
          this.game.level.renderEntities();
          // Draw trajectory in world space before reset
          this.game.debug.render();
          // Reset transform for UI overlay
          this.game.ctx.setTransform(1, 0, 0, 1, 0, 0);
          this.game.debug.renderText();
          this.game.ui.render();
        },
      },
      pause: {
        name: "PAUSED",
        update: () => {
          // Update pause state
        },
        render: () => {
          // Render pause state
        },
      },
    };
    this.current = this.states.game;
  }
  changeState(state) {
    if (this.current?.exit) this.current.exit();
    this.current = state;
    if (this.current?.enter) this.current.enter();
  }

  update() {
    this.current?.update();
    this.game.input.update();
  }
  render() {
    this.game.ctx.setTransform(1, 0, 0, 1, 0, 0); // reset
    this.game.ctx.clearRect(0, 0, this.game.width, this.game.height);
    this.current?.render();
  }
}
