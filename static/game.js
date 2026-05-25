// ================= CANVAS =================
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    knight.y = groundY();
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// ================= ASSETS =================
const knightImg = new Image();
knightImg.src = "/static/assets/knight.png";

const dragon1Img = new Image();
dragon1Img.src = "/static/assets/dragon.png";

const dragon2Img = new Image();
dragon2Img.src = "/static/assets/dragon.png";

const coinImg = new Image();
coinImg.src = "/static/assets/coin.png";

const fireballImg = new Image();
fireballImg.src = "/static/assets/fireball.png";

const bgMorning = new Image();
bgMorning.src = "/static/assets/bg_morning.png";

const bgEvening = new Image();
bgEvening.src = "/static/assets/bg_evening.png";

const bgNight = new Image();
bgNight.src = "/static/assets/bg_night.png";

// ================= AUDIO =================
const bgm1 = new Audio("/static/assets/bgm1.mp3");
const bgm2 = new Audio("/static/assets/bgm2.mp3");
bgm1.loop = true;
bgm2.loop = true;
bgm1.volume = 0.5;
bgm2.volume = 0.5;

window.addEventListener("load", () => {
    bgm1.play().catch(() => {});
});

// ================= GAME STATE =================
let score = 0;
let health = 100;
let gameOver = false;
let frameCount = 0;
let timePhase = "morning";

// ================= KNIGHT =================
const gravity = 0.65;
const groundY = () => canvas.height * 0.78;

const SINGLE_JUMP = -16;
const DOUBLE_JUMP = -12;

const knight = {
    x: canvas.width * 0.5,
    y: groundY(),
    width: 150,
    height: 190,
    vy: 0,
    speed: 7,
    jumps: 0,
    maxJumps: 2,
    attacking: false,
    attackCooldown: 0
};

// ================= DRAGONS =================
const SKY_TOP = 40;

function getSkyBottom() {
  return canvas.height * 0.45;
}

const DRAGON_MAX_HP = 3;
const DRAGON_RESPAWN_TIME = 1200; // 20 seconds @ ~60 FPS

const dragons = [
    {
        img: dragon1Img,
        x: canvas.width * 0.65,
        y: 120,
        width: 300,
        height: 220,
        vx: 1.2,
        vy: 0.6,
        dir: -1,
        fireCooldown: 0,
        hp: DRAGON_MAX_HP,
        alive: true,
        respawnTimer: 0
    },
    {
        img: dragon2Img,
        x: canvas.width * 0.15,
        y: 180,
        width: 300,
        height: 220,
        vx: 1.2,
        vy: 0.6,
        dir: 1,
        fireCooldown: 180,
        hp: DRAGON_MAX_HP,
        alive: true,
        respawnTimer: 0
    }
];

// ================= ENTITIES =================
let coins = [];
let fireballs = [];

// ================= INPUT =================
const keys = {};
document.addEventListener("keydown", e => {
    keys[e.code] = true;

    if (e.code === "Space") {
        if (knight.jumps === 0) {
            knight.vy = SINGLE_JUMP;   // first jump
            knight.jumps = 1;
        } else if (knight.jumps === 1) {
            knight.vy = DOUBLE_JUMP;   // second jump
            knight.jumps = 2;
        }
    }

    if (e.code === "KeyX") knight.attacking = true;
});
document.addEventListener("keyup", e => {
    keys[e.code] = false;
    if (e.code === "KeyX") knight.attacking = false;
});

// ================= TIME PHASE =================
function updateTimePhase() {
    if (frameCount < 2400) {
        timePhase = "morning";
    } else if (frameCount < 7200) {
        timePhase = "evening";
    } else {
        timePhase = "night";
    }

    if (timePhase === "night") {
        bgm1.pause();
        if (bgm2.paused) bgm2.play().catch(() => {});
    } else {
        bgm2.pause();
        if (bgm1.paused) bgm1.play().catch(() => {});
    }
}

// ================= COINS =================
function spawnCoin() {
    if (coins.length >= 5) return;

    coins.push({
        x: Math.random() * (canvas.width - 80),
        baseY: groundY() - (120 + Math.random() * 180),
        angle: Math.random() * Math.PI * 2
    });
}

// ================= FIREBALL =================
function fireFromDragon(dragon) {
    if (!dragon.alive) return;

    const knightAhead =
        (dragon.dir === -1 && knight.x < dragon.x) ||
        (dragon.dir === 1 && knight.x > dragon.x);

    if (!knightAhead) return;

    fireballs.push({
        x: dragon.dir === -1 ? dragon.x : dragon.x + dragon.width,
        y: dragon.y + dragon.height * 0.45,
        vx: 10 * dragon.dir,
        vy: (knight.y - dragon.y) * 0.05,
        width: 120,
        height: 80
    });
}

// ================= UPDATE =================
function updateKnight() {
    if (keys["ArrowRight"]) knight.x += knight.speed;
    if (keys["ArrowLeft"]) knight.x -= knight.speed;

    if (knight.x > canvas.width) knight.x = -knight.width;
    if (knight.x < -knight.width) knight.x = canvas.width;

    knight.vy += gravity;
    knight.y += knight.vy;

    if (knight.y >= groundY()) {
        knight.y = groundY();
        knight.vy = 0;
        knight.jumps = 0;
    }

    if (knight.attackCooldown > 0) {
        knight.attackCooldown--;
    }

}

