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

## Scenario 4: Display Current Weather

```puml
@startuml
actor User
participant "Frontend" as FE
participant "Backend" as BE
participant "Weather API\n(open-meteo.com)" as WA

User -> FE : opens app (Home or Recipe page)
FE -> BE : GET /api/weather (public, no JWT)
BE -> WA : HTTPS GET current weather
alt Weather API available
  WA --> BE : temperature + weather code
  BE --> FE : { data: { temperature, weatherCode } }
  FE --> User : shows icon + temperature in header
else Weather API unavailable (circuit breaker open)
  BE --> FE : HTTP 500 (Internal Server Error)
  FE --> User : shows error message; rest of app stays usable
end
@enduml
```

The weather request is public (no JWT required). The backend calls the external Weather API via
`WeatherRepository`, which wraps the HTTP call in an opossum circuit breaker. When the circuit
breaker is open the call fails gracefully and the frontend shows an error message without
affecting other functionality (Reliability goal, chapter [01](01_introduction_and_goals.md)).
