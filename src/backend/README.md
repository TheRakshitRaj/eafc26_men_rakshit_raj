# EA Sports FC 26 Player Analytics Platform Backend

An industry-level, highly scalable, and production-ready **REST API backend** built with **Node.js, Express.js, and MongoDB (via Mongoose)** using modern **ES Modules** syntax.

Designed around a strict **MVC (Model-View-Controller)** design pattern, the backend provides extensive endpoints for managing world-class soccer players, calculating side-by-side head-to-head comparisons, and generating aggregate dashboard analytics.

---

## 🌟 Features

- **Strict MVC Architecture:** Standardized, clean separation of models, validation filters, service classes, controllers, and router configurations.
- **Advanced Query Parameters:**
  - **Dynamic Pagination:** Custom calculation logic for metadata headers (`page`, `limit`, `totalPages`, `hasNextPage`, etc.).
  - **Relational Field Filtering:** Support for multiple Mongoose condition matching formats (e.g., `overall_gte=90`, `pace_lte=80`).
  - **Smart String Search:** Partial matching text query support across players (`name`, `team`, `league`, `nation`, `position`).
  - **Custom Field Limits:** Selectable output response fields (`fields=name,overall,team`).
  - **Translation Mapping:** Maps custom API search aliases (e.g., `ovr` mapped directly onto the database field `overall`).
- **Head-to-Head Comparisons:** Computes individual attribute deltas, calculates sub-attribute wins, and determines an overall match winner.
- **Mongoose Aggregations:** Analyzes player attributes grouped by club, league, country, and pitch positions.
- **Role-Based Access Control (RBAC):** Protects administrative routes (create/update/delete) with custom JWT verification and role boundaries.
- **Soft Deletion Pipeline:** Safely deletes player records by setting `{ isDeleted: true }` indexes, protecting documents from standard analytics and lists.
- **Resilient Error Interception:** Custom global error handler trap mapping common Mongoose errors (Duplicate Keys, Validation Failures, Cast Errors) to structured API standard payloads.
- **Security & Logging:** Incorporates request rate limiters and standard microsecond request trackers.

---

## 📂 Codebase Architecture

```directory
src/backend/
├── src/
│   ├── config/          # Environment configuration & DB connection
│   │   ├── db.js
│   │   └── jwt.js
│   ├── controllers/     # Controller router handlers
│   │   ├── adminController.js
│   │   ├── analyticsController.js
│   │   ├── authController.js
│   │   ├── compareController.js
│   │   ├── healthController.js
│   │   └── playerController.js
│   ├── data/            # Local data models & database seeders
│   │   └── seedPlayers.js
│   ├── middlewares/     # Global express middlewares & interceptors
│   │   ├── adminMiddleware.js
│   │   ├── asyncHandler.js
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   ├── loggerMiddleware.js
│   │   ├── rateLimiter.js
│   │   └── validationMiddleware.js
│   ├── models/          # Mongoose document schema definitions
│   │   ├── Player.js
│   │   └── User.js
│   ├── routes/          # Versioned Router binds
│   │   ├── adminRoutes.js
│   │   ├── analyticsRoutes.js
│   │   ├── authRoutes.js
│   │   ├── compareRoutes.js
│   │   ├── healthRoutes.js
│   │   └── playerRoutes.js
│   ├── services/        # Service logic and aggregation builders
│   │   ├── adminService.js
│   │   ├── analyticsService.js
│   │   ├── authService.js
│   │   ├── compareService.js
│   │   └── playerService.js
│   ├── utils/           # Centralized API response formatters & parsers
│   │   ├── ApiFeatures.js
│   │   ├── ApiResponse.js
│   │   ├── buildFilters.js
│   │   ├── generateToken.js
│   │   └── pagination.js
│   └── validators/      # Payload validator schemas
│       ├── authValidator.js
│       └── playerValidator.js
├── app.js               # Express application wires
├── server.js            # Server entrypoint & DB bootstrap
├── package.json         # Package configuration
└── .env                 # Environment configurations
```

---

## 🛠️ Tech Stack

