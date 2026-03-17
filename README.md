# 🗓️ Smart Daily Planner — PWA

A full-stack **Progressive Web App** built with **Flask** that helps users manage daily tasks, routines, and productivity — installable on any phone or desktop.

---

## 📱 PWA Features

- 📲 **Install on Phone** — Add to Home Screen for a native app-like experience
- 🔌 **Offline Support** — Service Worker caches the app shell for offline use
- ⚡ **Fast Loading** — Static assets cached locally for instant load
- 📡 **Offline Indicator** — Shows a banner when you lose connectivity
- 🔔 **Task Reminders** — Alarm overlay with shake animation for due tasks

---

## ✨ Core Features

| Tab | Features |
|-----|----------|
| **📋 Tasks** | Add, prioritize (High/Medium/Low), toggle complete, delete, reminder alarms |
| **🔁 Daily Routine** | Category-based routine items (Morning, Evening, Health...), checkboxes, time slots |
| **📊 Analysis** | Productivity score gauge, priority breakdown charts, routine stats, reminder table |

### Additional Features
- ✅ Priority-based auto-sorting (High → Medium → Low)
- ✅ Color-coded task cards with animated priority strips
- ✅ Real-time live clock in navbar
- ✅ Filter buttons (All / High / Medium / Low / Pending / Done)
- ✅ Flash messages with auto-dismiss
- ✅ Chart.js visualizations (doughnut, bar, pie)
- ✅ Responsive design — works on all screen sizes
- ✅ Smooth fade-in, bounce, and hover animations

---

## 🛠️ Technologies Used

| Technology | Purpose |
|------------|---------|
| **Python 3 + Flask** | Backend framework & routing |
| **SQLite** | Lightweight database |
| **Jinja2** | Server-side templating |
| **HTML5 + CSS3** | Structure & styling |
| **Bootstrap 5** | Responsive UI components |
| **Chart.js** | Data visualizations |
| **JavaScript** | Client-side interactivity |
| **Service Worker** | PWA offline caching |
| **Web App Manifest** | PWA install capability |

---

## 📁 Project Structure

```
Daily Task Tracker/
├── app.py                          # Flask backend (routes, DB, APIs)
├── requirements.txt                # Python dependencies
├── .gitignore                      # Git ignore rules
├── README.md                       # Project documentation
│
├── static/
│   ├── style.css                   # Custom CSS (all styling)
│   ├── script.js                   # JavaScript (clock, filters, alarms)
│   ├── manifest.json               # PWA manifest
│   ├── service-worker.js           # Service Worker for caching
│   └── icon-512.png                # App icon (512x512)
│
└── templates/
    ├── base.html                   # Base layout (navbar, footer, PWA)
    ├── index.html                  # Tasks page
    ├── routine.html                # Daily Routine page
    └── analysis.html               # Analysis & Charts page
```

---

## 🚀 Installation & Setup

### Prerequisites
- Python 3.7+
- pip

### Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/smart-daily-planner.git
   cd smart-daily-planner
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the app**:
   ```bash
   python app.py
   ```

4. **Open in browser**:
   ```
   http://127.0.0.1:5000
   ```

### 📲 Install as Mobile App
1. Open the app URL on your phone's browser (Chrome recommended)
2. Tap the **"Install"** banner that appears at the bottom
3. Or use browser menu → **"Add to Home Screen"**
4. The app will appear on your phone like a native app!

---

## 🔑 API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/` | GET | Tasks page |
| `/add` | POST | Add a new task |
| `/delete/<id>` | GET | Delete a task |
| `/toggle/<id>` | GET | Toggle task completion |
| `/routine` | GET | Daily Routine page |
| `/add_routine` | POST | Add a routine item |
| `/toggle_routine/<id>` | GET | Toggle routine completion |
| `/delete_routine/<id>` | GET | Delete a routine item |
| `/analysis` | GET | Analysis & Charts page |
| `/api/reminders` | GET | JSON API for pending reminders |
| `/service-worker.js` | GET | Service Worker (PWA) |

---

## 📝 Database Schema

```sql
CREATE TABLE tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task TEXT NOT NULL,
    priority TEXT NOT NULL,
    reminder_time TEXT,
    is_completed INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE routines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    routine TEXT NOT NULL,
    category TEXT DEFAULT 'General',
    routine_time TEXT,
    is_completed INTEGER DEFAULT 0,
    date TEXT DEFAULT (date('now')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 👨‍💻 Author

Built as an academic project demonstrating full-stack web development with PWA capabilities.

## 📄 License

This project is for educational purposes.
