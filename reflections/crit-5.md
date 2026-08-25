# Crit 5 Reflection

## What was the breakthrough that moved the work forward?

The breakthrough was treating the collision and end-state behaviour as rules that could be tested before finishing the game itself. At first, it would have been easy to focus on making the character jump and making the interface look like a game. Instead, I first defined a detectable end state and then isolated the collision rule with a focused unit test.

This changed the implementation from “make something playable and then fix it” into a clearer sequence: define the expected behaviour, verify the important rule, and then integrate it into the interaction. Once collision detection worked independently, building the one-button jumper became much more straightforward because I knew exactly what should happen when the player failed.

## What did this work change about who I want to be as a software developer?

This prototype made me want to be a developer who values small, testable decisions rather than adding complexity too early. A game does not need many controls or mechanics to demonstrate meaningful interaction. Keeping the prototype to one button gave me more time to make the core loop understandable and reliable.

I also learned that tests can shape design rather than simply check finished code. In future projects, I want to identify important behaviours earlier and make them observable and testable before building more features around them.
