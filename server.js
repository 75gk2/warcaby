const { json } = require('body-parser')
const express = require('express')
const app = express()
let PORT = process.env.PORT || 3000;

app.use(express.static('static'))
app.use(express.json())

let players = []
let inGame = false

let currentPlayer = null
let opponent = null

let animation = {}
let board = []

app.post("/ADD_USER", (req, res) => {
    console.log(req.body.login)
    const login = req.body.login
    const accept = !players.includes(login) && !inGame
    if (accept) {
        players.push(login)
        if (players.length == 2)
            startGame();
    }
    console.log(accept, players)
    res.send(accept)
})

app.post("/isMyTurn", (req, res) => {
    let name = req.body.name
    if (currentPlayer === name) {
        res.send({
            board: board,
            animation:animation
        })
    } else
        res.end()
})
app.post("/moved", (req, res) => {
    let name = req.body.name
    let boardUpdated = req.body.board
    let animation1 = req.body.animation
    console.log(currentPlayer,name)
    if (currentPlayer === name) {
        board = boardUpdated
        let tmp = currentPlayer;
        currentPlayer = opponent;
        animation = animation1
        opponent = tmp
        res.send({
            status: 200
        })
    } else
        res.end()
})

app.post("/RESET", (req, res) => {
    players = []
    inGame = false
    console.log({ players: players })
    res.end()
})
app.post("/WAITING/:name", (req, res) => {
    let name = req.params.name
    if (inGame && players.includes(name)) {
        const index = players.indexOf(name)
        res.send({
            opponent: players[1 - index],
            color: index + 1
        })
    } else
        res.end()
})

function startGame() {
    currentPlayer = players[0]
    opponent = players[1]
    inGame = true
}

app.listen(PORT, console.log("klik->\thttp://127.0.0.1:3000"))