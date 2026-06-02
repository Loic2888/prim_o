# PRIM'O

> Real-time meritocratic recognition platform for SMEs.

Employers allocate tokens to employees instantly upon observed performance. Employees redeem tokens for vouchers on an integrated marketplace.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + TypeScript |
| Backend | Node.js + Express.js |
| Database | PostgreSQL |
| Authentication | JWT + Bcrypt |
| Payments | Stripe |
| Containerization | Docker + Docker Compose |
| CI/CD | GitHub Actions |

---

## Project Structure

```
prim_o/
├── client/                 # React + TypeScript frontend
│   └── src/
│       ├── components/
│       ├── pages/
│       │   ├── employer/
│       │   └── employee/
│       ├── context/
│       ├── hooks/
│       └── services/
├── server/                 # Node.js + Express backend
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       └── services/
├── docker/                 # Docker configuration files
├── docs/                   # Technical documentation
├── .gitignore
├── docker-compose.yml
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js LTS
- PostgreSQL 15+
- Docker + Docker Compose
- A Stripe account (test mode)

### Environment setup

```bash
# Backend
cp server/.env.example server/.env
# Fill in DATABASE_URL, JWT_SECRET, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET

# Frontend
cp client/.env.example client/.env
# Fill in VITE_STRIPE_PUBLIC_KEY
```

### Run with Docker (recommended)

```bash
docker-compose up --build
```

### Run locally

```bash
# Backend — http://localhost:5000
cd server
npm install
npm run dev

# Frontend — http://localhost:3000
cd client
npm install
npm start
```

### Tests

All test commands are run from the `server/` directory.

#### Unit tests — `npm test`

Runs 83 Jest tests against every service and middleware in isolation. Uses mocks — no running server or database needed. Executes in ~1.5 seconds.

```bash
cd server
npm test
```

#### Practical E2E tests — `npm run test:e2e`

Runs 57 end-to-end scenarios against a live server, a real PostgreSQL database and Stripe in test mode. Covers the full application flow:

- Company creation and validation
- Employer, employee and admin registration
- JWT login, refresh and logout
- Token purchase with Stripe test card `4242 4242 4242 4242`
- Stripe webhook processing (`payment_intent.succeeded`)
- Employer → employee token allocation
- Voucher creation, update and deletion (admin)
- Employee voucher redemption, balance deduction
- Role-based access control (401, 403, 402 error cases)

**Prerequisites:** Docker stack running + `server/.env` configured with valid Stripe test keys.

```bash
# 1. Start the stack
docker-compose up -d

# 2. Run the E2E tests
cd server
npm run test:e2e
```

Results are printed to the console and saved as `practical-test.md` at the project root.

---

## API Overview

| Group | Base path |
|---|---|
| Auth | `/api/auth` |
| Users | `/api/users` |
| Tokens | `/api/tokens` |
| Marketplace | `/api/marketplace` |

Full API contract: [documentation/stage3.md](documentation/stage3.md)

---

## Design

Figma mockup: https://nimbus-hack-73904302.figma.site/

---

## Team

- **Loïc Cerqueira** — Tech Lead / Security
- **Véronique Beauvais** — UX / Data
