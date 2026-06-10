# Enviro365 Investment Withdrawal System

Full-stack investment withdrawal system for **Enviro365 Investments** — automates investor portfolio management and withdrawal processing.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Spring Boot 3.2, Java 17 |
| Frontend | Angular 21 |
| Database | H2 in-memory |
| Auth | JWT (stateless) |

## Project Structure

```
enviro365-investment/
├── backend/          # Spring Boot REST API
├── frontend/         # Angular SPA
└── README.md
```

### Backend Package

`com.enviro.assessment.junior.nqobile`

## Prerequisites

- Java 17+
- Maven 3.6+
- Node.js 20+
- npm 10+

## Setup Instructions

### 1. Start the Backend

```bash
cd backend
mvn spring-boot:run
```

The API runs at **http://localhost:8080**

H2 Console: **http://localhost:8080/h2-console**
- JDBC URL: `jdbc:h2:mem:envirodb`
- Username: `sa`
- Password: *(empty)*

### 2. Start the Frontend

```bash
cd frontend
npm install
npm start
```

The UI runs at **http://localhost:4200**

## API Documentation

### Authentication (Public)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new investor |
| POST | `/api/auth/login` | Login and receive JWT token |

**Register Request:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "secret123",
  "age": 70,
  "balance": 5000
}
```

**Login Request:**
```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

**Auth Response:**
```json
{
  "token": "<JWT>",
  "userId": 1,
  "email": "john@example.com",
  "message": "Login successful"
}
```

### Portfolio (Authenticated)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/portfolio/{userId}` | View investor profile |
| GET | `/api/portfolio/export?userId={id}&startDate=&endDate=` | Export withdrawal history as CSV |

### User Profile (Authenticated)

| Method | Endpoint | Description |
|--------|----------|-------------|
| PUT | `/api/user/{userId}` | Update age and/or balance |

**Update Request:**
```json
{
  "age": 70,
  "balance": 5000
}
```

### Withdrawals (Authenticated)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/withdrawals/{userId}?amount=500` | Process withdrawal |
| GET | `/api/withdrawals/{userId}` | Get withdrawal history |

**Withdrawal Response (Success):**
```json
{
  "message": "Withdrawal successful",
  "remainingBalance": 4500
}
```

**Withdrawal Response (Denied):**
```json
{
  "message": "Withdrawal denied: Insufficient balance"
}
```

### Withdrawal Business Rules

1. User age must be **at least 65** (any age may register)
2. Amount cannot exceed available balance
3. Amount cannot exceed **90%** of balance

### Security

- All endpoints except `/api/auth/**` and `/h2-console/**` require JWT
- Include header: `Authorization: Bearer <token>`
- CORS enabled for `http://localhost:4200`

## Database Configuration

```properties
spring.datasource.url=jdbc:h2:mem:envirodb
spring.jpa.hibernate.ddl-auto=update
```

### User Entity Fields

`id`, `firstName`, `lastName`, `email`, `password`, `age`, `balance`, `role`

## Frontend Features

- Login / Register pages with form validation
- Portfolio dashboard
- Profile editor (age + balance)
- Withdrawal form with business rule feedback
- Withdrawal history table
- CSV export with optional date range filter
- JWT interceptor on all API calls

## Running Tests

```bash
cd backend
mvn test
```

Unit tests cover withdrawal service business rules (age, balance, 90% limit).

## Advanced Features Implemented

- Global exception handling (`@ControllerAdvice`)
- DTO layer for requests/responses
- Input validation (`@Valid`)
- Unit tests (service layer)
- Logging system (SLF4J)
- UI form validation (Angular Reactive Forms)

## AI Usage Disclosure

This project was developed with assistance from **Cursor AI** (Claude). AI was used for:

- Scaffolding the Spring Boot and Angular project structure
- Implementing REST endpoints, JWT security, and business logic
- Creating Angular components, services, and routing
- Writing unit tests and documentation

All code was reviewed and validated against the assessment requirements. Business rules, API contracts, and security constraints were explicitly specified in the requirements document.

## Screenshots

Screenshots of the UI can be captured after starting both servers:

1. **Login** — `/login`
2. **Register** — `/register`
3. **Dashboard** — `/dashboard`
4. **Profile** — `/profile`
5. **Withdrawal Form** — `/withdrawals`
6. **Withdrawal History** — `/withdrawals/history`

> Run the application locally and capture screenshots for submission.

## Success Checklist

- [x] Register works
- [x] Login returns JWT
- [x] Profile saves age + balance correctly
- [x] Withdrawal deducts balance
- [x] Withdrawal history persists
- [x] CSV export works
- [x] Angular UI fully connected
- [x] Clean JSON communication
