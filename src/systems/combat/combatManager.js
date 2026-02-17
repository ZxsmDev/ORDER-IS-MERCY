export default class CombatManager {
  constructor(gameManager) {
    this.game = gameManager;
    this.enemies = [];
  }
  attack(attacker, defender) {
    const damage = attacker.damage - defender.defense;
    if (damage > 0) {
      defender.health -= damage;
      this.game.ui.showMessage(`${attacker.name} hits ${defender.name} for ${damage} damage!`);
    } else {
      this.game.ui.showMessage(`${attacker.name} attacks ${defender.name} but it has no effect!`);
    }
  }
}
