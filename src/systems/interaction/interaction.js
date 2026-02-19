export default class Interaction {
  constructor(gameManager) {
    this.game = gameManager;
    this.interactables = [];
  }
  addInteractable(interactable, interactionType) {
    this.interactables.push({ interactable, interactionType });
  }
  update() {
    const player = this.game.player;

    this.interactables.forEach(({ interactable, interactionType }) => {
      if (
        this.game.collision.checkCollision(
          player,
          interactable,
          "radial",
          50
        ) &&
        this.game.input.isPressed("KeyE")
      ) {
        interactable.action(interactionType);
      }
    });
  }
}
