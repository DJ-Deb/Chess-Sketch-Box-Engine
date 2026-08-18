import { chessmen } from "./js/chess-info.js"
import { PlayerChessman_1, PlayerChessman_2 } from "./js/chessman.js"

class MatrixOperation {
    /**
     * **Get the board data**
     * --------------------
     * 
     * The board data is divided as:
     * ```
     * boardData = {
            "matrix": matrix,
            "player1": player1,
            "player2": player2
        }
     * ``` 
     * 
     * ---
     * 
     * **Chessboard Data** (above)
     * ----------
     * - `metrix` is the metrix
     * - `player1` is the first-PLAYER chessmen `[value, [pos_row, pos_col]]`
     * - `player2` is the second-PLAYER chessmen `[value, [pos_row, pos_col]]`
     */
    boardData = undefined
    rowlen = undefined
    collen = undefined

    // check matrix is valid 2D array
    _checkDimention(matrix) {
        // 1. Must be an array
        if (!Array.isArray(matrix)) {
            throw new Error("Matrix must be an array")
        }

        // 2. Must not be 1D (should be array of arrays)
        if (matrix.length <= 1) {
            throw new Error("Matrix must have more than 1 row (n > 1)")
        }

        // 3. Must not be 3D array or mixed
        for (const row of matrix) {
            if (!Array.isArray(row)) {
                throw new Error("Matrix must be 2D (array of arrays). Not a 1D or invalid format")
            }

            // Check row is NOT an array of arrays (to avoid 3D)
            for (const cell of row) {
                if (Array.isArray(cell)) {
                    throw new Error("Matrix must NOT be more than 2D (3D array found)")
                }
            }
        }

        if (matrix[0].length <= 1) {
            throw new Error("Matrix must have more than 1 column (m > 1)")
        }

        // 4. Ensure all rows have equal columns
        for (const row of matrix) {
            if (row.length !== matrix[0].length) {
                throw new Error("All rows must have the same number of columns")
            }
        }

        return true
    }

    // check numbers inside the matrix
    _checkMatrix(matrix) {
        const allowedNumbers = new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])

        function checkArray(arr) {
            for (const item of arr) {
                if (Array.isArray(item)) {
                    // Recursively check nested arrays
                    checkArray(item)
                } else {
                    if (typeof item !== "number" || !allowedNumbers.has(item)) {
                        throw new Error(
                            "Given matrix contains number out of the pre-set\n" +
                            "\tThe pre-set: {0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12}\n" +
                            "Set, the matrix which should not contain any number out of the pre-set"
                        )
                    }
                }
            }
            return true
        }

        return checkArray(matrix)
    }

    // initiate the chess board data
    _initiateBoardData(matrix) {
        const [player1, player2, king1, king2, castle_player1, castle_player2] = chessmen(matrix)
        this.boardData = {
            "matrix": matrix,
            "player1": player1,
            "player2": player2,
            "king1": king1,
            "king2": king2,
            "castle1": castle_player1,
            "castle2": castle_player2
        }
        this.rowlen = matrix.length
        this.collen = matrix[0].length
    }
}

