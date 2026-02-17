// Main entry point for the game. Initializes the game manager and starts the game loop.
import GameManager from "./game/gameManager.js";
import GameLoop from "./game/gameLoop.js";
import StateManager from "./game/stateManager.js";

// Entity management and player class
import EntityManager from "./systems/entities/entityManager.js";
import Player from "./systems/entities/player.js";

// Combat system
import CombatManager from "./systems/combat/combatManager.js";

// Camera
import Camera from "./systems/camera/camera.js";

// UI
import UserInterface from "./systems/ui/userInterface.js";

// Level management
import Level from "./systems/level/level.js";

// Interaction system
import Interaction from "./systems/interaction/interaction.js";

// Utility classes
import Debug from "./utils/debug.js";
import InputHandler from "./utils/input.js";
import { Collision } from "./utils/collision.js";
import { MathUtils } from "./utils/math.js";

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  canvas.tabIndex = 0;
  canvas.focus();

  canvas.addEventListener("click", () => {
    // Request pointer lock
    canvas.requestPointerLock();
  });

  document.addEventListener("pointerlockchange", lockChangeAlert);

  function lockChangeAlert() {
    if (document.pointerLockElement === canvas) {
      console.log("The pointer lock status is now locked");
      // Add mouse movement listener when locked
      document.addEventListener("mousemove", updatePosition);
    } else {
      console.log("The pointer lock status is now unlocked");
      // Remove mouse movement listener when unlocked
      document.removeEventListener("mousemove", updatePosition);
    }
  }

  function updatePosition(e) {
    const movementX = e.movementX || 0;
    const movementY = e.movementY || 0;

    // Send to UI to create custom cursor movement
    // For example, you could dispatch a custom event with the movement data
    const cursorMoveEvent = new CustomEvent("cursorMove", {
      detail: { movementX, movementY },
    });
    document.dispatchEvent(cursorMoveEvent);
  }

  const gameManager = new GameManager(
    canvas,
    ctx,
    Collision,
    MathUtils,
    InputHandler,
    Debug,
    GameLoop,
    StateManager,
    EntityManager,
    Player,
    CombatManager,
    Level,
    Interaction,
    Camera,
    UserInterface
  );
  gameManager.init();
});
