import os
import sqlite3

from flask import (
    Flask,
    render_template,
    request,
    redirect,
    session,
    url_for
)

from werkzeug.security import (
    generate_password_hash,
    check_password_hash
)

app = Flask(__name__)
app.secret_key = os.environ.get(
    "SECRET_KEY",
    "knight-warrior-secret-key"
)

DATABASE = "project.db"


# -------------------------------
# DATABASE HELPERS
# -------------------------------

def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():

    conn = sqlite3.connect(DATABASE)

    with open("schema.sql", "r") as f:
        conn.executescript(f.read())

    conn.commit()
    conn.close()


if not os.path.exists(DATABASE):
    init_db()


# -------------------------------
# HOME
# -------------------------------

@app.route("/")
def index():

    user = session.get("username")

    return render_template(
        "index.html",
        user=user
    )


# -------------------------------
# REGISTER
# -------------------------------

@app.route("/register", methods=["GET", "POST"])
def register():

    if request.method == "POST":

        username = request.form.get("username")
        password = request.form.get("password")
        confirmation = request.form.get("confirmation")

        if not username:
            return render_template(
                "register.html",
                error="Username required"
            )

        if not password:
            return render_template(
                "register.html",
                error="Password required"
            )

        if password != confirmation:
            return render_template(
                "register.html",
                error="Passwords do not match"
            )

        db = get_db()

        existing = db.execute(
            "SELECT id FROM users WHERE username = ?",
            (username,)
        ).fetchone()

        if existing:

            db.close()

            return render_template(
                "register.html",
                error="Username already exists"
            )

        hashed_password = generate_password_hash(
            password
        )

        db.execute(
            """
            INSERT INTO users
            (username, password)
            VALUES (?, ?)
            """,
            (username, hashed_password)
        )

        db.commit()
        db.close()

        return redirect(
            url_for("login")
        )

    return render_template(
        "register.html"
    )


# -------------------------------
# LOGIN
# -------------------------------

@app.route("/login", methods=["GET", "POST"])
def login():

    if request.method == "POST":

        username = request.form.get("username")
        password = request.form.get("password")

        db = get_db()

        user = db.execute(
            """
            SELECT *
            FROM users
            WHERE username = ?
            """,
            (username,)
        ).fetchone()

        db.close()

        if not user:

            return render_template(
                "login.html",
                error="Invalid username or password"
            )

        if not check_password_hash(
            user["password"],
            password
        ):

            return render_template(
                "login.html",
                error="Invalid username or password"
            )

        session["user_id"] = user["id"]
        session["username"] = user["username"]

        return redirect(
            url_for("game")
        )

    return render_template(
        "login.html"
    )


# -------------------------------
# LOGOUT
# -------------------------------

@app.route("/logout")
def logout():

    session.clear()

    return redirect(
        url_for("index")
    )


# -------------------------------
# GAME PAGE
# -------------------------------

@app.route("/game")
def game():

    if "user_id" not in session:

        return redirect(
            url_for("login")
        )

    return render_template(
        "game.html"
    )


# -------------------------------
# SAVE SCORE
# -------------------------------

@app.route("/save_score", methods=["POST"])
def save_score():

    if "user_id" not in session:
        return redirect(url_for("login"))

    try:
        score = int(
            request.form.get(
                "score",
                0
            )
        )
    except ValueError:
        score = 0

    score = max(
        0,
        min(score, 999999)
    )

    db = get_db()

    db.execute(
        """
        INSERT INTO scores
        (
            user_id,
            score
        )
        VALUES (?, ?)
        """,
        (
            session["user_id"],
            score
        )
    )

    db.commit()
    db.close()

    return redirect(
        url_for("leaderboard")
    )

# -------------------------------
# LEADERBOARD
# -------------------------------

@app.route("/leaderboard")
def leaderboard():

    db = get_db()

    scores = db.execute(
        """
        SELECT
            users.username,
            MAX(scores.score) AS score

        FROM scores

        JOIN users
        ON users.id = scores.user_id

        GROUP BY users.id

        ORDER BY score DESC

        LIMIT 10
        """
    ).fetchall()

    db.close()

    return render_template(
        "leaderboard.html",
        scores=scores
    )


# -------------------------------
# RUN
# -------------------------------

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 5000))
    )