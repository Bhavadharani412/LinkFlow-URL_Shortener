# Product Documentation: URL Shortener with Analytics

**Project Name:** LinkFlow  
**Project Type:** Full-Stack Web Application  
**Version:** 1.0  
**Status:** Initial Development

---

# 1. Problem Statement

Long URLs are difficult to share, remember, and manage.

For example, URLs containing lengthy query parameters, tracking information, or nested paths can become inconvenient when sharing them through messaging applications, emails, documents, or social media.

Additionally, users have no simple way to manage their shortened URLs or understand how frequently those links are accessed.

Existing URL shortening services often provide advanced functionality, but building a simplified, self-hosted solution provides an opportunity to understand backend development, database management, REST APIs, and frontend integration.

### Problems to Solve

1. Long URLs are inconvenient to share.
2. Users need a simple way to convert long URLs into short links.
3. Users need a centralized place to manage generated short URLs.
4. Users should be able to track how many times a shortened URL is accessed.
5. Users need basic insights into their link usage.

---

# 2. Expected Solution

Build a full-stack web application called **LinkFlow** that allows users to convert long URLs into short, shareable URLs.

The application will provide a React-based dashboard where users can submit URLs, generate shortened links, copy them, and view their existing links.

A Spring Boot backend will expose REST APIs to handle URL generation, storage, redirection, and click tracking.

PostgreSQL will persist the original URLs, generated short codes, creation timestamps, and click information.

### Example

**Input URL:**

https://example.com/products/electronics/smartphones/latest-model

**Generated Short URL:**

http://localhost:8080/abc123

**Expected Behaviour:**

1. User enters a long URL in the React application.
2. React sends a request to the Spring Boot backend.
3. Backend validates the submitted URL.
4. Backend generates a unique short code.
5. Original URL and short code are stored in PostgreSQL.
6. Backend returns the generated short URL.
7. User copies and shares the shortened URL.
8. When someone accesses the short URL, the backend retrieves the original URL.
9. Backend redirects the visitor to the original URL.
10. The click count is incremented.

### Primary Goal

Deliver a functional URL shortening platform with a clean UI, reliable backend logic, and a properly structured database.

The application should initially support anonymous users without requiring registration or login.

---

# 3. Features to Implement

Features will be implemented incrementally.

## Phase 1: MVP (Initial Development)

**Goal: Complete a working application.**

### 3.1 URL Shortening

- Provide an input field to enter a long URL.
- Validate the URL before processing.
- Generate a unique short code for every URL.
- Store the original URL and short code in PostgreSQL.
- Return the generated shortened URL.
- Display the shortened URL on the frontend.
- Provide a copy-to-clipboard button.

### 3.2 URL Redirection

- Expose a public endpoint for shortened URLs.
- Accept the short code as a path variable.
- Retrieve the corresponding original URL.
- Redirect the visitor to the original URL.
- Return HTTP 404 when the short code does not exist.

### 3.3 URL Management Dashboard

Display all generated URLs in a dashboard.

Each URL entry should display:

- Original URL
- Short URL
- Creation date
- Total click count
- Action to copy the short URL

### 3.4 Click Tracking

- Track every successful visit to a shortened URL.
- Increment its click count.
- Persist click counts in PostgreSQL.
- Display updated click counts in the dashboard.

### 3.5 Basic Validation and Error Handling

- Reject empty URLs.
- Reject malformed URLs.
- Prevent duplicate short codes.
- Handle nonexistent short codes.
- Display meaningful error messages.
- Handle unexpected backend errors gracefully.

---

## Phase 2: Enhanced Features

**Goal: Improve functionality and user experience.**

### 3.6 Custom Short URLs

Allow users to provide their own short codes.

Example:

https://linkflow.com/summer-sale

Validate that the requested short code is available before saving it.

### 3.7 URL Expiration

- Allow users to specify an expiration date.
- Automatically reject expired links during redirection.
- Display expired status in the dashboard.

### 3.8 Advanced Analytics

Track additional information for each click:

- Click timestamp
- Referrer information
- Browser information
- Device category

Provide dashboard statistics:

- Total URLs created
- Total clicks
- Most visited URLs
- Daily click statistics

### 3.9 Search and Filtering

- Search URLs by original URL or short code.
- Filter URLs by creation date.
- Sort URLs by creation date.
- Sort URLs by click count.

---

## Phase 3: Advanced Backend Engineering

**Goal: Introduce production-oriented engineering concepts.**

### 3.10 Authentication and Authorization

- Implement user registration.
- Implement user login.
- Use JWT-based authentication.
- Associate shortened URLs with their owners.
- Allow users to manage only their own URLs.

### 3.11 Redis Caching

- Cache frequently accessed short codes.
- Retrieve cached URLs before querying PostgreSQL.
- Configure cache expiration.
- Handle cache invalidation when URLs are deleted or expire.

