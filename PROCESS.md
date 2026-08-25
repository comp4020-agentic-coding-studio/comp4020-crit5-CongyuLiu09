# Process overview

## What I built

I built a small one-button jumping game in Astro. The player controls a character by jumping over an obstacle, with the interaction deliberately kept simple so that the challenge comes from timing rather than learning controls. The prototype has a clear collision rule and a detectable end state, so the player can immediately understand when a run has failed and try again.

## The moments that mattered

### 1. Defining an observable end state before building the game

Before implementing the full interaction, I added a test for a detectable end state. Rather than starting with visuals and deciding later what counted as failure, I first made the game outcome something that could be checked automatically. This gave the implementation a concrete behavioural requirement: a collision needed to produce an observable game-over state rather than only a visual reaction.

I accepted this direction once the new specification was represented by a focused test that the later implementation could satisfy.

[`2fc3017`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit5-CongyuLiu09/commit/2fc3017)

### 2. Separating the collision rule from the rest of the interaction

Collision detection was the most important game rule because it determines whether the player has successfully avoided the obstacle. Instead of burying this behaviour inside animation or rendering code, I treated collision as a focused rule and added a unit test for it. This made the behaviour easier to reason about and gave me a direct way to check the boundary between a successful jump and a failed one.

The focused test provided evidence that collision behaviour worked independently before I relied on it in the complete game.

[`bc5ba41`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit5-CongyuLiu09/commit/bc5ba41)

### 3. Keeping the final interaction deliberately small

For the playable prototype, I chose a one-button jumper rather than adding multiple movement controls, levels, or mechanics. The simpler interaction made timing the main player decision and let me concentrate on making one complete game loop work: jump, avoid the obstacle, collide, reach an end state, and restart.

After integrating the collision rule into the playable version, I checked the game as an actual interaction rather than relying only on the unit test: the player could jump using the single control, collision produced the intended end state, and the game could be played again.

[`65b2085`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit5-CongyuLiu09/commit/65b2085)

## Before you ship

Before submission, I used the repository checks to verify that the prototype and its evidence were in a submit-ready state. In particular, the process evidence points to real commits rather than describing work that cannot be traced in the repository. I also kept the Astro stack carried forward from Crit 4 rather than introducing an unnecessary stack change for a small weekly prototype.

The stack and harness decisions are traceable through:

[`f03d846...a9495a6`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit5-CongyuLiu09/compare/f03d846...a9495a6)
