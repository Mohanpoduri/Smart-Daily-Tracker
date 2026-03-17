# 🗓️ Smart Daily Planner with Priority-Based Task Engine

A full-stack web application built with **Flask** and **Bootstrap** that helps users manage their daily tasks with an intelligent priority-based sorting system.

---

## 📋 Project Description

The **Smart Daily Planner** is a task management web application designed to help users organize their daily activities efficiently. Tasks are categorized into three priority levels — **High**, **Medium**, and **Low** — and are automatically sorted to ensure the most critical tasks appear first.

The application features a modern, responsive UI with real-time statistics, color-coded task cards, and smooth animations for an enhanced user experience.

---

## ✨ Features

- ✅ **Add Tasks** — Create tasks with a description and priority level
- ✅ **Priority Sorting** — Tasks auto-sort by priority (High → Medium → Low)
- ✅ **Delete Tasks** — Remove completed or unnecessary tasks
- ✅ **Color-Coded Cards** — Visual priority indicators (🔴 High, 🟡 Medium, 🟢 Low)
- ✅ **Dashboard Stats** — View total, high, medium, and low task counts
- ✅ **Progress Bar** — Visual task distribution indicator
- ✅ **Filter Buttons** — Filter tasks by priority (All / High / Medium / Low)
- ✅ **Flash Messages** — Success/error notifications with auto-dismiss
- ✅ **Form Validation** — Client-side and server-side input validation
- ✅ **Live Clock** — Real-time clock display in the navbar
- ✅ **Responsive Design** — Works on desktop, tablet, and mobile
- ✅ **Smooth Animations** — Fade-in effects and hover interactions
- ✅ **Timestamp Display** — Shows when each task was created
- ✅ **Empty State** — Friendly message when no tasks exist

---

## 🛠️ Technologies Used

| Technology | Purpose |
|------------|---------|
| **Python 3** | Backend programming language |
| **Flask** | Web framework for routing and templating |
| **SQLite** | Lightweight database for task storage |
| **Jinja2** | Template engine for dynamic HTML |
| **HTML5** | Page structure with semantic tags |
| **CSS3** | Custom styling and animations |
| **Bootstrap 5** | Responsive layout and UI components |
| **JavaScript** | Client-side interactivity |
| **jQuery** | DOM manipulation and effects |
| **Bootstrap Icons** | Icon library for UI elements |

---

## 📁 Project Structure

```
Daily Task Tracker/
│
├── static/
│   ├── style.css          # Custom CSS styles
│   ├── script.js          # JavaScript & jQuery logic
│
├── templates/
│   ├── base.html          # Base template (layout)
│   ├── index.html         # Main page template
│
├── app.py                 # Flask application (backend)
├── database.db            # SQLite database (auto-created)
├── requirements.txt       # Python dependencies
├── README.md              # Project documentation
```

---

## 🚀 Installation & Setup

### Prerequisites
- Python 3.7 or higher installed
- pip (Python package manager)

### Steps

1. **Clone or download** the project folder

2. **Navigate** to the project directory:
   ```bash
   cd "Daily Task Tracker"
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the application**:
   ```bash
   python app.py
   ```

5. **Open your browser** and go to:
   ```
   http://127.0.0.1:5000
   ```

---

## 📸 Screenshots

### Dashboard View
*Screenshot of the main dashboard with task cards and statistics*

### Add Task Form
*Screenshot of the task input form with priority selector*

### Mobile Responsive View
*Screenshot of the application on a mobile device*

---

## 🎯 How It Works

1. **Adding a Task** — Fill in the task description, select a priority level, and click "Add Task"
2. **Automatic Sorting** — Tasks are sorted by priority (High first, then Medium, then Low)
3. **Filtering** — Use the filter buttons to view tasks by specific priority
4. **Deleting a Task** — Click the trash icon on any task card to remove it
5. **Statistics** — View real-time task counts and distribution in the stats section

---

## 🔑 Key Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/` | GET | Home page — displays all tasks |
| `/add` | POST | Add a new task |
| `/delete/<id>` | GET | Delete a task by ID |

---

## 📝 Database Schema

```sql
CREATE TABLE tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task TEXT NOT NULL,
    priority TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 👨‍💻 Author

Built as an academic project to demonstrate full-stack web development skills using Flask and modern frontend technologies.

---

## 📄 License

This project is for educational purposes.
