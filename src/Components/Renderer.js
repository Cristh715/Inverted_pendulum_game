import { Sprite } from "./SpriteManager.js";

export class Renderer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = 800;
        this.canvas.height = 400;
        this.spriteManager = new Sprite();
        this.background = new Image();
        this.background.src = "assets/images/background.jpg";
    }

    loadAssets(callback) {
        this.background.onload = callback;
    }

    render(players, wind, score) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.background, 0, 0, this.canvas.width, this.canvas.height);

        players.forEach(player => {
            this.spriteManager.drawCarrito(this.ctx, player.carrito);
            player.pendulo.draw(this.ctx);
        });

        this.drawScore(score);
    }

    drawScore(score) {
        this.ctx.fillStyle = "black";
        this.ctx.font = "20px Arial";
        this.ctx.fillText(`Puntaje: ${score}`, 10, 30);
    }
}
