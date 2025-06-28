import Ship from '../src/ship'
import Gameboard from '../src/gameboard';
describe("gameboard functions", () => {

    test("place ship", () => {
        const gameboard = new Gameboard();
        const newShip = new Ship(3)

        gameboard.placeShip(0, 2, "horizontal", newShip);
        expect(gameboard.board[2][0]).toEqual(newShip);
        expect(gameboard.board[2][1]).toEqual(newShip);
        expect(gameboard.board[2][2]).toEqual(newShip);
        expect(gameboard.board[2][3]).toBeNull();

        const newShip2 = new Ship(5);
        gameboard.placeShip(8, 3, "vertical", newShip2);
        expect(gameboard.board[3][8]).toEqual(newShip2);
        expect(gameboard.board[4][8]).toEqual(newShip2);
        expect(gameboard.board[5][8]).toEqual(newShip2);
        expect(gameboard.board[6][8]).toEqual(newShip2);
        expect(gameboard.board[7][8]).toEqual(newShip2);
    })

    test("place ship out of bound", () => {
        const gameboard = new Gameboard();
        const newShip = new Ship(3)

        expect(() => gameboard.placeShip(10, 10, "horizontal", newShip)).toThrow();
    })

    test("receive attack", () => {
        const gameboard = new Gameboard();
        expect(gameboard.receiveAttack(0, 0)).toBeFalsy();
    })

    test("receive attack on ship", () => {
        const gameboard = new Gameboard();
        const newShip = new Ship(3)

        gameboard.placeShip(0, 2, "horizontal", newShip);

        expect(gameboard.receiveAttack(0, 2)).toBeTruthy();
    })

    test("check if tracks hits and misses", () => {
        const gameboard = new Gameboard();
        const newShip = new Ship(3)

        gameboard.placeShip(0, 2, "horizontal", newShip);
        gameboard.receiveAttack(0, 2)
        gameboard.receiveAttack(0, 0)
        expect(gameboard.board[2][0]).toBe("hit");
        expect(gameboard.board[0][0]).toBe("missed");
    })

    test("all ships sunk", () => {
        const gameboard = new Gameboard();
        const newShip = new Ship(3);
        gameboard.placeShip(0, 2, "horizontal", newShip);
        gameboard.receiveAttack(0, 2);
        gameboard.receiveAttack(1, 2);
        expect(gameboard.allSunk()).toBeFalsy();
        gameboard.receiveAttack(2, 2);
        expect(gameboard.allSunk()).toBeTruthy();
    })
})