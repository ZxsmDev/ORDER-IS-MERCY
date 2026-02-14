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
    PlayerClass,
    LevelClass,
  ) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.resizeCanvas();

    this.stateManager = new stateManager(this);
    this.gameLoop = new gameLoop(this);

    this.player = new PlayerClass(
      this,
      canvas.width / 2 - 12.5,
      canvas.height / 2 - 12.5,
      25,
      25,
    );
    this.entityManager = new entityManager(this);

    this.level = new LevelClass(this);

    this.collision = collision;
    this.math = mathUtils;
    this.input = new inputManager();
    this.debug = new debug(this);

    this.width = canvas.width;
    this.height = canvas.height;
    this.centerX = canvas.width / 2;
    this.centerY = canvas.height / 2;
    this.delta = null;
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
  // Helper method to position an entity at a point (centered on that point)
  positionAtCenter(entity, x, y) {
    entity.x = x - entity.width / 2;
    entity.y = y - entity.height / 2;
  }
  // Position entity at canvas center
  positionAtCanvasCenter(entity) {
    this.positionAtCenter(entity, this.centerX, this.centerY);
  }
}
