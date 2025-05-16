window.addEventListener("DOMContentLoaded", () => {
  let currentPlayer = "X";
  let gameOver = false;
  let rankingData = [];

  loadRankingData();
  updateRankingDisplay();

  window.startGame = function () {
    document.querySelector(".start-screen").classList.add("hidden");
    document.querySelector(".ranking-section").classList.add("hidden");
    document.getElementById("game-board").classList.remove("hidden");
    resetGame();
  };

  window.showInstructions = function () {
    document.getElementById("instructions-modal").classList.remove("hidden");
  };

  window.closeInstructions = function () {
    document.getElementById("instructions-modal").classList.add("hidden");
  };

  const cells = document.querySelectorAll(".cell");
  const currentPlayerDisplay = document.getElementById("current-player");

  function updateCurrentPlayerDisplay() {
    currentPlayerDisplay.textContent = gameOver
      ? ""
      : `Vez do jogador: ${currentPlayer}`;
  }

  function handleCellClick(e) {
    const cell = e.target;

    if (cell.textContent !== "" || gameOver) {
      return;
    }

    cell.textContent = currentPlayer;
    cell.classList.add(`player-${currentPlayer}`);

    if (checkWin()) {
      currentPlayerDisplay.textContent = `Jogador ${currentPlayer} venceu!`;
      updateRanking(currentPlayer);
      gameOver = true;
      return;
    }

    if (checkDraw()) {
      currentPlayerDisplay.textContent = `Empate!`;
      gameOver = true;
      return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    updateCurrentPlayerDisplay();
  }

  function checkWin() {
    const winPatterns = [
      // Linhas
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      // Colunas
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      // Diagonais
      [0, 4, 8],
      [2, 4, 6],
    ];

    return winPatterns.some((pattern) => {
      const [a, b, c] = pattern;
      return (
        cells[a].textContent === currentPlayer &&
        cells[b].textContent === currentPlayer &&
        cells[c].textContent === currentPlayer
      );
    });
  }

  function checkDraw() {
    return [...cells].every((cell) => cell.textContent !== "");
  }

  function resetGame() {
    cells.forEach((cell) => {
      cell.textContent = "";
      cell.classList.remove("player-X", "player-O");
    });
    currentPlayer = "X";
    gameOver = false;
    updateCurrentPlayerDisplay();
  }

  cells.forEach((cell) => {
    cell.addEventListener("click", handleCellClick);
  });

  function loadRankingData() {
    const savedRanking = localStorage.getItem("ticTacToeRanking");
    if (savedRanking) {
      rankingData = JSON.parse(savedRanking);
    }
  }

  function saveRankingData() {
    localStorage.setItem("ticTacToeRanking", JSON.stringify(rankingData));
  }

  function updateRanking(winner) {
    const playerIndex = rankingData.findIndex(
      (player) => player.name === `Jogador ${winner}`
    );

    if (playerIndex !== -1) {
      rankingData[playerIndex].wins++;
    } else {
      rankingData.push({
        name: `Jogador ${winner}`,
        wins: 1,
        timestamp: Date.now(),
      });
    }

    rankingData.sort((a, b) => {
      if (a.wins !== b.wins) {
        return b.wins - a.wins;
      }
      return a.timestamp - b.timestamp;
    });

    saveRankingData();
    updateRankingDisplay();
  }

  function updateRankingDisplay() {
    const rankingBody = document.getElementById("ranking-body");
    rankingBody.innerHTML = "";

    const topPlayers = rankingData.slice(0, 5);

    if (topPlayers.length === 0) {
      const emptyRow = document.createElement("tr");
      emptyRow.innerHTML = `<td colspan="3">Sem partidas registradas</td>`;
      rankingBody.appendChild(emptyRow);
    } else {
      topPlayers.forEach((player, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
        <td>${index + 1}</td>
        <td>${player.name}</td>
        <td>${player.wins}</td>
      `;
        rankingBody.appendChild(row);
      });
    }
  }
});
