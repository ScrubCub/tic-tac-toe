const body = document.querySelector('body');

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
    globalBoard.usedCells.push(cell);
    return globalBoard;
};

function showErrorMessage(typeOfError) {
    console.log("Error");
}

function checkWinCondition(symbol, globalBoard, currentCellProperty) {
    let line = globalBoard.boardObject[currentCellProperty];
    if (line.length === 3 && line.every((element) => element === symbol)) {
        return true;
    } else {
        return false;
    }
};

function createPlayer(name, symbol, boardProperties) {
    let player = Object.create(boardProperties)
    Object.assign(player, {name: name}, {symbol: symbol});
    return player;
}

function createElement(type) {
    return document.createElement(type);
}

function createMultipleElements(types) {
    let elements = [];
    for (let i = 0; i < types.length; i++) {
        elements.push(createElement(types[i]));
    }
    return elements;
}

function attachEventListener(cell, cellValue, globalBoard) {
    cell.addEventListener("click", () => {

        if (globalBoard.usedCells.indexOf(cellValue) == -1) {
            let thisCell = document.getElementById(`${cellValue}`);
            thisCell.textContent = globalBoard.players[0].symbol;
            updateGameState(cellValue, globalBoard);
        } else {
            showErrorMessage();
        }
        
    });
}


function initGame(names){
    resetBoard();
    let globalBoard = initBoardProperties();
    let [playerOneName, playerTwoName] = names;
    globalBoard.players = [createPlayer(playerOneName,"O", globalBoard), createPlayer(playerTwoName, "X", globalBoard)];
    createBoardCells(globalBoard);
}

function startWindow() {
    let startButton = document.createElement('button');
    let container = document.createElement('div');
    startButton.setAttribute('type', 'button');
    startButton.textContent = "Start";
    startButton.addEventListener("click", () => {
        askPlayerNames();
    });
    container.appendChild(startButton);
    body.appendChild(container);
}

function askPlayerNames() {
    let [dialogWindow, submitButton, container, playerOneNameField, playerTwoNameField, playerOneNameLabel, playerTwoNameLabel] = createMultipleElements(['dialog', 'button', 'div', 'input', 'input', 'label', 'label']);
    setAllAttributes([submitButton, playerOneNameField, playerTwoNameField, playerOneNameLabel, playerTwoNameLabel], ['type', 'id', 'id', 'for', 'for'], ['button', 'playerOne', 'playerTwo', 'playerOne', 'playerTwo'])
    playerOneNameLabel.textContent = 'Player One Name: ';
    playerTwoNameLabel.textContent = 'Player Two Name: ';
    submitButton.textContent = "Submit";
    
    submitButton.addEventListener("click", () => {
        
        let [playerOneName, playerTwoName] = [playerOneNameField.value, playerTwoNameField.value];
        dialogWindow.close();
        initGame([playerOneName, playerTwoName]);
        
    });

    appendChildrenToParents([container, dialogWindow, body], [[playerOneNameLabel, playerOneNameField, playerTwoNameLabel, playerTwoNameField, submitButton], [container], [dialogWindow]]);
    dialogWindow.showModal();


}

function updateGameState(cellValue, globalBoard) {
    let userInput = cellValue;
    let [currentPlayer, previousPlayer] = globalBoard.players;
    console.log(currentPlayer);

    if (globalBoard.usedCells.indexOf(userInput) == -1) {
        console.log("Fired")
            globalBoard = inputMark(userInput, globalBoard, currentPlayer.symbol);
            globalBoard.players = [previousPlayer, currentPlayer];
    }

    if (globalBoard.winnerExists) {
        createDialogWindow(globalBoard, 'win');
}
    if (globalBoard.usedCells.length == 9) {
        createDialogWindow(globalBoard, 'draw');
    }
}

function createBoardCells(globalBoard) {
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

function createDialogWindow(globalBoard, event) {
    let dialogWindow = createElement('dialog');
    let continueButton = createElement('button');
    continueButton.setAttribute('type', 'button');
    continueButton.addEventListener("click", () => {
        dialogWindow.close();
        resetBoard();
        startWindow();
    });
    continueButton.textContent = "Reset";

    if (event == 'win') {
        dialogWindow.textContent = `${globalBoard.players[1].name} wins!`;

    } else if (event == 'draw') {
        dialogWindow.textContent = `It's a draw.`;
    }

    dialogWindow.appendChild(continueButton);
    body.appendChild(dialogWindow);
    dialogWindow.showModal();
}

function resetBoard() {
    let container = document.querySelector('body > div');
    container.remove();
}

function appendChildrenToParents(parents, children) {
    for (let i = 0; i < parents.length; i++) {
        let parent = parents[i];

        for (let j = 0; j < children[i].length; j++) {
            console.log(children[i][j]);
            parent.appendChild(children[i][j]);
        }
    }

    return parents;
}

function setAllAttributes(elements, attributes, values) {
    for (let i = 0; i < elements.length; i++) {
        elements[i].setAttribute(attributes[i], values[i]);
    }
}

startWindow();