- **Runtime Environment:** Node.js (v18+)
- **Framework:** Express.js (v5.x)
- **Database ORM:** MongoDB Atlas + Mongoose
- **Security & Crypto:** `bcryptjs` (Password hashing) & `jsonwebtoken` (JWT Session authorization tokens)
- **Quality of Life:** `dotenv` & `express-rate-limit`

---

## 🚀 Installation & Setup

### 1. Initialize Configuration
Navigate to the backend directory and ensure your `.env` configuration contains appropriate settings:
```env
PORT=3000


### 2. Install Project Dependencies
```bash
npm install
```

### 3. Run the Database Seeder
Pre-populates the MongoDB Atlas database with **2 pre-configured user credentials** (Admin & User) and **16 world-class EA Sports FC 26 players** (Mbappé, Haaland, Aitana Bonmatí, Putellas, Messi, Ronaldo, etc.):
```bash
npm run seed
```

### 4. Start Development Server
Starts the hot-reloading development server on `http://localhost:3000`:
```bash
npm run dev
```

---

## 🔑 Seeded Demo Accounts

You can use the following pre-registered credentials to login and obtain JWT authentication tokens:

### 👤 Administrator Account
- **Email:** `admin@analytics.com`
- **Password:** `adminpassword`
- **Role:** `admin` *(Granted permissions to CREATE, UPDATE, and DELETE players, as well as view the Admin Dashboard).*

### 👥 Standard User Account
- **Email:** `rakshit@analytics.com`
- **Password:** `userpassword`
- **Role:** `user` *(Granted read-only access to standard Player lists, analytics queries, comparisons, and profile lookups).*

---

## 📡 API Endpoint Reference

All endpoints return a standardized success or error payload:
- **Success Format:** `{ success: true, message: "...", data: [...], pagination: {...} }`
- **Error Format:** `{ success: false, message: "...", error: {...} }`

### 🏥 System Health Checks
*   `GET /api/v1/health` - Check system uptime metrics and status description.

### 🔐 Authentication Operations
*   `POST /api/v1/auth/register` - Create user profile and generate bearer JWT.
*   `POST /api/v1/auth/login` - Validate user session.
*   `GET /api/v1/auth/profile` *(Protected)* - Retrieve logged-in session account profile.
*   `POST /api/v1/auth/logout` *(Protected)* - Log out user session.

### 🏃‍♂️ Player Queries & CRUD
*   `GET /api/v1/players` - Query players matching advanced filters.
    *   *Example filters:* `/api/v1/players?limit=5&page=1&sort=-overall,pace&overall_gte=88&league=LaLiga`
*   `GET /api/v1/players/:id` - Fetch detailed stats for a single player profile.
*   `POST /api/v1/players` *(Admin Protected)* - Create a new player.
*   `PATCH /api/v1/players/:id` *(Admin Protected)* - Edit an existing player profile.
*   `DELETE /api/v1/players/:id` *(Admin Protected)* - Trigger standard indexed soft deletion.

### 📊 Performance Analytics Dashboards
*   `GET /api/v1/analytics/top-rated` - Fetch top 10 highest-rated active players.
*   `GET /api/v1/analytics/top-teams` - Fetch top 5 teams ranked by average player overalls.
*   `GET /api/v1/analytics/top-leagues` - Fetch top 5 leagues sorted by their player attribute averages.
*   `GET /api/v1/analytics/top-nations` - Fetch top 5 countries ranked by average player qualities.
*   `GET /api/v1/analytics/position-distribution` - Retrieve pitch position counts distribution.

### ⚔️ Player Comparisons
*   `GET /api/v1/compare/:player1Id/:player2Id` - Generates side-by-side head-to-head comparison calculations and maps deltas, wins, and overall battle winners.

### 💻 Admin Panel
*   `GET /api/v1/admin/dashboard` *(Admin Protected)* - Load admin dashboard listing user counts, player statuses, recent users register list, and recent players create logs.

---

## 📬 Postman Testing

For fast and easy API testing, import the **Postman Collection file** located in the project root:
- `EA-FC26-Player-Analytics.postman_collection.json`

This collection contains:
- Pre-configured health, authentication, CRUD, analytics, and comparison requests.
- Dynamic environment variable bindings for `{{baseUrl}}` and `{{token}}`.
- An automated login script that **extracts and saves your JWT bearer token** to your Postman environment upon successful login.
