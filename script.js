window.addEventListener('DOMContentLoaded', () => {
  let currentPlayer = 'X';
  let gameOver = false;

  window.startGame = function () {
    document.querySelector('.start-screen').classList.add('hidden');
    document.getElementById('game-board').classList.remove('hidden');
    resetGame();
  };

  window.showInstructions = function () {
    document.getElementById('instructions-modal').classList.remove('hidden');
  };

  window.closeInstructions = function () {
    document.getElementById('instructions-modal').classList.add('hidden');
  };

  const cells = document.querySelectorAll('.cell');
  const currentPlayerDisplay = document.getElementById('current-player');

  function updateCurrentPlayerDisplay() {
    currentPlayerDisplay.textContent = gameOver
      ? ''
      : `Vez do jogador: ${currentPlayer}`;
  }

  function handleCellClick(e) {
    const cell = e.target;

    if (cell.textContent !== '' || gameOver) {
      return;
    }

    cell.textContent = currentPlayer;
    cell.classList.add(`player-${currentPlayer}`);

    if (checkWin()) {
      currentPlayerDisplay.textContent = `Jogador ${currentPlayer} venceu!`;
      gameOver = true;
      return;
    }

    if (checkDraw()) {
      currentPlayerDisplay.textContent = `Empate!`;
      gameOver = true;
      return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
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
      [2, 4, 6]
    ];

    return winPatterns.some(pattern => {
      const [a, b, c] = pattern;
      return (
        cells[a].textContent === currentPlayer &&
        cells[b].textContent === currentPlayer &&
        cells[c].textContent === currentPlayer
      );
    });
  }

  function checkDraw() {
    return [...cells].every(cell => cell.textContent !== '');
  }

  function resetGame() {
    cells.forEach(cell => {
      cell.textContent = '';
      cell.classList.remove('player-X', 'player-O');
    });
    currentPlayer = 'X';
    gameOver = false;
    updateCurrentPlayerDisplay();
  }

  cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
  });
});
