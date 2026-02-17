import testLevel00 from "./data/levelTest00.json" with { type: "json" };
import testLevel01 from "./data/levelTest01.json" with { type: "json" };
import { Rect, Ramp, Radial, Polygon } from "./objects/objects.js";

export default class Level {
  constructor(gameManager) {
    this.game = gameManager;
    this.data = null;
    this.geometry = [];
    this.collisionRects = [];
    this.collisionRamps = [];
    this.collisionRadial = [];
    this.collisionPoly = [];
    this.levelIndex = 0;
    this.color = {
      // ground: "#1d1103",
      // platform: "#56381a",
      // wall: "#141110",

      // For testing:
      ground: "#000000",
      platform: "#3F3F3F",
      wall: "#111111",
    };
    this.load();
  }
  renderGeometry() {
    this.collisionRects.forEach((rect) => {
      rect.render(this.game.ctx);
    });
    this.collisionRamps.forEach((ramp) => {
      ramp.render(this.game.ctx);
    });
    this.collisionRadial.forEach((radial) => {
      radial.render(this.game.ctx);
    });
    this.collisionPoly.forEach((polygon) => {
      polygon.render(this.game.ctx);
    });
  }
  renderEntities() {
    this.game.entityManager.render();
  }
  load() {
    // Load level data from JSON
    const level0 = testLevel00;
    const level1 = testLevel01;
    this.data = level1;
    this.geometry = level1.geometry;

    // Create collision rectangles from geometry
    this.geometry.forEach((obj) => {
      switch (obj.type) {
        case "ground":
          const groundRect = new Rect(
            obj.x,
            obj.y,
            obj.width,
            obj.height,
            this.color.ground,
          );
          this.collisionRects.push(groundRect);
          break;
        case "platform":
          const platformRect = new Rect(
            obj.x,
            obj.y,
            obj.width,
            obj.height,
            this.color.platform,
          );
          this.collisionRects.push(platformRect);
          break;
        case "wall":
          const wallRect = new Rect(
            obj.x,
            obj.y,
            obj.width,
            obj.height,
            this.color.wall,
          );
          this.collisionRects.push(wallRect);
          break;
        case "ramp":
          const ramp = new Ramp(
            obj.x,
            obj.y,
            obj.width,
            obj.height,
            obj.slope === 1 ? "up" : "down",
          );
          this.collisionRamps.push(ramp);
          break;
        case "radial":
          const radial = new Radial(
            obj.x,
            obj.y,
            obj.radius,
            obj.color || "#FF0000",
          );
          // this.collisionRadial.push(circle);
          break;
        case "polygon":
          const polygon = new Polygon(obj.points, obj.color || "#00FF00");
          // this.collisionPoly.push(polygon);
          break;
      }
    });
  }
}
