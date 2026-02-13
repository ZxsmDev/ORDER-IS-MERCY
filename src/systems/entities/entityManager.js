export default class EntityManager {
  constructor(gameManager, PlayerClass) {
    this.game = gameManager;

    this.entities = [];

    const player = new PlayerClass(this.game, 50, 50, 25, 25);

    this.entities.push(player);
  }
  update() {
    this.entities.forEach((e) => e.update());
  }
  render() {
    this.entities.forEach((e) => e.render());
  }
}
