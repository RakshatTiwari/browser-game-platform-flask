<div align="center">

# ⚔️ Knight Warrior

[![Typing SVG](https://readme-typing-svg.demolab.com?font=Poppins&weight=600&size=25&pause=1200&color=36BCF7&center=true&vCenter=true&width=1100&lines=Knight+Warrior+-+2D+Browser+Action+Game;Built+using+Python%2C+Flask%2C+JavaScript%2C+HTML5+Canvas+%26+CSS3;SQLite+Database+%7C+Jinja2+Templates+%7C+Werkzeug+Security;Real-Time+Gameplay+%7C+Collision+Detection+%7C+Session+Authentication;Persistent+Leaderboard+%7C+Render+Deployment)](https://git.io/typing-svg)

![Python](https://img.shields.io/badge/Python-3.x-3776AB?style=flat-square&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-Web%20Framework-000000?style=flat-square&logo=flask&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![HTML5 Canvas](https://img.shields.io/badge/HTML5-Canvas-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-Styling-1572B6?style=flat-square&logo=css3&logoColor=white)
![Jinja2](https://img.shields.io/badge/Jinja2-Templating-B41717?style=flat-square)
![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?style=flat-square&logo=sqlite&logoColor=white)
![Werkzeug](https://img.shields.io/badge/Werkzeug-Security-6DB33F?style=flat-square)
![Render](https://img.shields.io/badge/Render-Deployment-46E3B7?style=flat-square&logo=render&logoColor=white)
![Git](https://img.shields.io/badge/Git-Version%20Control-F05032?style=flat-square&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=flat-square&logo=github&logoColor=white)

</div>

> ### A Full-Stack Browser-Based Action Game built using HTML5 Canvas, JavaScript, Flask & SQLite

---

## 📌 Project Overview

**Knight Warrior** is a full-stack 2D browser-based action game that combines real-time gameplay with secure user authentication, session management, and a persistent SQLite leaderboard. Built using **HTML5 Canvas, JavaScript, Python (Flask), and SQLite**, the project demonstrates the integration of frontend game development with backend web application architecture.

Developed without any external game engine or frontend framework, all core gameplay mechanics—including rendering, player movement, gravity, collision detection, enemy behavior, and score tracking—were implemented from scratch, while the Flask backend manages authentication, database operations, and secure score persistence.

---

## 🌍 Live Demo

https://browser-game-platform-flask.onrender.com

---

## 🎮 Project Highlights

- Built a complete browser-based 2D action game without using any game engine.
- Implemented real-time gameplay using HTML5 Canvas and vanilla JavaScript.
- Developed a secure authentication system with Flask sessions and password hashing.
- Integrated SQLite for persistent user accounts and leaderboard storage.
- Created a dynamic leaderboard with player rankings.
- Deployed the application on Render for public access.

---

## 🛠️ Technology Stack

| Component | Technology |
|-----------|------------|
| Frontend | JavaScript (ES6), HTML5 Canvas, CSS3 |
| Backend | Python (Flask) |
| Templating | Jinja2 |
| Database | SQLite |
| Security  | Werkzeug (password hashing) |
| Deployment | Render |

---

## 🏗️ Application Architecture

```text
                                     Player
                                        │
                                        ▼
                            HTML5 Canvas + JavaScript
                                        │
                            Real-Time Gameplay Engine
                                        │
                                        ▼
                                   Flask Backend
                        (Authentication & Score Handling)
                                        │
                                        ▼
                                  SQLite Database
                                        │
                                        ▼
                                Dynamic Leaderboard
```

## Features

### ⚔️ Gameplay Features

- Real-time 2D gameplay rendered using **HTML5 Canvas**
- Keyboard-controlled knight character
- Horizontal movement with gravity-based physics
- Single jump and controlled double jump mechanics
- Enemy characters with hit-based damage logic
- Projectile attacks and collision detection
- Continuous score tracking while the game is running
- Game-over detection and proper score finalization

The gameplay logic is handled entirely on the client side using JavaScript. This includes rendering, physics updates, enemy behavior, and collision checks. The backend does not interfere with gameplay, which keeps the game responsive and smooth.

### 🌐 Web Application Features

- User registration and login system
- Secure password hashing using **Werkzeug**
- Session-based authentication
- Protected routes for gameplay and score submission
- Server-side score storage using **SQLite**
- Dynamic leaderboard displaying the top scores
- Graceful handling of cases where no scores exist yet

### 🎨 UI and UX Features

- Dark-themed interface to improve gameplay visibility
- Full-screen responsive game canvas
- Landing page with a background image
- Reusable button and form components
- Consistent layout across all pages

---

## ⚙️ Application Flow

The application begins with a landing page that serves as the main entry point. From here, users can register for a new account, log in, view the leaderboard, or start the game. Registration and login are handled entirely by the backend using Flask, with passwords securely hashed before storage.

Once a user is logged in, they can access the game page. The game itself runs entirely on the client side using JavaScript and an HTML5 canvas. This includes rendering the game world, updating the knight’s position, applying gravity, detecting collisions, managing enemies, handling projectiles, and updating the score in real time.

As the player survives longer and interacts with enemies, the score increases continuously. When the game ends, the final score is written into a hidden HTML form and submitted to the backend using a standard POST request. This approach avoids unnecessary APIs and keeps the communication between the frontend and backend simple and transparent.

The backend receives the score, associates it with the currently logged-in user using session data, and stores it in an SQLite database. The user is then redirected to the leaderboard page, where the top scores are displayed dynamically.

This design keeps gameplay fast and responsive while still allowing persistent score storage and user-based ranking.

---

## 🔐 Authentication, Security, and Sessions

User authentication is an important part of the project and is handled entirely on the server side. New users can register by choosing a username and password. The password is hashed using **Werkzeug** before being stored in the database, ensuring that no plaintext passwords are ever saved.

During login, the backend verifies the password hash and creates a session for the authenticated user. This session is then used to control access to protected routes, such as the game page and the score submission endpoint. If a user is not logged in, they are redirected to the login page.

Logging out clears the session and returns the user to the landing page. At no point is sensitive authentication logic handled in JavaScript, which keeps the system secure and aligned with best practices.

---

## 🗄️ Database and Data Storage

The project uses a lightweight **SQLite** database with two tables: one for users and one for scores. The users table stores usernames and hashed passwords, while the scores table stores completed game scores along with a reference to the user who achieved them and a timestamp.

This relational design allows multiple scores to be associated with a single user and makes it easy to display ranked leaderboards. The schema is intentionally minimal, which keeps queries simple and reduces unnecessary complexity.

---

## 🔄 Application Workflow

```text
                                    Register
                                        │
                                        ▼
                                      Login
                                        │
                                        ▼
                                    Play Game
                                        │
                                        ▼
                                  Generate Score
                                        │
                                        ▼
                                  Submit Score
                                        │
                                        ▼
                                   Flask Backend
                                        │
                                        ▼
                                  SQLite Database
                                        │
                                        ▼
                                   Leaderboard

```
---

## 📂 Project Structure

```text
browser-game-platform-flask/
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

## 🚀 Installation

### Clone repository:

```bash
git clone https://github.com/RakshatTiwari/browser-game-platform-flask.git
```

### Move into folder:

```bash
cd browser-game-platform-flask
```

### Install Flask:

```bash
pip install flask
```

### Initialize database:

```bash
sqlite3 project.db < schema.sql
```

### Run application:

```bash
python app.py
```

### Open browser:

```
http://127.0.0.1:5000
```

---

## 🪄 Styling and Visual Design

The application uses a dark-themed design to improve gameplay visibility and reduce distraction. Styling is handled through a centralized CSS file, which defines reusable components such as buttons, forms, and layout containers.

All images and audio assets are stored in a dedicated assets directory. These include character sprites, enemy sprites, background images, sound effects, and background music. The landing page background image is also used as a thumbnail for preview purposes.

---

## 💡 Future Improvements

Like any project of limited scope, **Knight Warrior** has some known limitations. The game is designed primarily for desktop browsers and does not currently support mobile or touch controls. There is no pause or save system, and the game state resets if the page is refreshed. Audio features are also relatively basic.

If the project were to be extended further, potential improvements include adding multiple levels, introducing new enemy types, improving animations, making the game mobile-friendly, and adding player profiles or statistics.

---

## 👨‍💻 Author

**Rakshat Tiwari**

---

<div align="center">

### ⭐ If you found this project useful, consider giving it a Star!

</div>