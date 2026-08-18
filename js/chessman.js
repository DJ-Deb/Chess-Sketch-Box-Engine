class Board {
    // the path by which check is being possible
    _check_path = {}
    rowlen = 0
    collen = 0
    matrix = []

    // check the chessman can move or not
    _canMove(pos) {
        const [row, col] = pos
        const inBounds = (r, c) =>
            r >= 0 && r < this.rowlen && c >= 0 && c < this.collen
        const matrix = this.matrix
        const val = matrix[row][col]
        if (val === 1) {
            if (inBounds(row + 1, col - 1) && matrix[row + 1][col - 1] > 6) return true
            if (inBounds(row + 1, col + 1) && matrix[row + 1][col + 1] > 6) return true
            if (inBounds(row + 1, col) && matrix[row + 1][col] === 0) return true
            return false
        } else if (val === 2) {
            const moves = [
                [row - 2, col + 1], [row - 1, col + 2],
                [row + 1, col + 2], [row + 2, col + 1],
                [row + 2, col - 1], [row + 1, col - 2],
                [row - 1, col - 2], [row - 2, col - 1]
            ]
            return moves.some(([r, c]) =>
                inBounds(r, c) && (matrix[r][c] > 6 || matrix[r][c] === 0)
            )
        } else if (val === 3) {
            const moves = [
                [row - 1, col + 1], [row + 1, col + 1],
                [row + 1, col - 1], [row - 1, col - 1]
            ]
            return moves.some(([r, c]) =>
                inBounds(r, c) && (matrix[r][c] > 6 || matrix[r][c] === 0)
            )
        } else if (val === 4) {
            const moves = [
                [row - 1, col], [row, col + 1],
                [row + 1, col], [row, col - 1]
            ]
            return moves.some(([r, c]) =>
                inBounds(r, c) && (matrix[r][c] > 6 || matrix[r][c] === 0)
            )
        } else if (val === 5 || val === 6) {
            const moves = [
                [row - 1, col], [row - 1, col + 1], [row, col + 1],
                [row + 1, col + 1], [row + 1, col], [row + 1, col - 1],
                [row, col - 1], [row - 1, col - 1]
            ]
            return moves.some(([r, c]) =>
                inBounds(r, c) && (matrix[r][c] > 6 || matrix[r][c] === 0)
            )
        } else if (val === 7) {
            if (inBounds(row - 1, col - 1) && matrix[row - 1][col - 1] <= 6 && matrix[row - 1][col - 1] !== 0) return true
            if (inBounds(row - 1, col + 1) && matrix[row - 1][col + 1] <= 6 && matrix[row - 1][col + 1] !== 0) return true
            if (inBounds(row - 1, col) && matrix[row - 1][col] === 0) return true
            return false
        } else if (val === 8) {
            const moves = [
                [row - 2, col + 1], [row - 1, col + 2],
                [row + 1, col + 2], [row + 2, col + 1],
                [row + 2, col - 1], [row + 1, col - 2],
                [row - 1, col - 2], [row - 2, col - 1]
            ]
            return moves.some(([r, c]) =>
                inBounds(r, c) && matrix[r][c] <= 6
            )
        } else if (val === 9) {
            const moves = [
                [row - 1, col + 1], [row + 1, col + 1],
                [row + 1, col - 1], [row - 1, col - 1]
            ]
            return moves.some(([r, c]) =>
                inBounds(r, c) && matrix[r][c] <= 6
            )
        } else if (val === 10) {
            const moves = [
                [row - 1, col], [row, col + 1],
                [row + 1, col], [row, col - 1]
            ]
            return moves.some(([r, c]) =>
                inBounds(r, c) && matrix[r][c] <= 6
            )
        } else if (val === 11 || val === 12) {
            const moves = [
                [row - 1, col], [row - 1, col + 1], [row, col + 1],
                [row + 1, col + 1], [row + 1, col], [row + 1, col - 1],
                [row, col - 1], [row - 1, col - 1]
            ]
            return moves.some(([r, c]) =>
                inBounds(r, c) && matrix[r][c] <= 6
            )
        }
        return false
    }

    // make the nodes of the moves
    _makeNode(pos) {
        if (Object.keys(this._check_path).length === 0) {
            return [...pos]
        } else {
            if (Object.hasOwn(this._check_path, `${pos[0]},${pos[1]}`)) {
                return [...pos]
            }
        }
    }
}
// range 1 - 6
export class PlayerChessman_1 extends Board {
    constructor(board, pos, rowlen, collen) {
        if (board.matrix[pos[0]][pos[1]] === 0 || (board.matrix[pos[0]][pos[1]] >= 7 && board.matrix[pos[0]][pos[1]] <= 12)) {
            throw new RangeError(
                `Invalid piece at [${row}, ${col}]: ${board.matrix[row][col]}. ` +
                `Expected a player piece (1-6).`
            )
        }
        super()
        this.matrix = board.matrix.map(row => [...row])
        this.pos = pos
        this.enemy = board.player2
        this.king = board.king1
        this.castle = board.castle1
        this.rowlen = rowlen
        this.collen = collen
    }

    [Symbol.iterator]() {
        const [row, col] = this.pos
        const piece = this.matrix[row][col]
        if (this._canMove(this.pos)) {
            let king_only
            [this._check_path, king_only] = this.#check()
            if (piece === 1 && !king_only) {
                return this.#pawn(row, col)[Symbol.iterator]()
            } else if (piece === 2 && !king_only) {
                return this.#knight(row, col)[Symbol.iterator]()
            } else if (piece === 3 && !king_only) {
                return this.#bishop(row, col)[Symbol.iterator]()
            } else if (piece === 4 && !king_only) {
                return this.#rook(row, col)[Symbol.iterator]()
            } else if (piece === 5 && !king_only) {
                return this.#queen(row, col)[Symbol.iterator]()
            } else if (piece === 6) {
                return this.#king(row, col)[Symbol.iterator]()
            }
        }
        return [][Symbol.iterator]()
    }

    // check if check then get the only positions where it can only move
    #check() {
        let encounter = 0
        let check_box = {}
        for (const x of this.enemy) {
            if (x[1] === 12) {
                continue
            }
            let list1 = {}
            const [kr, kc] = this.king
            const [r, c] = x[0]
            let steps = []
            const piece = x[1]
            if (piece === 7) {
                if (r - 1 === kr && c - 1 === kc) {
                    list1[[`${r},${c}`]] = true
                    encounter++
                } else if (r - 1 === kr && c + 1 === kc) {
                    list1[[`${r},${c}`]] = true
                    encounter++
                }
            } else if (piece === 8) {
                if ((r - 1 === kr && c - 2 === kc) || (r - 1 === kr && c + 2 === kc) || (r + 1 === kr && c - 2 === kc) || (r + 1 === kr && c + 2 === kc) || (r - 2 === kr && c - 1 === kc) || (r - 2 === kr && c + 1 === kc) || (r + 2 === kr && c - 1 === kc) || (r + 2 === kr && c + 1 === kc)) {
                    list1[[`${r},${c}`]] = true
                    encounter++
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
                list1[`${r},${c}`] = true
                let row = r + steps[0]
                let col = c + steps[1]
                while (row >= 0 && row < this.rowlen && col >= 0 && col < this.collen) {
                    if (this.matrix[row][col] === 0) {
                        list1[`${row},${col}`] = true
                    } else if (this.matrix[row][col] === 6) {
                        encounter++
                        break
                    } else {
                        list1 = {}
                        break
                    }
                    row += steps[0]
                    col += steps[1]
                }
            }
            if (Object.keys(list1).length !== 0) {
                check_box = {...list1}
            }
            if (encounter === 2) {
                return [{}, true]
            }
        }
        if (encounter === 1) {
            return [check_box, false]
        } else {
            return [{}, false]
        }
    }

