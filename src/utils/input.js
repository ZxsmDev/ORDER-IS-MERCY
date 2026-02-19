export default class InputHandler {
  constructor() {
    this.keys = {};
    this.previousKeys = {};

    window.addEventListener("keydown", (e) => (this.keys[e.code] = true));
    window.addEventListener("keyup", (e) => (this.keys[e.code] = false));
  }
  // Call this once per frame to update input state
  update() {
    this.previousKeys = { ...this.keys };
  }
  // Check if a key is currently held down
  isDown(keys) {
    if (Array.isArray(keys)) {
      return keys.some((key) => !!this.keys[key]);
    }
    return !!this.keys[keys];
  }
  // Check if a key was just pressed this frame (click/press)
  isPressed(keys) {
    if (Array.isArray(keys)) {
      return keys.some((key) => this.keys[key] && !this.previousKeys[key]);
    }
    return this.keys[keys] && !this.previousKeys[keys];
  }
  // Check if a key was just released this frame
  isReleased(keys) {
    if (Array.isArray(keys)) {
      return keys.some((key) => !this.keys[key] && this.previousKeys[key]);
    }
    return !this.keys[keys] && this.previousKeys[keys];
  }
  lastDirection() {
    if (this.isDown(["ArrowLeft", "KeyA"])) return { x: -1, y: 0 };
    if (this.isDown(["ArrowRight", "KeyD"])) return { x: 1, y: 0 };
    if (this.isDown(["ArrowUp", "KeyW"])) return { x: 0, y: -1 };
    if (this.isDown(["ArrowDown", "KeyS"])) return { x: 0, y: 1 };
    return { x: 0, y: 0 };
  }
}
