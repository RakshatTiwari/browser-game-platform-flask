import sqlite3
from flask import Flask, render_template, request, redirect, session, url_for
from werkzeug.security import generate_password_hash, check_password_hash

# --------------------------------------------------
# APP CONFIGURATION
# --------------------------------------------------

app = Flask(__name__)
app.secret_key = "knight-warrior-secret"

DATABASE = "project.db"

# --------------------------------------------------
# DATABASE CONNECTION HELPER
# --------------------------------------------------

def get_db():
    """Connect to SQLite database."""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


# --------------------------------------------------
# ROUTES
# --------------------------------------------------

@app.route("/")
def index():
    """Landing page."""
    return render_template("index.html")


@app.route("/register", methods=["GET", "POST"])
def register():
    """User registration."""
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")

        if not username or not password:
            return "Missing username or password"

        db = get_db()
        cur = db.cursor()

        # Check if user already exists
        cur.execute("SELECT id FROM users WHERE username = ?", (username,))
        if cur.fetchone():
            db.close()
            return "User already exists"

        # Store hashed password
        hashed = generate_password_hash(password)
        cur.execute(
            "INSERT INTO users (username, password) VALUES (?, ?)",
            (username, hashed)
        )

        db.commit()
        db.close()

        return redirect(url_for("login"))

    return render_template("register.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    """User login."""
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")

        db = get_db()
        cur = db.cursor()

        cur.execute("SELECT * FROM users WHERE username = ?", (username,))
        user = cur.fetchone()
        db.close()

        if user and check_password_hash(user["password"], password):
            session["user_id"] = user["id"]
            session["username"] = user["username"]
            return redirect(url_for("index"))

        return "Invalid username or password"

    return render_template("login.html")


@app.route("/logout")
def logout():
    """Logout user."""
    session.clear()
    return redirect(url_for("index"))


@app.route("/game")
def game():
    """Game page (login required)."""
    if "user_id" not in session:
        return redirect(url_for("login"))

    return render_template("game.html")


@app.route("/save_score", methods=["POST"])
def save_score():
    """Save score after game over."""
    if "user_id" not in session:
        return redirect(url_for("login"))

    score = request.form.get("score")
    if score is None:
        return redirect(url_for("game"))

    db = get_db()
    cur = db.cursor()

    cur.execute(
        "INSERT INTO scores (user_id, score) VALUES (?, ?)",
        (session["user_id"], score)
    )

    db.commit()
    db.close()

    return redirect(url_for("leaderboard"))


@app.route("/leaderboard")
def leaderboard():
    """Show top scores."""
    db = get_db()
    cur = db.cursor()

    cur.execute("""
        SELECT users.username, scores.score
        FROM scores
        JOIN users ON scores.user_id = users.id
        ORDER BY scores.score DESC
        LIMIT 10
    """)

    scores = cur.fetchall()
    db.close()

    return render_template("leaderboard.html", scores=scores)


# --------------------------------------------------
# RUN APPLICATION
# --------------------------------------------------

if __name__ == "__main__":
    app.run(debug=True)