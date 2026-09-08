export default function chessInfo(matrix, castlePlayer1, castlePlayer2) {
    const collen = matrix[0].length
    let king1 = []
    let king2 = []
    let player1 = []
    let player2 = []
    let rook_player1 = []
    let rook_player2 = []
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < collen; j++) {
            if (matrix[i][j] > 0 && matrix[i][j] <= 6) {
                player1.push([[i, j], matrix[i][j]])
                if (matrix[i][j] === 6) {
                    king1 = [i, j]
                } else if (matrix[i][j] === 4) {
                    rook_player1.push([i, j])
                }
            } else if (matrix[i][j] >= 7 && matrix[i][j] < 13) {
                player2.push([[i, j], matrix[i][j]])
                if (matrix[i][j] === 12) {
                    king2 = [i, j]
                } else if (matrix[i][j] === 10) {
                    rook_player2.push([i, j])
                }
            }
        }
    }
    const castle1 = rook_player1.filter(([row, col]) => row === king1[0] && ((castlePlayer1.includes("l") && col === 0) || (castlePlayer1.includes("r") && col === collen - 1))).map(([_, col]) => col)
    const castle2 = rook_player2.filter(([row, col]) => row === king2[0] && ((castlePlayer2.includes("l") && col === 0) || (castlePlayer2.includes("r") && col === collen - 1))).map(([_, col]) => col)
    return [player1, player2, king1, king2, castle1, castle2]
}

