---
status: Accepted
date: 2026-06-09
deciders: Thomas, ypw
---

# AD: Docker Setup for Local Demonstration

## Context and Problem Statement

We are required to demonstrate the project locally with minimal setup for the user. To achieve this, we need to decide on a Docker setup that allows us to easily run the application and its dependencies (such as the database) in a containerized environment. This will enable users to quickly get the application up and running without having to worry about installing and configuring the necessary software on their local machines.

## Decision Drivers

- Ease of setup for local demonstration
- Consistency across different development environments
- Isolation of application dependencies
- Simplified management of application and database versions

## Considered Options

- Use Docker Compose to define and run multi-container Docker applications
- Use individual Docker containers for each component and manage them manually

## Decision Outcome

- We decided to use Docker Compose for our local demonstration setup. Docker Compose allows us to define and run multi-container Docker applications, making it easier to manage the application and its dependencies in a consistent and isolated environment.
- We decided to use separate containers for the frontend and backend of the application, instead of delivering the bundled frontend assets to the backend container. This approach allows for better separation of concerns and makes it easier to manage and update each component independently.

### Consequences

Positive:

- Simplified setup for local demonstration
- Consistency across different development environments
- Isolation of application dependencies
- Simplified management of application and database versions
- Better separation of concerns between frontend and backend components

Negative:

- Potentially increased complexity in managing multiple containers

## More Information
