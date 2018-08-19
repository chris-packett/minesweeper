import React, { Component } from 'react';

const BASE_URL = 'https://minesweeper-api.herokuapp.com/games/'
const START_TIME = Date.now()

class Minesweeper extends Component {
    constructor(props) {
        super(props);
        this.state = {
            game: { board: [] }, 
            gameId: '',
            timer: 0, // in seconds
            result: ''
        }
    }

    startTimer() {
        this.timerID = setInterval(() => {
            this.setState({ timer: Math.floor((Date.now() - START_TIME) / 1000) })
        }, 1000)
    }

    stopTimer() {
        clearInterval(this.timerID)
    }

    componentDidMount() {
        this.startTimer()
        fetch(`${BASE_URL}`, {
            method: "POST",
            headers: { "Content-Type": "application/json; charset=utf-8" },
            body: JSON.stringify({ difficulty: 0 })
        })
        .then(resp => resp.json())
        .then(newGame => {
            this.setState({
                game: newGame,
                gameId: newGame.id
            })
        })
    }

    displayGameResult() {
        if (this.state.game.state === "won") {
            this.setState({ result: `Good job, you won in ${this.state.timer} seconds!` })
            this.stopTimer()
        }
        else if (this.state.game.state === "lost") {
            this.setState({ result: 'Oh no... you lose!' })
            this.stopTimer()
        }
    }

    checkBox = (row, col) => {
        fetch(`${BASE_URL}${this.state.gameId}/check`, {
            method: "POST",
            headers: { "Content-Type": "application/json; charset=utf-8" },
            body: JSON.stringify({ 
                "row": row,
                "col": col
            })
        })
        .then(resp => resp.json())
        .then(newGame => {
            this.setState({ game: newGame })
            this.displayGameResult()
        })
    }

    flagBox = (e, row, col) => {
        e.preventDefault()
        fetch(`${BASE_URL}${this.state.gameId}/flag`, {
            method: "POST",
            headers: { "Content-Type": "application/json; charset=utf-8" },
            body: JSON.stringify({ 
                "row": row,
                "col": col
            })
        })
        .then(resp => resp.json())
        .then(newGame => {
            this.setState({ game: newGame })
        })
    }

    renderTiles = (row, col) => {
        const tile = this.state.game.board[row][col]
        if (tile === "_") {
            return "◻️"
        }
        else if (tile === "F") {
            return "🚩"
        }
        else if (tile === "*" || tile === "@") {
            return "💣"
        }
        else {
            return tile
        }
    }

    render() {
        return (
            <div className='game'>
                <div className='title'>Minesweeper Game ID: #{this.state.game.id}</div>
                <div className='timer'>It's been {this.state.timer} seconds since you started!</div>
                <div className='board-border'>
                    {this.state.game.board.map((row, i) => {
                        return (
                            <div key={i} className='row'>
                                {row.map((col, j) => {
                                    return (
                                        <span key={j} className='col' 
                                        onClick={() => this.checkBox(i, j)} 
                                        onContextMenu={(e) => this.flagBox(e, i, j)}>
                                            {this.renderTiles(i, j)}
                                        </span>
                                    )
                                })}
                            </div>
                        )
                    })}
                </div>
                <div>{this.state.result}</div>
            </div>
        );
    }
}

export default Minesweeper;
