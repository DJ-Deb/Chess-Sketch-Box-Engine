import Board from "./index.js"
import readline from "readline"
import { PlayerChessman_1, PlayerChessman_2 } from "./js/chessman.js"

// board object created for the board initialization
const board = new Board([
    [4, 0, 6, 0, 4],
    [1, 1, 5, 0, 1],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [7, 7, 11, 0, 7],
    [10, 0, 12, 0, 10]
])
console.log("In testing")

// for reading the terminal query
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

// function for asking the query
function ask(question) {
    return new Promise(resolve => rl.question(question, resolve))
}

// playing chess in the terminal
let loop = true
while (loop) {
    let choice = await ask("Enter 1 : To get the chess board matrix\nEnter 2 : To show the moves\nEnter 3 : To play move\nEnter any other key : To exit\nChoose : ")

    switch (choice) {
        case "2":
            let row = await ask("Enter row number: ")
            let col = await ask("Enter col number: ")
            console.log(await board.showMoves(Number(row), Number(col)))
            break
        case "3":
            let old_row = await ask("Enter current row number: ")
            let old_col = await ask("Enter current col number: ")
            let new_row = await ask("Enter next row number: ")
            let new_col = await ask("Enter next col number: ")
            if ((board.boardData.matrix[Number(old_row)][Number(old_col)] === 1 && Number(new_row) === board.boardData.rowlen - 1) || (board.boardData.matrix[Number(old_row)][Number(old_col)] === 7 && Number(new_row) === 0)) {
                let changeChessman = await ask("Enter new number for the chessman to change to: ")
                board.playMove(Number(old_row), Number(old_col), Number(new_row), Number(new_col), Number(changeChessman))
            } else {
                board.playMove(Number(old_row), Number(old_col), Number(new_row), Number(new_col))
            }
            let [playerCheck1, playerCheck2] = board.check()
            console.log("Play move")
            if (playerCheck1) 
                console.log("Player-1 King Check")
            if (playerCheck2)
                console.log("Player-2 King Check")
        case "1":
            console.log("matrix:", board.boardData.matrix)
            console.log("\n")
            console.log("player1:", board.boardData.player1)
            console.log("king1:", board.boardData.king1)
            console.log("castle1:", board.boardData.castle1)
            console.log("\n")
            console.log("player2:", board.boardData.player2)
            console.log("king2:", board.boardData.king2)
            console.log("castle2:", board.boardData.castle2)
            break
        default:
            console.log("Exiting...")
            loop = false
    }
}

rl.close()
