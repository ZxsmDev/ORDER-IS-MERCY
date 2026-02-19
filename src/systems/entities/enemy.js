import Entity from "./entity.js";

export default class Enemy extends Entity {
  constructor(gameManager, x, y, width, height) {
    super(gameManager, x, y, width, height);
    this.health = 3;
  }
  update() {
    super.update();
  }
  render() {
    this.game.ctx.fillStyle = "red";
    this.game.ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
