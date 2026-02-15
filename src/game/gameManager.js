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
    Camera,
  ) {
    // Canvas and Context
    this.canvas = canvas;
    this.ctx = ctx;
    this.resizeCanvas();

    // Systems
    this.stateManager = new stateManager(this);
    this.gameLoop = new gameLoop(this);

    // Level
    this.level = new LevelClass(this);

    // Entities
    this.player = new PlayerClass(
      this,
      this.level.data.playerSpawn.x,
      this.level.data.playerSpawn.y,
      25,
      50,
    );
    this.entityManager = new entityManager(this);

    // Camera
    this.camera = new Camera(this);

    // Utils
    this.collision = collision;
    this.math = mathUtils;
    this.input = new inputManager();
    this.debug = new debug(this);

    // Global properties
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
