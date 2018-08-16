import React, { Component } from 'react';

class Minesweeper extends Component {
    constructor(props) {
        super(props);
        this.state = {
            game: {
                board: []
            }
        }
    }

    componentDidMount() {
        const baseURL = 'https://minesweeper-api.herokuapp.com'
        fetch(`${baseURL}/games/`, {
            method: "POST",
            body: JSON.stringify({ difficulty: 0 })
        })
        .then(resp => resp.json())
        .then(newGame => {
            console.log(newGame)
            this.setState({
                game: newGame
            })
        })
    }

    render() {
        return (
            <div className='board'>
                <div className='title'>
                    Minesweeper Game ID: {this.state.game.id}
                </div>
                <div className='board-border'>
                    {this.state.game.board.map((row, i) => {
                        return (
                            <div key={i} className='row'>
                                {row.map((col, j) => {
                                    return (
                                        <span key={j} className='col'>
                                            {this.state.game.board[i][j]}
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
