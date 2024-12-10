export class Pendulo {
    static MAX_ANGLE = Math.PI / 2;
    static TORQUE_FACTOR = 0.01;
    static GRAVITY = 1.9;

    constructor(carrito) {
        this.carrito = carrito;
        this.length = 200;
        this.angle = 0.1;
        this.angularVelocity = 0;
        this.angularAcceleration = 0;
    }

    update(torque, windStrength) {
        this.angularAcceleration = (Pendulo.GRAVITY / this.length) * Math.sin(this.angle) + torque + windStrength;
        this.angularVelocity += this.angularAcceleration;
        this.angularVelocity *= 0.85;
        this.angle += this.angularVelocity;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.carrito.x + this.carrito.width / 2, this.carrito.y);
        ctx.rotate(this.angle);
        ctx.fillStyle = "black";
        ctx.fillRect(-2, -this.length, 4, this.length);
        ctx.restore();
    }

    reset() {
        this.angle = 0.1;
        this.angularVelocity = 0;
        this.angularAcceleration = 0;
    }
}