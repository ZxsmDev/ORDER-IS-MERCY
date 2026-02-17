import levelData from "./data/level0.json" with { type: "json" };
import { Rect, Ramp, Circle, Polygon } from "./objects/objects.js";

export default class Level {
  constructor(gameManager) {
    this.game = gameManager;
    this.data = null;
    this.geometry = [];
    this.collisionRects = [];
    this.collisionRamps = [];
    this.levelIndex = 0;
    this.color = {
      // ground: "#1d1103",
      // platform: "#56381a",
      // wall: "#141110",
      
      // For testing:
      ground: "#000000",
      platform: "#3F3F3F",
      wall: "#111111",
    }
    this.load();
  }
  renderGeometry() {
    this.collisionRects.forEach((rect) => {
      rect.render(this.game.ctx);
    });
    this.collisionRamps.forEach((ramp) => {
      ramp.render(this.game.ctx);
    });
  }
  renderEntities() {
    this.game.entityManager.render();
  }
  load() {
    // Load level data from JSON
    const level0 = levelData;
    this.data = level0;
    this.geometry = level0.geometry;

    // Create collision rectangles from geometry
    this.geometry.forEach((obj) => {
      switch (obj.type) {
        case "ground":
          const groundRect = new Rect(obj.x, obj.y, obj.width, obj.height, this.color.ground);
          this.collisionRects.push(groundRect);
          break;
        case "platform":
          const platformRect = new Rect(obj.x, obj.y, obj.width, obj.height, this.color.platform);
          this.collisionRects.push(platformRect);
          break;
        case "wall":
          const wallRect = new Rect(obj.x, obj.y, obj.width, obj.height, this.color.wall);
          this.collisionRects.push(wallRect);
          break;
        case "ramp":
          const ramp = new Ramp(obj.x, obj.y, obj.width, obj.height, obj.slope === 1 ? "up" : "down");
          this.collisionRamps.push(ramp);
          break;
      }
    });
  }
}
