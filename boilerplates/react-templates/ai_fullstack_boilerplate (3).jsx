# AI Fullstack Boilerplate with JWT Auth and Frontend Integration

## 📁 Folder Structure
```
fullstack-ai-app/
├── backend/
│   ├── app.py
│   ├── model.py
│   ├── database.db
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.js
│   │   ├── index.js
│   │   ├── components/
│   │   │   ├── Login.js
│   │   │   └── Dashboard.js
│   └── package.json
├── .gitignore
└── README.md
```

---

## ✅ Features
- User registration (JWT-based)
- Secure login with JWT
- Token stored in localStorage
- Protected prediction endpoint
- SQLite for user and prediction logging

---

## 🧠 Backend (Flask + JWT)
### 📄 backend/app.py
```python
from flask import Flask, request, jsonify
from flask_cors import CORS
import bcrypt
import jwt
import datetime
import sqlite3
from functools import wraps

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'your_jwt_secret_key'

# Create tables
conn = sqlite3.connect('database.db')
c = conn.cursor()
c.execute('''CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT UNIQUE, password TEXT)''')
c.execute('''CREATE TABLE IF NOT EXISTS logs (id INTEGER PRIMARY KEY, username TEXT, input TEXT, output TEXT, timestamp TEXT)''')
conn.commit()
conn.close()

# Helper: token-required decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing'}), 403
        try:
            token = token.split()[1]
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = data['username']
        except:
            return jsonify({'message': 'Token is invalid'}), 403
        return f(current_user, *args, **kwargs)
    return decorated

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data['username']
    password = bcrypt.hashpw(data['password'].encode(), bcrypt.gensalt()).decode()
    try:
        conn = sqlite3.connect('database.db')
        c = conn.cursor()
        c.execute('INSERT INTO users (username, password) VALUES (?, ?)', (username, password))
        conn.commit()
        conn.close()
        return jsonify({'message': 'User registered'}), 201
    except:
        return jsonify({'message': 'User already exists'}), 409

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute('SELECT * FROM users WHERE username = ?', (data['username'],))
    user = c.fetchone()
    conn.close()
    if user and bcrypt.checkpw(data['password'].encode(), user[2].encode()):
        token = jwt.encode({'username': user[1], 'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=30)}, app.config['SECRET_KEY'])
        return jsonify({'token': token})
    return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/api/predict', methods=['POST'])
@token_required
def predict(current_user):
    input_data = request.get_json()['input']
    output = input_data[::-1]  # Fake prediction
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute('INSERT INTO logs (username, input, output, timestamp) VALUES (?, ?, ?, ?)', 
              (current_user, input_data, output, datetime.datetime.utcnow().isoformat()))
    conn.commit()
    conn.close()
    return jsonify({'output': output})

if __name__ == '__main__':
    app.run(debug=True)
```

---

## 🧑‍🎨 Frontend (React)
### 📄 frontend/src/components/Login.js
```jsx
import React, { useState } from 'react';
import axios from 'axios';

function Login({ setToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const login = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/login', {
        username,
        password
      });
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" /><br/>
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" /><br/>
      <button onClick={login}>Login</button>
    </div>
  );
}

export default Login;
```

### 📄 frontend/src/components/Dashboard.js
```jsx
import React, { useState } from 'react';
import axios from 'axios';

function Dashboard() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const predict = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post('http://localhost:5000/api/predict', { input }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setOutput(res.data.output);
    } catch (err) {
      alert('Unauthorized');
    }
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <input value={input} onChange={e => setInput(e.target.value)} placeholder="Enter input" />
      <button onClick={predict}>Submit</button>
      <p>Output: {output}</p>
    </div>
  );
}

export default Dashboard;
```

### 📄 frontend/src/App.js
```jsx
import React, { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  return (
    <div>
      {token ? <Dashboard /> : <Login setToken={setToken} />}
    </div>
  );
}

export default App;
```

---

## ✅ Requirements
### 📄 backend/requirements.txt
```
Flask
flask-cors
bcrypt
PyJWT
```

---

## 🚀 Deployment Ready
- Use **Render** for backend
- Use **Vercel** for frontend
- Use environment variable for `SECRET_KEY` in production

---

## ✅ TODO Next (optional):
- Add user registration UI
- Add logout feature
- Add JWT refresh tokens
- Add password reset

---

Let me know if you’d like ZIP or GitHub version!
