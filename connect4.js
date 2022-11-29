/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *   board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  for (let y = 0; y < HEIGHT; y++) {
    let test = {length : WIDTH}
    console.log(test, Array.from(test))
    board.push(Array.from({ length: WIDTH })); //creates 7 undefineds across
    //based on WIDTH of 7, and loops 5 times creating 6 rows of 7 cells. Board
    //started as empty array we push this grid into board creating the game board
    //grid
  }
  console.log(board)
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() { //dynamically create HTML table,
  const board = document.getElementById('board'); //grab html table el with id of
  //"board"

  // make column tops (clickable area for adding a piece to that column)
  const top = document.createElement('tr'); //create top table row
  top.setAttribute('id', 'column-top'); //give top row id of 'column-top'
  top.addEventListener('click', handleClick); //add click event to top table row 
  // ^ so that when clicked we can interact with gameboard and place pieces
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement('td'); //each time through create cell
    headCell.setAttribute('id', x); //give each id of what x is each time through //
    //
    top.append(headCell); //append each top cell to the top row we created
  }  //loop to create cells in top table row (any cell clicked piece will drop to
  //bottom when later code is working)

  board.append(top); //make top clickable row populated with cells appear on DOM, we
  //append it to the empty table element that exists in html

  // make main part of board (now that clickable top row is appended make 6 x 7 
  //gameBoard table) - similar logic to the top row
  for (let y = 0; y < HEIGHT; y++) {  //create columns , creates 6 columns 
    const row = document.createElement('tr');

    for (let x = 0; x < WIDTH; x++) { //creates rows 
      const cell = document.createElement('td'); //create cells 
      cell.setAttribute('id', `${y}-${x}`); //give ids that give x and y values
      //like coordinates - e.g. <td id="0-0"</td> represents a cell: column index 0,
      //and row index 0 -> so the first cell on the first row, 0-1 second cell on 1st
      //row. 1-0: row index 1 cell index 0 : first cell on second row on game board)
      //(note: game board does NOT include very top row that has event listener added 
      //to it)
      console.log(cell)
      row.append(cell); //loop created multiple rows (6) we append 7 cells per each
      //row
    }

    board.append(row); //we add populated rows to the table creating the full game
    //board matrix which is now added below to top var onto the DOM
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) { //called in handleClick (scroll down) , we pass in evt.
  //target -> so given evt.target(x) , 
  for (let y = HEIGHT - 1; y >= 0; y--) {
    if (!board[y][x]) { // e.g. if 0-0 (column 0, row 0) is falsey (empty)
      return y; //return top empty y
    }
  }
  return null; //otherwise return null (because it's already filled)
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) { //now we actually place pieces in table
  const piece = document.createElement('div'); //create pieces as divs 
  piece.classList.add('piece'); //give them both class of 'piece'
  piece.classList.add(`p${currPlayer}`); //add class of currentPlayer to differentiate
  //each time a top cell is clicked switch between current player by adding second 
  //class p1 or p2 depending on player (use str interpolation) background colors red
  //and blue are defined in connect4.css
  // between player 1 and 2 so we can toggle on each click , still confused on how
  // it toggles, understand p1 and p1 classes are switched between depending on currP
  //layer but can't see where currPlayer switches between values 1 & 2.
  piece.style.top = -50 * (y + 2);//setting vertical position of pieces 
  console.log(piece)    

  const spot = document.getElementById(`${y}-${x}`); //we grab the cells we click
  console.log(spot)
  spot.append(piece); //and append a piece on click -> 
}

/** endGame: announce game end */

function endGame(msg) {
  alert(msg); //alert triggers when a player wins, defined in conditional in handle
  //Click using interpolation
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  const x = +evt.target.id;
  console.log(x)  //we pass in target of the click to findSpotForCol(x)

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x); //once clicked and spot is found, 
  if (y === null) { //now if y is null (its filled) we return; meaning
    return; //we do nothing if the cell is filled
  }

  // place piece in board and add to HTML table
  //  I think the toggling of currPlayer val happens here
  //vv
  board[y][x] = currPlayer; //current player occupies filled cell when clicked
  console.log(board[y][x]) //accessed x and y in board  set = to currentPlayer
  //toggles between 1 and 2, 1 is player 1, 2 is player 2
  placeInTable(y, x);  // e.g. on click place in table (0-1) piece goes in first
  //row second cell
  
  // check for win
  if (checkForWin()) { //if checkForWin() returns true, 
    return endGame(`Player ${currPlayer} won!`); //passed into alert in endGame f(), 
  } //interpolation - > "Player (1 or 2) won!"
  
  // check for tie
  if (board.every(row => row.every(cell => cell))) {
    return endGame('Tie!'); //in event of tie pass this into msg param
  }
    
  // switch players
  currPlayer = currPlayer === 1 ? 2 : 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() { 
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every( //do all cells meet the win conditions?
      ([y, x]) =>
        y >= 0 &&      //is col greater than 0?
        y < HEIGHT &&  //is col less than height?
        x >= 0 &&
        x < WIDTH &&     //same logic for rows 
        board[y][x] === currPlayer
    );
  }

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      // get "check list" of 4 cells (starting here) for each of the different
      // ways to win
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]]; //checks for horiz-
      //-ontal victory, 
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]]; //checks for veritical
      //victory
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]]; //check 
      //for diagnoal victory right
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];  //check 
      //for diagnal left?

      // find winner (only checking each win-possibility as needed)
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;   //if any of these conditions are true (OR operator) return
        //true which means one of the players win, only returns true when a win occurs
        //otherwise it returns undefined 
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
