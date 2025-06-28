export default class Ship {
    constructor(length) {
        if (!Number.isInteger(length) || length <= 0) {
            throw new Error("Ship length must be a positive integer.");
        }
        this.length = length;
        this._hp = length;
    }

    hit() {
        if (this._hp > 0) {
            this._hp = this._hp - 1;
        }
    }

    get hp() {
        return this._hp;
    }

    isSunk() {
        return this._hp === 0;
    }

}