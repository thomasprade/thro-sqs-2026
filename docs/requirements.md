# Requirements

## Must Haves: Course Requirements

- [x] public repo
- [ ] 30 min Presentation -> issue #30
  - [ ] live demo
  - [ ] presentation of static code analysis tools
  - [ ] presentation of static code analysis based on latest project state
  - [ ] project structure using C4 (structurizr only)
  - [ ] test concept and used tools
  - [ ] prepare for questions
- [x] written in Typescript
- [x] Implementation
  - [x] public endpoint/frontend
  - [x] secure endpoint -> issue #31
  - [x] backend
    - [x] API
      - [x] fail-safe architecture pattern ("Ausfallsichere Architekturpatterns zum Anbinden externe[r] Services") -> Issue 32
  - [x] persistence
  - [x] tests
    - [x] unit tests -> Issue #33
    - [x] integration tests -> Issue #34
    - [x] e2e tests -> Issue #35
    - [x] penetration tests (could be integration test with test of security logic) -> Issue #36
    - [x] arch tests -> Issue #25
    - [x] github pipeline -> Issue #38
      - [x] steps: first build, then use build artifacts for tests
    - [x] static code analysis -> Issue #37
      - [x] min 80% test coverage
      - [x] no open issues
  - [x] documentation
    - [x] arc42 documentation for project -> Issue #39
    - [x] C4 Model (for presentation) -> Issue #30 (could be made into sub-issue)
    - [ ] project decisions in ADR -> Issue #40
    - [x] clean structured documentation
    - [x] documentation hosted on readthedocs -> Issue #41
  - [x] setup with max 2 commands -> Issue #42

## MVP

- [x] backend
  - [x] recipes
    - [x] crud
  - [x] ingredients
    - [x] cr
    - [x] ud -> #16
  - [ ] recipe steps -> #24, #68
    - [ ] crud
  - [x] API
    - [x] exist -> #3
  - [x] protect endpoint -> #31
- [x] frontend
  - [ ] print to pdf -> #4
  - [x] weather api -> #53
  - [x] pages -> #12
  - [x] page for recipes -> #43
  - [x] recipe manipulation -> #12
  - [x] better ts layout (material ui) -> #23

## Nice to have
