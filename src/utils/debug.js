export default class Debug {
  constructor(gameManager) {
    this.game = gameManager;
    this.on = false;
  }
  toggle() {
    this.on = !this.on;
  }
  render() {
    if (!this.on) return;
    // Corner Markers
    this.game.ctx.fillStyle = "lightblue";
    this.game.ctx.fillRect(0, 0, 10, 10);
    this.game.ctx.fillRect(this.game.width - 10, 0, 10, 10);
    this.game.ctx.fillRect(0, this.game.height - 10, 10, 10);
    this.game.ctx.fillRect(this.game.width - 10, this.game.height - 10, 10, 10);

    this.game.ctx.fillStyle = "white";
    // Left-top corner
    this.game.ctx.fillText("Debug Mode: ON", 15, 30);
    this.game.ctx.fillText("Game State: " + this.game.stateManager.current, 15, 50);
    this.game.ctx.fillText(
      "Canvas Size: " + this.game.width + " x " + this.game.height,
      15,
      70,
    );
    this.game.ctx.fillText("Center X: " + this.game.centerX.toFixed(2), 15, 90);
    this.game.ctx.fillText("Center Y: " + this.game.centerY.toFixed(2), 15, 110);
    this.game.ctx.fillText("Player Y: " + this.game.player.y.toFixed(2), 15, 130);
    this.game.ctx.fillText(
      "Player X: " + this.game.player.x.toFixed(2),
      15,
      150,
    );
    this.game.ctx.fillText(
      "Velocity X: " + this.game.player.vx.toFixed(3),
      15,
      170,
    );
    this.game.ctx.fillText(
      "Velocity Y: " + this.game.player.vy.toFixed(3),
      15,
      190,
    );
    this.game.ctx.fillText(
      "Grounded: " + this.game.player.grounded,
      15,
      210,
    );
    this.game.ctx.fillText(
      "Can Dash: " + this.game.player.canDash,
      15,
      230,
    );

    // Right-top corner
    this.game.ctx.fillText(
      "FPS: " +
        Math.round(1000 / (performance.now() - this.lastFrameTime || 16)),
      15,
      250,
    );
    this.lastFrameTime = performance.now();
    this.game.ctx.fillText("Left: [A]", 15, 290);
    this.game.ctx.fillText("Right: [D]", 15, 310);
    this.game.ctx.fillText("Jump: [SPACE]", 15, 330);
    this.game.ctx.fillText("Dash: [SHIFT]", 15, 350);
  }
}
