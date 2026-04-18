# 🗺️ RouteForge — Multi-City Trip Optimizer
### Design And Analysis Of Algorithm Mini Project | Floyd-Warshall Algorithm | Full-Stack (React + Node.js + MongoDB)
### Pritesh Bagul - 123B1D038
---

## 📁 Folder Structure

```
multi-city-trip-optimizer/
├── backend/
│   ├── algorithms/
│   │   └── floydWarshall.js     ← Core Floyd-Warshall algorithm
│   ├── models/
│   │   └── Network.js           ← MongoDB schema
│   ├── routes/
│   │   ├── networks.js          ← CRUD API routes
│   │   └── solve.js             ← Solve route
│   ├── .env                     ← Environment variables
│   ├── package.json
│   └── server.js                ← Express entry point
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── api/
    │   │   └── index.js         ← Axios API calls
    │   ├── components/
    │   │   ├── GraphCanvas.jsx  ← Interactive graph visualization
    │   │   ├── ResultsPanel.jsx ← Results, matrix, steps
    │   │   └── Sidebar.jsx      ← Build panel & saved networks
    │   ├── styles/
    │   │   └── global.css
    │   ├── App.js
    │   └── index.js
    └── package.json
```

---

## 🚀 How to Run on VS Code (Mac)

### Prerequisites
Make sure you have installed:
- Node.js (v18+): https://nodejs.org
- MongoDB running locally on port 27017

### Step 1 — Start MongoDB
Open Terminal and run:
```bash
brew services start mongodb-community
```
Or if installed manually:
```bash
mongod --dbpath /usr/local/var/mongodb
```

### Step 2 — Open Project in VS Code
```bash
code multi-city-trip-optimizer
```

### Step 3 — Setup Backend
Open a new terminal in VS Code (Ctrl + ` or Terminal > New Terminal):
```bash
cd backend
npm install
npm run dev
```
You should see:
```
🚀 Server running on http://localhost:5000
✅ MongoDB Connected
```

### Step 4 — Setup Frontend
Open another terminal tab in VS Code:
```bash
cd frontend
npm install
npm start
```
Browser will open at: **http://localhost:3000**

---

## 🧪 How to Use the App

1. **Add Cities** — Type city names in the sidebar and press Enter or click +
2. **Add Connections** — Select From/To cities and enter the cost (distance/time)
3. **Click "Run Floyd-Warshall"** — Algorithm runs on the backend
4. **View Results** — Click any path card to highlight it on the graph
5. **Distance Matrix** — View the all-pairs shortest distance table
6. **Algorithm Steps** — See every relaxation step the algorithm performed
7. **Save Network** — Save your city graph to MongoDB
8. **Load Saved** — Load and re-solve any saved network

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/solve | Run Floyd-Warshall on given data |
| POST | /api/solve/:id | Solve a saved network by ID |
| GET | /api/networks | Get all saved networks |
| POST | /api/networks | Save a new network |
| DELETE | /api/networks/:id | Delete a network |

---

## 🎓 Syllabus Coverage

- **Unit III — Dynamic Programming**: Floyd-Warshall All-Pairs Shortest Path
- Time Complexity: O(V³), Space: O(V²)
- Path reconstruction using next-hop matrix
- Handles disconnected graphs (marks as ∞)
