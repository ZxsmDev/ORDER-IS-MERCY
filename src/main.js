// Main entry point for the game. Initializes the game manager and starts the game loop.
import GameManager from "./game/gameManager.js";
import GameLoop from "./game/gameLoop.js";
import StateManager from "./game/stateManager.js";

// Entity management and player class
import EntityManager from "./systems/entities/entityManager.js";
import Player from "./systems/entities/player.js";

// Level management
import Level from "./systems/level/level.js";

// Utility classes
import Debug from "./utils/debug.js";
import InputHandler from "./utils/input.js";
import { Collision } from "./utils/collision.js";
import { MathUtils } from "./utils/math.js";

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

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
    Level,
  );
  gameManager.init();
});
