export class Wind {
    constructor() {
        this.strength = 0;
        this.lastActivation = 0;
        this.active = false;
    }

    update() {
        const now = Date.now();

        if (!this.active && now - this.lastActivation > 10000) {
            this.activateWind();
        }
        
        if (this.active && now - this.lastActivation > 2000) {
            this.desactivateWind();
        }
        console.log("wind: ", this.strength)
    }

    activateWind() {
        this.strength = (Math.random() * 2 - 1) * 0.002;//0.005
        this.lastActivation = Date.now();
        this.active = true;
    }

    desactivateWind() {
        this.strength = 0;
        this.active = false;
    }
}