    // filter outs the enemy which is affecting the kings next move
    #filterEnemy(arg) {
        const [enemy, row, col] = arg
        if (this.matrix[enemy[0]][enemy[1]] === 7) {
            if (enemy[0] === row && enemy[1] === col - 2) {
                return [1]
            } else if (enemy[0] === row && enemy[1] === col - 1) {
                return [2]
            } else if (enemy[0] === row && enemy[1] === col + 1) {
                return [2]
            } else if (enemy[0] === row && enemy[1] === col + 2) {
                return [3]
            } else if (enemy[0] === row + 1 && enemy[1] === col - 2) {
                return [4]
            } else if (enemy[0] === row + 1 && enemy[1] === col) {
                return [4, 5]
            } else if (enemy[0] === row + 1 && enemy[1] === col + 2) {
                return [5]
            } else if (enemy[0] === row + 2 && enemy[1] === col - 2) {
                return [6]
            } else if (enemy[0] === row + 2 && enemy[1] === col - 1) {
                return [7]
            } else if (enemy[0] === row + 2 && enemy[1] === col) {
                return [6, 8]
            } else if (enemy[0] === row + 2 && enemy[1] === col + 1) {
                return [7]
            } else if (enemy[0] === row + 2 && enemy[1] === col + 2) {
                return [8]
            }
        } else if (this.matrix[enemy[0]][enemy[1]] === 8) {
            if (enemy[0] === row - 3 && enemy[1] === col - 2) {
                return [1]
            } else if (enemy[0] === row - 3 && enemy[1] === col - 1) {
                return [2]
            } else if (enemy[0] === row - 3 && enemy[1] === col) {
                return [1, 3]
            } else if (enemy[0] === row - 3 && enemy[1] === col + 1) {
                return [2]
            } else if (enemy[0] === row - 3 && enemy[1] === col + 2) {
                return [3]
            } else if (enemy[0] === row - 2 && enemy[1] === col - 3) {
                return [1]
            } else if (enemy[0] === row - 2 && enemy[1] === col - 2) {
                return [2, 4]
            } else if (enemy[0] === row - 2 && enemy[1] === col - 1) {
                return [3]
            } else if (enemy[0] === row - 2 && enemy[1] === col) {
                return [4, 5]
            } else if (enemy[0] === row - 2 && enemy[1] === col + 1) {
                return [1]
            } else if (enemy[0] === row - 2 && enemy[1] === col + 2) {
                return [2, 5]
            } else if (enemy[0] === row - 2 && enemy[1] === col + 3) {
                return [3]
            } else if (enemy[0] === row - 1 && enemy[1] === col - 3) {
                return [4]
            } else if (enemy[0] === row - 1 && enemy[1] === col - 2) {
                return [6]
            } else if (enemy[0] === row - 1 && enemy[1] === col - 1) {
                return [5, 7]
            } else if (enemy[0] === row - 1 && enemy[1] === col) {
                return [6, 8]
            } else if (enemy[0] === row - 1 && enemy[1] === col + 1) {
                return [4, 7]
            } else if (enemy[0] === row - 1 && enemy[1] === col + 2) {
                return [8]
            } else if (enemy[0] === row - 1 && enemy[1] === col + 3) {
                return [5]
            } else if (enemy[0] === row && enemy[1] === col - 3) {
                return [1, 6]
            } else if (enemy[0] === row && enemy[1] === col - 2) {
                return [2, 7]
            } else if (enemy[0] === row && enemy[1] === col - 1) {
                return [3, 8]
            } else if (enemy[0] === row && enemy[1] === col + 1) {
                return [1, 6]
            } else if (enemy[0] === row && enemy[1] === col + 2) {
                return [2, 7]
            } else if (enemy[0] === row && enemy[1] === col + 3) {
                return [3, 8]
            } else if (enemy[0] === row + 1 && enemy[1] === col - 3) {
                return [4]
            } else if (enemy[0] === row + 1 && enemy[1] === col - 2) {
                return [1]
            } else if (enemy[0] === row + 1 && enemy[1] === col - 1) {
                return [2, 5]
            } else if (enemy[0] === row + 1 && enemy[1] === col) {
                return [1, 3]
            } else if (enemy[0] === row + 1 && enemy[1] === col + 1) {
                return [2, 4]
            } else if (enemy[0] === row + 1 && enemy[1] === col + 2) {
                return [3]
            } else if (enemy[0] === row + 1 && enemy[1] === col + 3) {
                return [5]
            } else if (enemy[0] === row + 2 && enemy[1] === col - 3) {
                return [6]
            } else if (enemy[0] === row + 2 && enemy[1] === col - 2) {
                return [4, 7]
            } else if (enemy[0] === row + 2 && enemy[1] === col - 1) {
                return [8]
            } else if (enemy[0] === row + 2 && enemy[1] === col) {
                return [4, 5]
            } else if (enemy[0] === row + 2 && enemy[1] === col + 1) {
                return [6]
            } else if (enemy[0] === row + 2 && enemy[1] === col + 2) {
                return [5, 7]
            } else if (enemy[0] === row + 2 && enemy[1] === col + 3) {
                return [8]
            } else if (enemy[0] === row - 3 && enemy[1] === col - 2) {
                return [6]
            } else if (enemy[0] === row - 3 && enemy[1] === col - 1) {
                return [7]
            } else if (enemy[0] === row - 3 && enemy[1] === col) {
                return [6, 8]
            } else if (enemy[0] === row - 3 && enemy[1] === col + 1) {
                return [7]
            } else if (enemy[0] === row - 3 && enemy[1] === col + 2) {
                return [8]
            }
        } else if (this.matrix[enemy[0]][enemy[1]] === 9) {
            if (enemy[0] === row + 2 && enemy[1] === col) {
                return [6, 8]
            } else if ((enemy[0] === row + 1 && enemy[1] === col) || (enemy[0] === row - 1 && enemy[1] === col)) {
                return [4, 5]
            } else if (enemy[0] === row - 2 && enemy[1] === col) {
                return [1, 3]
            } else if (enemy[0] === row && enemy[1] === col + 2) {
                return [3, 8]
            } else if ((enemy[0] === row && enemy[1] === col + 1) || (enemy[0] === row && enemy[1] === col - 1)) {
                return [2, 7]
            } else if (enemy[0] === row && enemy[1] === col - 2) {
                return [1, 6]
            } else {
                if (enemy[0] !== row - 1 && enemy[1] !== col - 1 && Math.abs(enemy[0] - (row - 1)) === Math.abs(enemy[1] - (col - 1))) {
                    if (enemy[0] !== row + 1 && enemy[1] !== col + 1 && Math.abs(enemy[0] - (row + 1)) === Math.abs(enemy[1] - (col + 1))) {
                        if (enemy[0] < row - 1 && enemy[1] < col - 1) {
                            for (let x = 1; x < Math.abs(enemy[0] - (row - 1)); x++) {
                                if (this.matrix[enemy[0] + x][enemy[1] + x] !== 0) {
                                    return null
                                }
                            }
                            if (this.matrix[row - 1][col - 1] !== 0) {
                                return [1]
                            }
                        } else if (enemy[0] > row + 1 && enemy[1] > col + 1) {
                            for (let x = 1; x < Math.abs(enemy[0] - (row + 1)); x++) {
                                if (this.matrix[enemy[0] - x][enemy[1] - x] !== 0) {
                                    return null
                                }
                            }
                            if (this.matrix[row + 1][col + 1] !== 0) {
                                return [8]
                            }
                        }
                        return [1, 8]
                    } else {
                        if (enemy[0] < row - 1 && enemy[1] > col - 1) {
                            for (let x = 1; x < Math.abs(enemy[0] - (row - 1)); x++) {
                                if (this.matrix[enemy[0] + x][enemy[1] - x] !== 0) {
                                    return null
                                }
                            }
                        } else if (enemy[0] > row - 1 && enemy[1] < col - 1) {
                            for (let x = 1; x < Math.abs(enemy[0] - (row - 1)); x++) {
                                if (this.matrix[enemy[0] - x][enemy[1] + x] !== 0) {
                                    return null
                                }
                            }
                        }
                        return [1]
                    }
                } else if (enemy[0] !== row - 1 && enemy[1] !== col && Math.abs(enemy[0] - (row - 1)) === Math.abs(enemy[1] - col)) {
                    if (enemy[0] !== row && enemy[1] !== col + 1 && Math.abs(enemy[0] - row) === Math.abs(enemy[1] - (col + 1))) {
                        if (enemy[0] < row - 1 && enemy[1] < col) {
                            for (let x = 1; x < Math.abs(enemy[0] - (row - 1)); x++) {
                                if (this.matrix[enemy[0] + x][enemy[1] + x] !== 0) {
                                    return null
                                }
                            }
                            if (this.matrix[row - 1][col] !== 0) {
                                return [2]
                            }
                        } else if (enemy[0] > row && enemy[1] > col + 1) {
                            for (let x = 1; x < Math.abs(enemy[0] - row); x++) {
                                if (this.matrix[enemy[0] - x][enemy[1] - x] !== 0) {
                                    return null
                                }
                            }
                            if (this.matrix[row][col + 1] !== 0) {
                                return [5]
                            }
                        }
                        return [2, 5]
                    } else if (enemy[0] !== row && enemy[1] !== col - 1 && Math.abs(enemy[0] - row) === Math.abs(enemy[1] - (col - 1))) {
                        if (enemy[0] < row - 1 && enemy[1] > col) {
                            for (let x = 1; x < Math.abs(enemy[0] - (row - 1)); x++) {
                                if (this.matrix[enemy[0] + x][enemy[1] - x] !== 0) {
                                    return null
                                }
                            }
                            if (this.matrix[row - 1][col] !== 0) {
                                return [2]
                            }
                        } else if (enemy[0] > row && enemy[1] < col - 1) {
                            for (let x = 1; x < Math.abs(enemy[0] - row); x++) {
                                if (this.matrix[enemy[0] - x][enemy[1] + x] !== 0) {
                                    return null
                                }
                            }
                            if (this.matrix[row][col - 1] !== 0) {
                                return [4]
                            }
                        }
                        return [2, 4]
                    }
                } else if (enemy[0] !== row - 1 && enemy[1] !== col + 1 && Math.abs(enemy[0] - (row - 1)) === Math.abs(enemy[1] - (col + 1))) {
                    if (enemy[0] !== row + 1 && enemy[1] !== col - 1 && Math.abs(enemy[0] - (row + 1)) === Math.abs(enemy[1] - (col - 1))) {
                        if (enemy[0] < row - 1 && enemy[1] > col + 1) {
                            for (let x = 1; x < Math.abs(enemy[0] - (row - 1)); x++) {
                                if (this.matrix[enemy[0] + x][enemy[1] - x] !== 0) {
                                    return null
                                }
                            }
                            if (this.matrix[row - 1][col + 1] !== 0) {
                                return [3]
                            }
                        } else if (enemy[0] > row + 1 && enemy[1] < col - 1) {
                            for (let x = 1; x < Math.abs(enemy[0] - (row + 1)); x++) {
                                if (this.matrix[enemy[0] - x][enemy[1] + x] !== 0) {
                                    return null
                                }
                            }
                            if (this.matrix[row + 1][col - 1] !== 0) {
                                return [6]
                            }
                        }
                        return [3, 6]
                    } else {
                        if (enemy[0] < row - 1 && enemy[1] < col + 1) {
                            for (let x = 1; x < Math.abs(enemy[0] - (row - 1)); x++) {
                                if (this.matrix[enemy[0] + x][enemy[1] + x] !== 0) {
                                    return null
                                }
                            }
                        } else if (enemy[0] > row - 1 && enemy[1] > col + 1) {
                            for (let x = 1; x < Math.abs(enemy[0] - (row - 1)); x++) {
                                if (this.matrix[enemy[0] - x][enemy[1] - x] !== 0) {
                                    return null
                                }
                            }
                        }
                        return [3]
                    }
                } else if (enemy[0] !== row && enemy[1] !== col - 1 && Math.abs(enemy[0] - row) === Math.abs(enemy[1] - (col - 1))) {
                    if (enemy[0] !== row + 1 && enemy[1] !== col && Math.abs(enemy[0] - (row + 1)) === Math.abs(enemy[1] - col)) {
                        if (enemy[0] < row && enemy[1] < col - 1) {
                            for (let x = 1; x < Math.abs(enemy[0] - row); x++) {
                                if (this.matrix[enemy[0] + x][enemy[1] + x] !== 0) {
                                    return null
                                }
                            }
                            if (this.matrix[row - 1][col] !== 0) {
                                return [4]
                            }
                        } else if (enemy[0] > row + 1 && enemy[1] > col) {
                            for (let x = 1; x < Math.abs(enemy[0] - row); x++) {
                                if (this.matrix[enemy[0] - x][enemy[1] - x] !== 0) {
                                    return null
                                }
                            }
                            if (this.matrix[row + 1][col] !== 0) {
                                return [7]
                            }
                        }
                        return [4, 7]
                    }
                } else if (enemy[0] !== row && enemy[1] !== col + 1 && Math.abs(enemy[0] - row) === Math.abs(enemy[1] - (col + 1))) {
                    if (enemy[0] !== row + 1 && enemy[1] !== col && Math.abs(enemy[0] - (row + 1)) === Math.abs(enemy[1] - col)) {
                        if (enemy[0] < row && enemy[1] > col + 1) {
                            for (let x = 1; x < Math.abs(enemy[0] - row); x++) {
                                if (this.matrix[enemy[0] + x][enemy[1] - x] !== 0) {
                                    return null
                                }
                            }
                            if (this.matrix[row][col + 1] !== 0) {
                                return [5]
                            }
                        } else if (enemy[0] > row + 1 && enemy[1] < col) {
                            for (let x = 1; x < Math.abs(enemy[0] - row); x++) {
                                if (this.matrix[enemy[0] - x][enemy[1] + x] !== 0) {
                                    return null
                                }
                            }
                            if (this.matrix[row + 1][col] !== 0) {
                                return [7]
                            }
                        }
                        return [5, 7]
                    }
                } else if (enemy[0] !== row + 1 && enemy[1] !== col - 1 && Math.abs(enemy[0] - (row + 1)) === Math.abs(enemy[1] - (col - 1))) {
                    if (enemy[0] < row + 1 && enemy[1] < col - 1) {
                        for (let x = 1; x < Math.abs(enemy[0] - (row + 1)); x++) {
                            if (this.matrix[enemy[0] + x][enemy[1] + x] !== 0) {
                                return null
                            }
                        }
                    } else if (enemy[0] > row + 1 && enemy[1] > col - 1) {
                        for (let x = 1; x < Math.abs(enemy[0] - (row + 1)); x++) {
                            if (this.matrix[enemy[0] - x][enemy[1] - x] !== 0) {
                                return null
                            }
                        }
                    }
                    return [6]
                } else if (enemy[0] !== row + 1 && enemy[1] !== col + 1 && Math.abs(enemy[0] - (row + 1)) === Math.abs(enemy[1] - (col + 1))) {
                    if (enemy[0] < row + 1 && enemy[1] > col + 1) {
                        for (let x = 1; x < Math.abs(enemy[0] - (row + 1)); x++) {
                            if (this.matrix[enemy[0] + x][enemy[1] - x] !== 0) {
                                return null
                            }
                        }
                    } else if (enemy[0] > row + 1 && enemy[1] < col + 1) {
                        for (let x = 1; x < Math.abs(enemy[0] - (row + 1)); x++) {
                            if (this.matrix[enemy[0] - x][enemy[1] + x] !== 0) {
                                return null
                            }
                        }
                    }
                    return [8]
                }
            }
        } else if (this.matrix[enemy[0]][enemy[1]] === 10) {
            if (enemy[0] === row - 1 && enemy[1] === col - 1) {
                if (this.matrix[row][col - 1] !== 0 && this.matrix[row - 1][col] !== 0) {
                    return [2, 4]
                } else if (this.matrix[row - 1][col] !== 0) {
                    return [2, 4, 6]
                } else if (this.matrix[row][col - 1] !== 0) {
                    return [2, 3, 4]
                } else {
                    return [2, 3, 4, 6]
                }
            } else if (enemy[0] === row - 1 && enemy[1] === col) {
                return [1, 3, 7]
            } else if (enemy[0] === row - 1 && enemy[1] === col + 1) {
                if (this.matrix[row][col + 1] !== 0 && this.matrix[row - 1][col] !== 0) {
                    return [2, 5]
                } else if (this.matrix[row - 1][col] !== 0) {
                    return [2, 5, 8]
                } else if (this.matrix[row][col + 1] !== 0) {
                    return [1, 2, 5]
                } else {
                    return [1, 2, 5, 8]
                }
            } else if (enemy[0] === row && enemy[1] === col - 1) {
                return [1, 5, 6]
            } else if (enemy[0] === row && enemy[1] === col + 1) {
                return [3, 4, 8]
            } else if (enemy[0] === row + 1 && enemy[1] === col - 1) {
                if (this.matrix[row][col - 1] !== 0 && this.matrix[row + 1][col] !== 0) {
                    return [4, 7]
                } else if (this.matrix[row + 1][col] !== 0) {
                    return [1, 4, 7]
                } else if (this.matrix[row][col - 1] !== 0) {
                    return [4, 7, 8]
                } else {
                    return [1, 4, 7, 8]
                }
            } else if (enemy[0] === row + 1 && enemy[1] === col) {
                return [2, 6, 8]
            } else if (enemy[0] === row + 1 && enemy[1] === col + 1) {
                if (this.matrix[row][col + 1] !== 0 && this.matrix[row + 1][col] !== 0) {
                    return [5, 7]
                } else if (this.matrix[row + 1][col] !== 0) {
                    return [3, 5, 7]
                } else if (this.matrix[row][col + 1] !== 0) {
                    return [5, 6, 7]
                } else {
                    return [3, 5, 6, 7]
                }
            } else {
                if (enemy[0] === row - 1) {
                    if (enemy[1] < col - 1) {
                        for (let x = enemy[1] + 1; x < col - 1; x++) {
                            if (this.matrix[row - 1][x] !== 0) return null
                        }
                        if (this.matrix[row - 1][col - 1] !== 0) return [1]
                        else if (this.matrix[row - 1][col] !== 0) return [1, 2]
                    } else if (enemy[1] > col + 1) {
                        for (let x = col + 2; x < enemy[1]; x++) {
                            if (this.matrix[row - 1][x] !== 0) return null
                        }
                        if (this.matrix[row - 1][col + 1] !== 0) return [3]
                        else if (this.matrix[row - 1][col] !== 0) return [2, 3]
                    }
                    return [1, 2, 3]
                } else if (enemy[0] === row) {
                    if (enemy[1] < col - 1) {
                        for (let x = enemy[1] + 1; x < col - 1; x++) {
                            if (this.matrix[row][x] !== 0) return null
                        }
                        if (this.matrix[row][col - 1] !== 0) return [4]
                    } else if (enemy[1] > col + 1) {
                        for (let x = col + 2; x < enemy[1]; x++) {
                            if (this.matrix[row][x] !== 0) return null
                        }
                        if (this.matrix[row][col + 1] !== 0) return [5]
                    }
                    return [4, 5]
                } else if (enemy[0] === row + 1) {
                    if (enemy[1] < col - 1) {
                        for (let x = enemy[1] + 1; x < col - 1; x++) {
                            if (this.matrix[row + 1][x] !== 0) return null
                        }
                        if (this.matrix[row + 1][col - 1] !== 0) return [6]
                        else if (this.matrix[row + 1][col] !== 0) return [6, 7]
                    } else if (enemy[1] > col + 1) {
                        for (let x = col + 2; x < enemy[1]; x++) {
                            if (this.matrix[row + 1][x] !== 0) return null
                        }
                        if (this.matrix[row + 1][col + 1] !== 0) return [8]
                        else if (this.matrix[row + 1][col] !== 0) return [7, 8]
                    }
                    return [6, 7, 8]
                } else if (enemy[1] === col - 1) {
                    if (enemy[0] < row - 1) {
                        for (let x = enemy[0] + 1; x < row - 1; x++) {
                            if (this.matrix[x][col - 1] !== 0) return null
                        }
                        if (this.matrix[row - 1][col - 1] !== 0) return [1]
                        else if (this.matrix[row][col - 1] !== 0) return [1, 4]
                    } else if (enemy[0] > row + 1) {
                        for (let x = row + 2; x < enemy[0]; x++) {
                            if (this.matrix[x][col - 1] !== 0) return null
                        }
                        if (this.matrix[row + 1][col - 1] !== 0) return [6]
                        else if (this.matrix[row][col - 1] !== 0) return [4, 6]
                    }
                    return [1, 4, 6]
                } else if (enemy[1] === col) {
                    if (enemy[0] < row - 1) {
                        for (let x = enemy[0] + 1; x < row - 1; x++) {
                            if (this.matrix[x][col] !== 0) return null
                        }
                        if (this.matrix[row - 1][col] !== 0) return [2]
                    } else if (enemy[0] > row + 1) {
                        for (let x = row + 2; x < enemy[0]; x++) {
                            if (this.matrix[x][col] !== 0) return null
                        }
                        if (this.matrix[row + 1][col] !== 0) return [7]
                    }
                    return [2, 7]
                } else if (enemy[1] === col + 1) {
                    if (enemy[0] < row - 1) {
                        for (let x = enemy[0] + 1; x < row - 1; x++) {
                            if (this.matrix[x][col + 1] !== 0) return null
                        }
                        if (this.matrix[row - 1][col + 1] !== 0) return [3]
                        else if (this.matrix[row][col + 1] !== 0) return [3, 5]
                    } else if (enemy[0] > row + 1) {
                        for (let x = row + 2; x < enemy[0]; x++) {
                            if (this.matrix[x][col + 1] !== 0) return null
                        }
                        if (this.matrix[row + 1][col + 1] !== 0) return [8]
                        else if (this.matrix[row][col + 1] !== 0) return [5, 8]
                    }
                    return [3, 5, 8]
                }

            }
        } else if (this.matrix[enemy[0]][enemy[1]] === 11) {
            if (enemy[0] === row - 1 && enemy[1] === col - 1) {
                if (this.matrix[row - 1][col] !== 0 && this.matrix[row][col - 1] !== 0) {
                    return [2, 4, 8]
                } else if (this.matrix[row - 1][col] !== 0) {
                    return [2, 4, 6, 8]
                } else if (this.matrix[row][col - 1] !== 0) {
                    return [2, 3, 4, 8]
                } else {
                    return [2, 3, 4, 6, 8]
                }
            } else if (enemy[0] === row - 1 && enemy[1] === col) {
                return [1, 3, 4, 5, 7]
            } else if (enemy[0] === row - 1 && enemy[1] === col + 1) {
                if (this.matrix[row - 1][col] !== 0 && this.matrix[row][col + 1] !== 0) {
                    return [2, 5, 6]
                } else if (this.matrix[row - 1][col] !== 0) {
                    return [2, 5, 6, 8]
                } else if (this.matrix[row][col - 1] !== 0) {
                    return [1, 2, 5, 6]
                } else {
                    return [1, 2, 5, 6, 8]
                }
            } else if (enemy[0] === row && enemy[1] === col - 1) {
                return [1, 2, 5, 6, 7]
            } else if (enemy[0] === row && enemy[1] === col + 1) {
                return [2, 3, 4, 7, 8]
            } else if (enemy[0] === row + 1 && enemy[1] === col - 1) {
                if (this.matrix[row + 1][col] !== 0 && this.matrix[row][col - 1] !== 0) {
                    return [3, 4, 7]
                } else if (this.matrix[row + 1][col] !== 0) {
                    return [1, 3, 4, 7]
                } else if (this.matrix[row][col - 1] !== 0) {
                    return [3, 4, 7, 8]
                } else {
                    return [1, 3, 4, 7, 8]
                }
            } else if (enemy[0] === row + 1 && enemy[1] === col) {
                return [2, 4, 5, 6, 8]
            } else if (enemy[0] === row + 1 && enemy[1] === col + 1) {
                if (this.matrix[row + 1][col] !== 0 && this.matrix[row][col + 1] !== 0) {
                    return [1, 5, 7]
                } else if (this.matrix[row + 1][col] !== 0) {
                    return [1, 3, 5, 7]
                } else if (this.matrix[row][col + 1] !== 0) {
                    return [1, 5, 6, 7]
                } else {
                    return [1, 3, 5, 6, 7]
                }
            } else if (enemy[0] === row - 2 && enemy[1] === col - 1) {
                if (this.matrix[row - 1][col - 1] !== 0 && this.matrix[row - 1][col] !== 0) {
                    return [1, 2]
                } else if (this.matrix[row][col - 1] !== 0 && this.matrix[row - 1][col] !== 0) {
                    return [1, 2, 4]
                } else if (this.matrix[row - 1][col - 1] !== 0) {
                    return [1, 2, 5]
                } else if (this.matrix[row - 1][col] !== 0) {
                    return [1, 2, 4, 6]
                } else if (this.matrix[row][col - 1] !== 0) {
                    return [1, 2, 4, 5]
                } else {
                    return [1, 2, 4, 5, 6]
                }
            } else if (enemy[0] === row - 2 && enemy[1] === col) {
                if (this.matrix[row - 1][col] !== 0) {
                    return [1, 2, 3]
                } else {
                    return [1, 2, 3, 7]
                }
            } else if (enemy[0] === row - 2 && enemy[1] === col + 1) {
                if (this.matrix[row - 1][col + 1] !== 0 && this.matrix[row - 1][col] !== 0) {
                    return [2, 3]
                } else if (this.matrix[row][col + 1] !== 0 && this.matrix[row - 1][col] !== 0) {
                    return [2, 3, 5]
                } else if (this.matrix[row - 1][col + 1] !== 0) {
                    return [2, 3, 4]
                } else if (this.matrix[row - 1][col] !== 0) {
                    return [2, 3, 5, 8]
                } else if (this.matrix[row][col + 1] !== 0) {
                    return [2, 3, 4, 5]
                } else {
                    return [2, 3, 4, 5, 8]
                }
            } else if (enemy[0] === row - 1 && enemy[1] === col - 2) {
                if (this.matrix[row - 1][col - 1] !== 0 && this.matrix[row][col - 1] !== 0) {
                    return [1, 4]
                } else if (this.matrix[row - 1][col] !== 0 && this.matrix[row][col - 1] !== 0) {
                    return [1, 2, 4]
                } else if (this.matrix[row - 1][col - 1] !== 0) {
                    return [1, 4, 7]
                } else if (this.matrix[row - 1][col] !== 0) {
                    return [1, 2, 4, 7]
                } else if (this.matrix[row][col - 1] !== 0) {
                    return [1, 2, 3, 4]
                } else {
                    return [1, 2, 3, 4, 7]
                }
            } else if (enemy[0] === row && enemy[1] === col - 2) {
                if (this.matrix[row][col - 1] !== 0) {
                    return [1, 4, 6]
                } else {
                    return [1, 4, 5, 6]
                }
            } else if (enemy[0] === row + 1 && enemy[1] === col - 2) {
                if (this.matrix[row + 1][col - 1] !== 0 && this.matrix[row][col - 1] !== 0) {
                    return [4, 6]
                } else if (this.matrix[row + 1][col] !== 0 && this.matrix[row][col - 1] !== 0) {
                    return [4, 6, 7]
                } else if (this.matrix[row + 1][col - 1] !== 0) {
                    return [2, 4, 6]
                } else if (this.matrix[row + 1][col] !== 0) {
                    return [2, 4, 6, 7]
                } else if (this.matrix[row][col - 1] !== 0) {
                    return [4, 6, 7, 8]
                } else {
                    return [2, 4, 6, 7, 8]
                }
            } else if (enemy[0] === row + 2 && enemy[1] === col - 1) {
                if (this.matrix[row + 1][col - 1] !== 0 && this.matrix[row + 1][col] !== 0) {
                    return [6, 7]
                } else if (this.matrix[row][col - 1] !== 0 && this.matrix[row + 1][col] !== 0) {
                    return [4, 6, 7]
                } else if (this.matrix[row + 1][col - 1] !== 0) {
                    return [5, 6, 7]
                } else if (this.matrix[row + 1][col] !== 0) {
                    return [1, 4, 6, 7]
                } else if (this.matrix[row][col - 1] !== 0) {
                    return [4, 5, 6, 7]
                } else {
                    return [1, 4, 5, 6, 7]
                }
            } else if (enemy[0] === row + 2 && enemy[1] === col) {
                if (this.matrix[row + 1][col] !== 0) {
                    return [6, 7, 8]
                } else {
                    return [2, 6, 7, 8]
                }
            } else if (enemy[0] === row + 2 && enemy[1] === col + 1) {
                if (this.matrix[row + 1][col + 1] !== 0 && this.matrix[row + 1][col] !== 0) {
                    return [7, 8]
                } else if (this.matrix[row][col + 1] !== 0 && this.matrix[row + 1][col] !== 0) {
                    return [5, 7, 8]
                } else if (this.matrix[row + 1][col + 1] !== 0) {
                    return [4, 7, 8]
                } else if (this.matrix[row + 1][col] !== 0) {
                    return [3, 5, 7, 8]
                } else if (this.matrix[row][col + 1] !== 0) {
                    return [4, 5, 7, 8]
                } else {
                    return [3, 4, 5, 7, 8]
                }
            } else if (enemy[0] === row - 1 && enemy[1] === col + 2) {
                if (this.matrix[row - 1][col + 1] !== 0 && this.matrix[row][col + 1] !== 0) {
                    return [3, 5]
                } else if (this.matrix[row - 1][col] !== 0 && this.matrix[row][col + 1] !== 0) {
                    return [2, 3, 5]
                } else if (this.matrix[row - 1][col + 1] !== 0) {
                    return [3, 5, 7]
                } else if (this.matrix[row - 1][col] !== 0) {
                    return [2, 3, 5, 7]
                } else if (this.matrix[row][col + 1] !== 0) {
                    return [1, 2, 3, 5]
                } else {
                    return [1, 2, 3, 5, 7]
                }
            } else if (enemy[0] === row && enemy[1] === col + 2) {
                if (this.matrix[row][col + 1] !== 0) {
                    return [3, 5, 8]
                } else {
                    return [3, 4, 5, 8]
                }
            } else if (enemy[0] === row + 1 && enemy[1] === col + 2) {
                if (this.matrix[row + 1][col + 1] !== 0 && this.matrix[row][col + 1] !== 0) {
                    return [5, 8]
                } else if (this.matrix[row + 1][col] !== 0 && this.matrix[row][col + 1] !== 0) {
                    return [5, 7, 8]
                } else if (this.matrix[row + 1][col + 1] !== 0) {
                    return [2, 5, 8]
                } else if (this.matrix[row + 1][col] !== 0) {
                    return [2, 5, 7, 8]
                } else if (this.matrix[row][col + 1] !== 0) {
                    return [5, 6, 7, 8]
                } else {
                    return [2, 5, 6, 7, 8]
                }
            } else if (enemy[0] === row - 3 && enemy[1] === col - 1) {
                if (this.matrix[row - 2][col - 1] !== 0 && this.matrix[row - 2][col] !== 0) {
                    return null
                } else if (this.matrix[row - 2][col - 1] !== 0) {
                    return [3]
                } else if (this.matrix[row - 2][col] !== 0) {
                    return [1]
                } else if (this.matrix[row - 1][col - 1] !== 0) {
                    return [1, 3]
                } else if (this.matrix[row][col - 1] !== 0) {
                    return [1, 4, 3]
                } else {
                    return [1, 3, 4, 6]
                }
            } else if (enemy[0] === row - 3 && enemy[1] === col) {
                if (this.matrix[row - 2][col] !== 0) {
                    return null
                } else if (this.matrix[row - 1][col] !== 0) {
                    return [2]
                } else {
                    return [2, 7]
                }
            } else if (enemy[0] === row - 3 && enemy[1] === col + 1) {
                if (this.matrix[row - 2][col + 1] !== 0 && this.matrix[row - 2][col] !== 0) {
                    return null
                } else if (this.matrix[row - 2][col + 1] !== 0) {
                    return [1]
                } else if (this.matrix[row - 2][col] !== 0) {
                    return [3]
                } else if (this.matrix[row - 1][col + 1] !== 0) {
                    return [1, 3]
                } else if (this.matrix[row][col + 1] !== 0) {
                    return [1, 3, 5]
                } else {
                    return [1, 3, 5, 8]
                }
            } else if (enemy[0] === row - 1 && enemy[1] === col - 3) {
                if (this.matrix[row - 1][col - 2] !== 0 && this.matrix[row][col - 2] !== 0) {
                    return null
                } else if (this.matrix[row - 1][col - 2] !== 0) {
                    return [6]
                } else if (this.matrix[row][col - 2] !== 0) {
                    return [1]
                } else if (this.matrix[row - 1][col - 1] !== 0) {
                    return [1, 6]
                } else if (this.matrix[row - 1][col] !== 0) {
                    return [1, 2, 6]
                } else {
                    return [1, 2, 3, 6]
                }
            } else if (enemy[0] === row && enemy[1] === col - 3) {
                if (this.matrix[row][col - 2] !== 0) {
                    return null
                } else if (this.matrix[row][col - 1] !== 0) {
                    return [4]
                } else {
                    return [4, 5]
                }
            } else if (enemy[0] === row + 1 && enemy[1] === col - 3) {
                if (this.matrix[row + 1][col - 2] !== 0 && this.matrix[row][col - 2] !== 0) {
                    return null
                } else if (this.matrix[row + 1][col - 2] !== 0) {
                    return [1]
                } else if (this.matrix[row][col - 2] !== 0) {
                    return [6]
                } else if (this.matrix[row + 1][col - 1] !== 0) {
                    return [1, 6]
                } else if (this.matrix[row + 1][col] !== 0) {
                    return [1, 6, 7]
                } else {
                    return [1, 3, 4, 6]
                }
            } else if (enemy[0] === row + 3 && enemy[1] === col - 1) {
                if (this.matrix[row + 2][col - 1] !== 0 && this.matrix[row + 2][col] !== 0) {
                    return null
                } else if (this.matrix[row + 2][col - 1] !== 0) {
                    return [8]
                } else if (this.matrix[row + 2][col] !== 0) {
                    return [6]
                } else if (this.matrix[row + 1][col - 1] !== 0) {
                    return [6, 8]
                } else if (this.matrix[row][col - 1] !== 0) {
                    return [4, 6, 8]
                } else {
                    return [1, 4, 6, 8]
                }
            } else if (enemy[0] === row + 3 && enemy[1] === col) {
                if (this.matrix[row + 2][col] !== 0) {
                    return null
                } else if (this.matrix[row + 1][col] !== 0) {
                    return [7]
                } else {
                    return [2, 7]
                }
            } else if (enemy[0] === row + 3 && enemy[1] === col + 1) {
                if (this.matrix[row + 2][col + 1] !== 0 && this.matrix[row + 2][col] !== 0) {
                    return null
                } else if (this.matrix[row + 2][col + 1] !== 0) {
                    return [6]
                } else if (this.matrix[row + 2][col] !== 0) {
                    return [8]
                } else if (this.matrix[row + 1][col + 1] !== 0) {
                    return [6, 8]
                } else if (this.matrix[row][col + 1] !== 0) {
                    return [5, 6, 8]
                } else {
                    return [3, 5, 6, 8]
                }
            } else if (enemy[0] === row - 1 && enemy[1] === col + 3) {
                if (this.matrix[row - 1][col + 2] !== 0 && this.matrix[row][col + 2] !== 0) {
                    return null
                } else if (this.matrix[row - 1][col + 2] !== 0) {
                    return [8]
                } else if (this.matrix[row + 2][col] !== 0) {
                    return [3]
                } else if (this.matrix[row - 1][col + 1] !== 0) {
                    return [3, 8]
                } else if (this.matrix[row - 1][col] !== 0) {
                    return [2, 3, 8]
                } else {
                    return [1, 2, 3, 8]
                }
            } else if (enemy[0] === row && enemy[1] === col + 3) {
                if (this.matrix[row][col + 2] !== 0) {
                    return null
                } else if (this.matrix[row][col + 1] !== 0) {
                    return [5]
                } else {
                    return [4, 5]
                }
            } else if (enemy[0] === row + 1 && enemy[1] === col + 3) {
                if (this.matrix[row + 1][col + 2] !== 0 && this.matrix[row][col + 2] !== 0) {
                    return null
                } else if (this.matrix[row + 1][col + 2] !== 0) {
                    return [3]
                } else if (this.matrix[row + 2][col] !== 0) {
                    return [8]
                } else if (this.matrix[row + 1][col + 1] !== 0) {
                    return [3, 8]
                } else if (this.matrix[row + 1][col] !== 0) {
                    return [3, 7, 8]
                } else {
                    return [3, 6, 7, 8]
                }
            } else if (
                (
                    ((enemy[0] >= 0 && enemy[0] < row - 3) || (enemy[0] > row + 3 && enemy[0] < this.rowlen)) &&
                    (enemy[1] >= col - 1 && enemy[1] <= col + 1)
                ) ||
                (
                    ((enemy[1] >= 0 && enemy[1] < col - 3) || (enemy[1] > col + 3 && enemy[1] < this.collen)) &&
                    (enemy[0] >= row - 1 && enemy[0] <= row + 1)
                )
            ) {
                if (enemy[0] === row - 1) {
                    if (enemy[1] < col - 1) {
                        for (let x = enemy[1] + 1; x < col - 1; x++) {
                            if (this.matrix[row - 1][x] !== 0) {
                                return null
                            }
                        }
                        if (this.matrix[row - 1][col - 1] !== 0) {
                            return [1]
                        } else if (this.matrix[row - 1][col] !== 0) {
                            return [1, 2]
                        }
                    } else if (enemy[1] > col + 1) {
                        for (let x = col + 2; x < enemy[1]; x++) {
                            if (this.matrix[row - 1][x] !== 0) {
                                return null
                            }
                        }
                        if (this.matrix[row - 1][col + 1] !== 0) {
                            return [3]
                        } else if (this.matrix[row - 1][col] !== 0) {
                            return [2, 3]
                        }
                    }
                    return [1, 2, 3]
                } else if (enemy[0] === row) {
                    if (enemy[1] < col - 1) {
                        for (let x = enemy[1] + 1; x < col - 1; x++) {
                            if (this.matrix[row][x] !== 0) {
                                return null
                            }
                        }
                        if (this.matrix[row][col - 1] !== 0) {
                            return [4]
                        }
                    } else if (enemy[1] > col + 1) {
                        for (let x = col + 2; x < enemy[1]; x++) {
                            if (this.matrix[row][x] !== 0) {
                                return null
                            }
                        }
                        if (this.matrix[row][col + 1] !== 0) {
                            return [5]
                        }
                    }
                    return [4, 5]
                } else if (enemy[0] === row + 1) {
                    if (enemy[1] < col - 1) {
                        for (let x = enemy[1] + 1; x < col - 1; x++) {
                            if (this.matrix[row + 1][x] !== 0) {
                                return null
                            }
                        }
                        if (this.matrix[row + 1][col - 1] !== 0) {
                            return [6]
                        } else if (this.matrix[row + 1][col] !== 0) {
                            return [6, 7]
                        }
                    } else if (enemy[1] > col + 1) {
                        for (let x = col + 2; x < enemy[1]; x++) {
                            if (this.matrix[row + 1][x] !== 0) {
                                return null
                            }
                        }
                        if (this.matrix[row + 1][col + 1] !== 0) {
                            return [8]
                        } else if (this.matrix[row + 1][col] !== 0) {
                            return [7, 8]
                        }
                    }
                    return [6, 7, 8]
                } else if (enemy[1] === col - 1) {
                    if (enemy[0] < row - 1) {
                        for (let x = enemy[0] + 1; x < row - 1; x++) {
                            if (this.matrix[x][col - 1] !== 0) {
                                return null
                            }
                        }
                        if (this.matrix[row - 1][col - 1] !== 0) {
                            return [1]
                        } else if (this.matrix[row][col - 1] !== 0) {
                            return [1, 4]
                        }
                    } else if (enemy[0] > row + 1) {
                        for (let x = row + 2; x < enemy[0]; x++) {
                            if (this.matrix[x][col - 1] !== 0) {
                                return null
                            }
                        }
                        if (this.matrix[row + 1][col - 1] !== 0) {
                            return [6]
                        } else if (this.matrix[row][col - 1] !== 0) {
                            return [4, 6]
                        }
                    }
                    return [1, 4, 6]
                } else if (enemy[1] === col) {
                    if (enemy[0] < row - 1) {
                        for (let x = enemy[0] + 1; x < row - 1; x++) {
                            if (this.matrix[x][col] !== 0) {
                                return null
                            }
                        }
                        if (this.matrix[row - 1][col] !== 0) {
                            return [2]
                        }
                    } else if (enemy[0] > row + 1) {
                        for (let x = row + 2; x < enemy[0]; x++) {
                            if (this.matrix[x][col] !== 0) {
                                return null
                            }
                        }
                        if (this.matrix[row + 1][col] !== 0) {
                            return [7]
                        }
                    }
                    return [2, 7]
                } else if (enemy[1] === col + 1) {
                    if (enemy[0] < row - 1) {
                        for (let x = enemy[0] + 1; x < row - 1; x++) {
                            if (this.matrix[x][col + 1] !== 0) {
                                return null
                            }
                        }
                        if (this.matrix[row - 1][col + 1] !== 0) {
                            return [3]
                        } else if (this.matrix[row][col + 1] !== 0) {
                            return [3, 5]
                        }
                    } else if (enemy[0] > row + 1) {
                        for (let x = row + 2; x < enemy[0]; x++) {
                            if (this.matrix[x][col + 1] !== 0) {
                                return null
                            }
                        }
                        if (this.matrix[row + 1][col + 1] !== 0) {
                            return [8]
                        } else if (this.matrix[row][col + 1] !== 0) {
                            return [5, 8]
                        }
                    }
                    return [3, 5, 8]
                }
            } else {
                if (
                    enemy[0] !== (row - 1) &&
                    enemy[1] !== (col - 1) &&
                    Math.abs(enemy[0] - (row - 1)) === Math.abs(enemy[1] - (col - 1))
                ) {
                    if (
                        enemy[0] !== (row + 1) &&
                        enemy[1] !== (col + 1) &&
                        Math.abs(enemy[0] - (row + 1)) === Math.abs(enemy[1] - (col + 1))
                    ) {
                        if (enemy[0] < (row - 1) && enemy[1] < (col - 1)) {
                            for (let x = 1; x < Math.abs(enemy[0] - (row - 1)); x++) {
                                if (this.matrix[enemy[0] + x][enemy[1] + x] !== 0) {
                                    return null
                                }
                            }
                            if (this.matrix[row - 1][col - 1] !== 0) {
                                return [1]
                            }
                        } else if (enemy[0] > (row + 1) && enemy[1] > (col + 1)) {
                            for (let x = 1; x < Math.abs(enemy[0] - (row + 1)); x++) {
                                if (this.matrix[enemy[0] - x][enemy[1] - x] !== 0) {
                                    return null
                                }
                            }
                            if (this.matrix[row + 1][col + 1] !== 0) {
                                return [8]
                            }
                        }
                        return [1, 8]
                    } else {
                        if (enemy[0] < (row - 1) && enemy[1] > (col - 1)) {
                            for (let x = 1; x < Math.abs(enemy[0] - (row - 1)); x++) {
                                if (this.matrix[enemy[0] + x][enemy[1] - x] !== 0) {
                                    return null
                                }
                            }
                        } else if (enemy[0] > (row - 1) && enemy[1] < (col - 1)) {
                            for (let x = 1; x < Math.abs(enemy[0] - (row - 1)); x++) {
                                if (this.matrix[enemy[0] - x][enemy[1] + x] !== 0) {
                                    return null
                                }
                            }
                        }
                        return [1]
                    }
                } else if (
                    enemy[0] !== (row - 1) &&
                    enemy[1] !== col &&
                    Math.abs(enemy[0] - (row - 1)) === Math.abs(enemy[1] - col)
                ) {
                    if (
                        enemy[0] !== row &&
                        enemy[1] !== (col + 1) &&
                        Math.abs(enemy[0] - row) === Math.abs(enemy[1] - (col + 1))
                    ) {
                        if (enemy[0] < (row - 1) && enemy[1] < col) {
                            for (let x = 1; x < Math.abs(enemy[0] - (row - 1)); x++) {
                                if (this.matrix[enemy[0] + x][enemy[1] + x] !== 0) {
                                    return null
                                }
                            }
                            if (this.matrix[row - 1][col] !== 0) {
                                return [2]
                            }
                        } else if (enemy[0] > row && enemy[1] > (col + 1)) {
                            for (let x = 1; x < Math.abs(enemy[0] - row); x++) {
                                if (this.matrix[enemy[0] - x][enemy[1] - x] !== 0) {
                                    return null
                                }
                            }
                            if (this.matrix[row][col + 1] !== 0) {
                                return [5]
                            }
                        }
                        return [2, 5]
                    } else if (
                        enemy[0] !== row &&
                        enemy[1] !== (col - 1) &&
                        Math.abs(enemy[0] - row) === Math.abs(enemy[1] - (col - 1))
                    ) {
                        if (enemy[0] < (row - 1) && enemy[1] > col) {
                            for (let x = 1; x < Math.abs(enemy[0] - (row - 1)); x++) {
                                if (this.matrix[enemy[0] + x][enemy[1] - x] !== 0) {
                                    return null
                                }
                            }
                            if (this.matrix[row - 1][col] !== 0) {
                                return [2]
                            }
                        } else if (enemy[0] > row && enemy[1] < (col - 1)) {
                            for (let x = 1; x < Math.abs(enemy[0] - row); x++) {
                                if (this.matrix[enemy[0] - x][enemy[1] + x] !== 0) {
                                    return null
                                }
                            }
                            if (this.matrix[row][col - 1] !== 0) {
                                return [4]
                            }
                        }
                        return [2, 4]
                    }
                } else if (
                    enemy[0] !== (row - 1) &&
                    enemy[1] !== (col + 1) &&
                    Math.abs(enemy[0] - (row - 1)) === Math.abs(enemy[1] - (col + 1))
                ) {
                    if (
                        enemy[0] !== (row + 1) &&
                        enemy[1] !== (col - 1) &&
                        Math.abs(enemy[0] - (row + 1)) === Math.abs(enemy[1] - (col - 1))
                    ) {
                        if (enemy[0] < (row - 1) && enemy[1] > (col + 1)) {
                            for (let x = 1; x < Math.abs(enemy[0] - (row - 1)); x++) {
                                if (this.matrix[enemy[0] + x][enemy[1] - x] !== 0) {
                                    return null
                                }
                            }
                            if (this.matrix[row - 1][col + 1] !== 0) {
                                return [3]
                            }
                        } else if (enemy[0] > (row + 1) && enemy[1] < (col - 1)) {
                            for (let x = 1; x < Math.abs(enemy[0] - (row + 1)); x++) {
                                if (this.matrix[enemy[0] - x][enemy[1] + x] !== 0) {
                                    return null
                                }
                            }
                            if (this.matrix[row + 1][col - 1] !== 0) {
                                return [6]
                            }
                        }
                        return [3, 6]
                    } else {
                        if (enemy[0] < (row - 1) && enemy[1] < (col + 1)) {
                            for (let x = 1; x < Math.abs(enemy[0] - (row - 1)); x++) {
                                if (this.matrix[enemy[0] + x][enemy[1] + x] !== 0) {
                                    return null
                                }
                            }
                        } else if (enemy[0] > (row - 1) && enemy[1] > (col + 1)) {
                            for (let x = 1; x < Math.abs(enemy[0] - (row - 1)); x++) {
                                if (this.matrix[enemy[0] - x][enemy[1] - x] !== 0) {
                                    return null
                                }
                            }
                        }
                        return [3]
                    }
                } else if (
                    enemy[0] !== row &&
                    enemy[1] !== (col - 1) &&
                    Math.abs(enemy[0] - row) === Math.abs(enemy[1] - (col - 1))
                ) {
                    if (
                        enemy[0] !== (row + 1) &&
                        enemy[1] !== col &&
                        Math.abs(enemy[0] - (row + 1)) === Math.abs(enemy[1] - col)
                    ) {
                        if (enemy[0] < row && enemy[1] < (col - 1)) {
                            for (let x = 1; x < Math.abs(enemy[0] - row); x++) {
                                if (this.matrix[enemy[0] + x][enemy[1] + x] !== 0) {
                                    return null
                                }
                            }
                            if (this.matrix[row - 1][col] !== 0) {
                                return [4]
                            }
                        } else if (enemy[0] > (row + 1) && enemy[1] > col) {
                            for (let x = 1; x < Math.abs(enemy[0] - row); x++) {
                                if (this.matrix[enemy[0] - x][enemy[1] - x] !== 0) {
                                    return null
                                }
                            }
                            if (this.matrix[row + 1][col] !== 0) {
                                return [7]
                            }
                        }

                        return [4, 7]
                    }
                } else if (
                    enemy[0] !== row &&
                    enemy[1] !== (col + 1) &&
                    Math.abs(enemy[0] - row) === Math.abs(enemy[1] - (col + 1))
                ) {
                    if (
                        enemy[0] !== (row + 1) &&
                        enemy[1] !== col &&
                        Math.abs(enemy[0] - (row + 1)) === Math.abs(enemy[1] - col)
                    ) {
                        if (enemy[0] < row && enemy[1] > (col + 1)) {
                            for (let x = 1; x < Math.abs(enemy[0] - row); x++) {
                                if (this.matrix[enemy[0] + x][enemy[1] - x] !== 0) {
                                    return null
                                }
                            }
                            if (this.matrix[row][col + 1] !== 0) {
                                return [5]
                            }
                        } else if (enemy[0] > (row + 1) && enemy[1] < col) {
                            for (let x = 1; x < Math.abs(enemy[0] - row); x++) {
                                if (this.matrix[enemy[0] - x][enemy[1] + x] !== 0) {
                                    return null
                                }
                            }
                            if (this.matrix[row + 1][col] !== 0) {
                                return [7]
                            }
                        }
                        return [5, 7]
                    }
                } else if (
                    enemy[0] !== (row + 1) &&
                    enemy[1] !== (col - 1) &&
                    Math.abs(enemy[0] - (row + 1)) === Math.abs(enemy[1] - (col - 1))
                ) {
                    if (enemy[0] < (row + 1) && enemy[1] < (col - 1)) {
                        for (let x = 1; x < Math.abs(enemy[0] - (row + 1)); x++) {
                            if (this.matrix[enemy[0] + x][enemy[1] + x] !== 0) {
                                return null
                            }
                        }
                    } else if (enemy[0] > (row + 1) && enemy[1] > (col - 1)) {
                        for (let x = 1; x < Math.abs(enemy[0] - (row + 1)); x++) {
                            if (this.matrix[enemy[0] - x][enemy[1] - x] !== 0) {
                                return null
                            }
                        }
                    }
                    return [6]
                } else if (
                    enemy[0] !== (row + 1) &&
                    enemy[1] !== (col + 1) &&
                    Math.abs(enemy[0] - (row + 1)) === Math.abs(enemy[1] - (col + 1))
                ) {
                    if (enemy[0] < (row + 1) && enemy[1] > (col + 1)) {
                        for (let x = 1; x < Math.abs(enemy[0] - (row + 1)); x++) {
                            if (this.matrix[enemy[0] + x][enemy[1] - x] !== 0) {
                                return null
                            }
                        }
                    } else if (enemy[0] > (row + 1) && enemy[1] < (col + 1)) {
                        for (let x = 1; x < Math.abs(enemy[0] - (row + 1)); x++) {
                            if (this.matrix[enemy[0] - x][enemy[1] + x] !== 0) {
                                return null
                            }
                        }
                    }
                    return [8]
                }
            }
        } else if (this.matrix[enemy[0]][enemy[1]] === 12) {
            if (enemy[0] === row - 2 && enemy[1] === col - 2) {
                return [1]
            } else if (enemy[0] === row - 2 && enemy[1] === col - 1) {
                return [1, 2]
            } else if (enemy[0] === row - 2 && enemy[1] === col) {
                return [1, 2, 3]
            } else if (enemy[0] === row - 2 && enemy[1] === col + 1) {
                return [2, 3]
            } else if (enemy[0] === row - 2 && enemy[1] === col + 2) {
                return [3]
            } else if (enemy[0] === row - 1 && enemy[1] === col - 2) {
                return [1, 4]
            } else if (enemy[0] === row - 1 && enemy[1] === col - 1) {
                return [2, 4]
            } else if (enemy[0] === row - 1 && enemy[1] === col) {
                return [1, 3, 4, 5]
            } else if (enemy[0] === row - 1 && enemy[1] === col + 1) {
                return [2, 5]
            } else if (enemy[0] === row - 1 && enemy[1] === col + 2) {
                return [3, 5]
            } else if (enemy[0] === row && enemy[1] === col - 2) {
                return [1, 4, 6]
            } else if (enemy[0] === row && enemy[1] === col - 1) {
                return [1, 2, 6, 7]
            } else if (enemy[0] === row && enemy[1] === col + 1) {
                return [2, 3, 7, 8]
            } else if (enemy[0] === row && enemy[1] === col + 2) {
                return [3, 5, 8]
            } else if (enemy[0] === row + 1 && enemy[1] === col - 2) {
                return [4, 6]
            } else if (enemy[0] === row + 1 && enemy[1] === col - 1) {
                return [4, 7]
            } else if (enemy[0] === row + 1 && enemy[1] === col) {
                return [4, 5, 6, 8]
            } else if (enemy[0] === row + 1 && enemy[1] === col + 1) {
                return [5, 7]
            } else if (enemy[0] === row + 1 && enemy[1] === col + 2) {
                return [5, 8]
            } else if (enemy[0] === row + 2 && enemy[1] === col - 2) {
                return [6]
            } else if (enemy[0] === row + 2 && enemy[1] === col - 1) {
                return [6, 7]
            } else if (enemy[0] === row + 2 && enemy[1] === col) {
                return [6, 7, 8]
            } else if (enemy[0] === row + 2 && enemy[1] === col + 1) {
                return [7, 8]
            } else if (enemy[0] === row + 2 && enemy[1] === col + 2) {
                return [8]
            }
        }
    }

    // checking the castling is possible or not
    #castle(x) {
        let list1
        const [king_row, king_col] = this.king
        // Check whether the path between king and rook is empty
        let castle = false
        if (x > king_col) {
            if (king_col >= this.collen - 2) {
                castle = false
            } else {
                castle = true
                for (let col = king_col + 1; col < x; col++) {
                    if (this.matrix[king_row][col] !== 0) {
                        castle = false
                        break
                    }
                }
            }
        } else if (x < king_col) {
            if (king_col <= 1) {
                castle = false
            } else {
                castle = true
                for (let col = x + 1; col < king_col; col++) {
                    if (this.matrix[king_row][col] !== 0) {
                        castle = false
                        break
                    }
                }
            }
        }
        // If path is clear, temporarily perform castling
        if (castle) {
            const matrix = this.matrix
            let king_next
            let rook_next
            if (x > king_col) {
                king_next = king_col + 2
                rook_next = king_col + 1
            } else if (x < king_col) {
                king_next = king_col - 2
                rook_next = king_col - 1
            }
            // Temporarily move pieces
            matrix[king_row][rook_next] = 4
            matrix[king_row][x] = 0
            matrix[king_row][king_next] = 6
            matrix[king_row][king_col] = 0
            this.king = [king_row, king_next]

            const [check_box, king_only] = this.#check()
            if (Object.keys(check_box).length === 0 && !king_only) {
                list1 = [king_row, king_next]
            }
            // Restore pieces
            matrix[king_row][king_col] = 6
            matrix[king_row][king_next] = 0
            matrix[king_row][x] = 4
            matrix[king_row][rook_next] = 0
            this.king = [king_row, king_col]
        }
        return list1
    }

    // It calculate the steps possible of the choosen chessman 
    #pawn(row, col) {
        let list1 = []
        if (row < this.rowlen - 1) {
            if (row === 1) {
                if (this.matrix[row + 1][col] === 0 && this.matrix[row + 2][col] === 0) {
                    list1 = [
                        this._makeNode([row + 1, col]),
                        this._makeNode([row + 2, col])
                    ]
                } else if (this.matrix[row + 1][col] === 0) {
                    list1 = [this._makeNode([row + 1, col])]
                }
            } else {
                if (this.matrix[row + 1][col] === 0) {
                    list1 = [this._makeNode([row + 1, col])]
                }
            }
            if (col - 1 >= 0) {
                if (this.matrix[row + 1][col - 1] !== 0 && this.matrix[row + 1][col - 1] > 6) {
                    list1.push(this._makeNode([row + 1, col - 1]))
                }
            }
            if (col + 1 < this.collen) {
                if (this.matrix[row + 1][col + 1] !== 0 && this.matrix[row + 1][col + 1] > 6) {
                    list1.push(this._makeNode([row + 1, col + 1]))
                }
            }
        }
        return list1.filter(node => node != null)
    }
    #knight(row, col) {
        let list1 = []
        const moves = [[1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2]]
        for (let [dr, dc] of moves) {
            const r = row + dr
            const c = col + dc
            if (r >= 0 && r < this.rowlen && c >= 0 && c < this.collen && (this.matrix[r][c] === 0 || this.matrix[r][c] > 6)) {
                list1.push(this._makeNode([r, c]))
            }
        }
        return list1.filter(node => node != null)
    }
    #bishop(row, col) {
        const directions = [[-1, +1], [+1, +1], [+1, -1], [-1, -1]]
        let moves = []
        for (const [dr, dc] of directions)
            moves = moves.concat(this.#slide(row, col, dr, dc))
        return moves
    }
    #rook(row, col) {
        const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]]
        let moves = []
        for (const [dr, dc] of directions) {
            moves = moves.concat(this.#slide(row, col, dr, dc))
        }
        return moves
    }
    #queen(row, col) {
        const directions = [[-1, 0], [0, 1], [1, 0], [0, -1], [-1, 1], [1, 1], [1, -1], [-1, -1]]
        let moves = []
        for (const [dr, dc] of directions) {
            moves = moves.concat(this.#slide(row, col, dr, dc))
        }
        return moves
    }
    #king(row, col) {
        let list1 = []
        const s = new Set()
        this.enemy.forEach(e => {
            const res = this.#filterEnemy([e[0], row, col])
            if (res) {
                res.forEach(v => s.add(v))
            }
        })
        const directions = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]
        for (let i = 0; i < 8; i++) {
            const [dr, dc] = directions[i]
            const r = row + dr
            const c = col + dc
            if (r >= 0 && r < this.rowlen && c >= 0 && c < this.collen && (this.matrix[r][c] >= 7 || this.matrix[r][c] === 0) && !s.has(i + 1)) {
                list1.push([r, c])
            }
        }
        if (this.castle.length !== 0) {
            const side = [!s.has(4), !s.has(5)]
            const [check_path, king_only] = this.#check()
            for (const x of this.castle) {
                if (x > col && side[1]) {
                    if (Object.keys(check_path).length === 0 && !king_only) {
                        list1.push(this.#castle(x))
                    }
                } else if (x < col && side[0]) {
                    if (Object.keys(check_path).length === 0 && !king_only) {
                        list1.push(this.#castle(x))
                    }
                }
            }
        }
        return list1.filter(node => node != null)
    }

    #slide(row, col, dr, dc) {
        let moves = []
        let r = row + dr
        let c = col + dc
        while (r >= 0 && r < this.rowlen && c >= 0 && c < this.collen) {
            if (this.matrix[r][c] === 0) {
                moves.push(this._makeNode([r, c]))
            } else if (this.matrix[r][c] >= 7) {
                moves.push(this._makeNode([r, c]))
                break
            } else {
                break
            }
            r += dr
            c += dc
        }
        return moves.filter(node => node != null)
    }
}

