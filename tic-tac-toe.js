function initBoardProperties() {
    const boardObject = {
        "H1": [],
        "H2": [],
        "H3": [],
        "V1": [],
        "V2": [],
        "V3": [],
        "D1": [],
        "D2": []
    }
    const usedCells = [];
    let winnerExists = false;
    return {boardObject, usedCells, winnerExists};
};

function showCellProperties() {
    let cellPropertiesObject = {
        0: ["H1", "V1", "D1"],
        1: ["H1", "V2"],
        2: ["H1", "V3", "D2"],
        3: ["H2", "V1"],
        4: ["H2", "V2", "D1", "D2"],
        5: ["H2", "V3"],
        6: ["H3", "V1", "D2"],
        7: ["H3", "V2"],
        8: ["H3", "V3", "D1"]
    }
    return cellPropertiesObject;
};

function inputMark(cell, globalBoard, symbol) {

    let currentCellProperties = showCellProperties(cell);
    globalBoard.winnerExists = !currentCellProperties[cell].every((prop) => {
    globalBoard.boardObject[prop].push(symbol);
    return !checkWinCondition(symbol, globalBoard, prop);        
    })
    globalBoard.usedCells = usedCellsFunc(globalBoard.usedCells, cell);
    return globalBoard;
};

function usedCellsFunc(usedCell, cell) {
    usedCell.push(cell);
    return usedCell;
}

function showErrorMessage(typeOfError) {
    console.log("Error");
}

function executeWinState() {
    console.log("You Win");
    createWinWindow();
}

function checkWinCondition(symbol, globalBoard, currentCellProperty) {
    let line = globalBoard.boardObject[currentCellProperty];
    if (line.length === 3 && line.every((element) => element === symbol)) {
        return true;
    } else {
        return false;
    }
};

function createPlayer(symbol, boardProperties) {
    let player = Object.create(boardProperties)
    Object.assign(player, {symbol: symbol});
    return player;
}

function createElement(type) {
    return document.createElement(type);
}

function attachEventListener(cell, cellValue, globalBoard) {
    cell.addEventListener("click", () => {
        updateGameState(cellValue, globalBoard);
        let thisCell = document.getElementById(`${cellValue}`);
        thisCell.textContent = globalBoard.players[0].symbol;
    });
}


function initGame(){
    let globalBoard = initBoardProperties();
    globalBoard.players = [createPlayer("O", globalBoard), createPlayer("X", globalBoard)];
    createBoardCells(globalBoard);
}

function updateGameState(cellValue, globalBoard) {
    let userInput = cellValue;
    let [currentPlayer, previousPlayer] = globalBoard.players;
    console.log(currentPlayer);

     if (globalBoard.usedCells.indexOf(userInput) >= 0) {
            showErrorMessage();

    } else if (globalBoard.usedCells.indexOf(userInput) == -1) {
            globalBoard = inputMark(userInput, globalBoard, currentPlayer.symbol);
            globalBoard.players = [previousPlayer, currentPlayer];
    }

    if (globalBoard.winnerExists) {
        executeWinState();
    
}
}

function createBoardCells(globalBoard) {
    let body = document.querySelector('body');
    let container = createElement('div');
    container.setAttribute('id', 'container');

    for (let i = 0; i < 9; i++) {
        let cell = createElement('div');
        cell.setAttribute('class', 'cells');
        cell.setAttribute('id', i);
        attachEventListener(cell, i, globalBoard);
        container.appendChild(cell);
    }
    body.appendChild(container);
}

function createWinWindow() {
    let dialogWindow = createElement('dialog');
    let continueButton = createElement('button');
    continueButton.setAttribute('type', 'button');
    continueButton.addEventListener("click", () => {
        resetBoard();
        initGame();
    });
    continueButton.textContent = "Reset";
    dialogWindow.textContent = 'Reset?';
    let body = document.querySelector('#container');
    dialogWindow.appendChild(continueButton);
    body.appendChild(dialogWindow);
    dialogWindow.showModal();
}

function resetBoard() {
    let container = document.querySelector('#container');
    container.remove();
}

initGame();