### 3.12 Rate Limiting

- Limit excessive URL creation requests.
- Prevent API abuse.
- Introduce configurable request limits.

### 3.13 Testing

- Unit tests using JUnit 5 and Mockito.
- Controller tests using Spring Boot Test.
- Repository integration tests.
- API validation tests.
- Frontend component tests.

### 3.14 Deployment and DevOps

- Dockerize the Spring Boot backend.
- Dockerize the React frontend.
- Run PostgreSQL using Docker.
- Use Docker Compose to manage services.
- Configure environment-based application properties.
- Deploy the application to a cloud platform.

---

# 4. Technology Stack

## 4.1 Backend

| Technology | Purpose |
|---|---|
| Java 21 | Programming language |
| Spring Boot 3.x | Backend application framework |
| Spring Web | REST API development |
| Spring Data JPA | Database interaction |
| Hibernate | ORM |
| Jakarta Validation | Request validation |
| Maven | Dependency management and build |
| Lombok | Reduce boilerplate code |

## 4.2 Frontend

| Technology | Purpose |
|---|---|
| React.js | Frontend framework |
| Vite | Frontend build tool |
| JavaScript | Frontend programming language |
| Axios | HTTP communication |
| React Router | Frontend routing |
| CSS | Styling and responsive layouts |

## 4.3 Database

**PostgreSQL**

Used to store:

- Original URLs
- Short codes
- URL creation timestamps
- Click counts
- Click analytics (future phase)
- User information (future phase)

## 4.4 Development Tools

| Tool | Purpose |
|---|---|
| IntelliJ IDEA / VS Code | Development |
| Postman | API testing |
| Git | Version control |
| GitHub | Source code management |
| pgAdmin | Database management |
| Docker | Containerization (future phase) |

---

# 5. Architecture

## 5.1 High-Level Architecture

The application follows a three-tier architecture.

```text
                 USER
                   |
                   |
             REACT FRONTEND
                   |
                   | HTTP / JSON
                   |
              SPRING BOOT
                   |
          +--------+--------+
          |        |        |
          |        |        |
      CONTROLLER SERVICE REPOSITORY
          |        |        |
          +--------+--------+
                   |
                   |
               HIBERNATE
                   |
                   |
               POSTGRESQL
```

### Frontend Layer

Responsible for:

- Displaying the URL shortening interface.
- Accepting user input.
- Communicating with backend REST APIs.
- Displaying shortened URLs.
- Showing the URL management dashboard.
- Handling loading and error states.

### Backend Layer

Responsible for:

- Processing incoming HTTP requests.
- Validating submitted URLs.
- Generating unique short codes.
- Managing URL creation and retrieval.
- Handling redirection.
- Tracking URL clicks.
- Communicating with PostgreSQL.

### Database Layer

Responsible for:

- Persisting shortened URLs.
- Maintaining URL metadata.
- Storing click counts.
- Maintaining data consistency.

---

## 5.2 Backend Architecture

Follow a layered architecture using Spring Boot.

```text
com.linkflow
│
├── LinkFlowApplication.java
│
├── controller
│   └── UrlController.java
│
├── service
│   ├── UrlService.java
│   └── impl
│       └── UrlServiceImpl.java
│
├── repository
│   └── UrlRepository.java
│
├── entity
│   └── Url.java
│
├── dto
│   ├── UrlRequest.java
│   └── UrlResponse.java
│
├── exception
│   ├── GlobalExceptionHandler.java
│   └── UrlNotFoundException.java
│
└── config
    └── WebConfig.java
```

### Layer Responsibilities

**Controller**

- Exposes REST endpoints.
- Accepts HTTP requests.
- Returns appropriate HTTP responses.
- Delegates business logic to the service layer.

**Service**

- Contains business logic.
- Generates unique short codes.
- Validates URL creation rules.
- Handles URL retrieval and click tracking.

**Repository**

- Handles database operations.
- Uses Spring Data JPA.
- Provides methods to retrieve URLs by short code.

**Entity**

- Represents the URL database table.

**DTO**

- Separates API request/response models from database entities.

**Exception**

- Handles application exceptions.
- Returns consistent error responses.

---

## 5.3 Database Design

### Table: urls

| Column | Data Type | Description |
|---|---|---|
| id | BIGSERIAL | Primary key |
| original_url | TEXT | Original URL |
| short_code | VARCHAR(20) | Unique short identifier |
| click_count | BIGINT | Total number of clicks |
| created_at | TIMESTAMP | Creation timestamp |
| expires_at | TIMESTAMP | Optional expiration timestamp |

### Constraints

- `id` must be the primary key.
- `short_code` must be unique.
- `original_url` must not be null.
- `click_count` defaults to zero.
- `created_at` must be automatically populated.

### Future Table: url_clicks

