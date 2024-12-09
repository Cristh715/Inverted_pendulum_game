import { Game } from "./Components/Game.js";

const game = new Game("game-canvas");
const startTrain = document.getElementById("startTrain");
const modos = document.getElementById("modo-game");
const controls = document.getElementById("controls");
const play = document.getElementById("start")
game.update();
modos.addEventListener("change", () =>{
    if (modos.value === "manual"){
        console.log("manual")
        controls.classList.add("hidden");
    }
    else{
        controls.classList.remove("hidden");
    }
    game.mode = modos.value;
});
play.addEventListener("click", () =>{
    game.resetGameState();
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