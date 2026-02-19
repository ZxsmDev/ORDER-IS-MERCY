export default class EntityManager {
  constructor(gameManager) {
    this.game = gameManager;

    this.entities = [];
  }
  update() {
    this.entities.forEach((e, index) => {
      if (e && typeof e.update === "function") {
        e.update();
      } else {
        console.warn(
          `Entity at index ${index} is invalid and will be skipped:`,
          e
        );
      }
    });
  }
  render() {
    this.entities.forEach((e, index) => {
      if (e && typeof e.render === "function") {
        e.render();
      } else {
        console.warn(
          `Entity at index ${index} is invalid and will be skipped:`,
          e
        );
      }
    });
  }
  addEnemy(enemy) {
    this.entities.push(enemy);
  }
}
