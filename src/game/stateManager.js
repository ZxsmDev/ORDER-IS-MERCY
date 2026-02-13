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
        },
        render: () => {
          // Render game state
          this.game.entityManager.render();
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

    //==========================================
    // DEBUG
    //==========================================
    if (this.game.input.isDown("\\")) {
      this.game.debug.toggle();
    }
  }
  render() {
    this.game.ctx.clearRect(0, 0, this.game.width, this.game.height);
    this.current?.render();
  }
}