| Column | Data Type | Description |
|---|---|---|
| id | BIGSERIAL | Primary key |
| url_id | BIGINT | Foreign key referencing urls |
| clicked_at | TIMESTAMP | Click timestamp |
| referrer | TEXT | Referrer information |
| user_agent | TEXT | Browser information |

This table will be introduced during the analytics iteration.

---

## 5.4 REST API Design

The following endpoints are required for Phase 1.

### 1. Create Short URL

**Endpoint:**

POST `/api/urls`

**Request:**

```json
{
  "originalUrl": "https://example.com/products/electronics"
}
```

**Response:**

```json
{
  "id": 1,
  "originalUrl": "https://example.com/products/electronics",
  "shortCode": "abc123",
  "shortUrl": "http://localhost:8080/abc123",
  "clickCount": 0,
  "createdAt": "2026-11-27T10:00:00"
}
```

### 2. Get All URLs

**Endpoint:**

GET `/api/urls`

**Purpose:**

Returns all shortened URLs for the dashboard.

### 3. Get URL by Short Code

**Endpoint:**

GET `/api/urls/{shortCode}`

**Purpose:**

Returns URL information associated with the given short code.

### 4. Redirect to Original URL

**Endpoint:**

GET `/{shortCode}`

**Purpose:**

- Retrieve the original URL.
- Increment the click count.
- Redirect the visitor using HTTP 302.

### 5. Delete URL

**Endpoint:**

DELETE `/api/urls/{id}`

**Purpose:**

Deletes a shortened URL.

---

## 5.5 URL Short Code Generation

The application should generate unique short codes.

For the MVP:

- Generate a random alphanumeric code.
- Use a default length of 6 characters.
- Check whether the generated code already exists.
- Regenerate if a collision occurs.
- Store the code in PostgreSQL with a unique constraint.

Example:

```text
Original URL:
https://example.com/products

Generated Code:
aB12xZ

Short URL:
http://localhost:8080/aB12xZ
```

The short code generator should be implemented as a separate component or service so that its implementation can be improved later.

---

# 6. Non-Functional Requirements

The application should follow these principles:

1. Maintain clean separation between controller, service, and repository layers.
2. Follow REST API conventions.
3. Use DTOs instead of exposing database entities directly.
4. Use proper HTTP status codes.
5. Implement centralized exception handling.
6. Use database constraints to maintain data integrity.
7. Keep frontend and backend independently maintainable.
8. Store configuration outside source code where appropriate.
9. Write readable, maintainable, and reusable code.
10. Design the application to support future scalability.

---

# 7. Initial Development Scope

For the first implementation, ONLY build Phase 1.

Do not implement:

- User registration or login.
- JWT authentication.
- Redis.
- Advanced analytics.
- Rate limiting.
- Docker.
- Microservices.
- Custom URL aliases.
- URL expiration.

These features will be implemented in future iterations.

### MVP Acceptance Criteria

The first version is considered complete when:

- [ ] React frontend runs successfully.
- [ ] Spring Boot backend runs successfully.
- [ ] PostgreSQL connection works.
- [ ] User can submit a long URL.
- [ ] Backend generates a unique short code.
- [ ] Generated URL is persisted in PostgreSQL.
- [ ] Shortened URL is displayed in React.
- [ ] User can copy the shortened URL.
- [ ] Visiting the shortened URL redirects to the original URL.
- [ ] Click count increases after successful redirection.
- [ ] Dashboard displays all generated URLs.
- [ ] Invalid URLs are handled appropriately.
- [ ] Unknown short codes return HTTP 404.

---

# 8. Instructions for Development

Build this application incrementally.

Before writing code:

1. Understand the entire product documentation.
2. Establish the backend and frontend folder structure.
3. Design the database entity and API contracts.
4. Implement the Spring Boot backend.
5. Verify backend APIs using Postman.
6. Implement the React frontend.
7. Integrate the frontend with the backend.
8. Test the complete application flow.

### Development Guidelines

- Prefer simple and readable code over unnecessary abstractions.
- Do not introduce complex design patterns for the MVP.
- Do not implement future-phase features prematurely.
- Follow the specified package structure.
- Keep API request and response formats consistent.
- Handle errors gracefully.
- Use meaningful variable and method names.
- Do not hardcode database credentials.
- Provide a README with setup and execution instructions.

**Important:** Build only the MVP initially. Once the MVP is working, wait for further instructions before implementing Phase 2 or Phase 3.

---

# 9. Future Product Vision

LinkFlow should gradually evolve from a basic URL shortening application into a production-oriented URL management platform.

The long-term vision includes:

- Secure user authentication.
- Personalized URL management.
- Custom short URLs.
- Detailed click analytics.
- Geographic and device-based insights.
- Redis-based caching.
- API rate limiting.
- Performance monitoring.
- Docker-based deployment.
- Automated testing and CI/CD.

The goal is not just to build a URL shortener, but to demonstrate practical full-stack engineering skills through continuous product development.
