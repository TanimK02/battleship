import Gameboard from './gameboard';

export default class Player {
    constructor(name) {
        this._name = name;
        this._gameBoard = new Gameboard();
    }

    get name() {
        return this._name;
    }

    set name(newName) {
        this._name = newName;
    }
}