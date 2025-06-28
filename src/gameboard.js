
export default class Gameboard {
    constructor() {
        this._board = Array(10).fill().map(() => Array(10).fill(null));
        this._ships = [];
    }

    placeShip(x, y, direction, ship) {
        const positions = [];

        for (let i = 0; i < ship.length; i++) {
            const newX = direction === "horizontal" ? x + i : x;
            const newY = direction === "vertical" ? y + i : y;

            if (newX >= 10 || newY >= 10 || this._board[newX][newY]) {
                throw new Error("Invalid placement")
            }
            positions.push([newX, newY])
        }

        positions.forEach(([x, y]) => {
            this._board[y][x] = ship;
        })

        this._ships.push(ship)
    }

    get board() {
        return structuredClone(this._board)
    }

    receiveAttack(x, y) {
        const location = this._board[y][x];
        if (location == "hit" || location == "missed") {
            return false
        }
        else if (!location) {
            this._board[y][x] = "missed";
            return false
        }
        else {
            location.hit();
            this._board[y][x] = "hit";
            return true
        }
    }

    allSunk() {
        return this._ships.every((ship) => {
            return ship.isSunk();
        })
    }

}