export default class Board extends MatrixOperation {
    /**
    * **Start your custom chess board**
    * ---------------------------------
    * 
    * **Here**: The matrix is a **n × m** matrix  
    * - **n** (columns) > 1  
    * - **m** (rows) > 1 
    * 
    * ---
    *
    * @param {number[][]} matrix
    * ```
    * [
    *   [A00, A01, ..., A0n],
    *   [A10, A11, ..., A1n],
    *   [..., ..., ..., ...],
    *   [Am0, Am1, ..., Amn]
    * ]
    * ```
    *
    * **Number in the matrix values**:
    * 
    * - **0** - Empty box or no chessman
    * ```Player1```
    * - **1** - Player1 Pawn
    * - **2** - Player1 Knight
    * - **3** - Player1 Bishop
    * - **4** - Player1 Rook
    * - **5** - Player1 Queen
    * - **6** - Player1 King
    * ```Player2```
    * - **7** - Player2 Pawn
    * - **8** - Player2 Knight
    * - **9** - Player2 Bishop
    * - **10** - Player2 Rook
    * - **11** - Player2 Queen
    * - **12** - Player2 King
    *  
    * ---
    * 
    * **Steps it follows**
    * --------------
    * - Check matrix is valid 2D array
    * - Check numbers inside the matrix ```[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]```
    * - Initiate the chess ```boardData```
    * 
    * ---
    * 
    * **How to use ?**
    * --------------
    * - **Step1**: create object(obj) = new Board(```matrix```, ```playerColor```)
    * - **Step2**: Then use its variables and methods - `obj`.```boardData```, `obj`.```showMoves(row, col)``` and `obj`.```playeMoves(old_row, old_col, new_row, new_col, changeChessman)```
    */
    constructor(matrix) {
        super()
        this._checkDimention(matrix)
        this._checkMatrix(matrix)
        this._initiateBoardData(matrix)
        // startPrediction()
    }

