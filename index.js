const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 400;

const MAX_ANGLE = Math.PI / 2;
const GRAVITY = 1.9;
const TORQUE_FACTOR = 0.01;
const spriteSpeed = 20;
const totalFramesWalk = 3;
const totalFramesIdle = 2;
const WIND_STRENGTH = 0.006;
const WIND_INTERVAL = 10000;

let score = 0;
let gameRunning = true;
let keys = {};
let frameX = 0;
let counter = 0;
let animationState = "idle";
let wind_direction = 0;
let wind_last = 0; 
let windActive = false;

const carrito = {
    x: 350,
    y: 310,
    width: 120,
    height: 100,
    speed: 5
};

const pendulo = {
    x: 450,
    y: 200,
    angle: 0,
    length: 200,
    angularVelocity: 0,
    angularAcceleration: 0
};


const sprite_walk = new Image();
sprite_walk.src = "assets/penguins-walk.png";

const sprite_idle = new Image();
sprite_idle.src = "assets/penguins_idle.png";

const background = new Image();
background.src = "assets/background.jpg";

document.addEventListener("keydown", (e) => (keys[e.key] = true));
document.addEventListener("keyup", (e) => (keys[e.key] = false));
document.getElementById("restart").addEventListener("click", resetGame);

function drawBackground() {
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
}

function drawCarrito() {
    const spriteX = carrito.x;
    const spriteY = carrito.y - 50;
    const sprite = animationState === "walking" ? sprite_walk : sprite_idle;
    const totalFrames = animationState === "walking" ? totalFramesWalk : totalFramesIdle;

    ctx.drawImage(
        sprite,
        frameX * sprite.width / totalFrames,
        0,
        sprite.width / totalFrames,
        sprite.height,
        spriteX,
        spriteY,
        sprite.width / totalFrames,
        sprite.height
    );
}

function windDelay() {
    setTimeout(() => {
        windActive = true;
    }, 8000);
}


function updateWind() {
    if (!windActive) return;
    const now = Date.now();
    if (now - wind_last > WIND_INTERVAL) {
        console.log("viento", wind_direction)
        wind_direction = Math.random() * 2 - 1;
        wind_last = now;
    }
}


function drawPendulo() {
    ctx.save();
    ctx.translate(carrito.x + carrito.width / 2, carrito.y);
    ctx.rotate(pendulo.angle);
    ctx.fillStyle = "black";
    ctx.fillRect(-2, -pendulo.length, 4, pendulo.length);
    ctx.restore();
}

function drawScore() {
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText(`Puntaje: ${score}`, 10, 30);
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function updateGame() {
    if (!gameRunning) return;

    if (keys["ArrowLeft"] && carrito.x > 0) carrito.x -= carrito.speed;
    if (keys["ArrowRight"] && carrito.x < canvas.width - carrito.width) carrito.x += carrito.speed;

    let torque = 0;
    if (keys["ArrowRight"]) {
        torque = -TORQUE_FACTOR;
        animationState = "walking";
        animateWalkingSprite(totalFramesWalk);
    } else if (keys["ArrowLeft"]) {
        torque = TORQUE_FACTOR;
        animationState = "walking";
        animateWalkingSprite(totalFramesWalk);
    } else {
        animationState = "idle";
        animateWalkingSprite(totalFramesIdle);
    }
    windDelay();
    updateWind();

    pendulo.angularAcceleration = (GRAVITY / pendulo.length) * Math.sin(pendulo.angle) + torque + wind_direction * WIND_STRENGTH;
    pendulo.angularVelocity += pendulo.angularAcceleration;
    pendulo.angularVelocity *= 0.85;
    pendulo.angle += pendulo.angularVelocity;

    if (Math.abs(pendulo.angle) > MAX_ANGLE) {
        endGame();
        return;
    }

    clearCanvas();
    drawBackground();
    drawCarrito();
    drawPendulo();
    drawScore();
    score++;

    requestAnimationFrame(updateGame);
}

function endGame() {
    gameRunning = false;
    document.getElementById("score").textContent = score;
    document.getElementById("game-over").classList.remove("hidden");
}

function resetGame() {
    gameRunning = true;
    score = 0;
    carrito.x = 350;
    pendulo.angle = 0;
    pendulo.angularVelocity = 0;
    pendulo.angularAcceleration = 0;
    document.getElementById("game-over").classList.add("hidden");
    updateGame();
}

function animateWalkingSprite(frameCount) {
    counter++;
    if (counter % spriteSpeed === 0) {
        frameX = (frameX + 1) % frameCount;
    }
}

background.onload = updateGame;
