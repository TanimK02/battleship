import Ship from '../src/ship';
describe("ship functions", () => {

    test("ship hit", () => {
        const ship = new Ship(3);
        ship.hit();
        expect(ship.hp).toBe(2)

    });

    test("ship sunk", () => {
        const ship = new Ship(1);
        ship.hit();
        expect(ship.isSunk()).toBeTruthy();
    })

    test("invalid ship lengths", () => {
        expect(() => new Ship(-1)).toThrow();
        expect(() => new Ship("asdfsf")).toThrow();
    })
})