    /**
     * **Show the moves possible**
     * -------------------------
     * - Calculate the number of moves possible by the desired **chessman** of the current chessboard.
     * - The chessman is ```matrix[row][col]```
     * 
     * @param {number} row
     * This is the chessman ```row``` postion
     * 
     * -
     * @param {number} col
     * This is the chessman ```col``` postion
     * 
     * -
     * 
     * --- 
     * 
     * These are the number of moves the desired chessman can move.
     * @returns {number[][]} 
     * ```
     * [[new_row_1, new_col_1], [new_row2, new_col_2], ..., [new_row_n, new_col_n]]
     * ```
     * If there is no move possible it will return
     * ```
     * [null]
     * ```  
    */
    showMoves(row, col) {
        let list
        if (this.boardData.matrix[row][col] <= 6 && this.boardData.matrix[row][col] > 0) {
            list = [...new PlayerChessman_1(this.boardData, [row, col], this.rowlen, this.collen)]
        } else if (this.boardData.matrix[row][col] <= 12 && this.boardData.matrix[row][col] > 6) {
            list = [...new PlayerChessman_2(this.boardData, [row, col], this.rowlen, this.collen)]
        }
        return list.map((new_pos) => this.#filter_out([row, col], new_pos)).filter(node => node != null)
    }

    /**
     * **Play the chessman move**
     * -------------------------
     * - Check whether the desired **chessman** can move in the current chessboard.
     * - Move the **chessman** to the new position:
     *   `matrix[new_row][new_col]`
     * - Change the chessman value if it is a pawn (`1` or `7`) that reaches
     *   the opponent's extreme row.
     *
     * @param {number} old_row
     * The current row position of the chessman.
     *
     * @param {number} old_col
     * The current column position of the chessman.
     *
     * @param {number} new_row
     * The destination row position.
     *
     * @param {number} new_col
     * The destination column position.
     *
     * @param {number} [changeChessman=-1]
     * The chessman value to promote the pawn to when it reaches the opponent's
     * extreme row.
     *
     * **Player 1 pawn (`1`)**
     * ```
     * changeChessman = 2 | 3 | 4 | 5
     * ```
     *
     * **Player 2 pawn (`7`)**
     * ```
     * changeChessman = 8 | 9 | 10 | 11
     * ```
     *
     * @returns {boolean}
     * `true` - The chessman has successfully moved.
     *
     * `false` - The chessman has not be moved
     *
     * 
     * @throws {Error}
     * Throws an error if:
     * - The chessman donot have valid next move.
     * - A pawn reaches the promotion row without a valid `changeChessman`.
     * - An invalid `changeChessman` value is provided.
     */
    playMove(old_row, old_col, new_row, new_col, changeChessman = -1) {
        const list = this.showMoves(old_row, old_col)

        // throws error when the chessman is 0 or donot have any moves
        if (list.length === 0) {
            return false
        } else {
            // check the chessman have valid moves
            if (list.some(([row, col]) => row === new_row && col === new_col)) {
                let matrix = this.boardData.matrix

                // check change chessman validation
                if (changeChessman === -1 && (matrix[old_row][old_col] === 1 || matrix[old_row][old_col] === 7) && (new_row === this.rowlen - 1 || new_row === 0)) {
                    throw new Error(`changingChessman is not given`)
                }

                // change the player1 and player2 placement
                if (matrix[old_row][old_col] <= 6) {
                    const player1 = this.boardData.player1
                    const index = player1.findIndex(([[row, col], owner]) => row === old_row && col === old_col && owner === matrix[old_row][old_col])

                    // check the change chessman validation
                    if ((changeChessman > 5 || changeChessman < 2) && (matrix[old_row][old_col] === 1) && (new_row == this.rowlen - 1)) {
                        throw new Error(`changeChessman: ${changeChessman} is invalid for player1`)
                    }

                    // check the move will change or not if change then update the player1 list in chess.this.json
                    if (matrix[old_row][old_col] === 1 && new_row === this.rowlen - 1) {
                        player1[index] = [[new_row, new_col], changeChessman]
                    } else {
                        player1[index] = [[new_row, new_col], matrix[old_row][old_col]]
                        if (matrix[old_row][old_col] === 6) {
                            this.boardData.king1 = [new_row, new_col]
                            this.boardData.castle1 = []
                            if (old_col + 2 === new_col) {
                                const rook_index = player1.findIndex(([[row, col], owner]) => row === old_row && col === this.collen - 1 && owner === 4)
                                player1[rook_index] = [[old_row, old_col + 1], 4]
                                matrix[old_row][old_col + 1] = 4
                                matrix[old_row][this.collen - 1] = 0
                            } else if (old_col - 2 === new_col) {
                                const rook_index = player1.findIndex(([[row, col], owner]) => row === old_row && col === 0 && owner === 4)
                                player1[rook_index] = [[old_row, old_col - 1], 4]
                                matrix[old_row][old_col - 1] = 4
                                matrix[old_row][0] = 0
                            }
                        } else if (matrix[old_row][old_col] === 4 && this.boardData.castle2.length !== 0) {
                            const rook_col_index = this.boardData.castle1.findIndex((col) => col === old_col)
                            if (rook_col_index !== -1) {
                                this.boardData.castle1.splice(rook_col_index, 1)
                            }
                        }
                    }
                } else if (matrix[old_row][old_col] >= 7) {
                    const player2 = this.boardData.player2
                    const index = player2.findIndex(([[row, col], owner]) => row === old_row && col === old_col && owner === matrix[old_row][old_col])

                    // check the change chessman validation
                    if ((changeChessman > 11 || changeChessman < 8) && (matrix[old_row][old_col] === 7) && (new_row == 0)) {
                        throw new Error(`changeChessman: ${changeChessman} is invalid for player2`)
                    }

                    // check the move will change or not if change then update the player2 list in chess.this.json
                    if (matrix[old_row][old_col] === 7 && new_row === 0) {
                        player2[index] = [[new_row, new_col], changeChessman]
                    } else {
                        player2[index] = [[new_row, new_col], matrix[old_row][old_col]]
                        if (matrix[old_row][old_col] === 12) {
                            this.boardData.king2 = [new_row, new_col]
                            this.boardData.castle2 = []
                            if (old_col + 2 === new_col) {
                                const rook_index = player2.findIndex(([[row, col], owner]) => row === old_row && col === this.collen - 1 && owner === 10)
                                player2[rook_index] = [[old_row, old_col + 1], 10]
                                matrix[old_row][old_col + 1] = 10
                                matrix[old_row][this.collen - 1] = 0
                            } else if (old_col - 2 === new_col) {
                                const rook_index = player2.findIndex(([[row, col], owner]) => row === old_row && col === 0 && owner === 10)
                                player2[rook_index] = [[old_row, old_col - 1], 10]
                                matrix[old_row][old_col - 1] = 10
                                matrix[old_row][0] = 0
                            }
                        } else if (matrix[old_row][old_col] === 10 && this.boardData.castle2.length !== 0) {
                            const rook_col_index = this.boardData.castle2.findIndex((col) => col === old_col)
                            if (rook_col_index !== -1) {
                                this.boardData.castle2.splice(rook_col_index, 1)
                            }
                        }
                    }
                }

                // if any chessman kills the opponent's chessman then delete the killed chessman from the opponent's list in chess.this.json
                if ((matrix[new_row][new_col] <= 6) && (matrix[new_row][new_col] !== 0)) {
                    let player1 = this.boardData.player1
                    let index = player1.findIndex(([[row, col], owner]) => row === new_row && col === new_col && owner === matrix[new_row][new_col])
                    player1.splice(index, 1)
                } else if ((matrix[new_row][new_col] >= 7) && (matrix[new_row][new_col] !== 0)) {
                    let player2 = this.boardData.player2
                    let index = player2.findIndex(([[row, col], owner]) => row === new_row && col === new_col && owner === matrix[new_row][new_col])
                    player2.splice(index, 1)
                }

                // it changes the player1 and player2 pawn
                if (matrix[old_row][old_col] === 1 && new_row === this.rowlen - 1) {
                    matrix[new_row][new_col] = changeChessman
                    matrix[old_row][old_col] = 0
                } else if (matrix[old_row][old_col] === 7 && new_row === 0) {
                    matrix[new_row][new_col] = changeChessman
                    matrix[old_row][old_col] = 0
                } else {
                    matrix[new_row][new_col] = matrix[old_row][old_col]
                    matrix[old_row][old_col] = 0
                }
            } else {
                throw new Error(`Not a next valid move`)
            }
            return true
        }
    }

    /**
     * **Look after the check**
     * --------------------
     * 
     * This checks that the king of either side is having any check or not.
     * 
     * @returns {boolean[]} 
     * ```
     * [player1, player2]
     * ```
     * 
     */
    check() {
        let player1 = false
        let player2 = false
        let matrix = this.boardData.matrix

        {   // look after the check of the player1
            let encounter = 0
            const [kr, kc] = this.boardData.king1
            for (const x of this.boardData.player2) {
                if (x[1] === 12) {
                    continue
                }
                const [r, c] = x[0]
                let steps = []
                const piece = matrix[r][c]
                // look after check by each pieces or calculate the path of check  
                if (piece === 7) {
                    if (r - 1 === kr && c - 1 === kc) {
                        player1 = true
                        break
                    } else if (r - 1 === kr && c + 1 === kc) {
                        player1 = true
                        break
                    }
                } else if (piece === 8) {
                    if (
                        (r - 1 === kr && c - 2 === kc) ||
                        (r - 1 === kr && c + 2 === kc) ||
                        (r + 1 === kr && c - 2 === kc) ||
                        (r + 1 === kr && c + 2 === kc) ||
                        (r - 2 === kr && c - 1 === kc) ||
                        (r - 2 === kr && c + 1 === kc) ||
                        (r + 2 === kr && c - 1 === kc) ||
                        (r + 2 === kr && c + 1 === kc)
                    ) {
                        player1 = true
                        break
                    }
                } else if (piece === 9) {
                    if (kr - r === kc - c && kr - r > 0) {
                        steps = [1, 1]
                    } else if (r - kr === kc - c && r - kr > 0) {
                        steps = [-1, 1]
                    } else if (kr - r === c - kc && kr - r > 0) {
                        steps = [1, -1]
                    } else if (r - kr === c - kc && r - kr > 0) {
                        steps = [-1, -1]
                    }
                } else if (piece === 10) {
                    if (r === kr && c < kc) {
                        steps = [0, 1]
                    } else if (r === kr && c > kc) {
                        steps = [0, -1]
                    } else if (r < kr && c === kc) {
                        steps = [1, 0]
                    } else if (r > kr && c === kc) {
                        steps = [-1, 0]
                    }
                } else if (piece === 11) {
                    if (kr - r === kc - c && kr - r > 0) {
                        steps = [1, 1]
                    } else if (r - kr === kc - c && r - kr > 0) {
                        steps = [-1, 1]
                    } else if (kr - r === c - kc && kr - r > 0) {
                        steps = [1, -1]
                    } else if (r - kr === c - kc && r - kr > 0) {
                        steps = [-1, -1]
                    } else if (r === kr && c < kc) {
                        steps = [0, 1]
                    } else if (r === kr && c > kc) {
                        steps = [0, -1]
                    } else if (r < kr && c === kc) {
                        steps = [1, 0]
                    } else if (r > kr && c === kc) {
                        steps = [-1, 0]
                    }
                }
                // Sliding pieces: Bishop, Rook, Queen
                if (steps.length === 2) {
                    let row = r + steps[0]
                    let col = c + steps[1]
                    while (row >= 0 && row < this.rowlen && col >= 0 && col < this.collen) {
                        if (matrix[row][col] === 0) {
                            row += steps[0]
                            col += steps[1]
                        } else if (matrix[row][col] === 6) {
                            encounter++
                            break
                        } else {
                            break
                        }
                    }
                }
                if (encounter === 1) {
                    player1 = true
                    break
                }
            }
        }
        {   // look after the check of the player2
            let encounter = 0
            const [kr, kc] = this.boardData.king2
            for (const x of this.boardData.player1) {
                if (x[1] === 6) {
                    continue
                }
                const [r, c] = x[0]
                let steps = []
                const piece = matrix[r][c]
                // look after check by each pieces or calculate the path of check
                if (piece === 1) {
                    if (r + 1 === kr && c - 1 === kc) {
                        player2 = true
                        break
                    } else if (r + 1 === kr && c + 1 === kc) {
                        player2 = true
                        break
                    }
                } else if (piece === 2) {
                    if (
                        (r - 1 === kr && c - 2 === kc) ||
                        (r - 1 === kr && c + 2 === kc) ||
                        (r + 1 === kr && c - 2 === kc) ||
                        (r + 1 === kr && c + 2 === kc) ||
                        (r - 2 === kr && c - 1 === kc) ||
                        (r - 2 === kr && c + 1 === kc) ||
                        (r + 2 === kr && c - 1 === kc) ||
                        (r + 2 === kr && c + 1 === kc)
                    ) {
                        player2 = true
                        break
                    }
                } else if (piece === 3) {
                    if (kr - r === kc - c && kr - r > 0) {
                        steps = [1, 1]
                    } else if (r - kr === kc - c && r - kr > 0) {
                        steps = [-1, 1]
                    } else if (kr - r === c - kc && kr - r > 0) {
                        steps = [1, -1]
                    } else if (r - kr === c - kc && r - kr > 0) {
                        steps = [-1, -1]
                    }
                } else if (piece === 4) {
                    if (r === kr && c < kc) {
                        steps = [0, 1]
                    } else if (r === kr && c > kc) {
                        steps = [0, -1]
                    } else if (r < kr && c === kc) {
                        steps = [1, 0]
                    } else if (r > kr && c === kc) {
                        steps = [-1, 0]
                    }
                } else if (piece === 5) {
                    if (kr - r === kc - c && kr - r > 0) {
                        steps = [1, 1]
                    } else if (r - kr === kc - c && r - kr > 0) {
                        steps = [-1, 1]
                    } else if (kr - r === c - kc && kr - r > 0) {
                        steps = [1, -1]
                    } else if (r - kr === c - kc && r - kr > 0) {
                        steps = [-1, -1]
                    } else if (r === kr && c < kc) {
                        steps = [0, 1]
                    } else if (r === kr && c > kc) {
                        steps = [0, -1]
                    } else if (r < kr && c === kc) {
                        steps = [1, 0]
                    } else if (r > kr && c === kc) {
                        steps = [-1, 0]
                    }
                }
                // Sliding pieces: Bishop, Rook, Queen
                if (steps.length === 2) {
                    let row = r + steps[0]
                    let col = c + steps[1]
                    while (row >= 0 && row < this.rowlen && col >= 0 && col < this.collen) {
                        if (matrix[row][col] === 0) {
                            row += steps[0]
                            col += steps[1]
                        } else if (matrix[row][col] === 12) {
                            encounter++
                            break
                        } else {
                            break
                        }
                    }
                }
                if (encounter === 1) {
                    player2 = true
                    break
                }
            }
        }
        return [player1, player2]
    }

    // filter_out the moves which may cause check in future
    #filter_out(old_pos, new_pos) {
        const [old_row, old_col] = old_pos
        const [new_row, new_col] = new_pos

        // first change the piece position
        let matrix = this.boardData.matrix.map(row => [...row])
        const piece = matrix[old_row][old_col]
        matrix[new_row][new_col] = piece
        matrix[old_row][old_col] = 0

        if (piece >= 1 && piece <= 5) {
            const [kr, kc] = this.boardData.king1
            let check = false
            for (const x of this.boardData.player2) {
                if (x[1] === 12) {
                    continue
                }
                const [r, c] = x[0]
                let steps = []
                const enemy = matrix[r][c]
                // look after check by each pieces or calculate the path of check  
                if (enemy === 7) {
                    if (r - 1 === kr && c - 1 === kc) {
                        check = true
                        break
                    } else if (r - 1 === kr && c + 1 === kc) {
                        check = true
                        break
                    }
                } else if (enemy === 8) {
                    if ((r - 1 === kr && c - 2 === kc) || (r - 1 === kr && c + 2 === kc) || (r + 1 === kr && c - 2 === kc) || (r + 1 === kr && c + 2 === kc) || (r - 2 === kr && c - 1 === kc) || (r - 2 === kr && c + 1 === kc) || (r + 2 === kr && c - 1 === kc) || (r + 2 === kr && c + 1 === kc)) {
                        check = true
                        break
                    }
                } else if (enemy === 9) {
                    if (kr - r === kc - c && kr - r > 0) {
                        steps = [1, 1]
                    } else if (r - kr === kc - c && r - kr > 0) {
                        steps = [-1, 1]
                    } else if (kr - r === c - kc && kr - r > 0) {
                        steps = [1, -1]
                    } else if (r - kr === c - kc && r - kr > 0) {
                        steps = [-1, -1]
                    }
                } else if (enemy === 10) {
                    if (r === kr && c < kc) {
                        steps = [0, 1]
                    } else if (r === kr && c > kc) {
                        steps = [0, -1]
                    } else if (r < kr && c === kc) {
                        steps = [1, 0]
                    } else if (r > kr && c === kc) {
                        steps = [-1, 0]
                    }
                } else if (enemy === 11) {
                    if (kr - r === kc - c && kr - r > 0) {
                        steps = [1, 1]
                    } else if (r - kr === kc - c && r - kr > 0) {
                        steps = [-1, 1]
                    } else if (kr - r === c - kc && kr - r > 0) {
                        steps = [1, -1]
                    } else if (r - kr === c - kc && r - kr > 0) {
                        steps = [-1, -1]
                    } else if (r === kr && c < kc) {
                        steps = [0, 1]
                    } else if (r === kr && c > kc) {
                        steps = [0, -1]
                    } else if (r < kr && c === kc) {
                        steps = [1, 0]
                    } else if (r > kr && c === kc) {
                        steps = [-1, 0]
                    }
                }
                // Sliding pieces: Bishop, Rook, Queen
                if (steps.length === 2) {
                    let row = r + steps[0]
                    let col = c + steps[1]
                    while (row >= 0 && row < this.rowlen && col >= 0 && col < this.collen) {
                        if (matrix[row][col] === 0) {
                            row += steps[0]
                            col += steps[1]
                        } else if (matrix[row][col] === 6) {
                            check = true
                            break
                        } else {
                            break
                        }
                    }
                }
                if (check) {
                    break
                }
            }
            if (!check) {
                return new_pos
            }
        } else if (piece >= 7 && piece <= 11) {
            const [kr, kc] = this.boardData.king2
            let check = false
            for (const x of this.boardData.player1) {
                if (x[1] === 6) {
                    continue
                }
                const [r, c] = x[0]
                let steps = []
                const enemy = matrix[r][c]
                // look after check by each pieces or calculate the path of check  
                if (enemy === 1) {
                    if (r + 1 === kr && c - 1 === kc) {
                        check = true
                        break
                    } else if (r + 1 === kr && c + 1 === kc) {
                        check = true
                        break
                    }
                } else if (enemy === 2) {
                    if ((r - 1 === kr && c - 2 === kc) || (r - 1 === kr && c + 2 === kc) || (r + 1 === kr && c - 2 === kc) || (r + 1 === kr && c + 2 === kc) || (r - 2 === kr && c - 1 === kc) || (r - 2 === kr && c + 1 === kc) || (r + 2 === kr && c - 1 === kc) || (r + 2 === kr && c + 1 === kc)) {
                        check = true
                        break
                    }
                } else if (enemy === 3) {
                    if (kr - r === kc - c && kr - r > 0) {
                        steps = [1, 1]
                    } else if (r - kr === kc - c && r - kr > 0) {
                        steps = [-1, 1]
                    } else if (kr - r === c - kc && kr - r > 0) {
                        steps = [1, -1]
                    } else if (r - kr === c - kc && r - kr > 0) {
                        steps = [-1, -1]
                    }
                } else if (enemy === 4) {
                    if (r === kr && c < kc) {
                        steps = [0, 1]
                    } else if (r === kr && c > kc) {
                        steps = [0, -1]
                    } else if (r < kr && c === kc) {
                        steps = [1, 0]
                    } else if (r > kr && c === kc) {
                        steps = [-1, 0]
                    }
                } else if (enemy === 5) {
                    if (kr - r === kc - c && kr - r > 0) {
                        steps = [1, 1]
                    } else if (r - kr === kc - c && r - kr > 0) {
                        steps = [-1, 1]
                    } else if (kr - r === c - kc && kr - r > 0) {
                        steps = [1, -1]
                    } else if (r - kr === c - kc && r - kr > 0) {
                        steps = [-1, -1]
                    } else if (r === kr && c < kc) {
                        steps = [0, 1]
                    } else if (r === kr && c > kc) {
                        steps = [0, -1]
                    } else if (r < kr && c === kc) {
                        steps = [1, 0]
                    } else if (r > kr && c === kc) {
                        steps = [-1, 0]
                    }
                }
                // Sliding pieces: Bishop, Rook, Queen
                if (steps.length === 2) {
                    let row = r + steps[0]
                    let col = c + steps[1]
                    while (row >= 0 && row < this.rowlen && col >= 0 && col < this.collen) {
                        if (matrix[row][col] === 0) {
                            row += steps[0]
                            col += steps[1]
                        } else if (matrix[row][col] === 12) {
                            check = true
                            break
                        } else {
                            break
                        }
                    }
                }
                if (check) {
                    break
                }
            }
            if (!check) {
                return new_pos
            }
        } else if (piece === 6 || piece === 12) {
            return new_pos
        }
    }
}
