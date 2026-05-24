## Overview

**Knight Warrior** is a 2D browser-based action game developed as my **CS50 Final Project** using **JavaScript**, **HTML5 Canvas**, **CSS**, and a **Flask backend**. The project combines real-time gameplay with a simple but secure authentication system and a persistent leaderboard backed by a relational database.

In the game, the player controls a knight character who must survive in a hostile environment filled with enemies and projectile attacks. The goal is straightforward: stay alive for as long as possible, defeat enemies, and score points. Once the game ends, the final score is submitted to the backend and stored in a database, where it appears on a leaderboard alongside scores from other registered users.

This project was intentionally built **without using any external game engines or frontend frameworks**. Instead of relying on abstractions, I wanted to work directly with core technologies like the Canvas API, vanilla JavaScript, and Flask. This made the project more challenging, but also much more educational and easier to explain from a conceptual standpoint.

> **Note:**
> The focus of this project is not just gameplay, but also clean architecture, security, and clarity.

---

## Installation

Clone repository:

```bash
git clone https://github.com/RakshatTiwari/browser-game-platform-flask.git
```

Move into folder:

```bash
cd browser-game-platform-flask
```

Install Flask:

```bash
pip install flask
```

Initialize database:

```bash
sqlite3 project.db < schema.sql
```

Run application:

```bash
python app.py
```

Open browser:

```
http://127.0.0.1:5000
```

---

## Concepts Demonstrated

- Full Stack Web Development
- Authentication and Session Management
- Database Design and Persistence
- Collision Detection and Game Logic
- Frontend and Backend Integration
- Secure Password Hashing
- Object-Oriented Programming Concepts

---

## Features

### Gameplay Features

- Real-time 2D gameplay rendered using **HTML5 Canvas**
- Keyboard-controlled knight character
- Horizontal movement with gravity-based physics
- Single jump and controlled double jump mechanics
- Enemy characters with hit-based damage logic
- Projectile attacks and collision detection
- Continuous score tracking while the game is running
- Game-over detection and proper score finalization

The gameplay logic is handled entirely on the client side using JavaScript. This includes rendering, physics updates, enemy behavior, and collision checks. The backend does not interfere with gameplay, which keeps the game responsive and smooth.

### Web Application Features

- User registration and login system
- Secure password hashing using **Werkzeug**
- Session-based authentication
- Protected routes for gameplay and score submission
- Server-side score storage using **SQLite**
- Dynamic leaderboard displaying the top scores
- Graceful handling of cases where no scores exist yet

### UI and UX Features

- Dark-themed interface to improve gameplay visibility
- Full-screen responsive game canvas
- Landing page with a background image
- Reusable button and form components
- Consistent layout across all pages

---

## How the Game and Application Work

The application begins with a landing page that serves as the main entry point. From here, users can register for a new account, log in, view the leaderboard, or start the game. Registration and login are handled entirely by the backend using Flask, with passwords securely hashed before storage.

Once a user is logged in, they can access the game page. The game itself runs entirely on the client side using JavaScript and an HTML5 canvas. This includes rendering the game world, updating the knight’s position, applying gravity, detecting collisions, managing enemies, handling projectiles, and updating the score in real time.

As the player survives longer and interacts with enemies, the score increases continuously. When the game ends, the final score is written into a hidden HTML form and submitted to the backend using a standard POST request. This approach avoids unnecessary APIs and keeps the communication between the frontend and backend simple and transparent.

The backend receives the score, associates it with the currently logged-in user using session data, and stores it in an SQLite database. The user is then redirected to the leaderboard page, where the top scores are displayed dynamically.

This design keeps gameplay fast and responsive while still allowing persistent score storage and user-based ranking.

---

## Technology Stack

| Component | Technology                           |
|-----------|--------------------------------------|
| Frontend  | JavaScript (ES6), HTML5 Canvas, CSS3 |
| Backend   | Python (Flask)                       |
| Templating| Jinja2                               |
| Database  | SQLite                               |
| Security  | Werkzeug (password hashing)          |

Each technology was chosen for simplicity and clarity. Flask and SQLite are lightweight technologies well-suited for rapid backend development and academic full-stack applications.

---

## Authentication, Security, and Sessions

User authentication is an important part of the project and is handled entirely on the server side. New users can register by choosing a username and password. The password is hashed using **Werkzeug** before being stored in the database, ensuring that no plaintext passwords are ever saved.

During login, the backend verifies the password hash and creates a session for the authenticated user. This session is then used to control access to protected routes, such as the game page and the score submission endpoint. If a user is not logged in, they are redirected to the login page.

Logging out clears the session and returns the user to the landing page. At no point is sensitive authentication logic handled in JavaScript, which keeps the system secure and aligned with best practices.

---

## Database and Data Storage

The project uses a lightweight **SQLite** database with two tables: one for users and one for scores. The users table stores usernames and hashed passwords, while the scores table stores completed game scores along with a reference to the user who achieved them and a timestamp.

This relational design allows multiple scores to be associated with a single user and makes it easy to display ranked leaderboards. The schema is intentionally minimal, which keeps queries simple and reduces unnecessary complexity.

---

## Project Structure

```text
GAME/
├── app.py                     # Flask backend
├── schema.sql                 # SQLite database schema
├── .gitignore
├── Knight_Warrior_Thumbnail.jpg
├── requirements.txt
├── templates/
│   ├── layout.html            # Base template
│   ├── index.html             # Landing page
│   ├── game.html              # Game canvas page
│   ├── login.html             # Login page
│   ├── register.html          # Registration page
│   └── leaderboard.html       # Leaderboard page
├── static/
│   ├── game.js                # Core game logic
│   ├── styles.css             # Global styles
│   └── assets/                # Images and audio assets
│       ├── knight.png
│       ├── dragon1.png
│       ├── dragon2.png
│       ├── fireball.png
│       ├── coin.png
│       ├── bg_morning.png
│       ├── bg_evening.png
│       ├── bg_night.png
│       ├── bgm1.mp3
│       ├── bgm2.mp3
│       ├── game_over.mp3
│       └── thumbnail.png
└── README.md
```

---

## Styling and Visual Design

The application uses a dark-themed design to improve gameplay visibility and reduce distraction. Styling is handled through a centralized CSS file, which defines reusable components such as buttons, forms, and layout containers.

All images and audio assets are stored in a dedicated assets directory. These include character sprites, enemy sprites, background images, sound effects, and background music. The landing page background image is also used as a thumbnail for preview purposes.

---

## Future Improvements

Like any project of limited scope, **Knight Warrior** has some known limitations. The game is designed primarily for desktop browsers and does not currently support mobile or touch controls. There is no pause or save system, and the game state resets if the page is refreshed. Audio features are also relatively basic.

If the project were to be extended further, potential improvements include adding multiple levels, introducing new enemy types, improving animations, making the game mobile-friendly, and adding player profiles or statistics.

---

## Final Notes

**Knight Warrior** represents a complete and well-structured full-stack project that reflects my understanding of frontend game development, backend web development, database design, and secure authentication.

---

## Author

**Rakshat Tiwari**