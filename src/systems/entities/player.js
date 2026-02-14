import Entity from "./entity.js";

export default class Player extends Entity {
  constructor(gameManager, x, y, width, height) {
    super(gameManager, x, y, width, height);
    this.game = gameManager;
    this.speed = 400;
    this.jumpStrength = 600;
    this.groundDashMultiplier = 2;
    this.grounded = false;
    this.canDash = true;
    this.isDashing = false;
    this.dashDuration = 0.25;
    this.dashTimer = 0;
    this.dashDistance = 300;
    this.dashDirX = 0;
    this.dashDirY = 0;
  }
  update() {
    //==========================================
    // Collision
    //==========================================
    const ground = this.game.level.ground;
    if (this.game.collision.rectCollision(this, ground)) {
      this.grounded = true;
      this.y = ground.y - this.height;
    }

    //==========================================
    // Dashing - Initiate
    //==========================================
    if (this.game.input.isPressed(["ShiftLeft"]) && this.canDash) {
      if (!this.grounded) {
        // Air dash: determine direction and calculate velocity
        this.isDashing = true;
        this.dashTimer = this.dashDuration;
        this.canDash = false;
        setTimeout(() => (this.canDash = true), 800);

        // Determine dash direction
        this.dashDirX = 0;
        this.dashDirY = 0;

        if (this.game.input.isDown(["ArrowLeft", "KeyA"])) {
          this.dashDirX = -1;
        } else if (this.game.input.isDown(["ArrowRight", "KeyD"])) {
          this.dashDirX = 1;
        }

        if (this.game.input.isDown(["ArrowDown", "KeyS"])) {
          this.dashDirY = 1;
        } else if (this.dashDirX === 0) {
          // No horizontal input: dash downwards
          this.dashDirY = 1;
        }

        // Calculate velocity to cover dashDistance in dashDuration
        // velocity = distance / time
        const dashVelocity = this.dashDistance / this.dashDuration;
        this.vx = this.dashDirX * dashVelocity;
        this.vy = this.dashDirY * dashVelocity;
      } else {
        // Ground dash: activate sprint mode
        this.isDashing = true;
      }
    }

    //==========================================
    // Update dash state
    //==========================================
    // Air dash ends when timer expires
    if (this.isDashing && !this.grounded) {
      this.dashTimer -= this.game.delta;
      if (this.dashTimer <= 0) {
        this.isDashing = false;
      }
    }

    // Ground dash ends when Shift released or player goes airborne
    if (
      this.isDashing &&
      this.grounded &&
      !this.game.input.isDown(["ShiftLeft"])
    ) {
      this.isDashing = false;
    }

    //==========================================
    // Horizontal movement (only if not air dashing)
    //==========================================
    if (!this.isDashing || this.grounded) {
      let speedMultiplier = 1;
      if (this.isDashing && this.grounded) {
        speedMultiplier = this.groundDashMultiplier;
      }

      if (this.game.input.isDown(["ArrowLeft", "KeyA"]))
        this.vx = -this.speed * speedMultiplier;
      else if (this.game.input.isDown(["ArrowRight", "KeyD"]))
        this.vx = this.speed * speedMultiplier;
      else this.vx = 0;
    }

    //==========================================
    // Gravity (disabled during air dash)
    //==========================================
    if (!this.grounded && !this.isDashing) {
      this.vy += 800 * this.game.delta;
    } else if (this.grounded) {
      this.vy = 0;
    }

    //==========================================
    // Jumping
    //==========================================
    if (
      this.game.input.isPressed(["ArrowUp", "KeyW", "Space"]) &&
      this.grounded
    ) {
      this.vy = this.isDashing ? -this.jumpStrength * 1.2 : -this.jumpStrength;
      this.grounded = false;
    }

    // Update position based on velocity
    super.update();

    //==========================================
    // DEBUG
    //==========================================
    if (this.game.input.isPressed(["Backslash"])) {
      this.game.debug.toggle();
    }
  }
  render() {
    this.game.ctx.fillStyle = "skyblue";
    this.game.ctx.fillRect(this.x, this.y, this.width, this.height);

    //==========================================
    // DEBUG
    //==========================================
    this.game.debug.render();
  }
}
