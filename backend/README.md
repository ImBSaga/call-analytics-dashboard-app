# 🚀 PineVox CDR Analytics Backend (Full-Stack Support)

A robust **Express.js** REST API designed for the PineVox Telecom Intelligence platform. This backend supports secure JWT authentication, Role-Based Access Control (RBAC), and persistent data storage via **MongoDB Atlas**.

---

## 🔥 New Features in Full-Stack Edition
- **MongoDB Atlas Integration**: Migrated from in-memory/CSV storage to a persistent cloud database.
- **Admin CRUD Support**: Fully implemented `POST`, `PUT`, and `DELETE` endpoints for managing Call Data Records (CDR).
- **Automated Data Seeding**: On the first start, the system automatically:
  - 📂 Parses `data/mock-cdr.csv` and populates the MongoDB cluster.
  - 👥 Creates default **Admin** and **Analyst** accounts.
- **Robust Connection Handling**: Optimized for **Vercel** serverless functions with connection pooling via `src/lib/db.js`.

---

## 🛠️ Technology Stack
- **Framework**: Express.js 4.x
- **Database**: MongoDB via Mongoose 8.x
- **Security**: JWT (jsonwebtoken), bcryptjs, express-validator
- **Optimization**: express-rate-limit, cors

---

## 🔗 Quick Start (Local)
1.  **Install dependencies**: `npm install`
2.  **Edit your `.env`**: Add your `MONGODB_URI` from your MongoDB Atlas dashboard.
3.  **Run with Hot-Reload**: `npm run dev` (API at `http://localhost:3001`).

---

## 🔐 Auth & Roles (Demo Accounts)
The system automatically seeds these users if the database is empty:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | admin@pinevox.com | Admin@1234 |
| **Analyst** | analyst@pinevox.com | Analyst@1234 |

*Note: The **Analyst** role provides Read-Only access. **Admin** has full Create, Edit, and Delete permissions.*

---

## 📡 API Endpoints

### 🩺 Health & Status
- `GET /health` — Check server and database connection status.

### 🔑 Authentication
- `POST /api/auth/login` — Login to receive a JWT.
- `POST /api/auth/signup` — Register as an Analyst (default).
- `GET /api/auth/me` — (🔒) Fetch current user details.

### 📊 CDR & Analytics
- `GET /api/cdr` — Paginated and filtered call log list.
- `GET /api/analytics` — Dynamic analytics summary (totals, trends, top callers).
- `POST /api/cdr` — (🛡️ Admin Only) Create a new call record.
- `PUT /api/cdr/:id` — (🛡️ Admin Only) Update an existing record.
- `DELETE /api/cdr/:id` — (🛡️ Admin Only) Remove a record from the database.

---

## 🔧 Environment Variables
Create a `.env` file in the `/backend` folder:
```env
PORT=3001
JWT_SECRET=your-secret-key
MONGODB_URI=mongodb+srv://... (Your Atlas URI)
NODE_ENV=development
```

---

## 📁 Backend Structure
```text
src/
├── app.js               # Express app & Middleware config
├── lib/db.js            # MongoDB Cloud connection logic
├── models/              # Mongoose Schemas (User, CDR)
├── services/            # Seeding (CSV -> MongoDB) & logic
├── controllers/         # Request handlers (Auth, CDR, Analytics)
├── routes/              # API Route definitions
└── middleware/          # JWT Verification & RBAC logic
```

Built with ❤️ for scalability and observability.
