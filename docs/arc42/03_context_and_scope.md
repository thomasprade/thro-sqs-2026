# Context and Scope

Definition of system scope and context.

## Business context

_TODO:_ make better

```mermaid
C4Contex
  title Business Context Diagram for Recipe App
  Enterprise_boundary(b0, "Recipe App Business Context") {
    Person(user, "User")
    System(app, "Recipe App")
    System(api, "PDF API")
  }
  BiRel(user, app, "Uses")
  BiRel(app, api, "Export Recipe")
```

## Technical Context

_TODO:_ make
