= Roadmap

== Must Haves: Course Requirements

- [x] public repo
- [ ] 15 min Presentation -> issue #30
  - [ ] live demo
  - [ ] presentation of static code analysis tools
  - [ ] presentation of static code analysis based on latest project state
  - [ ] project structure using C4 (structurizr only)
  - [ ] test concept and used tools
  - [ ] prepare for questions
- [x] written in Typescript
- [ ] Implementation
  - [ ] public endpoint/frontend
  - [ ] secure endpoint -> issue #31
  - [ ] backend
    - [ ] API
      - [ ] fail-save architecture pattern ("Ausfallsichere Architekturpatterns zum Anbinden externe[r] Services") -> Issue 32
  - [x] persistence
  - [ ] tests
    - [ ] unit tests -> Issue #33
    - [ ] integration tests -> Issue #34
    - [ ] e2e tests -> Issue #35
    - [ ] penetration tests (could be integration test with test of security logic) -> Issue #36
    - [ ] arch tests -> Issue #25
    - [ ] github pipeline -> Issue #38
      - [ ] steps: first build, then use build artifacts for tests
    - [ ] static code analysis -> Issue #37
      - [ ] min 80% test coverage
      - [ ] no open issues
  - [ ] documentation
    - [ ] arc42 documentation for project -> Issue #39
    - [ ] C4 Model (for presentation) -> Issue #30 (could be made into sub-issue)
    - [ ] project decisions in ADR -> Issue #40
    - [ ] clean structured documentation
    - [ ] documentation hosted on readthedocks -> Issue #41
  - [ ] setup with max 2 commands -> Issue #42

== MVP

- [ ] backend
  - [x] recipes
    - [x] crud
  - [ ] ingredients
    - [x] cr
    - [ ] ud -> #16
  - [ ] recipe steps -> #24
    - [ ] crud
  - [ ] API
    - [ ] exist -> #3
    - [ ] protect endpoint -> #31
- [ ] frontend
  - [ ] print to pdf -> #4
  - [ ] pages -> #12
  - [ ] page for recipes -> #43
  - [ ] recipe manipulation -> #12
  - [ ] better ts layout (material ui) -> #23

== Nice to have
