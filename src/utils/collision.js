export const Collision = {
  rectCollision(a, b) {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  },
  rampCollision(player, ramp) {
    const playerCenterX = player.x + player.width / 2;
    const rampYAtPlayerX = ramp.getYAtX(playerCenterX);
    return (
      player.y + player.height > rampYAtPlayerX &&
      player.y < rampYAtPlayerX + 10 && // Allow some tolerance
      playerCenterX >= ramp.x &&
      playerCenterX <= ramp.x + ramp.width
    );
  },
  radialCollision(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.hypot(dx, dy) < a.r + b.r;
  },
  checkCollision(refCaller, refTarget, type = "rect", radius = 0) {
    switch (type) {
      case "rect":
        return this.rectCollision(refCaller, refTarget);
      case "ramp":
        return this.rampCollision(refCaller, refTarget);
      case "radial":
        return this.radialCollision(
          {
            x: refCaller.x + refCaller.width / 2,
            y: refCaller.y + refCaller.height / 2,
            r: radius,
          },
          {
            x: refTarget.x + refTarget.width / 2,
            y: refTarget.y + refTarget.height / 2,
            r: radius,
          }
        );
      default:
        return false;
    }
  },
};
