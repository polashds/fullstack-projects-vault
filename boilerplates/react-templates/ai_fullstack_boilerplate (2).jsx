### 📁 Project: AI Fullstack App (Spam Detector + DB Logging + JWT Auth)

```
ai-fullstack-app/
├── backend/
│   ├── app.py
│   ├── auth.py
│   ├── model/
│   │   └── spam_model.pkl
│   ├── database.db
│   ├── requirements.txt
│   └── config.py
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.js
│   │   ├── Login.js
│   │   ├── Register.js
│   │   └── index.js
│   ├── package.json
├── .gitignore
├── README.md
```

---

### 📄 backend/app.py
```python
from flask import Flask, request, jsonify, g
from flask_cors import CORS
import sqlite3
import pickle
from config import BACKEND_PORT, DB_PATH, SECRET_KEY
from auth import token_required, create_token, register_user

app = Flask(__name__)
CORS(app, origins=["https://your-frontend-name.vercel.app"])

# Load model
with open('model/spam_model.pkl', 'rb') as f:
    model = pickle.load(f)

# DB Connection
def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(DB_PATH)
    return g.db

@app.teardown_appcontext
def close_db(exception):
    db = g.pop('db', None)
    if db is not None:
        db.close()

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    return register_user(data['username'], data['password'])

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data['username']
    password = data['password']

    db = get_db()
    user = db.execute("SELECT * FROM users WHERE username=? AND password=?", (username, password)).fetchone()
    if user:
        token = create_token(username)
        return jsonify({"token": token})
    return jsonify({"error": "Invalid credentials"}), 403

@app.route('/predict', methods=['POST'])
@token_required
def predict(current_user):
    data = request.json
    text = data.get("text", "")
    result = model([text])[0]

    db = get_db()
    db.execute("INSERT INTO logs (text, prediction) VALUES (?, ?)", (text, int(result)))
    db.commit()

    return jsonify({'prediction': int(result)})

if __name__ == '__main__':
    with sqlite3.connect(DB_PATH) as db:
        db.execute("""
            CREATE TABLE IF NOT EXISTS logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                text TEXT,
                prediction INTEGER,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        """)
        db.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE,
                password TEXT
            );
        """)
    app.run(host="0.0.0.0", port=BACKEND_PORT, debug=True)
```

---

### 📄 backend/auth.py
```python
from functools import wraps
from flask import request, jsonify
import jwt
import sqlite3
from config import SECRET_KEY, DB_PATH

def create_token(username):
    return jwt.encode({"user": username}, SECRET_KEY, algorithm="HS256")

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split()[1]
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            current_user = data['user']
        except:
            return jsonify({'error': 'Invalid token'}), 403
        return f(current_user, *args, **kwargs)
    return decorated

def register_user(username, password):
    try:
        conn = sqlite3.connect(DB_PATH)
        conn.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, password))
        conn.commit()
        conn.close()
        return jsonify({"message": "User registered successfully"})
    except sqlite3.IntegrityError:
        return jsonify({"error": "Username already exists"}), 400
```

---

### 📄 backend/config.py
```python
import os
BACKEND_PORT = int(os.getenv("PORT", 5000))
DB_PATH = os.getenv("DB_PATH", "database.db")
SECRET_KEY = os.getenv("SECRET_KEY", "mysecret")
```

---

### 📄 backend/requirements.txt
```
flask
flask-cors
scikit-learn
pickle-mixin
pyjwt
```

---

### 📄 frontend/src/App.js
```jsx
import React, { useState } from "react";
import axios from "axios";

function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const handlePredict = async () => {
    const res = await axios.post("https://your-backend-name.onrender.com/predict", { text }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setResult(res.data.prediction);
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Spam Detector</h1>
      <textarea rows={4} value={text} onChange={(e) => setText(e.target.value)} />
      <br />
      <button onClick={handlePredict}>Check</button>
      <h3>Result: {result === "" ? "N/A" : result === 1 ? "Spam" : "Ham"}</h3>
    </div>
  );
}

export default App;
```

---

### 📄 frontend/src/Login.js
```jsx
import React, { useState } from "react";
import axios from "axios";

function Login({ setToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const res = await axios.post("https://your-backend-name.onrender.com/login", { username, password });
    localStorage.setItem("token", res.data.token);
    setToken(res.data.token);
  };

  return (
    <div>
      <h2>Login</h2>
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;
```

---

### 📄 frontend/src/Register.js
```jsx
import React, { useState } from "react";
import axios from "axios";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    const res = await axios.post("https://your-backend-name.onrender.com/register", { username, password });
    setMessage(res.data.message || res.data.error);
  };

  return (
    <div>
      <h2>Register</h2>
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button onClick={handleRegister}>Register</button>
      <p>{message}</p>
    </div>
  );
}

export default Register;
```

---

### 📄 .gitignore
```
__pycache__/
node_modules/
.env
*.pkl
database.db
```

---

### 📄 README.md (updated summary)
```md
# AI Fullstack App - Spam Detector with DB Logging + JWT Auth

### Features
- Flask backend with ML model
- SQLite DB to log predictions
- User registration and JWT-based login
- React frontend
- Deploy with Render (backend) + Vercel (frontend)

### Local Setup
```bash
# Backend
cd backend
pip install -r requirements.txt
python app.py

# Frontend
cd frontend
npm install
npm start
```

### Deploy Checklist
- Update URLs in frontend files
- Store SECRET_KEY as Render environment variable
- Use HTTPS backend URL in production
```
