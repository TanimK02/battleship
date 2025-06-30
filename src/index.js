import './styles.css'
import Player from './player'
import Ship from './ship'


const resetAll = (val) => {
    document.querySelectorAll(".gameboard").forEach(el => {
        const filler = new Player("Player");
        const playerBoard = document.getElementById("playerGameboard");
        const computerBoard = document.getElementById("computerGameboard");
        document.getElementById("info").innerText = val ? "You Win!" : "You Lose!";
        loadGameboard(filler, playerBoard);
        loadGameboard(filler, computerBoard);
    });
    document.getElementById("resetContainer").style.display = "flex";
}

const attack = (e, player, board) => {
    const square = e.target;
    const x = square.dataset.x;
    const y = square.dataset.y;
    const area = player.gameboard.board[y][x];
    if (area != "hit" && area != "missed") {
        player.gameboard.receiveAttack(x, y);
        loadGameboard(player, board, true, true);
        if (player.gameboard.allSunk()) {
            console.log("you Win")
            resetAll(true);
            return false
        }
        return true
    }
    return false
}

const returnAttack = (player, board) => {
    let x = Math.floor(Math.random() * 10);
    let y = Math.floor(Math.random() * 10);
    while (player.gameboard.board[y][x] == "hit" || player.gameboard.board[y][x] == "missed") {
        x = Math.floor(Math.random() * 10);
        y = Math.floor(Math.random() * 10);
    }
    player.gameboard.receiveAttack(Number(x), Number(y));

    loadGameboard(player, board, false, false);
    if (player.gameboard.allSunk()) {
        resetAll(false);
        console.log("you Win")
    }
}


function loadGameboard(player, gameboardDiv, selectable = false, attackable = false, player2 = null, board2 = null) {
    gameboardDiv.innerText = "";
    for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
            const newSquare = document.createElement("div");
            newSquare.classList.add("square")
            newSquare.dataset.x = x;
            newSquare.dataset.y = y;
            const area = player.gameboard.board[y][x];
            if (area != "hit" && area != "missed" && attackable) {
                newSquare.addEventListener("click", (e) => {
                    if (attack(e, player, gameboardDiv)) {
                        returnAttack(player2, board2);
                        loadGameboard(player, gameboardDiv, selectable, attackable, player2, board2)
                    }
                })
            }
            if (area && area != "hit" && area != "missed") {
                newSquare.classList.add("ship")
            }
            if (selectable && area != "hit" && area != "missed") {
                newSquare.classList.add("selectableSquare");
            }
            if (area == "hit") {
                newSquare.classList.add("hit");
            }
            if (area == "missed") {
                newSquare.classList.add("missed");
            }
            gameboardDiv.appendChild(newSquare);
        }
    }
}

const handleHoverIn = (e, length) => {
    const square = e.target;
    if (!square.classList.contains("selectableSquare")) {
        return
    }
    const x = parseInt(square.dataset.x);
    const y = parseInt(square.dataset.y);
    const text = document.getElementById("rotate").innerText.slice(0, 1).toLowerCase
        () + document.getElementById("rotate").innerText.slice(1);
    const direction = text;
    for (let i = 0; i < length; i++) {
        let target;
        if (direction === 'horizontal') {
            target = document.querySelector(`[data-x='${x + i}'][data-y='${y}']`);
        } else {
            target = document.querySelector(`[data-x='${x}'][data-y='${y + i}']`);
        }
        if (target) target.classList.add('highlight');
    }
}

const handleHoverOut = (e) => {
    document.querySelectorAll('.highlight').forEach(square => {
        square.classList.remove('highlight');
    });
}

function loadPickShips(player, gameboardDiv, length = 2) {
    gameboardDiv.innerText = "";

    for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
            const newSquare = document.createElement("div");
            newSquare.classList.add("square")
            newSquare.dataset.x = x;
            newSquare.dataset.y = y;
            newSquare.addEventListener("mouseenter", (e) => {
                handleHoverIn(e, length)
            });
            newSquare.addEventListener("mouseleave", handleHoverOut);
            const area = player.gameboard.board[y][x];
            if (area) {
                newSquare.classList.add("ship");
            } else {

                newSquare.classList.add("selectableSquare");
            }
            gameboardDiv.appendChild(newSquare);
        }
    }
    console.log(player.gameboard.board)
}

function startGame() {
    const player1 = new Player("Player");
    const player2 = new Player("Computer");
    const computerBoard = document.getElementById("computerGameboard");
    const playerBoard = document.getElementById("playerGameboard");
    document.getElementById("resetContainer").style.display = "none";
    loadGameboard(player2, computerBoard, true);
    loadPickShips(player1, playerBoard);
    document.getElementById("info").innerText = "Place Your Ships...";
    pickShipLocation(player1, playerBoard, player2, computerBoard);
}

function pickShipLocation(player, board, player2, player2Board) {
    let length = 2;
    const rotate = document.getElementById("rotate");
    let direction = "horizontal";
    rotate.style.display = "block";
    const handleRotation = () => {
        direction = direction == "horizontal" ? "vertical" : "horizontal";
        rotate.innerText = direction;
    }
    rotate.addEventListener("click", handleRotation);

    const handle = (e) => {
        if (e.target.classList.contains("selectableSquare")) {
            const ship = new Ship(length);
            const x = e.target.dataset.x;
            const y = e.target.dataset.y;
            try {
                player.gameboard.placeShip(Number(x), Number(y), direction, ship);
                if (player.gameboard.ships.length == 2) {
                    length -= 1
                }
                length += 1;
                if (length == 6) {
                    board.removeEventListener("click", handle);
                    rotate.removeEventListener("click", handleRotation);
                    rotate.style.display = "none";
                    loadGameboard(player, board, false);
                    pickRandomShip(player2, player2Board, player, board);
                    return
                }
                loadPickShips(player, board, length);
            }
            catch (e) {
                return
            }
        }
    }

    board.addEventListener("click", handle);
}

function pickRandomShip(player, board, player2, board2) {
    let length = 2;
    while (player.gameboard.ships.length < 5) {
        const ship = new Ship(length);
        let x = Math.floor(Math.random() * 10);
        let y = Math.floor(Math.random() * 10);
        while (player.gameboard.board[y][x]) {
            x = Math.floor(Math.random() * 10);
            y = Math.floor(Math.random() * 10);
        }
        try {
            player.gameboard.placeShip(Number(x), Number(y), Math.random() < 0.5 ? "horizontal" : "vertical"
                , ship);
            if (player.gameboard.ships.length == 2) {
                length -= 1
            }
            length += 1;
        }
        catch (e) {
        }
    }
    document.getElementById("info").innerText = "Attack Enemy Ships!!!";
    loadGameboard(player, board, true, true, player2, board2);
}

document.getElementById("resetButton").addEventListener("click", startGame);


startGame();

