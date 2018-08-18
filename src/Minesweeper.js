import React, { Component } from 'react';

const BASE_URL = 'https://minesweeper-api.herokuapp.com'
const START_TIME = Date.now()

class Minesweeper extends Component {
    constructor(props) {
        super(props);
        this.state = {
            game: {
                board: []
            },
            gameId: '',
            timer: 0
        }
    }

    componentDidMount() {
        this.startTimer()
        fetch(`${BASE_URL}/games/`, {
            method: "POST",
            body: JSON.stringify({
                difficulty: 0
            })
        })
        .then(resp => resp.json())
        .then(newGame => {
            console.log(newGame)
            this.setState({
                game: newGame,
                gameId: newGame.id
            })
        })
    }

    startTimer() {
        this.timerID = setInterval(() => {
            this.setState({
                timer: Math.floor((Date.now() - START_TIME) / 1000)
            })
        }, 1000)
    }

    stopTimer() {
        clearInterval(this.timerID)
    }

    checkBox = (row, col) => {
        fetch(`${BASE_URL}/games/${this.state.gameId}/check`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({ 
                "row": row,
                "col": col
            })
        })
        .then(resp => resp.json())
        .then(newGame => {
            console.log(newGame)
            this.setState({
                game: newGame
            })
            if (this.state.game.state === "lost") {
                console.log('you lost!')
                this.stopTimer()
            }
            else if (this.state.game.state === "won") {
                console.log('you won!')
                this.stopTimer()
            }
        })
        .catch(console.error)

    }

    flagBox = (e, row, col) => {
        e.preventDefault()
        fetch(`${BASE_URL}/games/${this.state.gameId}/flag`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({ 
                "row": row,
                "col": col
            })
        })
        .then(resp => resp.json())
        .then(newGame => {
            console.log(newGame)
            this.setState({
                game: newGame
            })
        })
    }

    renderCells = (row, col) => {
        if (this.state.game.board[row][col] === "_") {
            return "◻️"
        }
        else if (this.state.game.board[row][col] === "F") {
            return "🚩"
        }
        else if (this.state.game.board[row][col] === "*") {
            return "💣"
        }
        else {
            return this.state.game.board[row][col]
        }
    }

    render() {
        return (
            <div className='board'>
                <div className='title'>
                    Minesweeper Game ID: #{this.state.game.id}
                </div>
                <div>
                    It's been {this.state.timer} seconds since you started!
                </div>
                <div className='board-border'>
                    {this.state.game.board.map((row, i) => {
                        return (
                            <div key={i} className='row'>
                                {row.map((col, j) => {
                                    return (
                                        <span 
                                        key={j} 
                                        className='col' 
                                        onClick={() => this.checkBox(i, j)} 
                                        onContextMenu={(e) => this.flagBox(e, i, j)}>
                                            {this.renderCells(i, j)}
                                        </span>
                                    )
                                })}
                            </div>
                        )
                    })}
                </div>
            </div>
        );
    }
}

export default Minesweeper;
