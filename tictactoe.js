//////////// Player Class ////////////
class Player {
	constructor(token, name) {
		this._token = token || '';
		this._name = name;
	}
}

class Square {
	constructor() {
		this._value = '';
		this._clicked = false;
	}

	changeValue(value) {
		if (this._clicked) {
			return;
		}
		this._value = value;
		this._clicked = true;
	}
}

class GameStatus {
	constructor() {
		this._initialState = {
			_players: [],
			_winner: null,
			_activePlayer: null,
			_activePlayerIndex: null,
			_squares: [],
		}
		this._gameState = this._initialState;
	}

	resetGame() {
		this._gameState = this._initialState;
		this.initGame();
	}

	// adds players to the game
	addPlayers(players) {
		players.filter(player => player._token)
			.map(player => this._gameState._players.push(player));
	}

	/**
	 * Sets the current active player
	 *
	 * @param {Object} player - a player of the game
	 * @memberof GameStatus
	 */
	setActivePlayer(playerIndex) {
		this._gameState._activePlayerIndex = playerIndex;
		this._gameState._activePlayer = this._gameState._players[playerIndex];
		document.querySelector('.currentPlayer').textContent = `${this._gameState._activePlayer._name}, it's your turn`;
	}

	getCurrentPlayerIndex() {
		return this._gameState._activePlayerIndex;
	}

	/**
	 * create 9 square objects to keep track of each square
	 *
	 * @memberof GameStatus
	 */
	initializeSquares(squares) {
		while(this._gameState._squares.length < 10) {
			this._gameState._squares.push(new Square());
		}

		squares.map((square, index) =>
			square.onclick = () => {
				if (!this._gameState._squares[index]._clicked && !this._gameState._winner) {
					this._gameState._squares[index].changeValue(this._gameState._activePlayer._token);
					square.textContent = this._gameState._squares[index]._value;

					if (this.checkWinner()) {
						const statusIndicator = document.querySelector('.currentPlayer');
						statusIndicator.textContent = `${this._gameState._activePlayer._name} has won!`;
						statusIndicator.classList.add('success');
						return;
					}

					this.setActivePlayer(this.getCurrentPlayerIndex() === 1 ? 0 : 1);
				}
			}
		);
	}

	checkWinner() {
		for (let i = 0; i < winning.length; i++) {
			if (winning[i].filter(value => this._gameState._squares[value]._value === this._gameState._activePlayer._token).length === 3) {
				this._gameState._winner = this._gameState._activePlayer;
				return true;
			}
		}
	}

	/**
	 * initializes the game
	 *
	 * @param {Object[]} players - list of players to add to the game
	 */
	initGame(players) {
		const squares = Array.from(document.querySelectorAll('.square'));
		this.addPlayers(players);
		this.setActivePlayer(Math.round(Math.random()));
		this.initializeSquares(squares);
	}
}

// Board layout
// 0 1 2
// 3 4 5
// 6 7 8
const winning = [
	[0, 1, 2],
	[0, 3, 6],
	[0, 4, 8],
	[3, 4, 5],
	[6, 7, 8],
	[1, 4, 7],
	[2, 5, 8],
	[2, 4, 6],
];

//////////// Main Thread ////////////
const Game = new GameStatus();
const players = [];
player1Input = document.getElementById('player1').value;
player2Input = document.getElementById('player2').value;

console.log(document.querySelector('.start').onClick);

document.querySelector('.start').onclick = () => {
	console.log('clicked bro');
	if (!player1Input || !player2Input) {
		alert('need two people to play');
		return;
	}

	const Player1 = new Player('X', player1Input);
	const Player2 = new Player('O', player2Input);
	Game.initGame([Player1, Player2]);
};
