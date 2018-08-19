import React, { Component } from 'react';
import Tile from './Tile'

const BASE_URL = 'https://minesweeper-api.herokuapp.com/games/'
const START_TIME = Date.now()

class Minesweeper extends Component {
    constructor(props) {
        super(props);
        this.state = {
            game: { board: [] }, 
            gameId: '',
            timer: 0, // in seconds
            result: '',
            difficulty: 0
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
            body: JSON.stringify({ difficulty: this.state.difficulty })
        })
        .then(resp => resp.json())
        .then(newGame => {
            this.setState({
                game: newGame,
                gameId: newGame.id
            })
        })
    }

    changeDifficulty = (e) => {
        console.log(e.target.value)
        // set up a dictionary to give easy: 0, medium: 1, and hard: 2
        this.setState({
            difficulty: e.target.value
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

    render() {
        return (
            <div className='game'>
                <div className='title'>Minesweeper Game ID: #{this.state.game.id}</div>
                <div>Choose difficulty: 
                    <span className='drop-down-difficulty'> 
                    <select name='difficulty' onChange={this.changeDifficulty}>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                    </span>
                </div>
                <div className='timer'>It's been {this.state.timer} seconds since you started!</div>
                <div className='board-border'>
                    {this.state.game.board.map((row, i) => {
                        return (
                            <div key={i} className='row'>
                                {row.map((col, j) => {
                                    return (
                                        <Tile key={j} 
                                        game={this.state.game} row={i} col={j}
                                        checkBox={this.checkBox} flagBox={this.flagBox}/>
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
