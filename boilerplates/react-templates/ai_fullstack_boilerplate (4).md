# 🏁 Full-Stack JWT Auth Boilerplate (FastAPI + React)

## 🔧 Backend (FastAPI)

### 📁 Folder Structure
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── auth.py
│   ├── models.py
│   ├── schemas.py
│   ├── database.py
│   └── utils.py
├── .env
├── requirements.txt
└── render.yaml
```

### ⚙️ Key Files
- `main.py`: FastAPI app with CORS and route registration.
- `auth.py`: Registration, login, and JWT management.
- `models.py`: SQLAlchemy models.
- `schemas.py`: Pydantic schemas.
- `database.py`: Session and engine setup.
- `utils.py`: Password hashing and token creation.
- `.env`: Contains JWT_SECRET, DATABASE_URL.
- `render.yaml`: Deployment config for Render.

### ✅ Features
- Registration & login routes
- JWT-based authentication
- Password hashing (PassLib)
- SQLAlchemy SQLite DB
- Logging to file using `logging`
- Token expiration support

---

## 🖼️ Frontend (React)

### 📁 Folder Structure
```
frontend/
├── public/
├── src/
│   ├── App.js
│   ├── Login.js
│   ├── Register.js
│   ├── Dashboard.js
│   ├── api.js
│   └── auth.js
├── .env
├── package.json
└── README.md
```

### ✅ Features
- Login & Registration forms
- JWT stored in `localStorage`
- Protected routes (Dashboard)
- Logout + token expiration handling

### 🧪 Bonus (Optional)
- `httpOnly` cookie option
- Interceptor for token expiration

---

## 🚀 Deployment

### 🛠️ Backend on Render
**`render.yaml`**
```yaml
services:
  - type: web
    name: fastapi-backend
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn app.main:app --host 0.0.0.0 --port 10000
    envVars:
      - key: DATABASE_URL
        value: sqlite:///./test.db
      - key: JWT_SECRET
        generateValue: true
```

### 🌍 Frontend on Vercel
- `.env`
```env
REACT_APP_API_URL=https://fastapi-backend.onrender.com
```
- In fetch: `fetch(`${process.env.REACT_APP_API_URL}/api/login`)`
- Connect frontend repo on [vercel.com](https://vercel.com) and set `REACT_APP_API_URL`

---

## ✅ Status
- [x] JWT Auth Backend (FastAPI)
- [x] React Frontend Login/Register
- [x] Logout + Token Expiry
- [x] Logging + DB
- [x] Deployment: Render + Vercel

---

## 📦 To-Do (Optional Enhancements)
- [ ] Refresh tokens
- [ ] httpOnly cookies
- [ ] Role-based auth
- [ ] Rate limiting / throttling
- [ ] Postgres for production
- [ ] GitHub Actions CI/CD

---

## 📘 How to Use
1. Clone repo
2. Create `.env` in backend with:
   ```
   JWT_SECRET=your-secret
   DATABASE_URL=sqlite:///./test.db
   ```
3. `cd backend && uvicorn app.main:app --reload`
4. `cd frontend && npm install && npm start`

---

Want the full downloadable GitHub boilerplate? Say: **"Download starter repo"**