function updateDragons() {
    dragons.forEach((d, i) => {

        // Respawn handling
        if (!d.alive) {
            d.respawnTimer--;
            if (d.respawnTimer <= 0) {
                d.alive = true;
                d.hp = DRAGON_MAX_HP;
            }
            return;
        }

        // Horizontal floating
        d.x += d.vx * d.dir;

        const minX = i === 0 ? canvas.width * 0.55 : 40;
        const maxX = i === 0
            ? canvas.width - d.width - 40
            : canvas.width * 0.45 - d.width;

        if (d.x < minX || d.x > maxX) {
            d.dir *= -1;
        }

        // Vertical hovering
        d.y += d.vy;
        if (d.y < SKY_TOP || d.y > getSkyBottom() - d.height) {
          d.vy *= -1;
        }

        // Fire control
        d.fireCooldown--;
        if (d.fireCooldown <= 0) {
            fireFromDragon(d);
            d.fireCooldown = 140;
        }
    });
}

function updateCoins() {
    coins.forEach(c => {
        c.angle += 0.03;
        c.y = c.baseY + Math.sin(c.angle) * 15;
    });
}

function updateFireballs() {
    fireballs.forEach(f => {
        f.x += f.vx;
        f.y += f.vy;
    });

    fireballs = fireballs.filter(
        f => f.x > -100 && f.x < canvas.width + 100
    );
}

// ================= COLLISIONS =================
function checkCollisions() {

    // Sword hits dragons (accurate hitbox)
    dragons.forEach(d => {
        if (!d.alive) return;

        const swordX = knight.x + knight.width * 0.8;
        const swordY = knight.y - knight.height * 0.6;

        const dragonCenterX = d.x + d.width / 2;
        const dragonCenterY = d.y + d.height / 2;

        const dx = Math.abs(swordX - dragonCenterX);
        const dy = Math.abs(swordY - dragonCenterY);

        if (
            knight.attacking &&
            knight.attackCooldown === 0 &&
            dx < d.width / 2 &&
            dy < d.height / 2
        ) {
            d.hp--;
            knight.attackCooldown = 25; // prevent multi-hit

            if (d.hp <= 0) {
                d.alive = false;
                d.respawnTimer = DRAGON_RESPAWN_TIME;
                score += 20;
            }
        }
    });


    // Fireballs hit knight
    fireballs.forEach(f => {
        if (
            knight.x < f.x + f.width &&
            knight.x + knight.width > f.x &&
            knight.y < f.y + f.height &&
            knight.y + knight.height > f.y
        ) {
            health -= 10;
            f.x = -999;

            if (health <= 0) {
                health = 0;
                gameOver = true;
                bgm1.pause();
                bgm2.pause();
            }
        }
    });

    // Coins
    coins = coins.filter(c => {
        if (
            knight.x < c.x + 50 &&
            knight.x + knight.width > c.x &&
            knight.y < c.y + 50 &&
            knight.y + knight.height > c.y
        ) {
            score += 5;
            return false;
        }
        return true;
    });
}

// ================= DRAW =================
function drawUI() {
    // Controls banner
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.fillRect(20, canvas.height - 70, 540, 50);
    ctx.fillStyle = "#000";
    ctx.font = "16px Arial";
    ctx.fillText("← Back | → Forward | SPACE Jump | SPACEx2 Double Jump | X Attack", 30, canvas.height - 40);

    // Health bar
    ctx.fillStyle = "red";
    ctx.fillRect(30, 30, 200, 18);
    ctx.fillStyle = "green";
    ctx.fillRect(30, 30, Math.max(0, health) * 2, 18);

    ctx.fillStyle = "#fff";
    ctx.fillText(`Score: ${score}`, canvas.width - 160, 40);
}

function drawDragons() {
    dragons.forEach(d => {
        if (!d.alive) return;

        ctx.drawImage(d.img, d.x, d.y, d.width, d.height);

        // Sword-stroke counter
        ctx.fillStyle = "#b026ff";
        ctx.font = "bold 24px Arial";
        ctx.textAlign = "center";
        ctx.shadowColor = "#00ffcc";
        ctx.shadowBlur = 15;

        ctx.fillText(
            `Hits left: ${d.hp}`,
            d.x + d.width / 2,
            d.y - 10
        );
        ctx.textAlign = "left";

        ctx.shadowBlur = 0;
        ctx.shadowColor = "transparent";
    });
}

function draw() {
    let bg =
        timePhase === "morning" ? bgMorning :
        timePhase === "evening" ? bgEvening :
        bgNight;

    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

    coins.forEach(c =>
        ctx.drawImage(coinImg, c.x, c.y, 150, 150)
    );

    fireballs.forEach(f =>
        ctx.drawImage(fireballImg, f.x, f.y, f.width, f.height)
    );

    drawDragons();

    ctx.drawImage(
        knightImg,
        knight.x,
        knight.y - knight.height,
        knight.width,
        knight.height
    );

    drawUI();
}

function drawGameOver() {
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#fff";
    ctx.font = "bold 60px serif";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 20);

    ctx.font = "26px Arial";
    ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 30);
    ctx.textAlign = "left";
}

// ================= LOOP =================

function gameLoop() {
    if (gameOver) {
        draw();
        drawGameOver();
        return;
    }

    frameCount++;
    updateTimePhase();

    if (frameCount % 150 === 0) spawnCoin();

    updateKnight();
    updateDragons();
    updateCoins();
    updateFireballs();
    checkCollisions();
    draw();

    requestAnimationFrame(gameLoop);
}

window.onload = () => {
  resizeCanvas();
  gameLoop();
};