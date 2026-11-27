# LinkFlow — URL Shortener (MVP v1.0)

LinkFlow is a full-stack URL shortening application built with **Spring Boot 3 (Java 21)**, **React (Vite)**, and **PostgreSQL**.

This release implements **Phase 1 (MVP)** as defined in [product-documentation.md](./product-documentation.md):
- Shorten long URLs into unique 6-character alphanumeric short codes
- Redirect visitors via `GET /{shortCode}` with HTTP `302 Found`
- Track and persist click counts in PostgreSQL
- Manage and copy shortened URLs from a responsive React dashboard
- Delete shortened URLs
- Validate URLs and handle errors consistently (HTTP `400`, `404`, `500`)

---

## Project Structure

```text
url_shortener_java/
├── backend/                     # Spring Boot 3 + Java 21 + Maven
│   ├── src/main/java/com/linkflow/
│   │   ├── LinkFlowApplication.java
│   │   ├── config/WebConfig.java
│   │   ├── controller/UrlController.java
│   │   ├── dto/
│   │   ├── entity/Url.java
│   │   ├── exception/
│   │   ├── repository/UrlRepository.java
│   │   └── service/
│   │       ├── ShortCodeGenerator.java
│   │       ├── UrlService.java
│   │       └── impl/UrlServiceImpl.java
│   ├── src/main/resources/application.properties
│   ├── .env.example
│   └── pom.xml
├── frontend/                    # React + Vite + Axios + React Router
│   ├── src/
│   │   ├── api/urlApi.js
│   │   ├── components/
│   │   ├── pages/
│   │   ├── styles/index.css
│   │   ├── utils/urlUtils.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── product-documentation.md
```

---

## Prerequisites

- **Java 21** (JDK 21)
- **Maven 3.9+**
- **Node.js 20+** and **npm**
- **PostgreSQL 15+**

---

## 1. Database Setup (PostgreSQL)

Create the `linkflow` database in PostgreSQL:

```sql
CREATE DATABASE linkflow;
```

Or via `psql`:

```bash
psql -U postgres -c "CREATE DATABASE linkflow;"
```

Hibernate (`spring.jpa.hibernate.ddl-auto=update`) will automatically create the `urls` table on backend startup with columns `id`, `original_url`, `short_code`, `click_count`, `created_at`, and `expires_at`.

---

## 2. Backend Setup & Execution

Database credentials are **not hardcoded** in source code. Configure them using environment variables (see `backend/.env.example`):

| Variable | Default | Description |
|---|---|---|
| `SERVER_PORT` | `8080` | Spring Boot HTTP port |
| `DB_URL` | `jdbc:postgresql://localhost:5432/linkflow` | PostgreSQL JDBC URL |
| `DB_USERNAME` | `postgres` | PostgreSQL username |
| `DB_PASSWORD` | *(empty)* | PostgreSQL password |
| `APP_BASE_URL` | `http://localhost:8080` | Public base URL for generated short links |
| `APP_SHORT_CODE_LENGTH` | `6` | Generated short code length (4–20) |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5173` | Comma-separated allowed frontend origins |

### Run Backend (PowerShell)

```powershell
cd backend
$env:DB_URL="jdbc:postgresql://localhost:5432/linkflow"
$env:DB_USERNAME="postgres"
$env:DB_PASSWORD="your_postgres_password"
mvn spring-boot:run
```

### Run Backend (Bash / macOS / Linux)

```bash
cd backend
export DB_URL="jdbc:postgresql://localhost:5432/linkflow"
export DB_USERNAME="postgres"
export DB_PASSWORD="your_postgres_password"
mvn spring-boot:run
```

### Run Backend Tests

```bash
cd backend
mvn test
```

---

## 3. Frontend Setup & Execution

Copy `frontend/.env.example` to `frontend/.env` if you need to override the backend API URL (defaults to `http://localhost:8080`).

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

To build for production:

```bash
cd frontend
npm run build
```

---

## REST API Reference (Phase 1)

| Method | Endpoint | Description | Success Status |
|---|---|---|---|
| `POST` | `/api/urls` | Create a shortened URL (`{"originalUrl": "https://..."}`) | `201 Created` |
| `GET` | `/api/urls` | List all shortened URLs | `200 OK` |
| `GET` | `/api/urls/{shortCode}` | Get details for a specific short code | `200 OK` |
| `GET` | `/{shortCode}` | Increment click count and redirect to original URL | `302 Found` |
| `DELETE` | `/api/urls/{id}` | Delete a shortened URL by ID | `204 No Content` |

### Example Request

```bash
curl -X POST http://localhost:8080/api/urls \
  -H "Content-Type: application/json" \
  -d '{"originalUrl": "https://example.com/products/electronics/smartphones/latest-model"}'
```

### Example Response

```json
{
  "id": 1,
  "originalUrl": "https://example.com/products/electronics/smartphones/latest-model",
  "shortCode": "aB12xZ",
  "shortUrl": "http://localhost:8080/aB12xZ",
  "clickCount": 0,
  "createdAt": "2026-11-27T10:00:00"
}
```
