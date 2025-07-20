### 📁 Project: AI Fullstack App (Spam Detector + DB Logging + Login)

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
from config import BACKEND_PORT, DB_PATH
from auth import auth_required

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

@app.route('/predict', methods=['POST'])
@auth_required
def predict():
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
        db.execute("INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)", ("admin", "admin123"))
    app.run(host="0.0.0.0", port=BACKEND_PORT, debug=True)
```

---

### 📄 backend/auth.py
```python
from flask import request, jsonify
from functools import wraps
import sqlite3
from config import DB_PATH

def auth_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth = request.authorization
        if not auth:
            return jsonify({"error": "Auth required"}), 401

        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        cur.execute("SELECT * FROM users WHERE username=? AND password=?", (auth.username, auth.password))
        user = cur.fetchone()
        conn.close()

        if user:
            return f(*args, **kwargs)
        return jsonify({"error": "Invalid credentials"}), 403
    return decorated_function
```

---

### 📄 backend/config.py
```python
import os
BACKEND_PORT = int(os.getenv("PORT", 5000))
DB_PATH = os.getenv("DB_PATH", "database.db")
```

---

### 📄 backend/requirements.txt
```
flask
flask-cors
scikit-learn
pickle-mixin
```

---

### 📄 frontend/src/App.js
```jsx
import React, { useState } from "react";
import axios from "axios";

function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");

  const handlePredict = async () => {
    const res = await axios.post("https://your-backend-name.onrender.com/predict", { text }, {
      auth: {
        username: "admin",
        password: "admin123"
      }
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

### 📄 frontend/src/Login.js (optional login UI for future use)
```jsx
import React, { useState } from "react";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    onLogin(username, password);
  };

  return (
    <div>
      <h2>Login</h2>
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleSubmit}>Login</button>
    </div>
  );
}

export default Login;
```

---

### 📄 frontend/package.json (same)
```json
{
  "name": "spam-detector",
  "version": "1.0.0",
  "dependencies": {
    "axios": "^1.6.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1"
  },
  "scripts": {
    "start": "react-scripts start"
  }
}
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
# AI Fullstack App - Spam Detector with DB Logging + Login

### Features
- Flask backend with ML model
- SQLite DB to log predictions
- Simple username/password auth
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

### Credentials
Username: admin  
Password: admin123

### Deploy Checklist
- Update frontend `App.js` with production URL
- Use Render Secrets for DB path or credentials (optional)
- Enable CORS in `app.py`
```
