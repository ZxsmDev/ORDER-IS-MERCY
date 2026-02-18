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
        this.game.collision.checkCollision(player, interactable, "radial", 50)
        // && player.isDown("KeyE")
      ) {
        this.handleInteraction(interactionType);
        console.log(`Interacted with ${interactionType}`);
      }
    });
  }
  handleInteraction(interactionType) {
    switch (interactionType) {
      case "door":
        console.log("Player interacts with a door!");
        break;
    }
  }
}
