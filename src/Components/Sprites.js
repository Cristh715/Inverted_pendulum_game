export class Sprite {
    constructor() {
        this.spriteWalk = new Image();
        this.spriteIdle = new Image();
        this.spriteWalk.src = "assets/images/penguins-walk.png";
        this.spriteIdle.src = "assets/images/penguins_idle.png";
        this.spriteSpeed = 20;
    }

    drawCarrito(ctx, carrito) {
        const sprite = carrito.animationState === "walking" ? this.spriteWalk : this.spriteIdle;
        const totalFrames = carrito.animationState === "walking" ? 3 : 2;

        carrito.counter++;
        if (carrito.counter % this.spriteSpeed === 0) {
            carrito.frameX = (carrito.frameX + 1) % totalFrames;
        }

        ctx.drawImage(
            sprite,
            carrito.frameX * sprite.width / totalFrames,
            0,
            sprite.width / totalFrames,
            sprite.height,
            carrito.x,
            carrito.y - 50,
            sprite.width / totalFrames,
            sprite.height
        );
    }
}