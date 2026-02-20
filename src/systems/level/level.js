import testLevel00 from "./data/levelTest00.json" with { type: "json" };
import testLevel01 from "./data/levelTest01.json" with { type: "json" };
import { Rect, Ramp, Radial, Polygon, Interactable } from "./objects/objects.js";
import EnemyClass from "../entities/enemy.js";

export default class Level {
  constructor(gameManager) {
    this.game = gameManager;
    this.levelIndex = 0;
    this.data = null;
    this.geometry = [];
    this.enemies = [];
    this.collision = {
      rects: [],
      ramps: [],
      radial: [],
      poly: [],
    }
    
    this.color = {
      ground: "#1d1103",
      platform: "#56381a",
      wall: "#111111",
      door: "#57391a",
      ramp: "#000000",

      // For testing:
      // ground: "#000000",
      // platform: "#3F3F3F",
    };
  }
  renderGeometry() {
    Object.values(this.collision).forEach((group) => {
      group.forEach((obj) => {
        obj.render(this.game.ctx);
      });
    });
  }
  renderEntities() {
    this.game.entityManager.render();
  }
  removeInteractable(interactable) {
    this.collision.rects = this.collision.rects.filter(r => r !== interactable);
  }
  update() {
    this.game.interaction.interactables.forEach((interactable) => {
      interactable.interactable.update();
    });
    this.game.entityManager.update();
  }
  load() {
    // Load level data from JSON
    const level0 = testLevel00;
    const level1 = testLevel01;
    this.data = level1;
    this.geometry = level1.geometry;
    this.enemies = level1.enemies;


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
          this.collision.rects.push(groundRect);
          break;
        case "platform":
          const platformRect = new Rect(
            obj.x,
            obj.y,
            obj.width,
            obj.height,
            this.color.platform,
          );
          this.collision.rects.push(platformRect);
          break;
        case "wall":
          const wallRect = new Rect(
            obj.x,
            obj.y,
            obj.width,
            obj.height,
            this.color.wall,
          );
          this.collision.rects.push(wallRect);
          break;
        case "ramp":
          const ramp = new Ramp(
            obj.x,
            obj.y,
            obj.width,
            obj.height,
            obj.slope === 1 ? "up" : "down",
            this.color.ramp,
          );
          this.collision.ramps.push(ramp);
          break;
        case "interactable":
          const interactable = new Interactable(
            obj.x,
            obj.y,
            obj.width,
            obj.height,
            this.color.door,
          );
          this.game.interaction.addInteractable(interactable, obj.interaction);
          this.collision.rects.push(interactable);
          break;
        case "radial":
          const radial = new Radial(
            obj.x,
            obj.y,
            obj.radius,
            obj.color || "#FF0000",
          );
          // this.collision.radial.push(circle);
          break;
        case "polygon":
          const polygon = new Polygon(obj.points, obj.color || "#00FF00");
          // this.collision.poly.push(polygon);
          break;
        
      }
    });

    this.enemies.forEach((enemyData) => {
    const enemy = new EnemyClass(
      this.game,
      enemyData.spawn.x,
      enemyData.spawn.y,
      25, // Default width
      50  // Default height
    );
    this.game.entityManager.addEnemy(enemy);
  });}
}
