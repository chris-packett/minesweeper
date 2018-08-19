import React, { Component } from 'react';

class Tile extends Component {
    renderTile = (game, row, col) => {
        const tile = game.board[row][col]
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
            <span className='col' 
            game={this.props.game}
            onClick={() => this.props.checkBox(this.props.row, this.props.col)} 
            onContextMenu={(e) => this.props.flagBox(e, this.props.row, this.props.col)}>
                {this.renderTile(this.props.game, this.props.row, this.props.col)}
            </span>
        );
    }
}

export default Tile;

