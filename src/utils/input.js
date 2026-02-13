export default class InputHandler {
  constructor() {
    this.keys = {};
    window.addEventListener("keydown", (e) => (this.keys[e.key] = true));
    window.addEventListener("keyup", (e) => (this.keys[e.key] = false));
  }
  isDown(keys) {
    // Check if multiple valid inputs
    if (Array.isArray(keys)) {
      keys.forEach((key) => {
        return !!this.keys[key];
      });
    }
    // If only one option:
    return !!this.keys[keys];
  }
}
