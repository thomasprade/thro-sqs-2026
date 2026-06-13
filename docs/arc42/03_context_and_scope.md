# Context and Scope

Definition of the system scope and context. This chapter delimits the Recipe App from its
communication partners — its users and the external Weather API — and describes the domain and
technical interfaces between them.

## Business Context

The Recipe App is used by a single type of user to manage and view cooking recipes. To display
current weather information, the app fetches data from an external Weather API (open-meteo.com).

```puml
@startuml
left to right direction
skinparam packageStyle rectangle

actor "User" as user
rectangle "Recipe App" as app
rectangle "Weather API" as api

user --> app : Browses, manages recipes &\ningredients, views current weather
app --> api : Requests current weather data
api --> app : Returns temperature & weather code
@enduml
```

| Communication Partner | Input (to Recipe App)                    | Output (from Recipe App)                         |
| --------------------- | ---------------------------------------- | ------------------------------------------------ |
| User                  | Recipe & ingredient data, search queries | Recipe overview, recipe details, current weather |
| Weather API           | Current temperature and WMO weather code | Location and time parameters                     |

## Technical Context

The user accesses the app through a browser. The React frontend talks to the NestJS backend
over a REST API (`/api`), which persists data in a local SQLite file and calls the external
Weather API over HTTPS.

```puml
@startuml
left to right direction

actor "User" as user
node "Browser\n(React Frontend)" as fe
node "Backend\n(NestJS REST API)" as be
database "SQLite\n(DATABASE_PATH)" as db
cloud "Weather API\n(open-meteo.com)" as api

user --> fe
fe --> be : REST /api (JSON, JWT bearer)
be --> db : SQL (file)
be --> api : HTTPS
@enduml
```

| Channel               | Protocol / Format                                          |
| --------------------- | ---------------------------------------------------------- |
| Browser ⇄ Frontend    | HTTP (Vite-served single-page app)                         |
| Frontend ⇄ Backend    | REST `/api`, JSON; write operations use a JWT bearer token |
| Backend ⇄ Database    | SQL against a local SQLite file (`DATABASE_PATH`)          |
| Backend ⇄ Weather API | HTTPS                                                      |
