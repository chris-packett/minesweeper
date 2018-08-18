import React, { Component } from 'react';

const BASE_URL = 'https://minesweeper-api.herokuapp.com'

class Minesweeper extends Component {
    constructor(props) {
        super(props);
        this.state = {
            game: {
                board: []
            },
            gameId: ''
        }
    }

    componentDidMount() {
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
        })
        .catch(console.error)
    }

    flagBox = (row, col) => {
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
        if (this.state.game.board[row][col] === " ") {
            return "U"
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
                                        onContextMenu={() => this.flagBox(i, j)}>
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
