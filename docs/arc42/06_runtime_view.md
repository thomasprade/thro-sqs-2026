# Runtime View

How the building blocks from chapter [05](05_building_block_view.md) cooperate at runtime, shown
for the use cases of chapter [01](01_introduction_and_goals.md).

## Scenario 1: Browse & Search Recipes (UC-01)

```puml
@startuml
actor User
participant "Frontend" as FE
participant "AuthGuard" as Guard
participant "RecipeController" as Ctrl
participant "RecipeService" as Svc
database "SQLite" as DB

User -> FE : open overview
FE -> Guard : GET /api/recipes
Guard -> Ctrl : @Public — pass through
Ctrl -> Svc : findAll()
Svc -> DB : SELECT recipes
DB --> Svc : rows
Svc --> Ctrl : recipes (mapped)
Ctrl --> FE : ApiResponse<Recipe[]>
FE --> User : render list
@enduml
```

The overview is a public `GET`, so the `AuthGuard` lets it through. Search is applied
client-side with a debounced filter over the returned list — no extra backend call.

## Scenario 2: View Recipe with Scalable Ingredients (UC-02)

```puml
@startuml
actor User
participant "RecipePage" as FE
participant "Backend" as BE
database "SQLite" as DB

User -> FE : open /recipe/:id
FE -> BE : GET /api/recipes/:id
FE -> BE : GET /api/recipes/:id/ingredients
BE -> DB : SELECT recipe + ingredients
DB --> BE : rows
BE --> FE : ApiResponse<Recipe>, ApiResponse<Ingredient[]>
FE --> User : render details
User -> FE : change portions
FE --> User : re-scale amounts (client-side)
@enduml
```

The page loads the recipe and its ingredients with two parallel public `GET`s. Changing the portion
count rescales the ingredient amounts in the browser - it does not hit the backend.

## Scenario 3: Login & Authenticated Write (UC-03)

```puml
@startuml
actor User
participant "Frontend" as FE
participant "AuthController" as Auth
participant "AuthGuard" as Guard
participant "RecipeController" as Ctrl
database "SQLite" as DB

User -> FE : enter credentials
FE -> Auth : POST /api/auth/login
Auth -> DB : find user, verify (bcrypt)
Auth --> FE : { access_token }
FE -> FE : store JWT in localStorage

User -> FE : create recipe
FE -> Guard : POST /api/recipes\nAuthorization: Bearer <jwt>
Guard -> Ctrl : token valid — pass through
Ctrl -> DB : INSERT recipe
Ctrl --> FE : ApiResponse<Recipe>
@enduml
```

Login returns a JWT that the frontend stores and sends on every write. The global `AuthGuard`
verifies the bearer token and the `ValidationPipe` checks the request body before the controller
runs; an invalid or missing token is rejected with `401`.

## Scenario 4: Export Recipe as PDF (UC-03 — Planned)

!!! note "Planned"
This flow is not yet implemented (see requirement #4). It documents the intended behaviour.

```puml
@startuml
actor User
participant "Frontend" as FE
participant "Backend" as BE
database "SQLite" as DB
participant "PDF API" as PDF

User -> FE : request PDF export
FE -> BE : POST /api/recipes/:id/export\nAuthorization: Bearer {jwt}
BE -> DB : load recipe + ingredients
BE -> PDF : HTTPS render request
alt PDF API available
  PDF --> BE : PDF document
  BE --> FE : PDF file
  FE --> User : download PDF
else PDF API unavailable
  BE --> FE : error (fail-safe)
  FE --> User : app stays usable
end
@enduml
```

The export is an authenticated request. The backend gathers the recipe and its ingredients and
delegates rendering to the external PDF API over HTTPS. A timeout / fallback isolates that call so
the rest of the app keeps working when the PDF API is unavailable (Reliability goal, chapter
[01](01_introduction_and_goals.md)).
