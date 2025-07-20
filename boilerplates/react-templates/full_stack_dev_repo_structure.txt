# 📁 Full Stack Dev Vault

A learning and production vault for aspiring Full Stack + AI developers.

---

## 📦 Folder Structure

```bash
FullStack-Dev-Vault/
├── projects/               # Real-world projects (dashboards, apps)
│   ├── unemployment-dashboard/
│   │   ├── notebooks/
│   │   ├── deployment/
│   │   └── README.md
│   └── ...
├── snippets/              # Code snippets for reuse
│   ├── flask_api.md
│   ├── react_login.md
│   └── ...
├── notes/                 # Learning notes
│   ├── backend/
│   │   ├── django.md
│   │   ├── fastapi.md
│   │   └── ...
│   ├── frontend/
│   │   ├── react.md
│   │   └── ...
│   ├── devops/
│   │   ├── nginx.md
│   │   └── apache.md
│   └── database/
│       ├── mongodb.md
│       └── postgresql.md
├── cheatsheets/           # Short reference guides
│   ├── git.md
│   ├── bash.md
│   ├── docker.md
│   └── ...
├── README.md
└── LICENSE
```

---

## 📁 What Each Folder Contains

### `projects/`
Real projects with clean structure: data, notebook, frontend/backend code, deployment docs.

### `snippets/`
Reusable code chunks like: API routes, JWT auth, Stripe checkout, login forms.

### `notes/`
Personal notes on tech stack: Django, FastAPI, React, MongoDB, Nginx, etc.

### `cheatsheets/`
Fast references: Git, Bash, Docker, Python tips, and frontend libraries.

---

## 🚀 How to Use This Vault

1. Clone the repo
2. Add your project in `projects/`
3. Write or paste reusable code in `snippets/`
4. Take notes while learning in `notes/`
5. Use `cheatsheets/` to quickly refresh memory

---

## 🧠 Example Snippet (snippets/flask_api.md)
```python
from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello():
    return "Hello, World!"

if __name__ == '__main__':
    app.run(debug=True)
```

---

## ✅ To-Do for You

- [ ] Initialize this on GitHub
- [ ] Copy existing local projects into `projects/`
- [ ] Push boilerplates from ChatGPT here
- [ ] Use Notion/GitHub for publishing cheat sheets

---

Ready to initialize this into your GitHub repo?
