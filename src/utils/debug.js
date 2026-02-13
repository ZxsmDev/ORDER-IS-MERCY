export default class Debug {
  constructor(gameManager) {
    this.game = gameManager;
    this.on = false;
  }
  toggle() {
    this.on = !this.on;
  }
  render(ctx) {
    if (!this.on) return;
    // Corner Markers
    ctx.fillStyle = "lightblue";
    ctx.fillRect(0, 0, 10, 10);
    ctx.fillRect(this.game.width - 10, 0, 10, 10);
    ctx.fillRect(0, this.game.height - 10, 10, 10);
    ctx.fillRect(this.game.width - 10, this.game.height - 10, 10, 10);

    ctx.fillStyle = "white";
    // Left-top corner
    ctx.fillText("Debug Mode: ON", 15, 30);
    ctx.fillText("Game State: " + this.game.stateManager.current, 15, 50);
    ctx.fillText(
      "Canvas Size: " + this.game.width + " x " + this.game.height,
      15,
      70,
    );
    ctx.fillText("Center X: " + this.game.centerX.toFixed(2), 15, 90);
    ctx.fillText("Center Y: " + this.game.centerY.toFixed(2), 15, 110);
    ctx.fillText("Player Y: " + this.game.player.y.toFixed(2), 15, 130);
    ctx.fillText(
      "Player X: " + this.game.entityManager.player.x.toFixed(2),
      15,
      150,
    );
    ctx.fillText(
      "Velocity X: " + this.game.entityManager.player.vx.toFixed(3),
      15,
      170,
    );
    ctx.fillText(
      "Velocity Y: " + this.game.entityManager.player.vy.toFixed(3),
      15,
      190,
    );
    ctx.fillText(
      "Grounded: " + this.game.entityManager.player.grounded,
      15,
      210,
    );
    ctx.fillText(
      "Can Dash: " + this.game.entityManager.player.canDash,
      15,
      230,
    );

    // Right-top corner
    ctx.fillText(
      "FPS: " +
        Math.round(1000 / (performance.now() - this.lastFrameTime || 16)),
      15,
      250,
    );
    this.lastFrameTime = performance.now();
    ctx.fillText("Left: [A]", 15, 290);
    ctx.fillText("Right: [D]", 15, 310);
    ctx.fillText("Jump: [SPACE]", 15, 330);
    ctx.fillText("Dash: [SHIFT]", 15, 350);
  }
}
