const body = document.querySelector('body');

// Functions for initializing board properties

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

function createPlayer(name, symbol, boardProperties) {
    let player = Object.create(boardProperties)
    Object.assign(player, {name: name}, {symbol: symbol});
    return player;
}

// Functions for creating and setting attributes to elements

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

function attachEventListener(cell, cellValue, globalBoard) {
    cell.addEventListener("click", () => {

        if (globalBoard.usedCells.indexOf(cellValue) == -1) {
            let image = createElement('img');
            image.setAttribute('id', 'marks')
            let thisCell = document.getElementById(`${cellValue}`);
            if (globalBoard.players[0].symbol == 'X') {
                image.setAttribute('src', './X.png');
            } else {
                image.setAttribute('src', './O.png');
            }
            thisCell.appendChild(image);
            updateGameState(cellValue, globalBoard);
        } else {
            showErrorMessage();
        }
        
    });
}

function resetBoard() {
    let container = document.querySelectorAll('body > *');
    container.forEach((element) => {
        element.remove();
    })
}

function appendChildrenToParents(parents, children) {
    for (let i = 0; i < parents.length; i++) {
        let parent = parents[i];

        for (let j = 0; j < children[i].length; j++) {
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

function initShowPlayerTurn(globalBoard) {
    let container = createElement('div');
    let text = createElement('p');
    text.setAttribute('id', 'player_turn')
    text.textContent = `It is ${globalBoard.players[0].name}'s (${globalBoard.players[0].symbol}) turn!`;
    container.appendChild(text);
    body.appendChild(container);

}

function updateShowPlayerTurn(globalBoard) {
    let text = document.querySelector('#player_turn');
    text.textContent = `It is ${globalBoard.players[0].name}'s (${globalBoard.players[0].symbol}) turn!`;

}

function bringToStart() {
    resetBoard();
    startWindow();
}

// Dialog window creation

function createDialogWindow(globalBoard, event) {
    let [dialogWindow, continueButton, startOverButton, container] = createMultipleElements(['dialog', 'button', 'button', 'div'])
    setAllAttributes([continueButton, startOverButton, dialogWindow], ['type', 'type', 'class'], ['button', 'button', 'dialogWindow']);
    setAllAttributes([continueButton, startOverButton], ['id', 'id'], ['continueBtn', 'startOverBtn']);
    continueButton.textContent = "Reset";
    startOverButton.textContent = 'Exit';
    
    continueButton.addEventListener("click", () => {
        dialogWindow.close();
        resetBoard();
        initGame([globalBoard.players[0].name, globalBoard.players[1].name]);
    });
    

    startOverButton.addEventListener("click", () => {
        dialogWindow.close();
        bringToStart();
    })

    if (event == 'win') {
        dialogWindow.textContent = `${globalBoard.players[1].name} wins!`;

    } else if (event == 'draw') {
        dialogWindow.textContent = `It's a draw.`;
    }

    container.appendChild(continueButton);
    container.appendChild(startOverButton);
    dialogWindow.appendChild(container);
    body.appendChild(dialogWindow);
    dialogWindow.showModal();
}

function startWindow() {
    let [startButton, container, startText] = createMultipleElements(['button', 'div', 'p']);
    setAllAttributes([container, startButton, startText], ['id', 'type', 'id'], ['start_container', 'button', 'start_text']);
    startButton.textContent = "Start";
    startText.textContent = "Tic Tac Toe";
    startButton.addEventListener("click", () => {
        askPlayerNames();
    });
    container.appendChild(startText);
    container.appendChild(startButton);
    body.appendChild(container);
}

// Main functions

function inputMark(cell, globalBoard, symbol) {

    let currentCellProperties = showCellProperties(cell);
    globalBoard.winnerExists = !currentCellProperties[cell].every((prop) => {
    globalBoard.boardObject[prop].push(symbol);
    return !checkWinCondition(symbol, globalBoard, prop);        
    })
    globalBoard.usedCells.push(cell);
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

function initGame(names){
    let globalBoard = initBoardProperties();
    let [playerOneName, playerTwoName] = names;
    globalBoard.players = [createPlayer(playerOneName,"O", globalBoard), createPlayer(playerTwoName, "X", globalBoard)];
    initShowPlayerTurn(globalBoard);
    createBoardCells(globalBoard);
}

function askPlayerNames() {
    let [dialogWindow, submitButton, container, playerOneNameField, playerTwoNameField, playerOneNameLabel, playerTwoNameLabel] = createMultipleElements(['dialog', 'button', 'div', 'input', 'input', 'label', 'label']);
    setAllAttributes([submitButton, playerOneNameField, playerTwoNameField, playerOneNameLabel, playerTwoNameLabel, dialogWindow], ['type', 'id', 'id', 'for', 'for', 'class'], ['button', 'playerOne', 'playerTwo', 'playerOne', 'playerTwo', 'dialogWindow'])
    playerOneNameLabel.textContent = 'Player One Name: ';
    playerTwoNameLabel.textContent = 'Player Two Name: ';
    submitButton.textContent = "Submit";
    
    submitButton.addEventListener("click", () => {
        
        let [playerOneName, playerTwoName] = [playerOneNameField.value, playerTwoNameField.value];
        dialogWindow.close();
        resetBoard();
        initGame([playerOneName, playerTwoName]);
        
    });

    appendChildrenToParents([container, dialogWindow, body], [[playerOneNameLabel, playerOneNameField, playerTwoNameLabel, playerTwoNameField, submitButton], [container], [dialogWindow]]);
    dialogWindow.showModal();


}

function updateGameState(cellValue, globalBoard) {
    let userInput = cellValue;
    let [currentPlayer, previousPlayer] = globalBoard.players;
    if (globalBoard.usedCells.indexOf(userInput) == -1) {
            inputMark(userInput, globalBoard, currentPlayer.symbol)
            globalBoard.players = [previousPlayer, currentPlayer];
            updateShowPlayerTurn(globalBoard);
    }

    if (globalBoard.winnerExists) {
        createDialogWindow(globalBoard, 'win');
}
    if (globalBoard.usedCells.length == 9 && !(globalBoard.winnerExists)) {
        createDialogWindow(globalBoard, 'draw');
    }
}


startWindow();