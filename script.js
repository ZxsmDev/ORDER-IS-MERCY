// ==================================================================================================================================================
// DEPRACATED
// ==================================================================================================================================================

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  // Game State Machine
  class Game {
    constructor() {
      this.width = canvas.width;
      this.height = canvas.height;
      this.centerX = this.width / 2;
      this.centerY = this.height / 2;
      this.debug = false;
      this.updateCenter();
      this.state = "MAIN";
      // this.init();

      this.player = new Player(this);
      this.player.init();
      this.ground = new Ground(this);

      this.gameObjects = [
        new GameObject(this, {
          width: 50,
          height: 150,
          offsetX: 0,
          offsetY: 100,
          color: "black",
        }),
        new GameObject(this, {
          width: 200,
          height: 20,
          offsetX: 0,
          offsetY: 80,
          color: "black",
        }),
      ];
    }
    init() {
      // Game initialization logic here
      ctx.fillStyle = "black";
      ctx.font = "16px Arial";
      this.state = "RUNNING";
    }
    update() {
      this.player.update();
      this.ground.update();

      // Update all game objects
      this.gameObjects.forEach((obj) => {
        obj.update();
        obj.checkCollisions(this.player);
      });
    }
    updateCenter() {
      this.centerX = this.width / 2;
      this.centerY = this.height / 2;

      // Update all game objects that use relative positioning
      this.gameObjects?.forEach((obj) => {
        if (obj.isRelativePosition) {
          obj.updatePosition(this.centerX, this.centerY);
        }
      });
    }
    draw() {
      ctx.clearRect(0, 0, this.width, this.height);

      // Draw all game objects
      this.gameObjects.forEach((obj) => obj.draw());

      this.player.draw();
      this.ground.draw();

      this.debug && this.drawDev();
    }
    drawDev() {
      // #TEMP
      ctx.fillStyle = "lightblue";
      ctx.fillRect(0, 0, 10, 10);
      ctx.fillRect(this.width - 10, 0, 10, 10);
      ctx.fillRect(0, this.height - 10, 10, 10);
      ctx.fillRect(this.width - 10, this.height - 10, 10, 10);

      ctx.fillStyle = "white";
      // Left-top corner
      ctx.fillText("Debug Mode: ON", 15, 30);
      ctx.fillText("Game State: " + this.state, 15, 50);
      ctx.fillText("Canvas Size: " + this.width + " x " + this.height, 15, 70);
      ctx.fillText("Center X: " + this.centerX.toFixed(2), 15, 90);
      ctx.fillText("Center Y: " + this.centerY.toFixed(2), 15, 110);
      ctx.fillText("Player Y: " + this.player.y.toFixed(2), 15, 130);
      ctx.fillText("Player X: " + this.player.x.toFixed(2), 15, 150);
      ctx.fillText("Velocity X: " + this.player.vx.toFixed(3), 15, 170);
      ctx.fillText("Velocity Y: " + this.player.vy.toFixed(3), 15, 190);
      ctx.fillText("Grounded: " + this.player.isGrounded, 15, 210);
      ctx.fillText("Can Dash: " + this.player.canDash, 15, 230);

      // Right-top corner
      ctx.fillText(
        "FPS: " +
          Math.round(1000 / (performance.now() - this.lastFrameTime || 16)),
        15,
        250
      );
      this.lastFrameTime = performance.now();
      ctx.fillText("Left: [A]", 15, 290);
      ctx.fillText("Right: [D]", 15, 310);
      ctx.fillText("Jump: [SPACE]", 15, 330);
      ctx.fillText("Dash: [SHIFT]", 15, 350);
    }
  }

  class Player {
    constructor(game) {
      this.game = game;
      this.x = game.centerX;
      this.y = game.centerY;
      this.size = 20;
      this.vx = 0;
      this.vy = 0;
      this.gravity = 0.075;
      this.acceleration = 0.2;
      this.moveSpeed = 0.5;
      this.jumpForce = -6;
      this.maxSpeed = 10;
      this.dashMaxSpeed = 30;
      this.friction = 0.85;
      this.isGrounded = false;
      this.isDashing = false;
      this.canDash = true;
      this.keys = {};
      this.dashMultiplier = 2.5;
      this.airDashMultiplier = 100;
      this.lastDebugPress = 0;
    }
    init() {
      window.addEventListener("keydown", (e) => {
        this.keys[e.code] = true;
      });

      window.addEventListener("keyup", (e) => {
        this.keys[e.code] = false;
      });
    }
    update() {
      if (this.keys["ArrowLeft"] || this.keys["KeyA"]) {
        this.vx -= this.moveSpeed;
      }
      if (this.keys["ArrowRight"] || this.keys["KeyD"]) {
        this.vx += this.moveSpeed;
      }
      // Jump only if grounded
      if ((this.keys["Space"] || this.keys["KeyW"]) && this.isGrounded) {
        this.vy = this.jumpForce;
        this.isGrounded = false;
      }

      // Updated dash mechanic
      if (this.keys["ShiftLeft"] && this.canDash) {
        const currentMultiplier = this.isGrounded
          ? this.dashMultiplier
          : this.airDashMultiplier;

        if (this.keys["ArrowLeft"] || this.keys["KeyA"]) {
          this.vx -= this.acceleration * currentMultiplier;
        }
        if (this.keys["ArrowRight"] || this.keys["KeyD"]) {
          this.vx += this.acceleration * currentMultiplier;
        }
        this.canDash = false;
        this.isDashing = true;

        // Reset dash state after 250ms
        setTimeout(() => {
          this.isDashing = false;
        }, 250);
      }
      // Reset dash ability when grounded
      if (this.isGrounded) {
        this.canDash = true;
      }

      // Apply physics
      this.vx *= this.friction;
      this.vy += this.gravity;

      const currentMaxSpeed = this.isDashing
        ? this.dashMaxSpeed
        : this.maxSpeed;

      // Clamp velocities
      this.vx = Math.max(Math.min(this.vx, currentMaxSpeed), -currentMaxSpeed);
      this.vy = Math.max(
        Math.min(this.vy, this.maxSpeed * 2),
        -this.maxSpeed * 2
      );

      // Update position
      this.x += this.vx;
      this.isDashing ? (this.y += this.vy * 0.5) : (this.y += this.vy);

      // Check collisions
      this.checkCollisions();

      if (this.keys["Backslash"]) {
        const now = performance.now();
        if (now - this.lastDebugPress > 200) {
          // Prevent rapid toggling
          this.game.debug = !this.game.debug;
          this.lastDebugPress = now;
        }
      }
    }
    checkCollisions() {
      // Ground collision
      if (this.y + this.size / 2 > this.game.ground.y) {
        this.y = this.game.ground.y - this.size / 2;
        this.vy = 0;
        this.isGrounded = true;
      } else {
        this.isGrounded = false;
      }

      // Screen boundaries
      if (this.x - this.size / 2 < 0) {
        this.x = this.size / 2;
        this.vx = 0;
      }
      if (this.x + this.size / 2 > this.game.width) {
        this.x = this.game.width - this.size / 2;
        this.vx = 0;
      }
    }
    draw() {
      // const ctx = this.game.ctx;
      ctx.fillStyle = "red";
      ctx.fillRect(
        this.x - this.size / 2,
        this.y - this.size / 2,
        this.size,
        this.size
      );
    }
  }

  class Ground {
    constructor(game) {
      this.game = game;
      this.width = game.width;
      this.height = game.height / 4;
      this.y = game.height - this.height;
    }
    update() {
      this.width = this.game.width;
      this.height = this.game.height / 4;
      this.y = this.game.height - this.height;
    }
    draw() {
      ctx.fillStyle = "black";
      ctx.fillRect(0, this.y, this.width, this.height);
    }
  }

  class GameObject {
    constructor(game, config = {}) {
      this.game = game;
      this.width = config.width || 50;
      this.height = config.height || 50;
      this.color = config.color || "black";
      this.strokeColor = config.strokeColor || "white";

      // Store the offset values
      this.offsetX = config.offsetX || 0;
      this.offsetY = config.offsetY || 0;

      // Track if using relative positioning
      this.isRelativePosition =
        config.x === undefined || config.y === undefined;

      // Set initial position
      if (this.isRelativePosition) {
        this.updatePosition(game.centerX, game.centerY);
      } else {
        this.x = config.x;
        this.y = config.y;
      }

      this.updateBounds();
    }
    updatePosition(centerX, centerY) {
      if (this.isRelativePosition) {
        this.x = centerX + this.offsetX;
        this.y = centerY + this.offsetY;
        this.updateBounds();
      }
    }
    updateBounds() {
      this.bounds = {
        left: this.x,
        right: this.x + this.width,
        top: this.y,
        bottom: this.y + this.height,
      };
    }
    update() {
      this.bounds = {
        left: this.x,
        right: this.x + this.width,
        top: this.y,
        bottom: this.y + this.height,
      };
    }
    checkCollisions(player) {
      // AABB Collision detection
      if (
        this.bounds.left < player.x + player.size / 2 &&
        this.bounds.right > player.x - player.size / 2 &&
        this.bounds.top < player.y + player.size / 2 &&
        this.bounds.bottom > player.y - player.size / 2
      ) {
        return this.handleCollision(player);
      }
      return false;
    }
    handleCollision(player) {
      // Default collision response
      const overlapX = Math.min(
        Math.abs(this.bounds.right - (player.x - player.size / 2)),
        Math.abs(this.bounds.left - (player.x + player.size / 2))
      );
      const overlapY = Math.min(
        Math.abs(this.bounds.bottom - (player.y - player.size / 2)),
        Math.abs(this.bounds.top - (player.y + player.size / 2))
      );

      // Push out of smallest overlap
      if (overlapX < overlapY) {
        // Horizontal collision
        if (player.x < this.x) {
          player.x = this.bounds.left - player.size / 2;
        } else {
          player.x = this.bounds.right + player.size / 2;
        }
        player.vx = 0;
      } else {
        // Vertical collision
        if (player.y < this.y) {
          player.y = this.bounds.top - player.size / 2;
          player.vy = 0;
          player.isGrounded = true;
        } else {
          player.y = this.bounds.bottom + player.size / 2;
          player.vy = 0;
        }
      }
      return true;
    }
    draw() {
      ctx.fillStyle = this.color;
      ctx.strokeStyle = this.strokeColor;
      ctx.lineWidth = 2;
      ctx.fillRect(this.x, this.y, this.width, this.height);
      // ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
  }

  const game = new Game();

  function gameLoop() {
    if (game.state === "RUNNING") {
      document.getElementById("game").style.display = "block";
      document.getElementById("main").style.display = "none";

      game.draw();
      game.update();
      requestAnimationFrame(gameLoop);
    }
  }

  function resizeCanvas() {
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    // Check if canvas needs to be resized
    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
      canvas.width = displayWidth;
      canvas.height = displayHeight;

      game.width = canvas.width;
      game.height = canvas.height;

      game.updateCenter();
      game.update();
    }
  }

  resizeCanvas();
  gameLoop();

  // Add resize listener
  window.addEventListener("resize", resizeCanvas);

  // =====================================================

  if (game.state == "MAIN") {
    document.getElementById("game").style.display = "none";
    document.getElementById("main").style.display = "block";

    const startButton = document.getElementById("startButton");
    startButton.addEventListener("click", () => {
      game.init();
      gameLoop();
    });
  }
});
