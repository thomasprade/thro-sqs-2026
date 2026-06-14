---
status: Accepted
date: 2026-06-01
deciders: Thomas, ypw
---

# AD: Object-Relational Mapping (ORM) Library

## Context and Problem Statement

The project needs to interact with a database, and we need to decide on an approach for this interaction. We can either use raw SQL queries or use an Object-Relational Mapping (ORM) library that abstracts away the database interactions and allows us to work with objects instead of SQL.

## Decision Drivers

- Desire to simplify database interactions and reduce boilerplate code
- Need for a more maintainable and readable codebase
- Existing familiarity with ORM libraries among the team members

## Considered Options

- Use raw SQL queries for database interactions
- Use an ORM library
  - TypeORM: A popular ORM for TypeScript and JavaScript that supports various databases and provides a repository pattern for data access.
  - Sequelize: Another popular ORM for Node.js that supports multiple databases and provides a rich set of features for data modeling and querying.
  - Prisma: A modern ORM that focuses on type safety and developer experience, with support for various databases and a powerful query language.

## Decision Outcome

- We decided to use TypeORM as our ORM library for this project. TypeORM provides a good balance between simplicity and functionality, and it is well-suited for our needs. It also has good documentation and community support, which will help us in case we encounter any issues.

### Consequences

Positive:

- Simplified database interactions and reduced boilerplate code
- Improved maintainability and readability of the codebase
- Leveraging the features provided by TypeORM, such as the repository pattern, to further abstract away database interactions and improve code organization

Negative:

- Additional learning curve for team members who are not familiar with TypeORM
- Potential performance overhead compared to raw SQL queries, although this is generally negligible for most applications
- Schema migrations and database management may require additional setup and configuration when using an ORM

## More Information
