const App = {
  $: {
    menu: document.querySelector("[data-id='menu']"),
    menuItems: document.querySelector("[data-id='menu-items']"),
    resetBtn: document.querySelector("[data-id='reset-btn']"),
    newRoundBtn: document.querySelector("[data-id='new-round-btn']"),
    squares: document.querySelectorAll("[data-id='square']"),
    modal: document.querySelector("[data-id='modal']"),
    modalText: document.querySelector("[data-id='modal-text']"),
    modalBtn: document.querySelector("[data-id='modal-btn']"),
    turn: document.querySelector("[data-id='turn']"),
  },

  state: {
    moves: [],
  },

  getGameStatus(moves) {
    const p1Moves = moves
      .filter((move) => move.playerId === 1)
      .map((move) => {
        return move.squareId;
      });
    const p2Moves = moves
      .filter((move) => move.playerId === 2)
      .map((move) => {
        return move.squareId;
      });

    const winningPatterns = [
      [1, 2, 3], // top row
      [1, 5, 9], // diagonal
      [1, 4, 7], // left column
      [2, 5, 8], // middle column
      [3, 5, 7], // diagonal
      [3, 6, 9], // right column
      [4, 5, 6], // middle row
      [7, 8, 9], // bottom row
    ];

    let winner = null;

    winningPatterns.forEach((pattern) => {
      const p1Wins = pattern.every((v) => p1Moves.includes(v));
      const p2Wins = pattern.every((v) => p2Moves.includes(v));

      if (p1Wins) {
        winner = 1;
      }
      if (p2Wins) {
        winner = 2;
      }
    });

    return {
      status: moves.length === 9 || winner != null ? "complete" : "in-progress", // 'in-progress', 'won', 'draw'
      winner, // 1, 2, null
    };
  },

  init() {
    this.registerEventListeners();
  },

  registerEventListeners() {
    this.$.menu.addEventListener("click", (event) => {
      this.$.menuItems.classList.toggle("hidden");
    });
    this.$.resetBtn.addEventListener("click", (event) => {
      this.state.moves = [];
      this.$.squares.forEach((square) => {
        square.replaceChildren();
      });
    });
    this.$.newRoundBtn.addEventListener("click", (event) => {
      this.state.moves = [];
      this.$.squares.forEach((square) => {
        square.replaceChildren();
      });
    });
    this.$.modalBtn.addEventListener("click", (event) => {
      this.state.moves = [];
      this.$.squares.forEach((square) => {
        square.replaceChildren();
      });
      this.$.modal.classList.add("hidden");
    });

    this.$.squares.forEach((square) => {
      square.addEventListener("click", (event) => {
        //check if there is already a play, if so, return early
        const hasMove = (squareId) => {
          const existingMove = this.state.moves.find(
            (move) => move.squareId === squareId
          );
          return existingMove !== undefined;
        };

        if (hasMove(+square.id)) {
          return;
        }

        const lastMove = this.state.moves.at(-1);
        const getOppositePlayer = (playerId) => (playerId === 1 ? 2 : 1);
        const currentPlayer =
          this.state.moves.length === 0
            ? 1
            : getOppositePlayer(lastMove.playerId);

        const nextPlayer = getOppositePlayer(currentPlayer);

        const squareIcon = document.createElement("i");
        const turnIcon = document.createElement("i");
        const turnLabel = document.createElement("p");
        turnLabel.textContent = `Player ${nextPlayer}'s you're up!`;

        if (currentPlayer === 1) {
          squareIcon.classList.add("fa-solid", "fa-x", "yellow");
          turnIcon.classList.add("fa-solid", "fa-0", "turquoise");
          turnLabel.classList.add("turquoise");
        } else {
          squareIcon.classList.add("fa-solid", "fa-o", "turquoise");
          turnIcon.classList.add("fa-solid", "fa-x", "yellow");
          turnLabel.classList.add("yellow");
        }

        this.$.turn.replaceChildren(turnIcon, turnLabel);

        this.state.moves.push({
          squareId: +square.id,
          playerId: currentPlayer,
        });

        square.replaceChildren(squareIcon);
        //Check for winner
        const game = this.getGameStatus(this.state.moves);

        if (game.status === "complete") {
          this.$.modal.classList.remove("hidden");
          if (game.winner) {
            this.$.modalText.textContent = `Player ${game.winner} wins!`;
            // console.log(`Player ${game.winner} wins!`);
          } else {
            this.$.modalText.textContent = `It's a draw!`;
          }
        }
      });
    });
  },
};

window.addEventListener("load", () => {
  App.init();
});
