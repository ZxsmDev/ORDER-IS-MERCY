export default class HUD {
  constructor(gameManager) {
    this.game = gameManager;
    this.font = "16px Arial";
    this.color = "white";
  }
  render(ctx) {
    ctx.save();
    ctx.font = this.font;
    ctx.fillStyle = this.color;
    ctx.fillText(
      `Health: ${this.game.player.combat.health}`,
      15,
      this.game.height - 160
    );
    ctx.fillText(
      `Damage: ${this.game.player.combat.damage}`,
      15,
      this.game.height - 140
    );
    ctx.fillText(
      `Attack Speed: ${this.game.player.combat.attackSpeed}`,
      15,
      this.game.height - 120
    );
    ctx.fillText(
      `Defense: ${this.game.player.combat.defense}`,
      15,
      this.game.height - 100
    );

    Object.keys(this.game.player.combat.modifiers).forEach((key, index) => {
      const value = this.game.player.combat.modifiers[key];
      ctx.fillText(
        `Combat Modifier ${index + 1}: ${key} (${value})`,
        15,
        this.game.height - (index + 1) * 20
      );
    });

    ctx.restore();
  }
}
