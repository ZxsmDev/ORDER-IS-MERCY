export default class EntityManager {
  constructor(gameManager) {
    this.game = gameManager;

    this.entities = [];

    this.entities.push(this.game.player);
  }
  update() {
    this.entities.forEach((e) => e.update());
  }
  render() {
    this.entities.forEach((e) => e.render());
  }
}
