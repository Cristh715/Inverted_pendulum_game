import { Carrito } from "./Carrito.js";
import { Pendulo } from "./Pendulo.js";
import { Wind } from "./Wind.js";
import { Sprite } from "./Sprites.js";
import { QLearning } from "./QLearning.js";

const windDiv = document.getElementById('wind-cant');
const chart = LightweightCharts.createChart(document.getElementById('grafica'), {
    width: 1000,
    height: 200,
    layout: { textColor: 'white', background: { type: 'Solid', color: '#000000' } },
    grid: { vertLines: { color: '#eeeeee' }, horzLines: { color: '#eeeeee' } },
    rightPriceScale: { visible: true },
});
chart.applyOptions({
    localization: {
        timeFormatter: (index) => `${index}`,
    },
})
const lineSeries = chart.addLineSeries();


export class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = 800;
        this.canvas.height = 400;
        this.score = 0;
        this.gameRunning = true;
        this.keys = {};
        this.carrito = new Carrito(350, 310, 120, 100, 5);
        this.pendulo = new Pendulo(this.carrito);
        this.wind = new Wind();
        this.sprite = new Sprite();
        this.mode = "manual";
        this.agent = new QLearning(["MoveLeft", "MoveRight", "Idle"]);
        this.background = new Image();
        this.background.src = "assets/images/background.jpg";
        this.episodes = 3000;
        this.currentEpisode = 0;
        this.maxSteps = 1000;
        this.animationId = null;
        this.windRunning = false;
        this.rewards = []

        this.readInputs();
        this.addEventListeners();
    }

    readInputs() {
        const episodesInput = document.getElementById("episodes");
        const stepsInput = document.getElementById("steps");

        this.episodes = parseInt(episodesInput.value) || 3000;
        this.maxSteps = parseInt(stepsInput.value) || 1000;
    }

    addEventListeners() {
        document.addEventListener("keydown", (e) => (this.keys[e.key] = true));
        document.addEventListener("keyup", (e) => (this.keys[e.key] = false));
        document.getElementById("restart").addEventListener("click", () => this.resetGame());
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawBackground() {
        this.ctx.drawImage(this.background, 0, 0, this.canvas.width, this.canvas.height);
    }

    drawScore() {
        this.ctx.fillStyle = "black";
        this.ctx.font = "20px Arial";
        this.ctx.fillText(`Puntaje: ${this.score}`, 10, 30);
    }

    trainAgent() {
        console.log("Iniciando entrenamiento del agente...");
        this.stopAnimation();
        this.gameRunning = false;
        this.agent.qTable = {};
        for (let episode = 0; episode < this.episodes; episode++) {
            let totalReward = 0;
            let steps = 0;
            this.resetGameState();

            while (steps < this.maxSteps) {
                const state = this.agent.getStateKey(this.carrito, this.pendulo);
                const action = this.agent.chooseAction(state);

                this.executeAction(action);

                const reward = -Math.abs(this.pendulo.angle) + (Math.abs(this.pendulo.angle) < 0.1 ? 10 : 0);
                const nextState = this.agent.getStateKey(this.carrito, this.pendulo);
                this.agent.updateQTable(state, action, reward, nextState);

                totalReward += reward;
                steps++;

                if (Math.abs(this.pendulo.angle) > Pendulo.MAX_ANGLE) break;
            }

            this.agent.decayExploration();
            this.rewards.push({time: episode, value: totalReward})
            console.log(`Episodio ${episode + 1}: Recompensa total: ${totalReward}`);
        }
        console.log("Entrenamiento completado.");
        this.gameRunning = true;
        this.agent.epsilon = 0.01;
        this.resetGame();
        lineSeries.setData(this.rewards)
    }

    stopAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    resetGameState() {
        this.carrito.reset();
        this.pendulo.reset();
    }

    executeAction(action) {
        switch (action) {
            case "MoveLeft":
                this.carrito.x = Math.max(this.carrito.x - this.carrito.speed, 0);
                break;
            case "MoveRight":
                this.carrito.x = Math.min(this.carrito.x + this.carrito.speed, this.canvas.width - this.carrito.width);
                break;
            case "Idle":
                break;
        }

        const torque = this.carrito.calculateTorque({
            ArrowLeft: action === "MoveLeft",
            ArrowRight: action === "MoveRight",
        });
        this.pendulo.update(torque, this.wind.strength);
    }

    manualControl() {
        const torque = this.carrito.calculateTorque(this.keys);
        this.carrito.update(this.keys);
        this.pendulo.update(torque, this.wind.strength);
    }

    update() {
        if (!this.gameRunning) return;

        if (this.mode === "bot") {
            const state = this.agent.getStateKey(this.carrito, this.pendulo);
            const action = this.agent.chooseAction(state);
            this.executeAction(action);
        } else {
            this.manualControl();
        }

        this.clearCanvas();
        this.drawBackground();
        this.sprite.drawCarrito(this.ctx, this.carrito);
        this.pendulo.draw(this.ctx);
        this.drawScore();
        if(this.windRunning)
            this.wind.update();

        if (Math.abs(this.pendulo.angle) > Pendulo.MAX_ANGLE) {
            if (this.mode === "manual") {
                this.endGame();
                return;
            } else {
                this.resetGameState();
                this.score = 0;
            }
        }

        this.score++;
        windDiv.innerHTML = this.wind.strength.toFixed(5);
        this.animationId = requestAnimationFrame(() => this.update());
    }

    resetGame() {
        this.windRunning = document.getElementById("wind").checked;
        this.stopAnimation();
        this.gameRunning = true;
        this.score = 0;
        this.resetGameState();
        document.getElementById("game-over").classList.add("hidden");
        this.update();
    }

    endGame() {
        this.stopAnimation();
        this.gameRunning = false;
        document.getElementById("score").textContent = this.score;
        document.getElementById("game-over").classList.remove("hidden");
    }
}
