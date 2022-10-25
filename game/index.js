import {
  sliceArray,
  getHoveredElement,
  debounce,
  displayTime,
} from './helpers';
import { checkWin, isSolutionPossible } from './checkers';
import { FIELD_SIZE, GAP, FILL_COLOR, COLOR, ZERO } from './constants';

let turnCounter = localStorage.getItem('turnCounter') || 0;
let gameTime = localStorage.getItem('gameTime') || 0;

export const renderCanvas = (selector = document.getElementById('app')) => {
  const { offsetWidth, offsetHeight } = document.body;
  const canvasSize = (offsetWidth + offsetHeight) / 2;
  const getCanvasSize = () => ~~canvasSize * 0.5;
  selector.innerHTML = `
  <canvas 
    id='canvas' 
    width=${getCanvasSize()} 
    height=${getCanvasSize()}>   
  </canvas>
  <section id='info'>
    <div>Counts: <span id='counter'>${turnCounter}</span></div>
    <div>Game time: <span id='time'>${displayTime(gameTime)}</span></div>
    <ul class='game-mode'>
      <li class='mode' data-mode='2'>2х2</li>
      <li class='mode' data-mode='3'>3х3</li>
      <li class='mode' data-mode='4'>4х4</li>
      <li class='mode' data-mode='5'>5х5</li>
      <li class='mode' data-mode='6'>6х6</li>
      <li class='mode' data-mode='7'>7х7</li>
      <li class='mode' data-mode='8'>8х8</li>
    </ul>
    </div>
    <button id='shuffle'>Shuffle and start</button>
  </section>
`;
  canvas.style.width = canvas.width = getCanvasSize();
  canvas.style.height = canvas.height = getCanvasSize();

  const CELL_SIZE = getCanvasSize() / FIELD_SIZE;
  initGame(CELL_SIZE);
};

const clearGameData = () => {
  turnCounter = 0;
  gameTime = 0;
};

const timer = setInterval(() => {
  const domTimer = document.getElementById('time');
  let gameTime = localStorage.getItem('gameTime') || 0;
  gameTime++;
  localStorage.setItem('gameTime', gameTime);
  domTimer.textContent = displayTime(gameTime);
}, 1000);

export const initGame = (CELL_SIZE) => {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const domCounter = document.getElementById('counter');

  const domShuffleButton = document.getElementById('shuffle');
  // clearGameData();

  timer;

  let activeCell = null;

  const getTurnCounter = () => {
    let turnCounter = localStorage.getItem('turnCounter') || 0;
    localStorage.setItem('turnCounter', ++turnCounter);
    domCounter.textContent = turnCounter;
  };

  const fillField = () => {
    const cells = [];
    const rowValues = new Set();
    while (rowValues.size < FIELD_SIZE ** 2) {
      const cellNumber = ~~(Math.random() * FIELD_SIZE ** 2);
      rowValues.add(cellNumber);
    }

    const filledCells = sliceArray(rowValues, FIELD_SIZE);

    if (!isSolutionPossible(filledCells)) return fillField();

    filledCells.map((value, row) => {
      for (let column = 0; column < FIELD_SIZE; column++) {
        cells.push({
          row,
          column,
          x: column * CELL_SIZE,
          y: row * CELL_SIZE,
          value: value[column],
        });
      }
    });
    return cells;
  };

  const cells = JSON.parse(localStorage.getItem('cells')) || fillField();

  const draw = (cells) => {
    ctx.clearRect(ZERO, ZERO, canvas.width, canvas.height);
    for (const key in cells) {
      if (Object.hasOwnProperty.call(cells, key)) {
        const { x, y, value } = cells[key];
        ctx.beginPath();
        ctx.rect(x, y, CELL_SIZE - GAP, CELL_SIZE - GAP);
        ctx.fillStyle = FILL_COLOR;
        if (value === 0) ctx.strokeStyle = 'black';
        ctx.fill();

        ctx.strokeStyle = COLOR;
        ctx.stroke();

        ctx.font = `${CELL_SIZE / 2}px arial sans-serif`;
        ctx.fillStyle = COLOR;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        const text = ctx.measureText(value);
        const offset = CELL_SIZE - text.width;
        ctx.fillText(
          value === ZERO ? '' : value,
          x + offset / 2,
          y + CELL_SIZE / 4
        );
      }
    }
    const cellsValues = cells.map(({ value }) => value);
    if (checkWin(cellsValues)) {
      // const isNewGame = confirm(
      //   `Hooray! You solved the puzzle in ${displayTime(
      //     gameTime
      //   )} and ${turnCounter} moves!`
      // );
      // if (isNewGame) {
      //   restartGame();
      // } else {
      //   window.location.reload();
      // }
    }
  };

  canvas.addEventListener(
    'mousemove',
    debounce((event) => {
      const { clientX, clientY, target } = event;
      const w = clientX - (window.innerWidth - target.width) / 2;
      const h = clientY - (window.innerHeight - target.height) / 2;
      activeCell = getHoveredElement(cells, CELL_SIZE, w, h);
    }, 50)
  );

  canvas.addEventListener('mouseleave', () => {
    activeCell = null;
  });

  canvas.addEventListener('click', () => {
    const { row, column, value } = activeCell;
    const [activeCellValue] = cells.filter((cell) => cell.value === value);
    const [zeroCell] = cells.filter((cell) => cell.value === ZERO);
    const closestRowElements = cells.filter(
      (cell) =>
        cell.row === row &&
        (cell.column === column - 1 || cell.column === column + 1)
    );
    const closestColumnElements = cells.filter(
      (cell) =>
        cell.column === column && (cell.row === row - 1 || cell.row === row + 1)
    );
    const closestValues = [
      ...closestRowElements.map((elem) => elem.value),
      ...closestColumnElements.map((elem) => elem.value),
    ];
    const isNearZero = closestValues.includes(ZERO);
    if (isNearZero) {
      zeroCell.value = value;
      activeCellValue.value = ZERO;
      getTurnCounter();
      localStorage.setItem('cells', JSON.stringify(cells));
      draw(cells);
      const cellsValues = cells.map(({ value }) => value);
      // if (checkWin(cellsValues)) {
      //   alert(
      //     `Hooray! You solved the puzzle in ${displayTime(
      //       gameTime
      //     )} and ${turnCounter} moves!`
      //   );
      //   restartGame();
      // }
    }
  });

  const restartGame = () => {
    ctx.clearRect(ZERO, ZERO, canvas.width, canvas.height);
    const newCells = fillField();
    clearGameData();
    renderCanvas();
    localStorage.setItem('turnCounter', 0);
    localStorage.setItem('gameTime', 0);
    localStorage.setItem('cells', JSON.stringify(newCells));
    draw(newCells);
  };

  const modes = document.querySelectorAll('.mode');
  modes.forEach((e) => {
    e.addEventListener('click', () => {
      draw();
      localStorage.setItem('fieldSize', e.dataset.mode);
      restartGame();
    });
  });

  domShuffleButton.addEventListener('click', restartGame);
  draw(cells);
};