// range 7 - 12
export class PlayerChessman_2 extends Board {
    constructor(board, pos, rowlen, collen) {
        if (board.matrix[pos[0]][pos[1]] === 0 || (board.matrix[pos[0]][pos[1]] >= 1 && board.matrix[pos[0]][pos[1]] <= 6)) {
            throw new RangeError(
                `Invalid piece at [${row}, ${col}]: ${board.matrix[row][col]}. ` +
                `Expected a player piece (7-12).`
            )
        }
        super()
        this.matrix = board.matrix.map(row => [...row])
        this.pos = pos
        this.enemy = board.player1
        this.king = board.king2
        this.castle = board.castle2
        this.rowlen = rowlen
        this.collen = collen
    }

    [Symbol.iterator]() {
        const [row, col] = this.pos
        const piece = this.matrix[row][col]
        if (this._canMove(this.pos)) {
            let king_only
            [this._check_path, king_only] = this.#check()
            if (piece === 7 && !king_only) {
                return this.#pawn(row, col)[Symbol.iterator]()
            } else if (piece === 8 && !king_only) {
                return this.#knight(row, col)[Symbol.iterator]()
            } else if (piece === 9 && !king_only) {
                return this.#bishop(row, col)[Symbol.iterator]()
            } else if (piece === 10 && !king_only) {
                return this.#rook(row, col)[Symbol.iterator]()
            } else if (piece === 11 && !king_only) {
                return this.#queen(row, col)[Symbol.iterator]()
            } else if (piece === 12) {
                return this.#king(row, col)[Symbol.iterator]()
            }
        }
        return [][Symbol.iterator]()
    }

