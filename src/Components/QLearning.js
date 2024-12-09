export class QLearning {
    constructor(actions, alpha = 0.1, gamma = 0.95, epsilon = 1.0, epsilonDecay = 0.99) {
        this.actions = actions;//<-, ->, 
        this.qTable = {};
        this.alpha = alpha;
        this.gamma = gamma;
        this.epsilon = epsilon;
        this.epsilonDecay = epsilonDecay;
    }

    getStateKey(carrito, pendulo) {
        const carritoPos = Math.round(carrito.x / 10) * 10;
        const penduloAngle = Math.round(pendulo.angle * 10) / 10;
        const penduloVelocity = Math.round(pendulo.angularVelocity * 10) / 10;
        return `${carritoPos}_${penduloAngle}_${penduloVelocity}`;
    }

    initializeState(state) {
        if (!this.qTable[state]) {
            this.qTable[state] = {};
            for (const action of this.actions) {
                this.qTable[state][action] = 0;
            }
        }
    }

    chooseAction(state) {
        this.initializeState(state);
        if (Math.random() < this.epsilon) {
            return this.actions[Math.floor(Math.random() * this.actions.length)];
        } else {
            const bestAction = Object.entries(this.qTable[state]).reduce((a, b) => (a[1] > b[1] ? a : b))[0];
            return bestAction;
        }
    }

    updateQTable(state, action, reward, nextState) {
        this.initializeState(state);
        this.initializeState(nextState);
        const maxNextQ = Math.max(...Object.values(this.qTable[nextState]));
        const currentQ = this.qTable[state][action];
        const updatedQ = currentQ + this.alpha * (reward + this.gamma * maxNextQ - currentQ);
        this.qTable[state][action] = updatedQ;
    }

    decayExploration() {
        this.epsilon = Math.max(0.1, this.epsilon * this.epsilonDecay);
    }    
}
