# Custom Chess Board Engine

[![npm version](https://img.shields.io/npm/v/chess-sketch-box-engine.svg)](https://www.npmjs.com/package/chess-sketch-box-engine)
[![npm downloads](https://img.shields.io/npm/dm/chess-sketch-box-engine.svg)](https://www.npmjs.com/package/chess-sketch-box-engine)
[![License](https://img.shields.io/npm/l/chess-sketch-box-engine.svg)](https://github.com/DJ-Deb/Chess-Sketch-Box-Engine/blob/main/LICENSE)

A JavaScript chess-board engine designed to work with **custom `n × m` boards**, rather than being restricted to the traditional 8×8 chess board.

The engine represents chess pieces using numeric values inside a 2D matrix and provides functionality for:

* Custom-size chess boards
* Chess piece move generation
* Legal move validation
* Check detection
* Capture handling
* Pawn promotion
* Castling
* Player piece tracking
* King position tracking
* Castling-state tracking

**### 📦 NPM Package:** [**chess-sketch-box-engine**](https://www.npmjs.com/package/chess-sketch-box-engine)

The package is available on NPM and can be installed and used directly in JavaScript or Node.js projects.

---

# Installation

If the project is published as an npm package:

```bash
npm i chess-sketch-box-engine
```

If you are using the project directly from the repository:

```bash
git clone https://github.com/DJ-Deb/Chess-Sketch-Box-Engine

cd Chess-Sketch-Box-Engine

npm install
```

---

# Features

## Custom Board Size

The board is represented as an `n × m` matrix, allowing boards with different numbers of rows and columns.

The matrix must:

* Be a 2D array.
* Contain more than one row.
* Contain more than one column.
* Have the same number of columns in every row.
* Not contain arrays as individual cells.
* Contain only the supported chess-piece values from `0` through `12`.

Example:

```js
const matrix = [
    [0, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 7, 0],
    [0, 0, 0, 0]
];
```

The matrix is validated using the internal matrix validation methods before the board data is initialized.

---

# Piece Representation

Each chess piece is represented by a number in the matrix.

| Value | Player   | Piece  |
| ----: | -------- | ------ |
|   `0` | —        | Empty  |
|   `1` | Player 1 | Pawn   |
|   `2` | Player 1 | Knight |
|   `3` | Player 1 | Bishop |
|   `4` | Player 1 | Rook   |
|   `5` | Player 1 | Queen  |
|   `6` | Player 1 | King   |
|   `7` | Player 2 | Pawn   |
|   `8` | Player 2 | Knight |
|   `9` | Player 2 | Bishop |
|  `10` | Player 2 | Rook   |
|  `11` | Player 2 | Queen  |
|  `12` | Player 2 | King   |

The complete mapping is used throughout the board and move-generation implementation.

---

# Board Creation

The `Board` constructor is responsible for configuring castling.

The chess-board matrix is **not passed to the constructor**.

Instead:

1. Create the `Board` object.
2. Configure castling options if required.
3. Pass the matrix to `fit()`.

## `new Board(player1Castle, player2Castle)`

Creates a new chess board engine with the specified castling configuration.

```js
const board = new Board();
```

By default, both players are allowed to castle with both rooks:

```js
new Board(["l", "r"], ["l", "r"]);
```

### Parameters

| Parameter       | Type       | Default      | Description                            |
| --------------- | ---------- | ------------ | -------------------------------------- |
| `player1Castle` | `string[]` | `["l", "r"]` | Castling options available to Player 1 |
| `player2Castle` | `string[]` | `["l", "r"]` | Castling options available to Player 2 |

### Castling Configuration

The following values are supported:

Allows castling using the left-side rook.

```js
["l"]
```

Allows castling using the right-side rook.

```js
["r"]
```

Allows castling using both rooks.

```js
["r", "l"]
```

Also allows castling using both rooks.

The values `"l"` and `"r"` represent the rook located on the left and right edge of the board respectively.

### Invalid Castling Configuration

The constructor validates the castling configuration.

The following are invalid:

```js
new Board("l", ["l", "r"]);
```

```js
new Board([], ["l", "r"]);
```

```js
new Board(["x"], ["l", "r"]);
```

```js
new Board(["l", "l"], ["l", "r"]);
```

```js
new Board(["l", "r", "l"], ["l", "r"]);
```

The constructor throws an error when:

* The value is not an array.
* The array contains fewer than 1 element.
* The array contains more than 2 elements.
* A value other than `"l"` or `"r"` is provided.
* The same castling side is provided more than once.

---

# Fitting a Matrix

## `board.fit(matrix)`

The `fit()` method validates the provided matrix and initializes the board's internal data.

```js
const board = new Board();

board.fit(matrix);
```

The method performs the following operations:

```text
Matrix
  ↓
Check Dimensions
  ↓
Check Matrix Values
  ↓
Initialize Board Data
```

### Matrix Validation

The matrix must:

* Be an array.
* Contain more than one row.
* Contain more than one column.
* Contain only arrays as rows.
* Not contain nested arrays inside cells.
* Have equal column lengths for every row.
* Contain only values from:

```js
[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
```

### Example

```js
const board = new Board();

board.fit([
    [10, 8, 9, 11, 12, 9, 8, 10],
    [7, 7, 7, 7, 7, 7, 7, 7],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [4, 2, 3, 5, 6, 3, 2, 4]
]);
```

---

# Board Data

## `board.boardData`

After calling `fit()`, the board creates its internal `boardData`.

The structure is:

```js
{
    matrix: matrix,
    player1: player1,
    player2: player2,
    king1: king1,
    king2: king2,
    castle1: castle1,
    castle2: castle2
}
```

### `matrix`

Contains the current chess-board matrix.

```js
board.boardData.matrix
```

### `player1`

Contains the chess pieces belonging to Player 1.

Each entry stores:

```js
[
    [row, col],
    pieceValue
]
```

Example:

```js
[
    [[7, 0], 1],
    [[7, 1], 1],
    [[7, 4], 6]
]
```

### `player2`

Contains the chess pieces belonging to Player 2.

The structure is the same as `player1`:

```js
[
    [position, pieceValue]
]
```

### `king1`

Stores the current position of Player 1's king:

```js
[row, col]
```

Example:

```js
[7, 4]
```

### `king2`

Stores the current position of Player 2's king:

```js
[row, col]
```

Example:

```js
[0, 4]
```

### `castle1`

Stores the column positions of Player 1's rooks that are currently eligible for castling.

Example:

```js
[0, 7]
```

### `castle2`

Stores the column positions of Player 2's rooks that are currently eligible for castling.

Example:

```js
[0, 7]
```

You can inspect the complete board state using:

```js
console.log(board.boardData);
```

---

# Show Possible Moves

## `board.showMoves(row, col)`

Calculates and returns the legal moves available to the chess piece at the specified position.

```js
const moves = board.showMoves(6, 0);

console.log(moves);
```

Example result:

```js
[
    [5, 0],
    [4, 0]
]
```

The method:

1. Determines which player owns the chess piece.
2. Generates possible moves using the corresponding chessman class.
3. Simulates each move.
4. Checks whether the move would leave the player's king in check.
5. Removes illegal moves.
6. Returns the remaining legal moves.

Conceptually:

```text
Chess Piece
     ↓
Generate Possible Moves
     ↓
Simulate Each Move
     ↓
Check King Safety
     ↓
Remove Illegal Moves
     ↓
Return Legal Moves
```

### Parameters

| Parameter | Type     | Description                       |
| --------- | -------- | --------------------------------- |
| `row`     | `number` | Current row of the chess piece    |
| `col`     | `number` | Current column of the chess piece |

### Example

```js
const moves = board.showMoves(6, 0);

console.log(moves);
```

If the piece has no legal moves, the final filtered result is an empty array:

```js
[]
```

---

# Play a Move

## `board.playMove(old_row, old_col, new_row, new_col, changeChessman)`

Moves a chess piece from one position to another after validating that the destination is a legal move.

```js
board.playMove(old_row, old_col, new_row, new_col);
```

### Parameters

| Parameter        | Type     | Default | Description                            |
| ---------------- | -------- | ------- | -------------------------------------- |
| `old_row`        | `number` | —       | Current row of the chess piece         |
| `old_col`        | `number` | —       | Current column of the chess piece      |
| `new_row`        | `number` | —       | Destination row                        |
| `new_col`        | `number` | —       | Destination column                     |
| `changeChessman` | `number` | `-1`    | Piece value used during pawn promotion |

### Example

```js
const success = board.playMove(6, 0, 5, 0);

console.log(success);
```

Returns:

```js
true
```

when the move is successfully performed.

If the chess piece has no legal moves:

```js
false
```

is returned.

If the destination is not one of the legal moves, the method throws:

```text
Error: Not a next valid move
```

---

# Capturing Pieces

Capturing is handled automatically when a chess piece moves onto a square occupied by an opponent's chess piece.

Conceptually:

```text
Player 1 Piece
      ↓
Moves to Opponent Square
      ↓
Opponent Piece Captured
      ↓
Opponent Piece Removed
      ↓
Board Updated
```

The captured piece is removed from the corresponding player's internal piece list.

The board matrix is then updated with the moving piece.

---

# Pawn Promotion

Pawn promotion is supported through the `changeChessman` parameter of `playMove()`.

A pawn must provide a valid promotion value when it reaches the opponent's extreme row.

## Player 1 Promotion

Player 1's pawn is represented by:

```text
1
```

It can be promoted to:

```text
2 → Knight
3 → Bishop
4 → Rook
5 → Queen
```

Example:

```js
board.playMove(oldRow, oldCol, newRow, newCol, 5);
```

The pawn becomes a Player 1 Queen.

If a Player 1 pawn reaches the final row without providing `changeChessman`, the engine throws:

```text
Error: changingChessman is not given
```

An invalid Player 1 promotion value throws an error such as:

```text
Error: changeChessman: 8 is invalid for player1
```

---

## Player 2 Promotion

Player 2's pawn is represented by:

```text
7
```

It can be promoted to:

```text
8  → Knight
9  → Bishop
10 → Rook
11 → Queen
```

Example:

```js
board.playMove(oldRow, oldCol, newRow, newCol, 11);
```

The pawn becomes a Player 2 Queen.

An invalid Player 2 promotion value throws an error such as:

```text
Error: changeChessman: 5 is invalid for player2
```

---

# Check Detection

## `board.check()`

Checks whether either player's king is currently in check.

```js
const [player1Check, player2Check] = board.check();

console.log(player1Check);
console.log(player2Check);
```

The method returns:

```js
[
    player1,
    player2
]
```

where:

```text
true  = King is in check
false = King is not in check
```

Therefore:

```js
[
    player1Check,
    player2Check
]
```

means:

* `player1Check` — whether Player 1's king is in check.
* `player2Check` — whether Player 2's king is in check.

### Example

```js
const [player1Check, player2Check] = board.check();

if (player1Check) {
    console.log("Player 1 is in check");
}

if (player2Check) {
    console.log("Player 2 is in check");
}
```

The check-detection logic evaluates attacks from:

* Pawns
* Knights
* Bishops
* Rooks
* Queens

For sliding pieces such as bishops, rooks, and queens, the engine traverses the path between the attacking piece and the king.

Conceptually:

```text
Attacking Piece
      ↓
Determine Direction
      ↓
Traverse Board
      ↓
Check Blocking Pieces
      ↓
Reach Enemy King?
      ↓
King in Check
```

---

# Legal Move Filtering

The engine prevents a chess piece from making a move that leaves its own king in check.

The internal `#filter_out()` method performs this validation.

For every generated move, the engine:

```text
Current Board
      ↓
Generate Possible Move
      ↓
Create Temporary Matrix
      ↓
Simulate Move
      ↓
Check King Safety
      ↓
Move Leaves King in Check?
      ↓
   Yes ───────→ Remove Move
      │
      No
      ↓
Keep Move
```

The temporary matrix is created using a copy of the current board:

```js
const matrix = this.boardData.matrix.map(row => [...row]);
```

This allows the engine to test a move without immediately modifying the actual board.

---

# Castling

Castling is supported for both players.

The constructor determines which rooks are eligible for castling:

```js
const board = new Board(player1Castle = ["l", "r"], player2Castle = ["l", "r"]);
```

The engine tracks eligible rook columns in:

```js
board.boardData.castle1
board.boardData.castle2
```

For example:

```js
[0, 7]
```

means that both edge rooks are currently available for castling.

### Supported Castling Sides

Player 1:

```js
new Board(["l"], ["l", "r"]);
```

Player 1 can castle using the left rook.

Player 2:

```js
new Board(["l", "r"], ["r"]);
```

Player 2 can castle using the right rook.

Both sides:

```js
new Board(["l", "r"], ["l", "r"]);
```

### King Movement

When a king performs a castling move by moving two columns toward the corresponding rook, the engine automatically moves the rook.

For right-side castling, operation performs:

```text
King:
old_col → old_col + 2

Rook:
edge_col → old_col + 1
```

For left-side castling, operation performs:

```text
King:
old_col → old_col - 2

Rook:
edge_col → old_col - 1
```

The engine also updates:

* King position
* Rook position
* Board matrix
* Castling state

Once a king moves, its castling state is cleared.

When an eligible rook moves, its corresponding castling option is removed.

---

# Traditional 8×8 Board

A traditional chess starting position can be represented using:

```js
const matrix = [
    [10, 8, 9, 11, 12, 9, 8, 10],
    [7, 7, 7, 7, 7, 7, 7, 7],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [4, 2, 3, 5, 6, 3, 2, 4]
];
```

Then create and fit the board:

```js
const board = new Board();

board.fit(matrix);
```

The matrix represents:

```text
0  = Empty
1  = Player 1 Pawn
2  = Player 1 Knight
3  = Player 1 Bishop
4  = Player 1 Rook
5  = Player 1 Queen
6  = Player 1 King
7  = Player 2 Pawn
8  = Player 2 Knight
9  = Player 2 Bishop
10 = Player 2 Rook
11 = Player 2 Queen
12 = Player 2 King
```

---

# Complete Example

```js
import Board from "./Board.js";

const matrix = [
    [10, 8, 9, 11, 12, 9, 8, 10],
    [7, 7, 7, 7, 7, 7, 7, 7],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [4, 2, 3, 5, 6, 3, 2, 4]
];

// Create board with both castling sides enabled
const board = new Board(player1Castle = ["l", "r"], player2Castle = ["l", "r"]);

// Fit the board matrix
board.fit(matrix);

// Inspect board data
console.log("Board Data:", board.boardData);

// Get legal moves
const moves = board.showMoves(6, 0);

console.log("Available moves:", moves);

// Check both kings
const [player1Check, player2Check] = board.check();

console.log("Player 1 in check:", player1Check);
console.log("Player 2 in check:", player2Check);

// Play a move
const moved = board.playMove(6, 0, 5, 0);

console.log("Move successful:", moved);
```

---

# Custom Board Example

The engine is not restricted to an 8×8 board.

For example:

```js
const board = new Board(player1Castle = ["l", "r"], player2Castle = ["l", "r"]);

board.fit([
    [0, 0, 0, 0, 0],
    [0, 1, 0, 7, 0],
    [0, 0, 6, 0, 12],
    [0, 0, 0, 0, 0]
]);
```

The board dimensions are determined from the supplied matrix.

The implementation uses:

```js
matrix.length
```

for the number of rows and:

```js
matrix[0].length
```

for the number of columns.

This allows the engine to work with non-standard board dimensions.

---

# Architecture

The `Board` class extends `MatrixOperation`.

Conceptually:

```text
                    Board
                      │
                      ▼
              MatrixOperation
                      │
          ┌───────────┴───────────┐
          │                       │
          ▼                       ▼
 PlayerChessman_1         PlayerChessman_2
          │                       │
          └───────────┬───────────┘
                      ▼
                Move Generation
                      │
                      ▼
              Legal Move Filter
                      │
                      ▼
                 Board State
```

The `MatrixOperation` class is responsible for:

* Matrix validation
* Board-data initialization
* Row/column dimension tracking

The `Board` class is responsible for:

* Board creation
* Castling configuration
* Fitting the matrix
* Move generation
* Legal move filtering
* Executing moves
* Capturing
* Pawn promotion
* Castling
* Check detection

The chessman classes are responsible for generating piece-specific movement possibilities.

---

# Supported Chess Rules

| Rule                    | Supported |
| ----------------------- | --------- |
| Pawn movement           | ✅         |
| Knight movement         | ✅         |
| Bishop movement         | ✅         |
| Rook movement           | ✅         |
| Queen movement          | ✅         |
| King movement           | ✅         |
| Capturing               | ✅         |
| Check detection         | ✅         |
| Legal move filtering    | ✅         |
| Pawn promotion          | ✅         |
| Castling                | ✅         |
| Custom board dimensions | ✅         |

---

# Error Handling

The engine validates board configuration, matrix structure, moves, and pawn promotion.

## Invalid Castling Configuration

Examples:

```js
new Board("l", ["l", "r"]);
```

```js
new Board(["x"], ["l", "r"]);
```

```js
new Board(["l", "l"], ["l", "r"]);
```

These result in validation errors.

---

## Invalid Matrix

Examples of invalid matrices include:

```js
[1, 2, 3]
```

or:

```js
[
    [1, 2],
    [3]
]
```

or:

```js
[
    [1, [2]],
    [3, 4]
]
```

The engine throws an error when the matrix does not satisfy the required structure.

---

## Invalid Move

If a destination is not a legal move for the selected chess piece:

```text
Error: Not a next valid move
```

---

## Missing Promotion

If a pawn reaches the promotion row without providing a promotion value:

```text
Error: changingChessman is not given
```

---

## Player 1 Promotion

Player 1 promotion values must be:

```text
2, 3, 4, 5
```

Otherwise an error is thrown.

---

## Player 2 Promotion

Player 2 promotion values must be:

```text
8, 9, 10, 11
```

Otherwise an error is thrown.

---

# Development

Clone the repository:

```bash
git clone https://github.com/DJ-Deb/Chess-Sketch-Box-Engine
```

Enter the project:

```bash
cd Chess-Sketch-Box-Engine
```

Install dependencies:

```bash
npm install
```

Run the available development or test commands according to the project's `package.json`.

---

# Project Status

This project is focused on building a reusable JavaScript chess-board and move-validation engine with support for customizable board dimensions.

The current implementation provides:

* Custom board dimensions
* Matrix validation
* Chess piece movement
* Legal move filtering
* Check detection
* Capturing
* Pawn promotion
* Castling
* Player piece tracking
* King position tracking
* Castling-state tracking

The engine is designed so that the board matrix can be supplied independently from the board configuration.

---

# License

Copyright (c) 2026 Dhrubajyoti Deb

This project is licensed under the MIT License.

See the [LICENSE](LICENSE) file for the complete license text.

---

# Author

**Dhrubajyoti Deb**

---

# ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.
