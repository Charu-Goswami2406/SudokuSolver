// Array to store the Sudoku grid elements
var arr = [[], [], [], [], [], [], [], [], []];

for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
        arr[i][j] = document.getElementById(i * 9 + j);
        // Make each grid cell editable
        arr[i][j].setAttribute("contentEditable", true);
        // Add event listener to validate input
        arr[i][j].addEventListener("input", function () {
            validateInput(this);
        });
    }
}

// Array to store the board values
var board = [[], [], [], [], [], [], [], [], []];

// Function to fill the board with numbers (or clear cells)
function FillBoard(board) {
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (board[i][j] != 0) {
                arr[i][j].innerText = board[i][j];
            } else {
                arr[i][j].innerText = '';
            }
        }
    }
}

// Event listener for the Get Puzzle button
let GetPuzzle = document.getElementById('GetPuzzle');
GetPuzzle.onclick = function () {
    var xhrRequest = new XMLHttpRequest();
    xhrRequest.onload = function () {
        var response = JSON.parse(xhrRequest.response);
        console.log(response);
        board = response.board;
        FillBoard(board);
    };
    xhrRequest.open('get', 'https://sugoku.onrender.com/board?difficulty=easy');
    xhrRequest.send();
};

// Event listener for the Solve Puzzle button
let SolvePuzzle = document.getElementById('SolvePuzzle');
SolvePuzzle.onclick = () => {
    sudukoSolver(board, 0, 0, 9);
};

// Function to validate user input (only allows numbers 1-9)
function validateInput(element) {
    let inputValue = element.innerText;
    if (inputValue.length > 1 || isNaN(inputValue) || inputValue < 1 || inputValue > 9) {
        element.innerText = '';
        alert('Please enter a number between 1 and 9');
    }
}

// Function to check if a value is safe to place in the Sudoku board
function isSafe(board, row, col, val, n) {
    for (let i = 0; i < n; i++) {
        // Check row and column
        if (board[row][i] == val || board[i][col] == val) {
            return false;
        }
    }
    // Check subgrid
    let rn = Math.sqrt(n);
    let si = row - row % rn;
    let sj = col - col % rn;
    for (let x = si; x < si + rn; x++) {
        for (let y = sj; y < sj + rn; y++) {
            if (board[x][y] == val) {
                return false;
            }
        }
    }
    return true;
}

// Sudoku solver using backtracking
function sudukoSolver(board, row, col, n) {
    // Base case: if all rows are processed
    if (row == n) {
        FillBoard(board);
        return true;
    }

    // Move to the next row if column is complete
    if (col == n) {
        return sudukoSolver(board, row + 1, 0, n);
    }

    // If the cell is already filled, move to the next column
    if (board[row][col] != 0) {
        return sudukoSolver(board, row, col + 1, n);
    }

    // Try placing values 1-9 and check if they are valid
    for (let val = 1; val <= 9; val++) {
        if (isSafe(board, row, col, val, n)) {
            board[row][col] = val;
            // Recursive call to solve the next cell
            if (sudukoSolver(board, row, col + 1, n)) {
                return true;
            }
            // Backtrack if the value is not valid
            board[row][col] = 0;
        }
    }
    return false;
}
