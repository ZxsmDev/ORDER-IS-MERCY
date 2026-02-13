import Entity from "./entity.js";

export default class Player extends Entity {
  constructor(gameManager, x, y, width, height) {
    super(gameManager, x, y, width, height);
    this.speed = 200;
    this.grounded = false;
    this.canDash = true;
  }
  update() {
    if (this.game.input.isDown(["ArrowLeft", "a"])) this.vx = -this.speed;
    else if (this.game.input.isDown(["ArrowRight", "d"])) this.vx = this.speed;
    else this.vx = 0;

    super.update()
  }
  render() {
    this.game.ctx.fillStyle = "blue"
    this.game.ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
