import { Game } from "./Components/Game.js";

const game = new Game("game-canvas");
const startTrain = document.getElementById("startTrain");
const modos = document.getElementById("modo-game");
const controls = document.getElementById("controls");
const grafica = document.getElementById("grafica-container");
const play = document.getElementById("start")

modos.addEventListener("change", () => {
    game.stopAnimation();
    game.gameRunning = false;
    if (modos.value === "manual") {
        console.log("manual")
        controls.classList.add("hidden");
        grafica.classList.add("hidden");
        play.classList.remove("hidden");
    }
    else {
        controls.classList.remove("hidden");
        play.classList.add("hidden");
        grafica.classList.remove("hidden");
        document.getElementById("game-over").classList.add("hidden");
    }
    game.mode = modos.value;
    game.resetGame();
});

modos.addEventListener("keydown", (e) => {
        e.preventDefault();
});

play.addEventListener("click", () => {
    game.resetGame();
});


startTrain.addEventListener("click", () => {
    game.readInputs();
    if (game.currentEpisode > 0) {
        console.log("El entrenamiento ya está en curso.");
        return;
    }
    game.mode = "bot";
    game.trainAgent();
});