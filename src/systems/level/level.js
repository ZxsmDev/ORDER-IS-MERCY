export default class Level {
  constructor(gameManager) {
    this.game = gameManager;
    this.ground = {
      x: 0,
      y: this.game.height - 150,
      width: this.game.width,
      height: 150,    
    }
  }
  render() {
    // Draw ground
    this.game.ctx.fillStyle = "black";
    this.game.ctx.fillRect(
      this.ground.x,
      this.ground.y,
      this.ground.width,
      this.ground.height,
    );
  }
}
