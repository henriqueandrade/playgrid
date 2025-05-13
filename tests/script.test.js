/**
 * @jest-environment jsdom
 */

const fs = require("fs");
const path = require("path");

describe("Testando jogabilidade do Playgrid", () => {
  beforeEach(async () => {
    const html = fs.readFileSync(
      path.resolve(__dirname, "../public/index.html"),
      "utf8"
    );
    document.open();
    document.write(html);
    document.close();

    const scriptCode = fs.readFileSync(
      path.resolve(__dirname, "../public/script.js"),
      "utf8"
    );

    eval(scriptCode);

    await new Promise((resolve) => setTimeout(resolve, 0));

    document.dispatchEvent(new Event("DOMContentLoaded"));

    await new Promise((resolve) => setTimeout(resolve, 0));
  });

  test("Deve iniciar um novo jogo ao clicar no botão 'Começar Jogo'.", () => {
    const startScreen = document.querySelector(".start-screen");
    const gameBoard = document.getElementById("game-board");

    startScreen.classList.remove("hidden");
    gameBoard.classList.add("hidden");

    window.startGame();

    expect(startScreen.classList.contains("hidden")).toBe(true);
    expect(gameBoard.classList.contains("hidden")).toBe(false);
  });

  test("Deve exibir modal de ajuda", () => {
    const modal = document.getElementById("instructions-modal");
    modal.classList.add("hidden");

    window.showInstructions();

    expect(modal.classList.contains("hidden")).toBe(false);
  });

  test("Deve fechar a modal de ajuda", () => {
    const modal = document.getElementById("instructions-modal");
    modal.classList.remove("hidden");

    window.closeInstructions();

    expect(modal.classList.contains("hidden")).toBe(true);
  });

  test("Deve alternar entre jogadores (X e O)", () => {
    const cells = document.querySelectorAll(".cell");
    const display = document.getElementById("current-player");

    window.startGame();

    cells[0].click(); // Jogador X
    expect(cells[0].textContent).toBe("X");
    expect(display.textContent).toMatch(/O/);

    cells[1].click(); // Jogador O
    expect(cells[1].textContent).toBe("O");
    expect(display.textContent).toMatch(/X/);
  });

  test("Deve mudar de jogador após cada jogada válida", () => {
    const cells = document.querySelectorAll(".cell");
    const display = document.getElementById("current-player");

    window.startGame();

    const queue = [
      { action: 0, result: "X", next: "O" },
      { action: 1, result: "O", next: "X" },
      { action: 2, result: "X", next: "O" },
    ];

    queue.forEach(({ action, result, next }) => {
      cells[action].click();
      expect(cells[action].textContent).toBe(result);
      expect(display.textContent).toMatch(new RegExp(next));
    });
  });

  test("Deve impedir que selecione uma posição já ocupada", () => {
    const cells = document.querySelectorAll(".cell");
    const display = document.getElementById("current-player");

    window.startGame();

    cells[0].click();
    expect(cells[0].textContent).toBe("X");

    cells[0].click();
    expect(cells[0].textContent).toBe("X");

    expect(display.textContent).toMatch(/O/);
  });

  test("Deve reconhecer vitória na horizontal", () => {
    const cells = document.querySelectorAll(".cell");
    const display = document.getElementById("current-player");

    window.startGame();

    cells[0].click(); // X
    cells[3].click(); // O
    cells[1].click(); // X
    cells[4].click(); // O
    cells[2].click(); // X vence

    expect(display.textContent).toMatch(/X venceu/);
  });

  test("Deve reconhecer vitória na vertical", () => {
    const cells = document.querySelectorAll(".cell");
    const display = document.getElementById("current-player");

    window.startGame();

    cells[0].click(); // X
    cells[1].click(); // O
    cells[3].click(); // X
    cells[2].click(); // O
    cells[6].click(); // X vence (0,3,6)

    expect(display.textContent).toMatch(/X venceu/);
  });

  test("Deve reconhecer vitória na diagonal", () => {
    const cells = document.querySelectorAll(".cell");
    const display = document.getElementById("current-player");

    window.startGame();

    cells[0].click(); // X
    cells[1].click(); // O
    cells[4].click(); // X
    cells[2].click(); // O
    cells[8].click(); // X vence (0,4,8)

    expect(display.textContent).toMatch(/X venceu/);
  });

  test("Deve reconhcer empate", () => {
    const cells = document.querySelectorAll(".cell");
    const display = document.getElementById("current-player");

    window.startGame();

    // X O X
    cells[0].click(); // X
    cells[1].click(); // O
    cells[2].click(); // X
    // O X O
    cells[4].click(); // O
    cells[3].click(); // X
    cells[5].click(); // O
    // O X X
    cells[7].click(); // X
    cells[6].click(); // O
    cells[8].click(); // X

    expect(display.textContent).toMatch(/Empate/);
  });

  test("Deve iniciar um novo jogo", () => {
    const cells = document.querySelectorAll(".cell");
    const display = document.getElementById("current-player");

    window.startGame();

    cells[0].click();
    cells[1].click();
    cells[2].click();

    window.startGame();

    cells.forEach((cell) => {
      expect(cell.textContent).toBe("");
      expect(cell.classList.contains("player-X")).toBe(false);
      expect(cell.classList.contains("player-O")).toBe(false);
    });

    expect(display.textContent).toMatch(/X/);
  });
});
