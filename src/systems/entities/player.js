import Entity from "./entity.js";

export default class Player extends Entity {
  constructor(gameManager, x, y, width, height) {
    super(gameManager, x, y, width, height); // Call base constructor
    // Reference to game manager for accessing other systems
    this.game = gameManager;

    // Physics properties
    this.speed = 400;
    this.gravity = 800;
    this.jumpStrength = 600;
    this.fallMultiplier = 1.5;

    // Dashing properties
    this.dash = {
      canDash: true,
      isDashing: false,
      justDashed: false,
      duration: 0.25,
      timer: 0,
      distance: 300,
      dirX: 0,
      dirY: 0,
      startX: 0,
      startY: 0,
      groundMultiplier: 2,
    };

    // Double jump properties
    this.doubleJump = {
      canDoubleJump: true,
      used: false,
    };

    // Combat
    this.combat = {
      damage: 10,
      attackSpeed: 1,
      defense: 5,
      health: 100,
      modifiers: {
        damage: 0,
        defense: 0,
        health: 0,
      },
    };

    // Flags
    this.grounded = false;
  }
  update() {
    //==========================================
    // Dashing - Initiate
    //==========================================
    if (
      this.game.input.isPressed(["ShiftLeft", "ShiftRight"]) &&
      this.dash.canDash
    ) {
      if (!this.grounded && !this.dash.justDashed) {
        // Air dash: determine direction and calculate velocity
        this.dash.justDashed = true;
        this.dash.isDashing = true;
        this.dash.startX = this.x;
        this.dash.startY = this.y;
        this.dash.timer = this.dash.duration;
        this.dash.canDash = false;

        // Determine dash direction
        this.dash.dirX = 0;
        this.dash.dirY = 0;

        if (this.game.input.isDown(["ArrowLeft", "KeyA"])) {
          this.dash.dirX = -1;
        } else if (this.game.input.isDown(["ArrowRight", "KeyD"])) {
          this.dash.dirX = 1;
        }

        if (this.game.input.isDown(["ArrowDown", "KeyS"])) {
          this.dash.dirY = 1;
        } else if (this.dash.dirX === 0) {
          // No horizontal input: dash downwards
          this.dash.dirY = 1;
        }

        // Calculate velocity to cover dashDistance in dashDuration
        // velocity = distance / time
        const dashVelocity = this.dash.distance / this.dash.duration;
        this.vx = this.dash.dirX * dashVelocity;
        this.vy = this.dash.dirY * dashVelocity;
        // Allow dashing again after brief cooldown
        setTimeout(() => (this.dash.canDash = true), 100);
      } else if (this.grounded) {
        // Ground dash: activate sprint mode
        this.dash.isDashing = true;
        this.dash.canDash = false;
        // Allow dashing again after brief cooldown
        setTimeout(() => (this.dash.canDash = true), 100);
      }
    }

    //==========================================
    // Update dash state
    //==========================================
    // Air dash ends when timer expires
    if (this.dash.isDashing && !this.grounded) {
      this.dash.timer -= this.game.delta;
      if (this.dash.timer <= 0) {
        this.dash.isDashing = false;
      }
    }

    // Ground dash ends when Shift released or player goes airborne
    if (
      this.dash.isDashing &&
      this.grounded &&
      !this.game.input.isDown(["ShiftLeft", "ShiftRight"])
    ) {
      this.dash.isDashing = false;
    }

    //==========================================
    // Horizontal movement (only if not air dashing)
    //==========================================
    if (!this.dash.isDashing || this.grounded) {
      let speedMultiplier = 1;
      if (this.dash.isDashing && this.grounded) {
        speedMultiplier = this.dash.groundMultiplier;
      }

      if (this.game.input.isDown(["ArrowLeft", "KeyA"]))
        this.vx = -this.speed * speedMultiplier;
      else if (this.game.input.isDown(["ArrowRight", "KeyD"]))
        this.vx = this.speed * speedMultiplier;
      else this.vx = 0;
    }

    //==========================================
    // Gravity (disabled during air dash).
    // Apply stronger gravity when falling to reduce "floaty" feel.
    //==========================================
    if (!this.grounded && !this.dash.isDashing) {
      const gravityScale = this.vy > 0 ? this.fallMultiplier : 1;
      this.vy += this.gravity * gravityScale * this.game.delta;
    } else if (this.grounded) {
      this.vy = 0;
    }

    //==========================================
    // Jumping
    //==========================================
    if (this.game.input.isPressed(["ArrowUp", "Space"]) && this.grounded) {
      this.vy = this.dash.isDashing
        ? -this.jumpStrength * 1.2
        : -this.jumpStrength;
      this.grounded = false;
      setTimeout(() => (this.doubleJump.delay = 0), 100); // Start double jump delay
    } else if (
      this.game.input.isPressed(["ArrowUp", "Space"]) &&
      !this.grounded &&
      this.doubleJump.canDoubleJump &&
      !this.doubleJump.used &&
      this.doubleJump.delay <= 0
    ) {
      this.vy = -this.jumpStrength;
      this.doubleJump.used = true;
    } else if (this.grounded) {
      this.doubleJump.used = false;
    }

    this.moveAndCollide();

    //==========================================
    // DEBUG
    //==========================================
    if (this.game.input.isPressed(["Backslash", "Backquote"])) {
      this.game.debug.toggle();
    }
  }
  render() {
    this.game.ctx.fillStyle = "skyblue";
    this.game.ctx.fillRect(this.x, this.y, this.width, this.height);
  }
  moveAndCollide() {
    const rects = this.game.level.collisionRects;
    const ramps = this.game.level.collisionRamps;

    //==========================================
    // Horizontal
    //==========================================
    this.x += this.vx * this.game.delta;

    for (let rect of rects) {
      if (this.game.collision.rectCollision(this, rect)) {
        if (this.vx > 0) {
          // Moving right, hit left side of rect
          this.x = rect.x - this.width;
        } else if (this.vx < 0) {
          // Moving left, hit right side of rect
          this.x = rect.x + rect.width;
        }

        this.vx = 0;
      }
    }

    for (let ramp of ramps) {
      if (this.game.collision.rampCollision(this, ramp)) {
        // Align player with ramp surface
        const rampY = ramp.getYAtX(this.x + this.width / 2);
        if (this.y + this.height > rampY) {
          this.y = rampY - this.height;
          this.grounded = true;
          this.dash.justDashed = false;
          this.doubleJump.canDoubleJump = true;
        }
      }
    }

    //==========================================
    // Vertical
    //==========================================
    this.y += this.vy * this.game.delta;

    for (let rect of rects) {
      if (this.game.collision.rectCollision(this, rect)) {
        // Only ground if we're falling (vy > 0) and hitting from above
        if (this.vy > 0) {
          // Check if player was above the platform before collision
          const playerBottomBefore =
            this.y - this.vy * this.game.delta + this.height;
          if (playerBottomBefore <= rect.y + 5) {
            // Hit top of platform
            this.y = rect.y - this.height;
            this.grounded = true;
            this.dash.justDashed = false;
            this.doubleJump.canDoubleJump = true;
          } else {
            // Hit side while falling - just stop vertical movement
            this.vy = 0;
          }
        } else if (this.vy < 0) {
          // Jumping into platform from below
          this.y = rect.y + rect.height;
          this.vy = 0;
        }

        this.vy = 0;
      }
    }

    for (let ramp of ramps) {
      if (this.game.collision.rampCollision(this, ramp)) {
        // Align player with ramp surface
        const rampY = ramp.getYAtX(this.x + this.width / 2);

        if (this.y + this.height >= rampY) {
          this.y = rampY - this.height;
          this.grounded = true;
          this.dash.justDashed = false;
          this.doubleJump.canDoubleJump = true;
        }
      }
    }

    // Unground if no collision below
    if (this.grounded) {
      this.y += 1;
      let stillGrounded = false;
      for (let rect of rects) {
        if (this.game.collision.rectCollision(this, rect)) {
          stillGrounded = true;
          break;
        }
      }
      for (let ramp of ramps) {
        if (this.game.collision.rampCollision(this, ramp)) {
          stillGrounded = true;
          break;
        }
      }
      this.y -= 1;
      if (!stillGrounded) {
        this.grounded = false;
      }
    }
  }
}
