export const MathUtils = {
  clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  },
  lerp(a, b, alpha) {
    return a + (b - a) * alpha;
  },
  distance(x1, y1, x2, y2) {
    return Math.hypot(x2 - x1, y2 - y1);
  },
  angleTo(x1, y1, x2, y2) {
    return Math.atan2(y2 - y1, x2 - x1);
  },
  randomRange(min, max) {
    return Math.random() * (max - min) + min;
  },
  dotProduct(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y;
  },
};
