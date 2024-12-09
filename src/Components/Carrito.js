import { Pendulo } from "./Pendulo.js";

export class Carrito {
    constructor(x, y, width, height, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.animationState = "idle";
        this.frameX = 0;
        this.counter = 0;
    }

    update(keys) {
        if (keys["ArrowLeft"] && this.x > 0) this.x -= this.speed;
        if (keys["ArrowRight"] && this.x < 800 - this.width) this.x += this.speed;
    }

    calculateTorque(keys) {
        if (keys["ArrowRight"]) {
            this.animationState = "walking";
            return -Pendulo.TORQUE_FACTOR;
        } else if (keys["ArrowLeft"]) {
            this.animationState = "walking";
            return Pendulo.TORQUE_FACTOR;
        } else {
            this.animationState = "idle";
            return 0;
        }
    }

    reset() {
        this.x = 350;
    }
}
