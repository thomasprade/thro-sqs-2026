---
status: Accepted
deciders: Thomas, ypw
---

# AD: Which node version to use

## Context and Problem Statement

Which node version should be used for the project.

## Decision Drivers

- Project was created when node 26 was in development (node v26 release May 05, 2026)
- Now node v26 is active and node v24 will be active till october 2026

## Considered Options

1. node v24
2. node v26

## Decision Outcome

We decided to use node v24, since it is still maintained and active until after the project is due.
Introducing a new node version will now create unnecessary work, since node v26 will introduce breaking changes.
Since our project lifetime is that of a semester project/prototype, a lifetime till october is not a problem.

### Consequences

Positive:

- No breaking changes short before deadline

Negative:

- Project will require a version node upgrade in the unlikely case that the project will be continued after this semester

## More Information
