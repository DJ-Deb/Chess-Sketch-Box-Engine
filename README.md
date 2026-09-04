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

### 📦 NPM Package: https://www.npmjs.com/package/chess-sketch-box-engine

The package is available on NPM. You can install it and use it directly in your JavaScript or Node.js project.

---

## Installation

If this project is published as an npm package:

```bash
npm i chess-sketch-box-engine
```

If you are using it directly from the repository:

```bash
git clone https://github.com/DJ-Deb/Chess-Sketch-Box-Engine
cd Chess-Sketch-Box-Engine
npm install
```

---

## Features

### Custom Board Size

The board is represented as an `n × m` matrix, allowing boards with different numbers of rows and columns.

```js
const matrix = [
    [0, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 7, 0],
    [0, 0, 0, 0]
];

const board = new Board(matrix);
```

The implementation validates the board dimensions before initializing the board data.

---

## Piece Representation

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

The complete mapping is defined directly in the `Board` implementation.

---

## Basic Usage

Import the `Board` class:

```js
import Board from "./Board.js";
```

Create a board using a 2D matrix:

```js
const matrix = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [7, 7, 7, 7, 7, 7, 7, 7],
    [10, 8, 9, 11, 12, 9, 8, 10]
];

const board = new Board(matrix);
```

The constructor validates the matrix and initializes `boardData`.

---

# API

## `new Board(matrix)`

Creates a new chess board.

```js
const board = new Board(matrix);
```

### Parameters

| Parameter | Type         | Description                            |
| --------- | ------------ | -------------------------------------- |
| `matrix`  | `number[][]` | 2D matrix representing the chess board |

The matrix must contain valid chess-piece values from `0` through `12`.

---

## `board.boardData`

Contains the internal state of the chess board.

The implementation uses this data to track things such as:

* Board matrix
* Player 1 pieces
* Player 2 pieces
* Player 1 king
* Player 2 king
* Castling information

You can access it with:

```js
console.log(board.boardData);
```

---

# `showMoves(row, col)`

Returns the legal moves available for the chess piece at the specified position.

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

The method first determines which player's piece occupies the position, generates possible moves, and then filters moves that would result in the player's king being in check.

If there are no legal moves, the resulting list is empty after filtering.

---

# `playMove()`

Moves a chess piece from one position to another.

```js
board.playMove(
    oldRow,
    oldCol,
    newRow,
    newCol
);
```

Example:

```js
const success = board.playMove(
    6,
    0,
    5,
    0
);

console.log(success);
```

Returns:

```js
true
```

when the move is successfully performed.

The method validates that the destination is a legal move before changing the board.

---

## Pawn Promotion

Pawn promotion is supported through the `changeChessman` parameter.

### Player 1

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
board.playMove(
    oldRow,
    oldCol,
    newRow,
    newCol,
    5
);
```

This promotes the pawn to a Queen.

### Player 2

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

## The implementation validates promotion values and throws an error when an invalid value is supplied.

# `check()`

Checks whether either player's king is currently under attack.

```js
const [player1Check, player2Check] = board.check();

console.log(player1Check);
console.log(player2Check);
```

The return value is:

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

The engine checks attacks from:

* Pawns
* Knights
* Bishops
* Rooks
* Queens

## and uses path traversal for sliding pieces.

# Legal Move Filtering

The engine prevents moves that would leave the moving player's king in check.

Internally, the board creates a temporary copy of the matrix, performs the hypothetical move, and checks whether the king becomes attacked.

```text
Current Board
      ↓
Generate Possible Moves
      ↓
Simulate Move
      ↓
Check King Safety
      ↓
Remove Illegal Move
      ↓
Return Legal Moves
```

This filtering is performed by the internal `#filter_out()` method.

---

# Capturing Pieces

When a piece moves onto a square occupied by an opponent's piece, the captured piece is removed from the corresponding player's piece list.

For example:

```text
Player 1 piece
      ↓
moves onto
      ↓
Player 2 piece
      ↓
Player 2 piece is captured
```

The implementation handles captures for both players.

---

# Castling

Castling is supported for both players.

The engine handles:

* King-side castling
* Queen-side castling
* King position updates
* Rook position updates
* Castling-state updates

## When a king moves two columns toward a rook, the corresponding rook is moved automatically.

# Board Representation

A traditional starting position can be represented using the numeric matrix:

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

Where:

```text
0  = Empty
1  = P1 Pawn
2  = P1 Knight
3  = P1 Bishop
4  = P1 Rook
5  = P1 Queen
6  = P1 King

7  = P2 Pawn
8  = P2 Knight
9  = P2 Bishop
10 = P2 Rook
11 = P2 Queen
12 = P2 King
```

---

# Example

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

const board = new Board(matrix);

// Get legal moves
const moves = board.showMoves(6, 0);

console.log("Available moves:", moves);

// Check the board
const [player1Check, player2Check] = board.check();

console.log("Player 1 in check:", player1Check);
console.log("Player 2 in check:", player2Check);

// Play a move
const moved = board.playMove(6, 0, 5, 0);

console.log("Move successful:", moved);
```

---

# Architecture

The `Board` class extends `MatrixOperation` and uses separate chessman/move-generation classes to calculate possible moves.
Conceptually:

```text
                 Board
                   │
                   ▼
           MatrixOperation
                   │
          ┌────────┴────────┐
          │                 │
          ▼                 ▼
 PlayerChessman_1     PlayerChessman_2
          │                 │
          └────────┬────────┘
                   ▼
             Move Generation
                   │
                   ▼
             Legal Move Filter
                   │
                   ▼
              Board State
```

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

# Custom Board Support

One of the main goals of this engine is to avoid hard-coding the board to an 8×8 layout.

The implementation uses the board's row and column lengths when calculating movement boundaries, making it possible to work with different board dimensions.

For example:

```js
const board = new Board([
    [0, 0, 0, 0, 0],
    [0, 1, 0, 7, 0],
    [0, 0, 6, 0, 12],
    [0, 0, 0, 0, 0]
]);
```

This allows experimentation with non-standard chess boards and board-based game engines.

---

# Error Handling

The engine throws errors when invalid operations are attempted.

Examples include:

### Invalid Move

```text
Error: Not a next valid move
```

### Missing Promotion

```text
Error: changingChessman is not given
```

### Invalid Player 1 Promotion

```text
Error: changeChessman is invalid for player1
```

### Invalid Player 2 Promotion

```text
Error: changeChessman is invalid for player2
```

The move API documents these validation conditions explicitly.

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

Run the project's available development/test command according to its package configuration.

---

# Project Status

This project is focused on building a reusable JavaScript chess-board and move-validation engine with support for customizable board dimensions.

The current implementation contains the core board-management and chess-rule functionality, including move generation, check detection, legal-move filtering, promotion, capturing, and castling.

---

# Contributing

Contributions are welcome.

If you would like to contribute:

1. Fork the repository.
2. Create a new branch.

```bash
git checkout -b feature/my-feature
```

3. Make your changes.
4. Test your changes.
5. Commit your changes.

```bash
git commit -m "Add my feature"
```

6. Push the branch.

```bash
git push origin feature/my-feature
```

7. Open a Pull Request.

---

## License

Copyright (c) 2026 Dhrubajyoti Deb

This project is licensed under the MIT License.

See the [LICENSE](LICENSE) file for the complete license text.

---

## Author

**Dhrubajyoti Deb**

---

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.
