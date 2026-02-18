import { Collision } from "../../../utils/collision.js";

export class Rect {
  constructor(x, y, width, height, color = "rgb(0, 0, 0)") {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
  }
  render(ctx, color = this.color) {
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

export class Ramp {
  constructor(x, y, width, height, direction) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.direction = direction; // "up" or "down"
  }
  getYAtX(x) {
    const relativeX = x - this.x;
    const slope = this.height / this.width;
    return this.direction === "up"
      ? this.y + this.height - slope * relativeX
      : this.y + slope * relativeX;
  }
  render(ctx, color = "rgb(25, 25, 25)") {
    ctx.fillStyle = color;
    ctx.beginPath();
    if (this.direction === "up") {
      ctx.moveTo(this.x, this.y + this.height);
      ctx.lineTo(this.x + this.width, this.y + this.height);
      ctx.lineTo(this.x + this.width, this.y);
    } else {
      ctx.moveTo(this.x + this.width, this.y + this.height);
      ctx.lineTo(this.x, this.y);
      ctx.lineTo(this.x, this.y + this.height);
    }
    ctx.closePath();
    ctx.fill();
  }
}

export class Radial {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
  }
  render(ctx, color = "rgb(25, 25, 25)") {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

export class Polygon {
  constructor(points) {
    this.points = points; // Array of {x, y} objects
  }
  render(ctx, color = "rgb(25, 25, 25)") {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);
    for (let i = 1; i < this.points.length; i++) {
      ctx.lineTo(this.points[i].x, this.points[i].y);
    }
    ctx.closePath();
    ctx.fill();
  }
}

export class Interactable {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
  render(ctx, color = "rgb(0, 200, 100)") {
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
