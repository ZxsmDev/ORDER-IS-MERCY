export default class CombatManager {
  constructor(gameManager) {
    this.game = gameManager;
    this.enemies = [];
    document.addEventListener("click", () => this.playerAttack());
  }
  playerAttack() {
    console.log("Player attacks!");
    if (this.game.player) {
      this.game.player.attack();
    }
  }
}
