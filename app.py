"""
Smart Daily Planner with Priority-Based Task Engine
====================================================
Multi-tab application:
  Tab 1: Tasks   — Add, prioritize, reminded, complete tasks
  Tab 2: Routine — Daily routine plan with checkboxes & scheduling
  Tab 3: Analysis— Charts, reports, productivity score
"""

from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
import sqlite3
from datetime import datetime, date

app = Flask(__name__)
app.secret_key = 'smart_daily_planner_secret_2024'

# ── Database Helpers ─────────────────────────────────────────────

def get_db():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
    # Tasks table
    conn.execute('''
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            task TEXT NOT NULL,
            priority TEXT NOT NULL,
            reminder_time TEXT,
            is_completed INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    # Daily routines table
    conn.execute('''
        CREATE TABLE IF NOT EXISTS routines (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            routine TEXT NOT NULL,
            category TEXT DEFAULT 'General',
            routine_time TEXT,
            is_completed INTEGER DEFAULT 0,
            date TEXT DEFAULT (date('now')),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()


# ── Helper: Task Stats ───────────────────────────────────────────

def get_task_stats(tasks):
    total = len(tasks)
    completed = sum(1 for t in tasks if t['is_completed'])
    high = sum(1 for t in tasks if t['priority'] == 'High')
    medium = sum(1 for t in tasks if t['priority'] == 'Medium')
    low = sum(1 for t in tasks if t['priority'] == 'Low')
    pending_high = sum(1 for t in tasks if t['priority'] == 'High' and not t['is_completed'])
    return dict(total=total, completed=completed, high=high, medium=medium,
                low=low, pending_high=pending_high)


# ══════════════════════════════════════════════════════════════════
#  TAB 1 — TASKS
# ══════════════════════════════════════════════════════════════════

@app.route('/')
def index():
    conn = get_db()
    tasks = conn.execute('''
        SELECT * FROM tasks
        ORDER BY is_completed ASC,
            CASE priority WHEN 'High' THEN 1 WHEN 'Medium' THEN 2 WHEN 'Low' THEN 3 END,
            created_at DESC
    ''').fetchall()
    conn.close()
    stats = get_task_stats(tasks)
    return render_template('index.html', tasks=tasks, **stats)


@app.route('/add', methods=['POST'])
def add_task():
    task_name = request.form.get('task', '').strip()
    priority = request.form.get('priority', 'Low')
    reminder_time = request.form.get('reminder_time', '').strip() or None

    if not task_name:
        flash('Task cannot be empty!', 'danger')
        return redirect(url_for('index'))
    if priority not in ('High', 'Medium', 'Low'):
        flash('Invalid priority.', 'danger')
        return redirect(url_for('index'))

    conn = get_db()
    conn.execute('INSERT INTO tasks (task, priority, reminder_time) VALUES (?,?,?)',
                 (task_name, priority, reminder_time))
    conn.commit()
    conn.close()
    r = f' Reminder at {reminder_time}.' if reminder_time else ''
    flash(f'Task added with {priority} priority!{r}', 'success')
    return redirect(url_for('index'))


@app.route('/delete/<int:tid>')
def delete_task(tid):
    conn = get_db()
    t = conn.execute('SELECT task FROM tasks WHERE id=?', (tid,)).fetchone()
    if t:
        conn.execute('DELETE FROM tasks WHERE id=?', (tid,))
        conn.commit()
        flash(f'Task "{t["task"]}" deleted!', 'warning')
    conn.close()
    return redirect(url_for('index'))


@app.route('/toggle/<int:tid>')
def toggle_task(tid):
    conn = get_db()
    t = conn.execute('SELECT * FROM tasks WHERE id=?', (tid,)).fetchone()
    if t:
        conn.execute('UPDATE tasks SET is_completed=? WHERE id=?',
                     (0 if t['is_completed'] else 1, tid))
        conn.commit()
    conn.close()
    return redirect(url_for('index'))


# ══════════════════════════════════════════════════════════════════
#  TAB 2 — DAILY ROUTINE
# ══════════════════════════════════════════════════════════════════

ROUTINE_CATEGORIES = ['Morning', 'Afternoon', 'Evening', 'Health', 'Study', 'Work', 'General']

@app.route('/routine')
def routine_page():
    conn = get_db()
    today = date.today().isoformat()
    routines = conn.execute(
        'SELECT * FROM routines WHERE date=? ORDER BY routine_time ASC, created_at ASC',
        (today,)
    ).fetchall()
    conn.close()

    total = len(routines)
    done = sum(1 for r in routines if r['is_completed'])
    pct = round(done / total * 100, 1) if total else 0

    # Group by category
    grouped = {}
    for cat in ROUTINE_CATEGORIES:
        items = [r for r in routines if r['category'] == cat]
        if items:
            grouped[cat] = items

    return render_template('routine.html', routines=routines, grouped=grouped,
                           total=total, done=done, pct=pct, today=today,
                           categories=ROUTINE_CATEGORIES)


@app.route('/add_routine', methods=['POST'])
def add_routine():
    name = request.form.get('routine', '').strip()
    time = request.form.get('routine_time', '').strip() or None
    cat  = request.form.get('category', 'General')
    today = date.today().isoformat()

    if not name:
        flash('Routine cannot be empty!', 'danger')
        return redirect(url_for('routine_page'))

    conn = get_db()
    conn.execute('INSERT INTO routines (routine, category, routine_time, date) VALUES (?,?,?,?)',
                 (name, cat, time, today))
    conn.commit()
    conn.close()
    flash(f'Routine "{name}" added!', 'success')
    return redirect(url_for('routine_page'))


@app.route('/toggle_routine/<int:rid>')
def toggle_routine(rid):
    conn = get_db()
    r = conn.execute('SELECT * FROM routines WHERE id=?', (rid,)).fetchone()
    if r:
        conn.execute('UPDATE routines SET is_completed=? WHERE id=?',
                     (0 if r['is_completed'] else 1, rid))
        conn.commit()
    conn.close()
    return redirect(url_for('routine_page'))


@app.route('/delete_routine/<int:rid>')
def delete_routine(rid):
    conn = get_db()
    r = conn.execute('SELECT routine FROM routines WHERE id=?', (rid,)).fetchone()
    if r:
        conn.execute('DELETE FROM routines WHERE id=?', (rid,))
        conn.commit()
        flash(f'Routine "{r["routine"]}" removed!', 'warning')
    conn.close()
    return redirect(url_for('routine_page'))


# ══════════════════════════════════════════════════════════════════
#  TAB 3 — ANALYSIS
# ══════════════════════════════════════════════════════════════════

@app.route('/analysis')
def analysis():
    conn = get_db()
    today = date.today().isoformat()

    tasks = conn.execute('SELECT * FROM tasks').fetchall()
    routines = conn.execute('SELECT * FROM routines WHERE date=?', (today,)).fetchall()
    reminders = conn.execute(
        'SELECT * FROM tasks WHERE reminder_time IS NOT NULL AND is_completed=0'
    ).fetchall()
    conn.close()

    ts = get_task_stats(tasks)
    pending_tasks = ts['total'] - ts['completed']
    high_done = sum(1 for t in tasks if t['priority'] == 'High' and t['is_completed'])
    med_done  = sum(1 for t in tasks if t['priority'] == 'Medium' and t['is_completed'])
    low_done  = sum(1 for t in tasks if t['priority'] == 'Low' and t['is_completed'])

    rt_total = len(routines)
    rt_done  = sum(1 for r in routines if r['is_completed'])

    total_items = ts['total'] + rt_total
    done_items  = ts['completed'] + rt_done
    productivity = round(done_items / total_items * 100, 1) if total_items else 0

    return render_template('analysis.html',
        total_tasks=ts['total'], completed_tasks=ts['completed'], pending_tasks=pending_tasks,
        high_total=ts['high'], high_done=high_done,
        medium_total=ts['medium'], medium_done=med_done,
        low_total=ts['low'], low_done=low_done,
        total_routines=rt_total, completed_routines=rt_done,
        productivity=productivity, reminders=reminders,
        tasks=tasks, routines=routines)


# ── API: Reminders (for JS alarm) ────────────────────────────────

@app.route('/api/reminders')
def api_reminders():
    conn = get_db()
    rows = conn.execute(
        'SELECT id, task, priority, reminder_time FROM tasks '
        'WHERE reminder_time IS NOT NULL AND is_completed=0'
    ).fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])


# ── PWA: Serve service worker with root scope header ─────
@app.route('/service-worker.js')
def service_worker():
    from flask import send_from_directory, make_response
    response = make_response(send_from_directory('static', 'service-worker.js'))
    response.headers['Content-Type'] = 'application/javascript'
    response.headers['Service-Worker-Allowed'] = '/'
    return response


# ── Run ───────────────────────────────────────────────────────────

if __name__ == '__main__':
    init_db()
    print("✅ Database initialized!")
    print("🚀 http://127.0.0.1:5000")
    app.run(debug=True)