    // check if check then get the only positions where it can only move
    #check() {
        let encounter = 0
        let check_box = {}
        for (const x of this.enemy) {
            if (x[1] === 6) {
                continue
            }
            let list1 = {}
            const [kr, kc] = this.king
            const [r, c] = x[0]
            let steps = []
            const piece = x[1]
            if (piece === 1) {
                if (r + 1 === kr && c - 1 === kc) {
                    list1[[`${r},${c}`]] = true
                    encounter++
                } else if (r + 1 === kr && c + 1 === kc) {
                    list1[[`${r},${c}`]] = true
                    encounter++
                }
            } else if (piece === 2) {
                if ((r - 1 === kr && c - 2 === kc) || (r - 1 === kr && c + 2 === kc) || (r + 1 === kr && c - 2 === kc) || (r + 1 === kr && c + 2 === kc) || (r - 2 === kr && c - 1 === kc) || (r - 2 === kr && c + 1 === kc) || (r + 2 === kr && c - 1 === kc) || (r + 2 === kr && c + 1 === kc)) {
                    list1[[`${r},${c}`]] = true
                    encounter++
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
                list1[`${r},${c}`] = true
                let row = r + steps[0]
                let col = c + steps[1]
                while (row >= 0 && row < this.rowlen && col >= 0 && col < this.collen) {
                    if (this.matrix[row][col] === 0) {
                        list1[`${row},${col}`] = true
                    } else if (this.matrix[row][col] === 12) {
                        encounter++
                        break
                    } else {
                        list1 = {}
                        break
                    }
                    row += steps[0]
                    col += steps[1]
                }
            }
            if (Object.keys(list1).length !== 0) {
                check_box = {...list1}
            }
            if (encounter === 2) {
                return [{}, true]
            }
        }
        if (encounter === 1) {
            return [check_box, false]
        } else {
            return [{}, false]
        }
    }

