import { Game } from "./Components/Game.js";

const game = new Game("game-canvas");
const startTrain = document.getElementById("startTrain");
const modos = document.getElementById("modo-game");
const controls = document.getElementById("controls");
const play = document.getElementById("start")
game.update();
modos.addEventListener("change", () =>{
    game.gameRunning = false;
    if (modos.value === "manual"){
        console.log("manual")
        controls.classList.add("hidden");
        play.classList.remove("hidden");
    }
    else{
        controls.classList.remove("hidden");
        play.classList.add("hidden");
        document.getElementById("game-over").classList.add("hidden");
    }
    game.mode = modos.value;
    game.resetGame();
});
play.addEventListener("click", () =>{
    game.gameRunning = true;
    game.update();
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