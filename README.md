# ORDER IS MERCY

> A bleak platformer metroidvania about obedience, decay, and the quiet violence of systems that never stop running.

---

## TABLE OF CONTENTS

- [Overview](#overview)
- [Design Pillars](#design-pillars)
- [Core Fantasy](#core-fantasy)
- [Core Loop](#core-loop)
- [Player Mechanics](#player-mechanics)
  - [Movement](#movement)
  - [Combat](#combat)
- [Systems & Progression](#systems--progression)
- [World Structure](#world-structure)
- [Narrative Structure](#narrative-structure)
- [Endings](#endings)
- [Visual & Audio Direction](#visual--audio-direction)
- [Technical Architecture](#technical-architecture)
- [Inspirations](#inspirations)
- [Development Roadmap](#development-roadmap)
- [Task Checklist](#task-checklist)
- [Commit History](#commit-history)

---

## OVERVIEW

**ORDER IS MERCY** is a dark, atmospheric 2D platformer with precision combat and traversal, inspired by  
_Hollow Knight_, but grounded in themes of **bureaucracy, decay, and enforced purpose**.

This is not a heroic journey.  
The world does not want saving.  
It wants **processing**.

You are not chosen.  
You are **assigned**.

---

## DESIGN PILLARS

1. **Obedience Is a Mechanic**
   - Progress is tied to compliance, not skill alone.
   - The game tracks _how well you follow instructions_, not how moral you are.

2. **Movement Is Expression**
   - Traversal should feel fluid, fast, and empowering.
   - Combat difficulty comes from **positioning**, not raw numbers.

3. **The System Outlives You**
   - The world does not care about rebellion.
   - Even failure is documented and archived.

4. **No Clean Endings**
   - Every ending is a loss.
   - The only variable is **who benefits from it**.

---

## CORE FANTASY

You are a low-ranking **clerical enforcer** operating within a city-state governed entirely by an ancient administrative machine known only as **The Bureau**.

Every action requires:

- Authorization
- Documentation
- Justification

Including violence.  
Including death.  
Including your own.

---

## CORE LOOP

> **Explore → Receive Directives → Execute Tasks → File Results → Adjust Compliance → World Reacts**

### Directive Flow

1. Receive a Directive from a Ministry terminal or NPC
2. Carry out the task (combat, traversal, investigation)
3. Return proof or documentation
4. Receive rewards, penalties, or amendments
5. World state subtly shifts

### Player Tension

- High compliance = easier access, colder world
- Low compliance = resistance, instability, corruption
  - (Low compliance essentially blocks upgrades - in an effort to encourage obedience)

There is **no neutral state**.

---

## PLAYER MECHANICS

### Movement

- **Double Jump**
  - Midair correction framed as an “approved action”
  - Visualized via a stamped burst of energy

- **Dash**
  - Ground dash behaves like a short sprint
  - Air dash decays rapidly, forcing intentional use
  - Down dash, and diagonal down dash for interest
  - Combat wise, high compliance unlocks i-frame upgrade

- **Wall Cling**
  - Slow descent
  - Resets jump cooldown
  - Limited by stamina/focus to prevent infinite climbs

Movement should feel _cleaner than combat_.

---

### Combat

- **Melee Combat**
  - Fast, precise strikes
  - Short recovery windows
  - Enemies punish panic inputs

- **Projectile Tools**
  - High lethality, limited ammo
  - Enemies obey the same rules
  - Designed to complement melee, not replace it

- **Execution Attacks**
  - Triggered when enemy morale breaks
  - Cinematic, brutal, costly
  - Lowers compliance as punishment for excess
    - (While high compliance is typically sought after, it can be "channeled" and lost to aid in combat)

---

## SYSTEMS & PROGRESSION

| System           | Description                               |
| ---------------- | ----------------------------------------- |
| Compliance Meter | Tracks obedience to directives            |
| Permits & Forms  | Gate abilities, areas, upgrades           |
| Paper Clips      | Base currency (valuable due to scarcity)  |
| Seals            | Permanent progression markers             |
| Records          | Save system disguised as archival backups |

Progression is not about growth.  
It’s about **authorization**.

---

## WORLD STRUCTURE

### The Ministry (Hub)

- Central administrative complex
- Cold, rigid, sterile
- Source of most Directives

### Outer Sectors

- Abandoned bureaucratic projects
- Collapsed offices, overgrown archives
- Populated by forgotten workers and malformed enforcers

### Sanctums

- Optional challenge zones
- Contain outlawed knowledge
- No Directives, no guidance

### The Citadel

- Final region
- Pristine, empty, silent
- Where the system reveals its truth

---

## NARRATIVE STRUCTURE

### Act I — Compliance

- You follow orders
- The system rewards efficiency
- The world feels stable but lifeless

### Act II — Realization

- Directives contradict themselves
- NPC dialogue loops and degrades
- You discover there is no ruling authority

### Act III — Collapse

- The system begins correcting _you_
- Areas destabilize
- The game actively resists player agency
  - Input inversion, flipped camera etc.

---

## ENDINGS

1. **Compliance Complete**
   - Perfect obedience
   - You are promoted into irrelevance

2. **Anomaly Logged**
   - Rebellion acknowledged
   - Filed, categorized, ignored

3. **Overwrite**
   - You assume control
   - The system persists, now bearing your name

There is no victory state.

---

## VISUAL & AUDIO DIRECTION

### Visuals

- Muted palette, near-monochrome - very brown/tan and lifeless
- Red stamps and seals as UI accents
- Subtle world glitches tied to compliance

### Audio

- Mechanical ambience
- Distant machinery
- Music fades under heavy bureaucracy moments

Silence is intentional.

---

## TECHNICAL ARCHITECTURE

- HTML Canvas
- Vanilla JavaScript
- Centralized GameManager architecture
- Entity-based system (Player, Enemies, NPCs)
- State-driven scene management

Structure prioritizes **maintainability over speed**.

---

## INSPIRATIONS

- _Hollow Knight_
  - Environmental storytelling, melancholic tone, a world decaying long after its purpose has been forgotten.
- _1984_
  - Totalitarianism, bureaucratic control, and the weaponization of language to suppress individuality and dissent.
- _Control_
  - Institutional surrealism, hostile architecture, and the idea that systems persist regardless of human cost.
- _Rain World_
  - Survival, inevitability, and the indifference of the world to player intent.
- _Hollow Knight: Silksong_
  - A dying world in motion — collapse as a process, not an event.

---

## DEVELOPMENT ROADMAP

### Phase 1 — Foundation

- Core movement
- Basic combat
- Scene/state system

### Phase 2 — Systems

- Directives
- Compliance tracking
- Save/record system

### Phase 3 — Content

- World regions
- Enemy types
- Boss encounters

### Phase 4 — Narrative & Polish

- Endings
- Environmental storytelling
- Audio/visual refinement

---

## TASK CHECKLIST

### Core Engine

- [x] Finalize GameManager architecture
- [ ] Implement full StateManager
- [x] Modularize Entity system
- [x] Camera system with smoothing
- [x] Collision refinement

### Player

- [x] Finalize movement tuning
- [x] Dash decay logic
- [ ] Wall cling stamina
- [ ] Animation state machine
- [ ] Hitbox / hurtbox separation

### Combat

- [ ] Melee combo logic
- [ ] Parry / counter window
- [ ] Projectile ammo system
- [ ] Enemy morale system
- [ ] Execution animations

### Systems

- [ ] Directive generator
- [ ] Compliance meter logic
- [ ] Permit gating
- [ ] Ink & Seal economy
- [ ] Save/record terminals

### World

- [ ] Ministry hub
- [ ] Outer Sector tilesets
- [ ] Sanctum challenge rooms
- [ ] Citadel layout
- [ ] Environmental hazards

### Enemies

- [ ] Basic enforcer
- [ ] Ranged unit
- [ ] Corrupted worker
- [ ] Elite bureaucrat
- [ ] Boss framework

### Narrative

- [ ] Directive text pool
- [ ] NPC dialogue system
- [ ] World-state dialogue variants
- [ ] Ending triggers
- [ ] Ending cutscenes

### Polish

- [ ] UI theming
- [ ] Audio pass
- [ ] Performance optimization
- [ ] Bug fixing
- [ ] Playtesting

---

## COMMIT HISTORY

| #   | Commit                          | Description                                                                                            |
| --- | ------------------------------- | ------------------------------------------------------------------------------------------------------ |
| 1   | Refactoring Progress (P1)       | Core architecture rebuilt: MAIN → GAMEMANAGER → GAMELOOP → STATEMANAGER → ENTITYMANAGER → PLAYER       |
| 2   | Refactoring Progress (P2)       | Bug fixes, sizing logic, refined movement, early level infrastructure                                  |
| 3   | Refactoring Progress (P3)       | Debug trajectory, improved collision detection, camera system, level system, core player movement      |
| 4   | Created New Preliminary Systems | Combat manager, interaction manager, ui + hud, better collision detection, ramp level object           |
| 5   | Updated Level System            | Created a more in-depth level, adjusted some ramp physics, began constructing python level editor      |
| 6   | Refined Object Instantiation    | Trimmed and refactored object instantiation, improved and simplified collision, interaction foundation |
| 7   | Attack Implementation & Enemies | Allowed player attacking, added enemies and adjusted gameManager declaration, interactable door        |
| 8   | Interaction & Improved Editor   | Added UI to the door interaction, cleaned up varius redundant code, massive editor upgrade (still WIP) |
| 9   | Main Menu & Editor Change       | Converted editor into HTML/JS for ease of use, added main menu, began working on level swapping        |

---

> - “NONCOMPLIANCE IS NEGLIGENCE.”
> - “EVERY ACTION HAS A FILE.”
> - “FUNCTION IS FREEDOM.”
> - “THE SYSTEM REMEMBERS SO YOU DON’T HAVE TO.”
> - “YOU ARE SAFE WHILE RECORDED.”