    // filter outs the enemy which is affecting the kings next move
    #filterEnemy(arg) {
        const [enemy, row, col] = arg
        if (this.matrix[enemy[0]][enemy[1]] === 1) {
            if (enemy[0] === row - 2 && enemy[1] === col - 2) {
                return [1]
            } else if (enemy[0] === row - 2 && enemy[1] === col - 1) {
                return [2]
            } else if (enemy[0] === row - 2 && enemy[1] === col) {
                return [1, 3]
            } else if (enemy[0] === row - 2 && enemy[1] === col + 1) {
                return [2]
            } else if (enemy[0] === row - 2 && enemy[1] === col + 2) {
                return [3]
            } else if (enemy[0] === row - 1 && enemy[1] === col - 2) {
                return [4]
            } else if (enemy[0] === row - 1 && enemy[1] === col) {
                return [4, 5]
            } else if (enemy[0] === row - 1 && enemy[1] === col + 2) {
                return [5]
            } else if (enemy[0] === row && enemy[1] === col - 2) {
                return [6]
            } else if (enemy[0] === row && enemy[1] === col - 1) {
                return [7]
            } else if (enemy[0] === row && enemy[1] === col + 1) {
                return [7]
            } else if (enemy[0] === row && enemy[1] === col + 2) {
                return [8]
            }
        } else if (this.matrix[enemy[0]][enemy[1]] === 2) {
            if (enemy[0] === row - 3 && enemy[1] === col - 2) {
                return [1]
            } else if (enemy[0] === row - 3 && enemy[1] === col - 1) {
                return [2]
            } else if (enemy[0] === row - 3 && enemy[1] === col) {
                return [1, 3]
            } else if (enemy[0] === row - 3 && enemy[1] === col + 1) {
                return [2]
            } else if (enemy[0] === row - 3 && enemy[1] === col + 2) {
                return [3]
            } else if (enemy[0] === row - 2 && enemy[1] === col - 3) {
                return [1]
            } else if (enemy[0] === row - 2 && enemy[1] === col - 2) {
                return [2, 4]
            } else if (enemy[0] === row - 2 && enemy[1] === col - 1) {
                return [3]
            } else if (enemy[0] === row - 2 && enemy[1] === col) {
                return [4, 5]
            } else if (enemy[0] === row - 2 && enemy[1] === col + 1) {
                return [1]
            } else if (enemy[0] === row - 2 && enemy[1] === col + 2) {
                return [2, 5]
            } else if (enemy[0] === row - 2 && enemy[1] === col + 3) {
                return [3]
            } else if (enemy[0] === row - 1 && enemy[1] === col - 3) {
                return [4]
            } else if (enemy[0] === row - 1 && enemy[1] === col - 2) {
                return [6]
            } else if (enemy[0] === row - 1 && enemy[1] === col - 1) {
                return [5, 7]
            } else if (enemy[0] === row - 1 && enemy[1] === col) {
                return [6, 8]
            } else if (enemy[0] === row - 1 && enemy[1] === col + 1) {
                return [4, 7]
            } else if (enemy[0] === row - 1 && enemy[1] === col + 2) {
                return [8]
            } else if (enemy[0] === row - 1 && enemy[1] === col + 3) {
                return [5]
            } else if (enemy[0] === row && enemy[1] === col - 3) {
                return [1, 6]
            } else if (enemy[0] === row && enemy[1] === col - 2) {
                return [2, 7]
            } else if (enemy[0] === row && enemy[1] === col - 1) {
                return [3, 8]
            } else if (enemy[0] === row && enemy[1] === col + 1) {
                return [1, 6]
            } else if (enemy[0] === row && enemy[1] === col + 2) {
                return [2, 7]
            } else if (enemy[0] === row && enemy[1] === col + 3) {
                return [3, 8]
            } else if (enemy[0] === row + 1 && enemy[1] === col - 3) {
                return [4]
            } else if (enemy[0] === row + 1 && enemy[1] === col - 2) {
                return [1]
            } else if (enemy[0] === row + 1 && enemy[1] === col - 1) {
                return [2, 5]
            } else if (enemy[0] === row + 1 && enemy[1] === col) {
                return [1, 3]
            } else if (enemy[0] === row + 1 && enemy[1] === col + 1) {
                return [2, 4]
            } else if (enemy[0] === row + 1 && enemy[1] === col + 2) {
                return [3]
            } else if (enemy[0] === row + 1 && enemy[1] === col + 3) {
                return [5]
            } else if (enemy[0] === row + 2 && enemy[1] === col - 3) {
                return [6]
            } else if (enemy[0] === row + 2 && enemy[1] === col - 2) {
                return [4, 7]
            } else if (enemy[0] === row + 2 && enemy[1] === col - 1) {
                return [8]
            } else if (enemy[0] === row + 2 && enemy[1] === col) {
                return [4, 5]
            } else if (enemy[0] === row + 2 && enemy[1] === col + 1) {
                return [6]
            } else if (enemy[0] === row + 2 && enemy[1] === col + 2) {
                return [5, 7]
            } else if (enemy[0] === row + 2 && enemy[1] === col + 3) {
                return [8]
            } else if (enemy[0] === row - 3 && enemy[1] === col - 2) {
                return [6]
            } else if (enemy[0] === row - 3 && enemy[1] === col - 1) {
                return [7]
            } else if (enemy[0] === row - 3 && enemy[1] === col) {
                return [6, 8]
            } else if (enemy[0] === row - 3 && enemy[1] === col + 1) {
                return [7]
            } else if (enemy[0] === row - 3 && enemy[1] === col + 2) {
                return [8]
            }
        } else if (this.matrix[enemy[0]][enemy[1]] === 3) {
            if (enemy[0] === (row + 2) && enemy[1] === col) {
                return [6, 8]
            } else if ((enemy[0] === (row + 1) && enemy[1] === col) || (enemy[0] === (row - 1) && enemy[1] === col)) {
                return [4, 5]
            } else if (enemy[0] === (row - 2) && enemy[1] === col) {
                return [1, 3]
            } else if (enemy[0] === row && enemy[1] === (col + 2)) {
                return [3, 8]
            } else if ((enemy[0] === row && enemy[1] === (col + 1)) || (enemy[0] === row && enemy[1] === (col - 1))) {
                return [2, 7]
            } else if (enemy[0] === row && enemy[1] === (col - 2)) {
                return [1, 6]
            } else {
                if (enemy[0] !== (row - 1) && enemy[1] !== (col - 1) && Math.abs(enemy[0] - (row - 1)) === Math.abs(enemy[1] - (col - 1))) {
                    if (enemy[0] !== (row + 1) && enemy[1] !== (col + 1) && Math.abs(enemy[0] - (row + 1)) === Math.abs(enemy[1] - (col + 1))) {
                        if (enemy[0] < (row - 1) && enemy[1] < (col - 1)) {
                            for (let x = 1; x < Math.abs(enemy[0] - (row - 1)); x++) {
                                if (this.matrix[enemy[0] + x][enemy[1] + x] !== 0) {
                                    return null
                                }
                            }
                            if (this.matrix[row - 1][col - 1] !== 0) {
                                return [1]
                            }
                        } else if (enemy[0] > (row + 1) && enemy[1] > (col + 1)) {
                            for (let x = 1; x < Math.abs(enemy[0] - (row + 1)); x++) {
                                if (this.matrix[enemy[0] - x][enemy[1] - x] !== 0) {
                                    return null
                                }
                            }
                            if (this.matrix[row + 1][col + 1] !== 0) {
                                return [8]
                            }
                        }
                        return [1, 8]
                    } else {
                        if (enemy[0] < (row - 1) && enemy[1] > (col - 1)) {
                            for (let x = 1; x < Math.abs(enemy[0] - (row - 1)); x++) {
                                if (this.matrix[enemy[0] + x][enemy[1] - x] !== 0) {
                                    return null
                                }
                            }
                        } else if (enemy[0] > (row - 1) && enemy[1] < (col - 1)) {
                            for (let x = 1; x < Math.abs(enemy[0] - (row - 1)); x++) {
                                if (this.matrix[enemy[0] - x][enemy[1] + x] !== 0) {
                                    return null
                                }
                            }
                        }
                        return [1]
                    }
                } else if (enemy[0] !== (row - 1) && enemy[1] !== col && Math.abs(enemy[0] - (row - 1)) === Math.abs(enemy[1] - col)) {
                    if (enemy[0] !== row && enemy[1] !== (col + 1) && Math.abs(enemy[0] - row) === Math.abs(enemy[1] - (col + 1))) {
                        if (enemy[0] < (row - 1) && enemy[1] < col) {
                            for (let x = 1; x < Math.abs(enemy[0] - (row - 1)); x++) {
                                if (this.matrix[enemy[0] + x][enemy[1] + x] !== 0) {
                                    return null
                                }
                            }
                            if (this.matrix[row - 1][col] !== 0) {
                                return [2]
                            }
                        } else if (enemy[0] > row && enemy[1] > (col + 1)) {
                            for (let x = 1; x < Math.abs(enemy[0] - row); x++) {
                                if (this.matrix[enemy[0] - x][enemy[1] - x] !== 0) {
                                    return null
                                }
                            }
                            if (this.matrix[row][col + 1] !== 0) {
                                return [5]
                            }
                        }
                        return [2, 5]
                    } else if (enemy[0] !== row && enemy[1] !== (col - 1) && Math.abs(enemy[0] - row) === Math.abs(enemy[1] - (col - 1))) {
                        if (enemy[0] < (row - 1) && enemy[1] > col) {
                            for (let x = 1; x < Math.abs(enemy[0] - (row - 1)); x++) {
                                if (this.matrix[enemy[0] + x][enemy[1] - x] !== 0) {
                                    return null
                                }
                            }
                            if (this.matrix[row - 1][col] !== 0) {
                                return [2]
                            }
                        } else if (enemy[0] > row && enemy[1] < (col - 1)) {
                            for (let x = 1; x < Math.abs(enemy[0] - row); x++) {
                                if (this.matrix[enemy[0] - x][enemy[1] + x] !== 0) {
                                    return null
                                }
                            }
                            if (this.matrix[row][col - 1] !== 0) {
                                return [4]
                            }
                        }
                        return [2, 4]
                    }
                } else if (enemy[0] !== (row - 1) && enemy[1] !== (col + 1) && Math.abs(enemy[0] - (row - 1)) === Math.abs(enemy[1] - (col + 1))) {
                    if (enemy[0] !== (row + 1) && enemy[1] !== (col - 1) && Math.abs(enemy[0] - (row + 1)) === Math.abs(enemy[1] - (col - 1))) {
                        if (enemy[0] < (row - 1) && enemy[1] > (col + 1)) {
                            for (let x = 1; x < Math.abs(enemy[0] - (row - 1)); x++) {
                                if (this.matrix[enemy[0] + x][enemy[1] - x] !== 0) {
                                    return null
                                }
                            }
                            if (this.matrix[row - 1][col + 1] !== 0) {
                                return [3]
                            }
                        } else if (enemy[0] > (row + 1) && enemy[1] < (col - 1)) {
                            for (let x = 1; x < Math.abs(enemy[0] - (row + 1)); x++) {
                                if (this.matrix[enemy[0] - x][enemy[1] + x] !== 0) {
                                    return null
                                }
                            }
                            if (this.matrix[row + 1][col - 1] !== 0) {
                                return [6]
                            }
                        }
                        return [3, 6]
                    } else {
                        if (enemy[0] < (row - 1) && enemy[1] < (col + 1)) {
                            for (let x = 1; x < Math.abs(enemy[0] - (row - 1)); x++) {
                                if (this.matrix[enemy[0] + x][enemy[1] + x] !== 0) {
                                    return null
                                }
                            }
                        } else if (enemy[0] > (row - 1) && enemy[1] > (col + 1)) {
                            for (let x = 1; x < Math.abs(enemy[0] - (row - 1)); x++) {
                                if (this.matrix[enemy[0] - x][enemy[1] - x] !== 0) {
                                    return null
                                }
                            }
                        }
                        return [3]
                    }
                } else if (enemy[0] !== row && enemy[1] !== (col - 1) && Math.abs(enemy[0] - row) === Math.abs(enemy[1] - (col - 1))) {
                    if (enemy[0] !== (row + 1) && enemy[1] !== col && Math.abs(enemy[0] - (row + 1)) === Math.abs(enemy[1] - col)) {
                        if (enemy[0] < row && enemy[1] < (col - 1)) {
                            for (let x = 1; x < Math.abs(enemy[0] - row); x++) {
                                if (this.matrix[enemy[0] + x][enemy[1] + x] !== 0) {
                                    return null
                                }
                            }
                            if (this.matrix[row - 1][col] !== 0) {
                                return [4]
                            }
                        } else if (enemy[0] > (row + 1) && enemy[1] > col) {
                            for (let x = 1; x < Math.abs(enemy[0] - row); x++) {
                                if (this.matrix[enemy[0] - x][enemy[1] - x] !== 0) {
                                    return null
                                }
                            }
                            if (this.matrix[row + 1][col] !== 0) {
                                return [7]
                            }
                        }
                        return [4, 7]
                    }
                } else if (enemy[0] !== row && enemy[1] !== (col + 1) && Math.abs(enemy[0] - row) === Math.abs(enemy[1] - (col + 1))) {
                    if (enemy[0] !== (row + 1) && enemy[1] !== col && Math.abs(enemy[0] - (row + 1)) === Math.abs(enemy[1] - col)) {
                        if (enemy[0] < row && enemy[1] > (col + 1)) {
                            for (let x = 1; x < Math.abs(enemy[0] - row); x++) {
                                if (this.matrix[enemy[0] + x][enemy[1] - x] !== 0) {
                                    return null
                                }
                            }
                            if (this.matrix[row][col + 1] !== 0) {
                                return [5]
                            }
                        } else if (enemy[0] > (row + 1) && enemy[1] < col) {
                            for (let x = 1; x < Math.abs(enemy[0] - row); x++) {
                                if (this.matrix[enemy[0] - x][enemy[1] + x] !== 0) {
                                    return null
                                }
                            }
                            if (this.matrix[row + 1][col] !== 0) {
                                return [7]
                            }
                        }
                        return [5, 7]
                    }
                } else if (enemy[0] !== (row + 1) && enemy[1] !== (col - 1) && Math.abs(enemy[0] - (row + 1)) === Math.abs(enemy[1] - (col - 1))) {
                    if (enemy[0] < (row + 1) && enemy[1] < (col - 1)) {
                        for (let x = 1; x < Math.abs(enemy[0] - (row + 1)); x++) {
                            if (this.matrix[enemy[0] + x][enemy[1] + x] !== 0) {
                                return null
                            }
                        }
                    } else if (enemy[0] > (row + 1) && enemy[1] > (col - 1)) {
                        for (let x = 1; x < Math.abs(enemy[0] - (row + 1)); x++) {
                            if (this.matrix[enemy[0] - x][enemy[1] - x] !== 0) {
                                return null
                            }
                        }
                    }
                    return [6]
                } else if (enemy[0] !== (row + 1) && enemy[1] !== (col + 1) && Math.abs(enemy[0] - (row + 1)) === Math.abs(enemy[1] - (col + 1))) {
                    if (enemy[0] < (row + 1) && enemy[1] > (col + 1)) {
                        for (let x = 1; x < Math.abs(enemy[0] - (row + 1)); x++) {
                            if (this.matrix[enemy[0] + x][enemy[1] - x] !== 0) {
                                return null
                            }
                        }
                    } else if (enemy[0] > (row + 1) && enemy[1] < (col + 1)) {
                        for (let x = 1; x < Math.abs(enemy[0] - (row + 1)); x++) {
                            if (this.matrix[enemy[0] - x][enemy[1] + x] !== 0) {
                                return null
                            }
                        }
                    }
                    return [8]
                }
            }
        } else if (this.matrix[enemy[0]][enemy[1]] === 4) {
            if (enemy[0] === row - 1 && enemy[1] === col - 1) {
                if (this.matrix[row][col - 1] !== 0 && this.matrix[row - 1][col] !== 0) {
                    return [2, 4]
                } else if (this.matrix[row - 1][col] !== 0) {
                    return [2, 4, 6]
                } else if (this.matrix[row][col - 1] !== 0) {
                    return [2, 3, 4]
                } else {
                    return [2, 3, 4, 6]
                }
            } else if (enemy[0] === row - 1 && enemy[1] === col) {
                return [1, 3, 7]
            } else if (enemy[0] === row - 1 && enemy[1] === col + 1) {
                if (this.matrix[row][col + 1] !== 0 && this.matrix[row - 1][col] !== 0) {
                    return [2, 5]
                } else if (this.matrix[row - 1][col] !== 0) {
                    return [2, 5, 8]
                } else if (this.matrix[row][col + 1] !== 0) {
                    return [1, 2, 5]
                } else {
                    return [1, 2, 5, 8]
                }
            } else if (enemy[0] === row && enemy[1] === col - 1) {
                return [1, 5, 6]
            } else if (enemy[0] === row && enemy[1] === col + 1) {
                return [3, 4, 8]
            } else if (enemy[0] === row + 1 && enemy[1] === col - 1) {
                if (this.matrix[row][col - 1] !== 0 && this.matrix[row + 1][col] !== 0) {
                    return [4, 7]
                } else if (this.matrix[row + 1][col] !== 0) {
                    return [1, 4, 7]
                } else if (this.matrix[row][col - 1] !== 0) {
                    return [4, 7, 8]
                } else {
                    return [1, 4, 7, 8]
                }
            } else if (enemy[0] === row + 1 && enemy[1] === col) {
                return [2, 6, 8]
            } else if (enemy[0] === row + 1 && enemy[1] === col + 1) {
                if (this.matrix[row][col + 1] !== 0 && this.matrix[row + 1][col] !== 0) {
                    return [5, 7]
                } else if (this.matrix[row + 1][col] !== 0) {
                    return [3, 5, 7]
                } else if (this.matrix[row][col + 1] !== 0) {
                    return [5, 6, 7]
                } else {
                    return [3, 5, 6, 7]
                }
            } else {
                if (enemy[0] === row - 1) {
                    if (enemy[1] < col - 1) {
                        for (let x = enemy[1] + 1; x < col - 1; x++) {
                            if (this.matrix[row - 1][x] !== 0) return null
                        }
                        if (this.matrix[row - 1][col - 1] !== 0) return [1]
                        else if (this.matrix[row - 1][col] !== 0) return [1, 2]
                    } else if (enemy[1] > col + 1) {
                        for (let x = col + 2; x < enemy[1]; x++) {
                            if (this.matrix[row - 1][x] !== 0) return null
                        }
                        if (this.matrix[row - 1][col + 1] !== 0) return [3]
                        else if (this.matrix[row - 1][col] !== 0) return [2, 3]
                    }
                    return [1, 2, 3]
                } else if (enemy[0] === row) {
                    if (enemy[1] < col - 1) {
                        for (let x = enemy[1] + 1; x < col - 1; x++) {
                            if (this.matrix[row][x] !== 0) return null
                        }
                        if (this.matrix[row][col - 1] !== 0) return [4]
                    } else if (enemy[1] > col + 1) {
                        for (let x = col + 2; x < enemy[1]; x++) {
                            if (this.matrix[row][x] !== 0) return null
                        }
                        if (this.matrix[row][col + 1] !== 0) return [5]
                    }
                    return [4, 5]
                } else if (enemy[0] === row + 1) {
                    if (enemy[1] < col - 1) {
                        for (let x = enemy[1] + 1; x < col - 1; x++) {
                            if (this.matrix[row + 1][x] !== 0) return null
                        }
                        if (this.matrix[row + 1][col - 1] !== 0) return [6]
                        else if (this.matrix[row + 1][col] !== 0) return [6, 7]
                    } else if (enemy[1] > col + 1) {
                        for (let x = col + 2; x < enemy[1]; x++) {
                            if (this.matrix[row + 1][x] !== 0) return null
                        }
                        if (this.matrix[row + 1][col + 1] !== 0) return [8]
                        else if (this.matrix[row + 1][col] !== 0) return [7, 8]
                    }
                    return [6, 7, 8]
                } else if (enemy[1] === col - 1) {
                    if (enemy[0] < row - 1) {
                        for (let x = enemy[0] + 1; x < row - 1; x++) {
                            if (this.matrix[x][col - 1] !== 0) return null
                        }
                        if (this.matrix[row - 1][col - 1] !== 0) return [1]
                        else if (this.matrix[row][col - 1] !== 0) return [1, 4]

                    } else if (enemy[0] > row + 1) {
                        for (let x = row + 2; x < enemy[0]; x++) {
                            if (this.matrix[x][col - 1] !== 0) return null
                        }
                        if (this.matrix[row + 1][col - 1] !== 0) return [6]
                        else if (this.matrix[row][col - 1] !== 0) return [4, 6]
                    }
                    return [1, 4, 6]
                } else if (enemy[1] === col) {
                    if (enemy[0] < row - 1) {
                        for (let x = enemy[0] + 1; x < row - 1; x++) {
                            if (this.matrix[x][col] !== 0) return null
                        }
                        if (this.matrix[row - 1][col] !== 0) return [2]
                    } else if (enemy[0] > row + 1) {
                        for (let x = row + 2; x < enemy[0]; x++) {
                            if (this.matrix[x][col] !== 0) return null
                        }
                        if (this.matrix[row + 1][col] !== 0) return [7]
                    }
                    return [2, 7]
                } else if (enemy[1] === col + 1) {
                    if (enemy[0] < row - 1) {
                        for (let x = enemy[0] + 1; x < row - 1; x++) {
                            if (this.matrix[x][col + 1] !== 0) return null
                        }
                        if (this.matrix[row - 1][col + 1] !== 0) return [3]
                        else if (this.matrix[row][col + 1] !== 0) return [3, 5]
                    } else if (enemy[0] > row + 1) {
                        for (let x = row + 2; x < enemy[0]; x++) {
                            if (this.matrix[x][col + 1] !== 0) return null
                        }
                        if (this.matrix[row + 1][col + 1] !== 0) return [8]
                        else if (this.matrix[row][col + 1] !== 0) return [5, 8]
                    }
                    return [3, 5, 8]
                }
            }
        } else if (this.matrix[enemy[0]][enemy[1]] === 5) {
            if (enemy[0] === row - 1 && enemy[1] === col - 1) {
                if (this.matrix[row - 1][col] !== 0 && this.matrix[row][col - 1] !== 0) {
                    return [2, 4, 8]
                } else if (this.matrix[row - 1][col] !== 0) {
                    return [2, 4, 6, 8]
                } else if (this.matrix[row][col - 1] !== 0) {
                    return [2, 3, 4, 8]
                } else {
                    return [2, 3, 4, 6, 8]
                }
            } else if (enemy[0] === row - 1 && enemy[1] === col) {
                return [1, 3, 4, 5, 7]
            } else if (enemy[0] === row - 1 && enemy[1] === col + 1) {
                if (this.matrix[row - 1][col] !== 0 && this.matrix[row][col + 1] !== 0) {
                    return [2, 5, 6]
                } else if (this.matrix[row - 1][col] !== 0) {
                    return [2, 5, 6, 8]
                } else if (this.matrix[row][col - 1] !== 0) {
                    return [1, 2, 5, 6]
                } else {
                    return [1, 2, 5, 6, 8]
                }
            } else if (enemy[0] === row && enemy[1] === col - 1) {
                return [1, 2, 5, 6, 7]
            } else if (enemy[0] === row && enemy[1] === col + 1) {
                return [2, 3, 4, 7, 8]
            } else if (enemy[0] === row + 1 && enemy[1] === col - 1) {
                if (this.matrix[row + 1][col] !== 0 && this.matrix[row][col - 1] !== 0) {
                    return [3, 4, 7]
                } else if (this.matrix[row + 1][col] !== 0) {
                    return [1, 3, 4, 7]
                } else if (this.matrix[row][col - 1] !== 0) {
                    return [3, 4, 7, 8]
                } else {
                    return [1, 3, 4, 7, 8]
                }
            } else if (enemy[0] === row + 1 && enemy[1] === col) {
                return [2, 4, 5, 6, 8]
            } else if (enemy[0] === row + 1 && enemy[1] === col + 1) {
                if (this.matrix[row + 1][col] !== 0 && this.matrix[row][col + 1] !== 0) {
                    return [1, 5, 7]
                } else if (this.matrix[row + 1][col] !== 0) {
                    return [1, 3, 5, 7]
                } else if (this.matrix[row][col + 1] !== 0) {
                    return [1, 5, 6, 7]
                } else {
                    return [1, 3, 5, 6, 7]
                }
            } else if (enemy[0] === row - 2 && enemy[1] === col - 1) {
                if (this.matrix[row - 1][col - 1] !== 0 && this.matrix[row - 1][col] !== 0) {
                    return [1, 2]
                } else if (this.matrix[row][col - 1] !== 0 && this.matrix[row - 1][col] !== 0) {
                    return [1, 2, 4]
                } else if (this.matrix[row - 1][col - 1] !== 0) {
                    return [1, 2, 5]
                } else if (this.matrix[row - 1][col] !== 0) {
                    return [1, 2, 4, 6]
                } else if (this.matrix[row][col - 1] !== 0) {
                    return [1, 2, 4, 5]
                } else {
                    return [1, 2, 4, 5, 6]
                }
            } else if (enemy[0] === row - 2 && enemy[1] === col) {
                if (this.matrix[row - 1][col] !== 0) {
                    return [1, 2, 3]
                } else {
                    return [1, 2, 3, 7]
                }
            } else if (enemy[0] === row - 2 && enemy[1] === col + 1) {
                if (this.matrix[row - 1][col + 1] !== 0 && this.matrix[row - 1][col] !== 0) {
                    return [2, 3]
                } else if (this.matrix[row][col + 1] !== 0 && this.matrix[row - 1][col] !== 0) {
                    return [2, 3, 5]
                } else if (this.matrix[row - 1][col + 1] !== 0) {
                    return [2, 3, 4]
                } else if (this.matrix[row - 1][col] !== 0) {
                    return [2, 3, 5, 8]
                } else if (this.matrix[row][col + 1] !== 0) {
                    return [2, 3, 4, 5]
                } else {
                    return [2, 3, 4, 5, 8]
                }
            } else if (enemy[0] === row - 1 && enemy[1] === col - 2) {
                if (this.matrix[row - 1][col - 1] !== 0 && this.matrix[row][col - 1] !== 0) {
                    return [1, 4]
                } else if (this.matrix[row - 1][col] !== 0 && this.matrix[row][col - 1] !== 0) {
                    return [1, 2, 4]
                } else if (this.matrix[row - 1][col - 1] !== 0) {
                    return [1, 4, 7]
                } else if (this.matrix[row - 1][col] !== 0) {
                    return [1, 2, 4, 7]
                } else if (this.matrix[row][col - 1] !== 0) {
                    return [1, 2, 3, 4]
                } else {
                    return [1, 2, 3, 4, 7]
                }
            } else if (enemy[0] === row && enemy[1] === col - 2) {
                if (this.matrix[row][col - 1] !== 0) {
                    return [1, 4, 6]
                } else {
                    return [1, 4, 5, 6]
                }
            } else if (enemy[0] === row + 1 && enemy[1] === col - 2) {
                if (this.matrix[row + 1][col - 1] !== 0 && this.matrix[row][col - 1] !== 0) {
                    return [4, 6]
                } else if (this.matrix[row + 1][col] !== 0 && this.matrix[row][col - 1] !== 0) {
                    return [4, 6, 7]
                } else if (this.matrix[row + 1][col - 1] !== 0) {
                    return [2, 4, 6]
                } else if (this.matrix[row + 1][col] !== 0) {
                    return [2, 4, 6, 7]
                } else if (this.matrix[row][col - 1] !== 0) {
                    return [4, 6, 7, 8]
                } else {
                    return [2, 4, 6, 7, 8]
                }
            } else if (enemy[0] === row + 2 && enemy[1] === col - 1) {
                if (this.matrix[row + 1][col - 1] !== 0 && this.matrix[row + 1][col] !== 0) {
                    return [6, 7]
                } else if (this.matrix[row][col - 1] !== 0 && this.matrix[row + 1][col] !== 0) {
                    return [4, 6, 7]
                } else if (this.matrix[row + 1][col - 1] !== 0) {
                    return [5, 6, 7]
                } else if (this.matrix[row + 1][col] !== 0) {
                    return [1, 4, 6, 7]
                } else if (this.matrix[row][col - 1] !== 0) {
                    return [4, 5, 6, 7]
                } else {
                    return [1, 4, 5, 6, 7]
                }
            } else if (enemy[0] === row + 2 && enemy[1] === col) {
                if (this.matrix[row + 1][col] !== 0) {
                    return [6, 7, 8]
                } else {
                    return [2, 6, 7, 8]
                }
            } else if (enemy[0] === row + 2 && enemy[1] === col + 1) {
                if (this.matrix[row + 1][col + 1] !== 0 && this.matrix[row + 1][col] !== 0) {
                    return [7, 8]
                } else if (this.matrix[row][col + 1] !== 0 && this.matrix[row + 1][col] !== 0) {
                    return [5, 7, 8]
                } else if (this.matrix[row + 1][col + 1] !== 0) {
                    return [4, 7, 8]
                } else if (this.matrix[row + 1][col] !== 0) {
                    return [3, 5, 7, 8]
                } else if (this.matrix[row][col + 1] !== 0) {
                    return [4, 5, 7, 8]
                } else {
                    return [3, 4, 5, 7, 8]
                }
            } else if (enemy[0] === row - 1 && enemy[1] === col + 2) {
                if (this.matrix[row - 1][col + 1] !== 0 && this.matrix[row][col + 1] !== 0) {
                    return [3, 5]
                } else if (this.matrix[row - 1][col] !== 0 && this.matrix[row][col + 1] !== 0) {
                    return [2, 3, 5]
                } else if (this.matrix[row - 1][col + 1] !== 0) {
                    return [3, 5, 7]
                } else if (this.matrix[row - 1][col] !== 0) {
                    return [2, 3, 5, 7]
                } else if (this.matrix[row][col + 1] !== 0) {
                    return [1, 2, 3, 5]
                } else {
                    return [1, 2, 3, 5, 7]
                }
            } else if (enemy[0] === row && enemy[1] === col + 2) {
                if (this.matrix[row][col + 1] !== 0) {
                    return [3, 5, 8]
                } else {
                    return [3, 4, 5, 8]
                }
            } else if (enemy[0] === row + 1 && enemy[1] === col + 2) {
                if (this.matrix[row + 1][col + 1] !== 0 && this.matrix[row][col + 1] !== 0) {
                    return [5, 8]
                } else if (this.matrix[row + 1][col] !== 0 && this.matrix[row][col + 1] !== 0) {
                    return [5, 7, 8]
                } else if (this.matrix[row + 1][col + 1] !== 0) {
                    return [2, 5, 8]
                } else if (this.matrix[row + 1][col] !== 0) {
                    return [2, 5, 7, 8]
                } else if (this.matrix[row][col + 1] !== 0) {
                    return [5, 6, 7, 8]
                } else {
                    return [2, 5, 6, 7, 8]
                }
            } else if (enemy[0] === row - 3 && enemy[1] === col - 1) {
                if (this.matrix[row - 2][col - 1] !== 0 && this.matrix[row - 2][col] !== 0) {
                    return null
                } else if (this.matrix[row - 2][col - 1] !== 0) {
                    return [3]
                } else if (this.matrix[row - 2][col] !== 0) {
                    return [1]
                } else if (this.matrix[row - 1][col - 1] !== 0) {
                    return [1, 3]
                } else if (this.matrix[row][col - 1] !== 0) {
                    return [1, 4, 3]
                } else {
                    return [1, 3, 4, 6]
                }
            } else if (enemy[0] === row - 3 && enemy[1] === col) {
                if (this.matrix[row - 2][col] !== 0) {
                    return null
                } else if (this.matrix[row - 1][col] !== 0) {
                    return [2]
                } else {
                    return [2, 7]
                }
            } else if (enemy[0] === row - 3 && enemy[1] === col + 1) {
                if (this.matrix[row - 2][col + 1] !== 0 && this.matrix[row - 2][col] !== 0) {
                    return null
                } else if (this.matrix[row - 2][col + 1] !== 0) {
                    return [1]
                } else if (this.matrix[row - 2][col] !== 0) {
                    return [3]
                } else if (this.matrix[row - 1][col + 1] !== 0) {
                    return [1, 3]
                } else if (this.matrix[row][col + 1] !== 0) {
                    return [1, 3, 5]
                } else {
                    return [1, 3, 5, 8]
                }
            } else if (enemy[0] === row - 1 && enemy[1] === col - 3) {
                if (this.matrix[row - 1][col - 2] !== 0 && this.matrix[row][col - 2] !== 0) {
                    return null
                } else if (this.matrix[row - 1][col - 2] !== 0) {
                    return [6]
                } else if (this.matrix[row][col - 2] !== 0) {
                    return [1]
                } else if (this.matrix[row - 1][col - 1] !== 0) {
                    return [1, 6]
                } else if (this.matrix[row - 1][col] !== 0) {
                    return [1, 2, 6]
                } else {
                    return [1, 2, 3, 6]
                }
            } else if (enemy[0] === row && enemy[1] === col - 3) {
                if (this.matrix[row][col - 2] !== 0) {
                    return null
                } else if (this.matrix[row][col - 1] !== 0) {
                    return [4]
                } else {
                    return [4, 5]
                }
            } else if (enemy[0] === row + 1 && enemy[1] === col - 3) {
                if (this.matrix[row + 1][col - 2] !== 0 && this.matrix[row][col - 2] !== 0) {
                    return null
                } else if (this.matrix[row + 1][col - 2] !== 0) {
                    return [1]
                } else if (this.matrix[row][col - 2] !== 0) {
                    return [6]
                } else if (this.matrix[row + 1][col - 1] !== 0) {
                    return [1, 6]
                } else if (this.matrix[row + 1][col] !== 0) {
                    return [1, 6, 7]
                } else {
                    return [1, 3, 4, 6]
                }
            } else if (enemy[0] === row + 3 && enemy[1] === col - 1) {
                if (this.matrix[row + 2][col - 1] !== 0 && this.matrix[row + 2][col] !== 0) {
                    return null
                } else if (this.matrix[row + 2][col - 1] !== 0) {
                    return [8]
                } else if (this.matrix[row + 2][col] !== 0) {
                    return [6]
                } else if (this.matrix[row + 1][col - 1] !== 0) {
                    return [6, 8]
                } else if (this.matrix[row][col - 1] !== 0) {
                    return [4, 6, 8]
                } else {
                    return [1, 4, 6, 8]
                }
            } else if (enemy[0] === row + 3 && enemy[1] === col) {
                if (this.matrix[row + 2][col] !== 0) {
                    return null
                } else if (this.matrix[row + 1][col] !== 0) {
                    return [7]
                } else {
                    return [2, 7]
                }
            } else if (enemy[0] === row + 3 && enemy[1] === col + 1) {
                if (this.matrix[row + 2][col + 1] !== 0 && this.matrix[row + 2][col] !== 0) {
                    return null
                } else if (this.matrix[row + 2][col + 1] !== 0) {
                    return [6]
                } else if (this.matrix[row + 2][col] !== 0) {
                    return [8]
                } else if (this.matrix[row + 1][col + 1] !== 0) {
                    return [6, 8]
                } else if (this.matrix[row][col + 1] !== 0) {
                    return [5, 6, 8]
                } else {
                    return [3, 5, 6, 8]
                }
            } else if (enemy[0] === row - 1 && enemy[1] === col + 3) {
                if (this.matrix[row - 1][col + 2] !== 0 && this.matrix[row][col + 2] !== 0) {
                    return null
                } else if (this.matrix[row - 1][col + 2] !== 0) {
                    return [8]
                } else if (this.matrix[row + 2][col] !== 0) {
                    return [3]
                } else if (this.matrix[row - 1][col + 1] !== 0) {
                    return [3, 8]
                } else if (this.matrix[row - 1][col] !== 0) {
                    return [2, 3, 8]
                } else {
                    return [1, 2, 3, 8]
                }
            } else if (enemy[0] === row && enemy[1] === col + 3) {
                if (this.matrix[row][col + 2] !== 0) {
                    return null
                } else if (this.matrix[row][col + 1] !== 0) {
                    return [5]
                } else {
                    return [4, 5]
                }
            } else if (enemy[0] === row + 1 && enemy[1] === col + 3) {
                if (this.matrix[row + 1][col + 2] !== 0 && this.matrix[row][col + 2] !== 0) {
                    return null
                } else if (this.matrix[row + 1][col + 2] !== 0) {
                    return [3]
                } else if (this.matrix[row + 2][col] !== 0) {
                    return [8]
                } else if (this.matrix[row + 1][col + 1] !== 0) {
                    return [3, 8]
                } else if (this.matrix[row + 1][col] !== 0) {
                    return [3, 7, 8]
                } else {
                    return [3, 6, 7, 8]
                }
            } else if (
                (
                    ((enemy[0] >= 0 && enemy[0] < row - 3) || (enemy[0] > row + 3 && enemy[0] < this.rowlen)) &&
                    (enemy[1] >= col - 1 && enemy[1] <= col + 1)
                ) ||
                (
                    ((enemy[1] >= 0 && enemy[1] < col - 3) || (enemy[1] > col + 3 && enemy[1] < this.collen)) &&
                    (enemy[0] >= row - 1 && enemy[0] <= row + 1)
                )
            ) {
                if (enemy[0] === row - 1) {
                    if (enemy[1] < col - 1) {
                        for (let x = enemy[1] + 1; x < col - 1; x++) {
                            if (this.matrix[row - 1][x] !== 0) {
                                return null
                            }
                        }
                        if (this.matrix[row - 1][col - 1] !== 0) {
                            return [1]
                        } else if (this.matrix[row - 1][col] !== 0) {
                            return [1, 2]
                        }
                    } else if (enemy[1] > col + 1) {
                        for (let x = col + 2; x < enemy[1]; x++) {
                            if (this.matrix[row - 1][x] !== 0) {
                                return null
                            }
                        }
                        if (this.matrix[row - 1][col + 1] !== 0) {
                            return [3]
                        } else if (this.matrix[row - 1][col] !== 0) {
                            return [2, 3]
                        }
                    }
                    return [1, 2, 3]
                } else if (enemy[0] === row) {
                    if (enemy[1] < col - 1) {
                        for (let x = enemy[1] + 1; x < col - 1; x++) {
                            if (this.matrix[row][x] !== 0) {
                                return null
                            }
                        }
                        if (this.matrix[row][col - 1] !== 0) {
                            return [4]
                        }
                    } else if (enemy[1] > col + 1) {
                        for (let x = col + 2; x < enemy[1]; x++) {
                            if (this.matrix[row][x] !== 0) {
                                return null
                            }
                        }
                        if (this.matrix[row][col + 1] !== 0) {
                            return [5]
                        }
                    }
                    return [4, 5]
                } else if (enemy[0] === row + 1) {
                    if (enemy[1] < col - 1) {
                        for (let x = enemy[1] + 1; x < col - 1; x++) {
                            if (this.matrix[row + 1][x] !== 0) {
                                return null
                            }
                        }
                        if (this.matrix[row + 1][col - 1] !== 0) {
                            return [6]
                        } else if (this.matrix[row + 1][col] !== 0) {
                            return [6, 7]
                        }
                    } else if (enemy[1] > col + 1) {
                        for (let x = col + 2; x < enemy[1]; x++) {
                            if (this.matrix[row + 1][x] !== 0) {
                                return null
                            }
                        }
                        if (this.matrix[row + 1][col + 1] !== 0) {
                            return [8]
                        } else if (this.matrix[row + 1][col] !== 0) {
                            return [7, 8]
                        }
                    }
                    return [6, 7, 8]
                } else if (enemy[1] === col - 1) {
                    if (enemy[0] < row - 1) {
                        for (let x = enemy[0] + 1; x < row - 1; x++) {
                            if (this.matrix[x][col - 1] !== 0) {
                                return null
                            }
                        }
                        if (this.matrix[row - 1][col - 1] !== 0) {
                            return [1]
                        } else if (this.matrix[row][col - 1] !== 0) {
                            return [1, 4]
                        }
                    } else if (enemy[0] > row + 1) {
                        for (let x = row + 2; x < enemy[0]; x++) {
                            if (this.matrix[x][col - 1] !== 0) {
                                return null
                            }
                        }
                        if (this.matrix[row + 1][col - 1] !== 0) {
                            return [6]
                        } else if (this.matrix[row][col - 1] !== 0) {
                            return [4, 6]
                        }
                    }
                    return [1, 4, 6]
                } else if (enemy[1] === col) {
                    if (enemy[0] < row - 1) {
                        for (let x = enemy[0] + 1; x < row - 1; x++) {
                            if (this.matrix[x][col] !== 0) {
                                return null
                            }
                        }
                        if (this.matrix[row - 1][col] !== 0) {
                            return [2]
                        }
                    } else if (enemy[0] > row + 1) {
                        for (let x = row + 2; x < enemy[0]; x++) {
                            if (this.matrix[x][col] !== 0) {
                                return null
                            }
                        }
                        if (this.matrix[row + 1][col] !== 0) {
                            return [7]
                        }
                    }
                    return [2, 7]
                } else if (enemy[1] === col + 1) {
                    if (enemy[0] < row - 1) {
                        for (let x = enemy[0] + 1; x < row - 1; x++) {
                            if (this.matrix[x][col + 1] !== 0) {
                                return null
                            }
                        }
                        if (this.matrix[row - 1][col + 1] !== 0) {
                            return [3]
                        } else if (this.matrix[row][col + 1] !== 0) {
                            return [3, 5]
                        }
                    } else if (enemy[0] > row + 1) {
                        for (let x = row + 2; x < enemy[0]; x++) {
                            if (this.matrix[x][col + 1] !== 0) {
                                return null
                            }
                        }
                        if (this.matrix[row + 1][col + 1] !== 0) {
                            return [8]
                        } else if (this.matrix[row][col + 1] !== 0) {
                            return [5, 8]
                        }
                    }
                    return [3, 5, 8]
                }
            } else {
                if (
                    enemy[0] !== (row - 1) &&
                    enemy[1] !== (col - 1) &&
                    Math.abs(enemy[0] - (row - 1)) === Math.abs(enemy[1] - (col - 1))
                ) {
                    if (
                        enemy[0] !== (row + 1) &&
                        enemy[1] !== (col + 1) &&
                        Math.abs(enemy[0] - (row + 1)) === Math.abs(enemy[1] - (col + 1))
                    ) {
                        if (enemy[0] < (row - 1) && enemy[1] < (col - 1)) {
                            for (let x = 1; x < Math.abs(enemy[0] - (row - 1)); x++) {
                                if (this.matrix[enemy[0] + x][enemy[1] + x] !== 0) {
                                    return null
                                }
                            }
                            if (this.matrix[row - 1][col - 1] !== 0) {
                                return [1]
                            }
                        } else if (enemy[0] > (row + 1) && enemy[1] > (col + 1)) {
                            for (let x = 1; x < Math.abs(enemy[0] - (row + 1)); x++) {
                                if (this.matrix[enemy[0] - x][enemy[1] - x] !== 0) {
                                    return null
                                }
                            }
                            if (this.matrix[row + 1][col + 1] !== 0) {
                                return [8]
                            }
                        }
                        return [1, 8]
                    } else {
                        if (enemy[0] < (row - 1) && enemy[1] > (col - 1)) {
                            for (let x = 1; x < Math.abs(enemy[0] - (row - 1)); x++) {
                                if (this.matrix[enemy[0] + x][enemy[1] - x] !== 0) {
                                    return null
                                }
                            }
                        } else if (enemy[0] > (row - 1) && enemy[1] < (col - 1)) {
                            for (let x = 1; x < Math.abs(enemy[0] - (row - 1)); x++) {
                                if (this.matrix[enemy[0] - x][enemy[1] + x] !== 0) {
                                    return null
                                }
                            }
                        }
                        return [1]
                    }
                } else if (
                    enemy[0] !== (row - 1) &&
                    enemy[1] !== col &&
                    Math.abs(enemy[0] - (row - 1)) === Math.abs(enemy[1] - col)
                ) {
                    if (
                        enemy[0] !== row &&
                        enemy[1] !== (col + 1) &&
                        Math.abs(enemy[0] - row) === Math.abs(enemy[1] - (col + 1))
                    ) {
                        if (enemy[0] < (row - 1) && enemy[1] < col) {
                            for (let x = 1; x < Math.abs(enemy[0] - (row - 1)); x++) {
                                if (this.matrix[enemy[0] + x][enemy[1] + x] !== 0) {
                                    return null
                                }
                            }
                            if (this.matrix[row - 1][col] !== 0) {
                                return [2]
                            }
                        } else if (enemy[0] > row && enemy[1] > (col + 1)) {
                            for (let x = 1; x < Math.abs(enemy[0] - row); x++) {
                                if (this.matrix[enemy[0] - x][enemy[1] - x] !== 0) {
                                    return null
                                }
                            }
                            if (this.matrix[row][col + 1] !== 0) {
                                return [5]
                            }
                        }
                        return [2, 5]
                    } else if (
                        enemy[0] !== row &&
                        enemy[1] !== (col - 1) &&
                        Math.abs(enemy[0] - row) === Math.abs(enemy[1] - (col - 1))
                    ) {
                        if (enemy[0] < (row - 1) && enemy[1] > col) {
                            for (let x = 1; x < Math.abs(enemy[0] - (row - 1)); x++) {
                                if (this.matrix[enemy[0] + x][enemy[1] - x] !== 0) {
                                    return null
                                }
                            }
                            if (this.matrix[row - 1][col] !== 0) {
                                return [2]
                            }
                        } else if (enemy[0] > row && enemy[1] < (col - 1)) {
                            for (let x = 1; x < Math.abs(enemy[0] - row); x++) {
                                if (this.matrix[enemy[0] - x][enemy[1] + x] !== 0) {
                                    return null
                                }
                            }
                            if (this.matrix[row][col - 1] !== 0) {
                                return [4]
                            }
                        }
                        return [2, 4]
                    }
                } else if (
                    enemy[0] !== (row - 1) &&
                    enemy[1] !== (col + 1) &&
                    Math.abs(enemy[0] - (row - 1)) === Math.abs(enemy[1] - (col + 1))
                ) {
                    if (
                        enemy[0] !== (row + 1) &&
                        enemy[1] !== (col - 1) &&
                        Math.abs(enemy[0] - (row + 1)) === Math.abs(enemy[1] - (col - 1))
                    ) {
                        if (enemy[0] < (row - 1) && enemy[1] > (col + 1)) {
                            for (let x = 1; x < Math.abs(enemy[0] - (row - 1)); x++) {
                                if (this.matrix[enemy[0] + x][enemy[1] - x] !== 0) {
                                    return null
                                }
                            }
                            if (this.matrix[row - 1][col + 1] !== 0) {
                                return [3]
                            }
                        } else if (enemy[0] > (row + 1) && enemy[1] < (col - 1)) {
                            for (let x = 1; x < Math.abs(enemy[0] - (row + 1)); x++) {
                                if (this.matrix[enemy[0] - x][enemy[1] + x] !== 0) {
                                    return null
                                }
                            }
                            if (this.matrix[row + 1][col - 1] !== 0) {
                                return [6]
                            }
                        }
                        return [3, 6]
                    } else {
                        if (enemy[0] < (row - 1) && enemy[1] < (col + 1)) {
                            for (let x = 1; x < Math.abs(enemy[0] - (row - 1)); x++) {
                                if (this.matrix[enemy[0] + x][enemy[1] + x] !== 0) {
                                    return null
                                }
                            }
                        } else if (enemy[0] > (row - 1) && enemy[1] > (col + 1)) {
                            for (let x = 1; x < Math.abs(enemy[0] - (row - 1)); x++) {
                                if (this.matrix[enemy[0] - x][enemy[1] - x] !== 0) {
                                    return null
                                }
                            }
                        }
                        return [3]
                    }
                } else if (
                    enemy[0] !== row &&
                    enemy[1] !== (col - 1) &&
                    Math.abs(enemy[0] - row) === Math.abs(enemy[1] - (col - 1))
                ) {
                    if (
                        enemy[0] !== (row + 1) &&
                        enemy[1] !== col &&
                        Math.abs(enemy[0] - (row + 1)) === Math.abs(enemy[1] - col)
                    ) {
                        if (enemy[0] < row && enemy[1] < (col - 1)) {
                            for (let x = 1; x < Math.abs(enemy[0] - row); x++) {
                                if (this.matrix[enemy[0] + x][enemy[1] + x] !== 0) {
                                    return null
                                }
                            }
                            if (this.matrix[row - 1][col] !== 0) {
                                return [4]
                            }
                        } else if (enemy[0] > (row + 1) && enemy[1] > col) {
                            for (let x = 1; x < Math.abs(enemy[0] - row); x++) {
                                if (this.matrix[enemy[0] - x][enemy[1] - x] !== 0) {
                                    return null
                                }
                            }
                            if (this.matrix[row + 1][col] !== 0) {
                                return [7]
                            }
                        }

                        return [4, 7]
                    }
                } else if (
                    enemy[0] !== row &&
                    enemy[1] !== (col + 1) &&
                    Math.abs(enemy[0] - row) === Math.abs(enemy[1] - (col + 1))
                ) {
                    if (
                        enemy[0] !== (row + 1) &&
                        enemy[1] !== col &&
                        Math.abs(enemy[0] - (row + 1)) === Math.abs(enemy[1] - col)
                    ) {
                        if (enemy[0] < row && enemy[1] > (col + 1)) {
                            for (let x = 1; x < Math.abs(enemy[0] - row); x++) {
                                if (this.matrix[enemy[0] + x][enemy[1] - x] !== 0) {
                                    return null
                                }
                            }
                            if (this.matrix[row][col + 1] !== 0) {
                                return [5]
                            }
                        } else if (enemy[0] > (row + 1) && enemy[1] < col) {
                            for (let x = 1; x < Math.abs(enemy[0] - row); x++) {
                                if (this.matrix[enemy[0] - x][enemy[1] + x] !== 0) {
                                    return null
                                }
                            }
                            if (this.matrix[row + 1][col] !== 0) {
                                return [7]
                            }
                        }
                        return [5, 7]
                    }
                } else if (
                    enemy[0] !== (row + 1) &&
                    enemy[1] !== (col - 1) &&
                    Math.abs(enemy[0] - (row + 1)) === Math.abs(enemy[1] - (col - 1))
                ) {
                    if (enemy[0] < (row + 1) && enemy[1] < (col - 1)) {
                        for (let x = 1; x < Math.abs(enemy[0] - (row + 1)); x++) {
                            if (this.matrix[enemy[0] + x][enemy[1] + x] !== 0) {
                                return null
                            }
                        }
                    } else if (enemy[0] > (row + 1) && enemy[1] > (col - 1)) {
                        for (let x = 1; x < Math.abs(enemy[0] - (row + 1)); x++) {
                            if (this.matrix[enemy[0] - x][enemy[1] - x] !== 0) {
                                return null
                            }
                        }
                    }
                    return [6]
                } else if (
                    enemy[0] !== (row + 1) &&
                    enemy[1] !== (col + 1) &&
                    Math.abs(enemy[0] - (row + 1)) === Math.abs(enemy[1] - (col + 1))
                ) {
                    if (enemy[0] < (row + 1) && enemy[1] > (col + 1)) {
                        for (let x = 1; x < Math.abs(enemy[0] - (row + 1)); x++) {
                            if (this.matrix[enemy[0] + x][enemy[1] - x] !== 0) {
                                return null
                            }
                        }
                    } else if (enemy[0] > (row + 1) && enemy[1] < (col + 1)) {
                        for (let x = 1; x < Math.abs(enemy[0] - (row + 1)); x++) {
                            if (this.matrix[enemy[0] - x][enemy[1] + x] !== 0) {
                                return null
                            }
                        }
                    }
                    return [8]
                }
            }
        } else if (this.matrix[enemy[0]][enemy[1]] === 6) {
            if (enemy[0] === row - 2 && enemy[1] === col - 2) {
                return [1]
            } else if (enemy[0] === row - 2 && enemy[1] === col - 1) {
                return [1, 2]
            } else if (enemy[0] === row - 2 && enemy[1] === col) {
                return [1, 2, 3]
            } else if (enemy[0] === row - 2 && enemy[1] === col + 1) {
                return [2, 3]
            } else if (enemy[0] === row - 2 && enemy[1] === col + 2) {
                return [3]
            } else if (enemy[0] === row - 1 && enemy[1] === col - 2) {
                return [1, 4]
            } else if (enemy[0] === row - 1 && enemy[1] === col - 1) {
                return [2, 4]
            } else if (enemy[0] === row - 1 && enemy[1] === col) {
                return [1, 3, 4, 5]
            } else if (enemy[0] === row - 1 && enemy[1] === col + 1) {
                return [2, 5]
            } else if (enemy[0] === row - 1 && enemy[1] === col + 2) {
                return [3, 5]
            } else if (enemy[0] === row && enemy[1] === col - 2) {
                return [1, 4, 6]
            } else if (enemy[0] === row && enemy[1] === col - 1) {
                return [1, 2, 6, 7]
            } else if (enemy[0] === row && enemy[1] === col + 1) {
                return [2, 3, 7, 8]
            } else if (enemy[0] === row && enemy[1] === col + 2) {
                return [3, 5, 8]
            } else if (enemy[0] === row + 1 && enemy[1] === col - 2) {
                return [4, 6]
            } else if (enemy[0] === row + 1 && enemy[1] === col - 1) {
                return [4, 7]
            } else if (enemy[0] === row + 1 && enemy[1] === col) {
                return [4, 5, 6, 8]
            } else if (enemy[0] === row + 1 && enemy[1] === col + 1) {
                return [5, 7]
            } else if (enemy[0] === row + 1 && enemy[1] === col + 2) {
                return [5, 8]
            } else if (enemy[0] === row + 2 && enemy[1] === col - 2) {
                return [6]
            } else if (enemy[0] === row + 2 && enemy[1] === col - 1) {
                return [6, 7]
            } else if (enemy[0] === row + 2 && enemy[1] === col) {
                return [6, 7, 8]
            } else if (enemy[0] === row + 2 && enemy[1] === col + 1) {
                return [7, 8]
            } else if (enemy[0] === row + 2 && enemy[1] === col + 2) {
                return [8]
            }
        }
    }

    // checking the castling is possible or not
    #castle(x) {
        let list1
        const [king_row, king_col] = this.king
        // Check whether the path between king and rook is empty
        let castle = false
        if (x > king_col) {
            if (king_col >= this.collen - 2) {
                castle = false
            } else {
                castle = true
                for (let col = king_col + 1; col < x; col++) {
                    if (this.matrix[king_row][col] !== 0) {
                        castle = false
                        break
                    }
                }
            }
        } else if (x < king_col) {
            if (king_col <= 1) {
                castle = false
            } else {
                castle = true
                for (let col = x + 1; col < king_col; col++) {
                    if (this.matrix[king_row][col] !== 0) {
                        castle = false
                        break
                    }
                }
            }
        }
        // If path is clear, temporarily perform castling
        if (castle) {
            const matrix = this.matrix
            let king_next
            let rook_next
            if (x > king_col) {
                king_next = king_col + 2
                rook_next = king_col + 1
            } else if (x < king_col) {
                king_next = king_col - 2
                rook_next = king_col - 1
            }
            // Temporarily move pieces
            matrix[king_row][rook_next] = 10
            matrix[king_row][x] = 0
            matrix[king_row][king_next] = 12
            matrix[king_row][king_col] = 0

            this.king = [king_row, king_next]

            const [check_box, king_only] = this.#check()
            if (Object.keys(check_box).length === 0 && !king_only) {
                list1 = [king_row, king_next]
            }
            // Restore pieces
            matrix[king_row][king_col] = 12
            matrix[king_row][king_next] = 0
            matrix[king_row][x] = 10
            matrix[king_row][rook_next] = 0
            this.king = [king_row, king_col]
        }
        return list1
    }

    // It calculate the steps possible of the choosen chessman
    #pawn(row, col) {
        let list1 = []
        if (row > 0) {
            if (row === this.rowlen - 2) {
                if (this.matrix[row - 1][col] === 0 && this.matrix[row - 2][col] === 0) {
                    list1 = [
                        this._makeNode([row - 1, col]),
                        this._makeNode([row - 2, col])
                    ]
                } else if (this.matrix[row - 1][col] === 0) {
                    list1 = [
                        this._makeNode([row - 1, col])
                    ]
                }
            } else {
                if (this.matrix[row - 1][col] === 0) {
                    list1 = [
                        this._makeNode([row - 1, col])
                    ]
                }
            }
            if (col - 1 >= 0) {
                if (this.matrix[row - 1][col - 1] !== 0 && this.matrix[row - 1][col - 1] <= 6) {
                    list1.push(this._makeNode([row - 1, col - 1]))
                }
            }
            if (col + 1 < this.collen) {
                if (this.matrix[row - 1][col + 1] !== 0 && this.matrix[row - 1][col + 1] <= 6) {
                    list1.push(this._makeNode([row - 1, col + 1]))
                }
            }
        }
        return list1.filter(node => node != null)
    }
    #knight(row, col) {
        let list1 = []
        const moves = [[1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2]]
        for (const [dr, dc] of moves) {
            const r = row + dr
            const c = col + dc
            if (r >= 0 && r < this.rowlen && c >= 0 && c < this.collen && this.matrix[r][c] < 7) {
                list1.push(this._makeNode([r, c]))
            }
        }
        return list1.filter(node => node != null)
    }
    #bishop(row, col) {
        const directions = [[-1, +1], [+1, +1], [+1, -1], [-1, -1]]
        let moves = []
        for (const [dr, dc] of directions)
            moves = moves.concat(this.#slide(row, col, dr, dc))
        return moves
    }
    #rook(row, col) {
        const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]]
        let moves = []
        for (const [dr, dc] of directions) {
            moves = moves.concat(this.#slide(row, col, dr, dc))
        }
        return moves
    }
    #queen(row, col) {
        const directions = [[-1, 0], [0, 1], [1, 0], [0, -1], [-1, 1], [1, 1], [1, -1], [-1, -1]]
        let moves = []
        for (const [dr, dc] of directions) {
            moves = moves.concat(this.#slide(row, col, dr, dc))
        }
        return moves
    }
    #king(row, col) {
        let list1 = []
        const s = new Set()
        this.enemy.forEach(e => {
            const res = this.#filterEnemy([e[0], row, col])
            if (res) {
                res.forEach(v => s.add(v))
            }
        })
        const directions = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]
        for (let i = 0; i < 8; i++) {
            const [dr, dc] = directions[i]
            const r = row + dr
            const c = col + dc
            if (r >= 0 && r < this.rowlen && c >= 0 && c < this.collen && this.matrix[r][c] < 7 && !s.has(i + 1)) {
                list1.push([r, c])
            }
        }
        if (this.castle.length !== 0) {
            const side = [!s.has(4), !s.has(5)]
            const [check_path, king_only] = this.#check()
            for (const x of this.castle) {
                if (x > col && side[1]) {
                    if (Object.keys(check_path).length === 0 && !king_only) {
                        list1.push(this.#castle(x))
                    }
                } else if (x < col && side[0]) {
                    if (Object.keys(check_path).length === 0 && !king_only) {
                        list1.push(this.#castle(x))
                    }
                }
            }
        }
        return list1.filter(node => node != null)
    }

    #slide(row, col, dr, dc) {
        let moves = []
        let r = row + dr
        let c = col + dc
        while (r >= 0 && r < this.rowlen && c >= 0 && c < this.collen) {
            if (this.matrix[r][c] === 0) {
                moves.push(this._makeNode([r, c]))
            } else if (this.matrix[r][c] <= 6) {
                moves.push(this._makeNode([r, c]))
                break
            } else {
                break
            }
            r += dr
            c += dc
        }
        return moves.filter(node => node != null)
    }
}
