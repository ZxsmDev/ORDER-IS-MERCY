export default class Interaction {
  constructor(gameManager) {
    this.game = gameManager;
    this.interactables = [];
  }
  addInteractable(interactable) {
    this.interactables.push(interactable);
  }
  update() {
    const player = this.game.entities.player;
    for (let interactable of this.interactables) {
      if (
        this.game.collision.checkCollision(
          player, // player reference
          interactable, // interactable reference
          "radial", // collision type
          player.width * 3 // interaction radius (adjust as needed)
        ) &&
        this.game.input.isDown("E")
      ) {
        interactable.interact(player);
      }
    }
  }
}
