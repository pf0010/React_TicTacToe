import { useState } from 'react';

function Square({ value, onSquareClick }) {
    return <button className="square" onClick={onSquareClick}>{value}</button>
}

function Board({ xIsNext, squares, onPlay }) {
    function handleClick(i) {
        if (squares[i] || calculateWinner(squares)) {
            return;
        }

        const nextSquares = squares.slice();
        if (xIsNext) {
            nextSquares[i] = "X";
        } else {
            nextSquares[i] = "O";
        }

        onPlay(nextSquares);
    }
    const winner = calculateWinner(squares);
    let status;

    if (winner) {
        status = "Winner: " + winner;
    } else {
        status = "Next player: " + (xIsNext ? "X" : "O");
    }

    console.log(squares[0]);

    const renderSquares = () => Array.from({ length: 3 }).map((v, i) => {
        let s;
        let row = [];
        for (let j = 0; j < 3; ++j) {
            s = i * 3 + j;
            row.push(<Square key={s} value={squares[s]} onSquareClick={() => handleClick(i * 3 + j)} />);
            console.log(squares[s]);
        }

        return (
            <div className="board-row">{row}</div>
        );
    });



    return (
        <>
            <div className="status">{status}</div>
            <div>{renderSquares()}</div>
        </>
    );
}

export default function Game() {
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentmove] = useState(0);
    const [movesSorting, setMovesSorting] = useState("Descending");
    const xIsNext = currentMove % 2 === 0;
    const currentSquares = history[currentMove];

    function handlePlay(nextSquares) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentmove(nextHistory.length - 1);
    }

    function jumpTo(nextMove) {
        setCurrentmove(nextMove);
    }

    function sortMoves() {
        setMovesSorting(movesSorting === "Ascending" ? "Descending" : "Ascending");
    }

    const moves = history.map((squares, move) => {
        let description;

        if (move > 0) {
            description = 'Go to move #' + move;
        } else {
            description = 'Go to game start';
        }

        if (move === currentMove) {
            return (<li key="move">{"You are at move #" + move}</li>);
        } else {
            return (
                <li key={move}>
                    <button onClick={() => jumpTo(move)}>{description}</button>
                </li>
            );
        }
    });

    return (
        <div className="game">
            <div className="game-board">
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
            </div>
            <div className="game-info">
                <center><button onClick={sortMoves}>{movesSorting}</button></center>
                <ol>{moves}</ol>
            </div>
        </div>
    )
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}
