# EA FC 26 Player Analytics API & Web App

A full-stack MERN application inspired by EA Sports FC Ultimate Team and player analytics platforms.
This project allows users to explore football players, analyze stats, compare players, build squads, and visualize advanced football analytics.

---

# 🚀 Features

## 🔥 Core Features

* Player database management
* Football player analytics
* Advanced search & filtering
* Player comparison system
* Team builder
* Authentication & authorization
* Admin dashboard
* Real-time filtering
* Pagination & sorting
* Analytics dashboard with charts

---

# 🛠 Tech Stack

## Frontend

* React.js
* React Router DOM
* Axios
* Tailwind CSS
* Recharts
* React Icons

---

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcryptjs
* Express Validator

---

# 📂 Project Structure

```bash
EAFC-26/
│
├── frontend/
│
└── backend/
```

---

# 📁 Backend Folder Structure

```bash
backend/
│
├── src/
│   │
│   ├── config/
│   │   ├── db.js
│   │   └── jwt.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── playerController.js
│   │   ├── analyticsController.js
│   │   ├── compareController.js
│   │   ├── teamBuilderController.js
│   │   └── adminController.js
│   │
│   ├── models/
│   │   ├── Player.js
│   │   ├── User.js
│   │   └── Team.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── playerRoutes.js
│   │   ├── analyticsRoutes.js
│   │   ├── compareRoutes.js
│   │   ├── teamBuilderRoutes.js
│   │   ├── adminRoutes.js
│   │   └── searchRoutes.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── adminMiddleware.js
│   │   ├── errorMiddleware.js
│   │   ├── validateMiddleware.js
│   │   ├── loggerMiddleware.js
│   │   └── rateLimiter.js
│   │
│   ├── services/
│   │   ├── analyticsService.js
│   │   ├── recommendationService.js
│   │   ├── chemistryService.js
│   │   └── compareService.js
│   │
│   ├── validators/
│   │   ├── authValidator.js
│   │   ├── playerValidator.js
│   │   └── teamValidator.js
│   │
│   ├── utils/
│   │   ├── generateToken.js
│   │   ├── apiFeatures.js
│   │   ├── responseHandler.js
│   │   ├── pagination.js
│   │   └── errorResponse.js
│   │
│   ├── data/
│   │   ├── players.json
│   │   └── seedPlayers.js
│   │
│   ├── logs/
│   │   └── server.log
│   │
│   ├── app.js
│   └── server.js
│
├── .env
├── .gitignore
├── package.json
└── README.md
```

---

# 📁 Frontend Folder Structure

```bash
frontend/
│
├── public/
│
├── src/
│   │
│   ├── api/
│   │   └── axios.js
│   │
│   ├── assets/
│   │
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── PlayerCard.jsx
│   │   ├── SearchBar.jsx
│   │   ├── Filters.jsx
│   │   ├── Pagination.jsx
│   │   ├── AnalyticsChart.jsx
│   │   └── CompareCard.jsx
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Players.jsx
│   │   ├── PlayerDetails.jsx
│   │   ├── Compare.jsx
│   │   ├── Analytics.jsx
│   │   ├── TeamBuilder.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Profile.jsx
│   │   └── AdminDashboard.jsx
│   │
│   ├── context/
│   │   └── AuthContext.jsx
│   │
│   ├── hooks/
│   │   └── useFetch.js
│   │
│   ├── layouts/
│   │   └── MainLayout.jsx
│   │
│   ├── routes/
│   │   └── AppRoutes.jsx
│   │
│   ├── styles/
│   │   └── global.css
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── package.json
└── vite.config.js
```

---

# ⚙️ Installation

# 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/eafc-26.git
```

---

# 2️⃣ Install Backend Dependencies

```bash
cd backend
npm install
```

---

# 3️⃣ Install Frontend Dependencies

```bash
cd frontend
npm install
```

---

# 🔑 Environment Variables

Create a `.env` file inside backend folder.

```env
PORT=5000

MONGO_URI=your_mongodb_connection

JWT_SECRET=your_secret_key

NODE_ENV=development
```

---

# ▶️ Run Backend

```bash
npm run dev
```

Server runs on:

```bash
http://localhost:5000
```

---

# ▶️ Run Frontend

```bash
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

# 📦 Main API Features

# 👤 Authentication

* User Registration
* User Login
* JWT Authentication
* Protected Routes
* Role Based Authorization

---

# ⚽ Player Features

* Fetch all players
* Fetch single player
* Create player
* Update player
* Delete player
* Search players
* Filter players
* Sort players
* Pagination

---

# 📊 Analytics Features

* Top rated players
* Top leagues
* Position distributions
* Nation distributions
* Skill move analytics
* Team analytics

---

# 🧠 Advanced Features

* Player comparison
* Squad chemistry
* Dream team generation
* Recommendation engine
* Trending players
* Team builder

---

# 🔐 Middleware Used

## Authentication Middleware

Protects private routes using JWT.

---

## Admin Middleware

Restricts admin-only APIs.

---

## Validation Middleware

Validates incoming request data.

---

## Error Handling Middleware

Handles global API errors.

---

## Rate Limiter

Protects APIs from spam requests.

---

# 🗄 Database Models

# 👤 User Model

```js
{
  username: String,
  email: String,
  password: String,
  role: String
}
```

---

# ⚽ Player Model

```js
{
  name: String,
  age: Number,
  overallRating: Number,
  pace: Number,
  shooting: Number,
  passing: Number,
  dribbling: Number,
  defending: Number,
  physical: Number,
  team: String,
  league: String,
  nation: String,
  position: String,
  preferredFoot: String,
  playstyles: [String]
}
```

---

# 📄 Important API Routes

# Authentication

```bash
POST   /auth/register
POST   /auth/login
GET    /auth/profile
PATCH  /auth/profile
```

---

# Players

```bash
GET    /players
GET    /players/:id
POST   /players
PATCH  /players/:id
DELETE /players/:id
```

---

# Search & Filters

```bash
GET /search/players?q=mbappe

GET /players?team=Real Madrid

GET /players?sort=pace

GET /players?page=1&limit=10
```

---

# Analytics

```bash
GET /analytics/players/top-rated

GET /analytics/players/top-leagues

GET /analytics/players/position-distribution
```

---

# Compare Players

```bash
GET /players/compare/:player1/:player2
```

---

# 🧪 Future Improvements

* Real-time player market
* AI recommendations
* Live football stats
* Match simulations
* Transfer system
* Squad sharing
* Real-time chat
* Dark/light mode
* PWA support

---

# 📈 Learning Outcomes

This project demonstrates:

* REST API development
* Authentication systems
* MongoDB database design
* Advanced querying
* Filtering & pagination
* Backend architecture
* MERN stack integration
* Analytics dashboard development

---

# 👨‍💻 Author

Developed by Rakshit Raj

---

# 📜 License

This project is licensed under the MIT License.
