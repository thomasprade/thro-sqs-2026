# Introduction and Goals

Our recipe service is a web application that helps users manage and use their cooking recipes.
The target user is the home cook in search for a minimalistic and clean way to organize their recipes.

## Requirements Overview

A short description of the core functional requirements for our system. For a detailed list see our [requirements document](../requirements.md).

| UseCaseID | Short Description                                                              |
| --------- | ------------------------------------------------------------------------------ |
| UC-01     | The system shall display an searchable overfiew for all recipes                |
| UC-02     | The system shall display recipes in a dedicated page with scalabel ingredients |
| UC-03     | The system shall allow registered users to export recipes as pdf               |

_TODO:_ Some sort of use case diagram

```puml
@startuml
left to right direction
actor "German car driver" as user
rectangle Tanker24 {
  usecase "UC1 - Search gas price in area" as UC1 #palegreen
  usecase "UC2 - Get detail information for gas station" as UC2 #palegreen
  usecase "UC3 - Track filling" as UC3
  usecase "UC4 - Export user data" as UC4
  usecase "UC5 - Authenticate" as UC5
  usecase "UC4.1 - Export as JSON" as UC4.1
  usecase "UC4.2 - Export as csv" as UC4.2
  usecase "UC6 - Add car to user account" as UC6
  usecase "UC7 - List gas stations by distance" as UC7 #palegreen
}
user --> UC1
user --> UC2
user --> UC3
user --> UC4.1
user --> UC4.2
user --> UC6
user --> UC7
UC3 .right.> UC5: <<include>>
UC6 .> UC5: <<include>>
UC4 ..> UC5: <<include>>
UC4.1 ..> UC4: <<extend>>
UC4.2 ..> UC4: <<extend>>

json Legend{
    "palegreen": "Main use case",
    "gray": "Additional use case"
}
@enduml
```

## Quality Goals

Our top three quality goals:

_TODO:_ decide on quality goals
| Priority | Quality Goal | Scenario |
| --- | --- | --- |
| 1 | TBD | TBD |
| 2 | TBD | TBD |
| 3 | TBD | TBD |

Reliability:

- All recipes and ingredients should be displayed accurately
- App should recover from API not working

Performance:

- App should start under 2sec
- Latency for all actions within the app (excluding pdf generation) should be under 1sec

## Stakeholders

| Role              | Contact Channels     | Expectations                                                                        |
| ----------------- | -------------------- | ----------------------------------------------------------------------------------- |
| Dev Team          | Lecture, Dev channel | Guided introduction to professional software quality assurance                      |
| Course Instructor | Lecture, Mail        | Adherence of project to course requirements listed in [roadmap](../requirements.md) |
