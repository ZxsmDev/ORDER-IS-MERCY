export default class GameLoop {
  constructor(gameManager) {
    this.game = gameManager;
    this.stateManager = gameManager.stateManager;
    this.lastTime = 0;
  }
  start() {
    requestAnimationFrame(this.loop.bind(this));
  }
  loop(time) {
    if (!this.lastTime) this.lastTime = time;

    const delta = (time - this.lastTime) / 1000;
    this.lastTime = time;

    this.game.delta = delta;

    this.stateManager.update();
    this.stateManager.render();

    requestAnimationFrame(this.loop.bind(this));
  }
}
