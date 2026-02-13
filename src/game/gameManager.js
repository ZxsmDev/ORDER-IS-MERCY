export default class GameManager {
  constructor(
    canvas,
    ctx,
    collision,
    mathUtils,
    inputManager,
    debug,
    gameLoop,
    stateManager,
    entityManager,
    player,
  ) {
    this.canvas = canvas;
    this.ctx = ctx;

    this.stateManager = new stateManager(this);
    this.gameLoop = new gameLoop(this);
    
    this.entityManager = new entityManager(this, player);

    this.collision = collision;
    this.math = mathUtils;
    this.input = new inputManager();
    this.debug = new debug(this);

    this.width = canvas.width;
    this.height = canvas.height;
    this.centerX = canvas.width / 2;
    this.centerY = canvas.height / 2;
    this.delta = null

    this.resizeCanvas();
  }
  init() {
    this.ctx.fillStyle = "black";
    this.ctx.font = "16px Arial";
    this.stateManager.changeState(this.stateManager.states.game);
    this.gameLoop.start();
  }
  resizeCanvas() {
    const displayWidth = this.canvas.clientWidth;
    const displayHeight = this.canvas.clientHeight;

    // Check if canvas needs to be resized
    if (
      this.canvas.width !== displayWidth ||
      this.canvas.height !== displayHeight
    ) {
      this.canvas.width = displayWidth;
      this.canvas.height = displayHeight;

      this.width = this.canvas.width;
      this.height = this.canvas.height;

      // Update Center
      this.centerX = this.width / 2;
      this.centerY = this.height / 2;
    }
  }
}
