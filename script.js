/*----- constants -----*/
const player_info = {
    '1':'X',
    '-1':'O',
    'null':''
}

/*----- state variables -----*/
let board;
let winner;
let turn;

/*----- cached elements  -----*/
const messageEl = document.querySelector('h1');
const playAgainBtn = document.querySelector('button');
const sqrs = Array.from(document.querySelectorAll('#board > div'));


/*----- event listeners -----*/
playAgainBtn.addEventListener('click', init)
document.getElementById('board').addEventListener('click', handleClick);

/*----- functions -----*/
init()

function init(){
    board = [
        [null, null, null], //col 0
        [null, null, null], //col 1
        [null, null, null] // col 2
    ]

    winner = null;
    turn = 1;

    render()
}
function handleClick(evt){
    const cellId = evt.target.id;
    const colId = parseInt(cellId.charAt(1)); 
    const rowId = parseInt(cellId.charAt(3)); 

    if (board[colId][rowId] === null) {
        board[colId][rowId] = turn;
        if (turn === 1) {
            document.getElementById('xSound').play();
        } else {
            document.getElementById('oSound').play();
        }
        winner = checkWinner(colId,rowId);
        turn *= -1; // Switch turns
        render();
    }
}

function checkWinner(colId, rowId){
    return checkVerticalWin(colId, rowId) ||
    checkNeSwWin(colId, rowId) ||
    checkNwSeWin(colId, rowId) ||
    checkHorizontalWin(colId, rowId);
}
function checkNwSeWin(colId, rowId) {
    const adjCountNW = checkAdjacent(colId, rowId, -1, 1);
    const adjCountSE = checkAdjacent(colId, rowId, 1, -1);
    return adjCountNW + adjCountSE >= 2 ? board[colId][rowId] : null;
}
function checkNeSwWin(colId, rowId) {
    const adjCountNE = checkAdjacent(colId, rowId, 1, 1);
    const adjCountSW = checkAdjacent(colId, rowId, -1, -1);
    return adjCountNE + adjCountSW >= 2 ? board[colId][rowId] : null;
}

function checkHorizontalWin(colId, rowId) {
    const adjCountRight = checkAdjacent(colId, rowId, 1, 0);
    const adjCountLeft = checkAdjacent(colId, rowId, -1, 0);
    return adjCountRight + adjCountLeft >= 2 ? board[colId][rowId] : null;
}

function checkVerticalWin(colId, rowId) {
    const adjCountUp = checkAdjacent(colId, rowId, 0, -1);
    const adjCountDown = checkAdjacent(colId, rowId, 0, 1);
    return adjCountUp + adjCountDown >= 2 ? board[colId][rowId] : null;
}

function checkAdjacent(colId, rowId, colOffset, rowOffset) {
    let count = 0;
    const playerValue = board[colId][rowId];

    // perform the offset to begin checking adjacent cells
    colId += colOffset;
    rowId += rowOffset;

    while(board[colId] && board[colId][rowId] === playerValue) {
        count++;
        colId += colOffset
        rowId += rowOffset
    }
    return count;
}

function render(){
    renderBoard();
    renderMessage();
    renderControls();
}

function renderControls(){
    playAgainBtn.style.visibility = winner? "visible":"hidden";
    if (!winner && isBoardFull()) {
        winner = "T";
        render();
    } else if (winner) {
        const winSound = document.getElementById('winSound');
        winSound.play();
    }
}
function isBoardFull() {
    return board.every(row => row.every(cell => cell !== null));
}
function renderMessage(){
    if(winner === "T"){
        messageEl.innerText = "Tie Game!";
    } else if(winner) {
        // messageEl.innerHTML = `<span style="color: ${player_info[winner]}">${player_info[winner]}</span> Wins!`;
        messageEl.innerHTML = `${player_info[winner]} Wins!`;
    }
    else {
        // messageEl.innerHTML = `<span style="color: ${player_info[turn]}">${player_info[turn]}'s</span> Turn`;
        messageEl.innerHTML = `${player_info[turn]}' Turn`;
    }
}

function renderBoard(){
    board.forEach(function(colArr, colId){
        colArr.forEach(function(cellVal, rowId){
            const cellId = `c${colId}r${rowId}`;
            const cellEl = document.getElementById(cellId);
            cellEl.className = player_info[cellVal];
        })
    })
}