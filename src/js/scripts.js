const blackClass = "fa-solid";
const whiteClass = "fa-regular";
const backRow = ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"];
const gameBoard = document.querySelector("main");

function generateBoard(target) {
  for (let rowNumber = 8; rowNumber >= 1; rowNumber--) {
    const row = document.createElement("div");
    row.id = `row-${rowNumber}`;
    for (let colNumber = 97; colNumber <= 104; colNumber++) {
      const cell = document.createElement("div");
      cell.id = `${String.fromCharCode(colNumber)}${rowNumber}`;
      cell.addEventListener("click", movePiece);
      if ([1, 2, 7, 8].includes(rowNumber)) {
        const newPiece = document.createElement("i");
        if (rowNumber === 1 || rowNumber === 8) {
          newPiece.classList.add(`fa-chess-${backRow[colNumber - 97]}`);
        } else if (rowNumber === 2 || rowNumber === 7) {
          newPiece.classList.add(`fa-chess-pawn`);
        }
        newPiece.classList.add(rowNumber >= 4 ? blackClass : whiteClass);
        newPiece.addEventListener("click", selectPiece);
        cell.appendChild(newPiece);
      }
      row.appendChild(cell);
    }
    target.appendChild(row);
  }
}
generateBoard(gameBoard);

function selectPiece(event) {
  event.stopPropagation();
  const targetPiece = event.target;
  if (targetPiece.tagName === "I" && document.querySelector(".selected") === null) {
    targetPiece.classList.add("selected");
    const possibleMoves = flagPossibleMoves(targetPiece.classList[0].split("-")[2], targetPiece.parentElement.id);
    filterObstructedMoves(
      targetPiece.classList[0].split("-")[2],
      targetPiece.parentElement.id,
      possibleMoves,
      targetPiece.classList.contains(blackClass) ? "black" : "white",
    );
    console.log(possibleMoves);
    for (const move of possibleMoves) {
      gameBoard.querySelector(`#${move}`).classList.add("possible");
    }
    //const oldCell = piece.parentElement;
    //const oldRow = oldCell.parentElement;
    //const oldCol = oldRow.id;
    //const newRow = gameBoard.querySelector("#row-5");
    //const newCell = newRow.querySelector("#d5");
    //newCell.appendChild(piece);
  }
}
function movePiece(event) {
  const targetSpace = event.target;
  const selectedPiece = gameBoard.querySelector(".selected");
  if (selectedPiece && targetSpace.classList.contains("possible")) {
    targetSpace.appendChild(selectedPiece);
    selectedPiece.classList.remove("selected");

    const possibleMoves = gameBoard.querySelectorAll(".possible");
    for (const move of possibleMoves) {
      move.classList.remove("possible");
    }
  }
}
function flagPossibleMoves(pieceType, origin) {
  // Considering pieceType and origin, return an array of all possible spaces on the board (not consider which spaces are occupied)
  // origin is a string representing a space in chess notation, pieceType is a string representing the name of the piece in lowercase
  const possibleMoves = [];
  const [col, row] = origin.split("");
  if (pieceType === "pawn") {
    // For now, return the space in front/behind of the pawn and its four diagonals, the rest of the logic will be handled elsewhere
    possibleMoves.push(`${col}${parseInt(row) + 1}`);
    possibleMoves.push(`${col}${parseInt(row) + 2}`);
    possibleMoves.push(`${String.fromCharCode(col.charCodeAt(0) - 1)}${parseInt(row) + 1}`);
    possibleMoves.push(`${String.fromCharCode(col.charCodeAt(0) + 1)}${parseInt(row) + 1}`);
    possibleMoves.push(`${col}${parseInt(row) - 1}`);
    possibleMoves.push(`${col}${parseInt(row) - 2}`);
    possibleMoves.push(`${String.fromCharCode(col.charCodeAt(0) - 1)}${parseInt(row) - 1}`);
    possibleMoves.push(`${String.fromCharCode(col.charCodeAt(0) + 1)}${parseInt(row) - 1}`);
  } else if (pieceType === "rook") {
    for (let i = 97; i <= 104; i++) {
      possibleMoves.push(`${String.fromCharCode(i)}${row}`);
    }
    for (let i = 1; i <= 8; i++) {
      possibleMoves.push(`${col}${i}`);
    }
  } else if (pieceType === "knight") {
    const colCode = col.charCodeAt(0);
    const rowInt = parseInt(row);

    if (colCode - 2 >= 97 && rowInt + 1 <= 8) {
      possibleMoves.push(`${String.fromCharCode(colCode - 2)}${rowInt + 1}`);
    }
    if (colCode - 1 >= 97 && rowInt + 2 <= 8) {
      possibleMoves.push(`${String.fromCharCode(colCode - 1)}${rowInt + 2}`);
    }
    if (colCode + 1 <= 104 && rowInt + 2 <= 8) {
      possibleMoves.push(`${String.fromCharCode(colCode + 1)}${rowInt + 2}`);
    }
    if (colCode + 2 <= 104 && rowInt + 1 <= 8) {
      possibleMoves.push(`${String.fromCharCode(colCode + 2)}${rowInt + 1}`);
    }
    if (colCode + 2 <= 104 && rowInt - 1 >= 1) {
      possibleMoves.push(`${String.fromCharCode(colCode + 2)}${rowInt - 1}`);
    }
    if (colCode + 1 <= 104 && rowInt - 2 >= 1) {
      possibleMoves.push(`${String.fromCharCode(colCode + 1)}${rowInt - 2}`);
    }
    if (colCode - 1 >= 97 && rowInt - 2 >= 1) {
      possibleMoves.push(`${String.fromCharCode(colCode - 1)}${rowInt - 2}`);
    }
    if (colCode - 2 >= 97 && rowInt - 1 >= 1) {
      possibleMoves.push(`${String.fromCharCode(colCode - 2)}${rowInt - 1}`);
    }
  } else if (pieceType === "bishop") {
    const colCode = col.charCodeAt(0);
    const rowInt = parseInt(row);

    for (let i = 1; i <= Math.min(104 - colCode, 8 - rowInt); i++) {
      possibleMoves.push(`${String.fromCharCode(colCode + i)}${rowInt + i}`);
    }
    for (let i = 1; i <= Math.min(colCode - 97, 8 - rowInt); i++) {
      possibleMoves.push(`${String.fromCharCode(colCode - i)}${rowInt + i}`);
    }
    for (let i = 1; i <= Math.min(104 - colCode, rowInt - 1); i++) {
      possibleMoves.push(`${String.fromCharCode(colCode + i)}${rowInt - i}`);
    }
    for (let i = 1; i <= Math.min(colCode - 97, rowInt - 1); i++) {
      possibleMoves.push(`${String.fromCharCode(colCode - i)}${rowInt - i}`);
    }
  } else if (pieceType === "queen") {
    for (let i = 97; i <= 104; i++) {
      possibleMoves.push(`${String.fromCharCode(i)}${row}`);
    }
    for (let i = 1; i <= 8; i++) {
      possibleMoves.push(`${col}${i}`);
    }
    for (let i = 1; i <= 8; i++) {
      possibleMoves.push(`${String.fromCharCode(col.charCodeAt(0) + i)}${parseInt(row) + i}`);
      possibleMoves.push(`${String.fromCharCode(col.charCodeAt(0) - i)}${parseInt(row) + i}`);
      possibleMoves.push(`${String.fromCharCode(col.charCodeAt(0) + i)}${parseInt(row) - i}`);
      possibleMoves.push(`${String.fromCharCode(col.charCodeAt(0) - i)}${parseInt(row) - i}`);
    }
  } else if (pieceType === "king") {
    possibleMoves.push(`${String.fromCharCode(col.charCodeAt(0) + 1)}${parseInt(row) + 1}`);
    possibleMoves.push(`${String.fromCharCode(col.charCodeAt(0) + 1)}${parseInt(row)}`);
    possibleMoves.push(`${String.fromCharCode(col.charCodeAt(0) + 1)}${parseInt(row) - 1}`);
    possibleMoves.push(`${col}${parseInt(row) + 1}`);
    possibleMoves.push(`${col}${parseInt(row) - 1}`);
    possibleMoves.push(`${String.fromCharCode(col.charCodeAt(0) - 1)}${parseInt(row) + 1}`);
    possibleMoves.push(`${String.fromCharCode(col.charCodeAt(0) - 1)}${parseInt(row)}`);
    possibleMoves.push(`${String.fromCharCode(col.charCodeAt(0) - 1)}${parseInt(row) - 1}`);
  }
  // Remove any spaces that are outside the bounds of the board (a-h, 1-8)
  return possibleMoves.filter((space) => {
    const [col, row] = space.split("");
    return col.charCodeAt(0) >= 97 && col.charCodeAt(0) <= 104 && row >= 1 && row <= 8;
  });
}

// Copilot generated this, untested.
function filterObstructedMoves(pieceType, origin, possibleMoves, team) {
  const [col, row] = origin.split("");
  if (pieceType === "pawn") {
    // If the pawn is moving forward, remove the space behind it from the possible moves
    if (team === "black") {
      possibleMoves = possibleMoves.filter((space) => {
        return space !== `${col}${parseInt(row) - 1}`;
      });
    } else {
      possibleMoves = possibleMoves.filter((space) => {
        return space !== `${col}${parseInt(row) + 1}`;
      });
    }
  }
  // Remove any spaces that are occupied by a piece of the same team
  for (const move of possibleMoves) {
    const targetSpace = gameBoard.querySelector(`#${move}`);
    if (targetSpace.children.length > 0) {
      const targetPiece = targetSpace.children[0];
      if (team === "black" && targetPiece.classList.contains(blackClass)) {
        possibleMoves = possibleMoves.filter((space) => {
          return space !== move;
        });
      } else if (team === "white" && targetPiece.classList.contains(whiteClass)) {
        possibleMoves = possibleMoves.filter((space) => {
          return space !== move;
        });
      }
    }
  }
  return possibleMoves;
}
