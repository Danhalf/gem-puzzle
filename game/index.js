import { sliceArray, getHoveredElement, debounce, displayTime } from "./helpers";
import { FIELD_SIZE, GAP, FILL_COLOR, COLOR, ZERO } from "./constants";

export const initGame = (canvasSize) => {

   const { log: __ } = console;
   const canvas = document.getElementById('canvas')
   const ctx = canvas.getContext('2d')
   const domCounter = document.getElementById('counter')
   const domTimer = document.getElementById('time')
   const domShuffleButton = document.getElementById('shuffle')

   const CELL_SIZE = canvas.width / FIELD_SIZE

   let turnCounter = 1;
   let gameTime = 0

   __(canvas.width, canvasSize)



   setInterval(() => {
      gameTime++
      domTimer.textContent = displayTime(gameTime)
   }, 1000)

   let activeCell = null;

   const getTurnCounter = count => {
      turnCounter++
      domCounter.textContent = count
   }

   const checkWin = (combination, length = FIELD_SIZE ** 2 - 1) => {
      const currentCombination = sliceArray(combination, FIELD_SIZE)
      const winCombination = sliceArray([...Array.from({ length }, (_, i) => i + 1), 0], FIELD_SIZE)
      return currentCombination.join`` === winCombination.join``
   }

   const fillField = () => {
      const cells = [];
      const rowValues = new Set;
      while (rowValues.size < FIELD_SIZE ** 2) {
         const cellNumber = ~~(Math.random() * FIELD_SIZE ** 2)
         rowValues.add(cellNumber)
      }

      const filledCells = sliceArray(rowValues, FIELD_SIZE)

      filledCells.map((value, row) => {
         for (let column = 0; column < FIELD_SIZE; column++) {
            cells.push({ row, column, x: column * CELL_SIZE, y: row * CELL_SIZE, value: value[column] })
         }
      })

      return cells
   }

   const cells = JSON.parse(localStorage.getItem('cells')) || fillField()

   const draw = (cells) => {

      ctx.clearRect(ZERO, ZERO, canvas.width, canvas.height)
      for (const key in cells) {
         if (Object.hasOwnProperty.call(cells, key)) {
            const { x, y, value } = cells[key];
            ctx.beginPath()
            ctx.rect(x, y, CELL_SIZE - GAP, CELL_SIZE - GAP)
            ctx.fillStyle = FILL_COLOR
            ctx.fill()

            ctx.strokeStyle = COLOR
            ctx.stroke()

            ctx.font = `${CELL_SIZE / 2}px arial sans-serif`
            ctx.fillStyle = COLOR
            ctx.textAlign = 'left'
            ctx.textBaseline = 'top'
            const text = ctx.measureText(value)
            const offset = CELL_SIZE - text.width
            ctx.fillText(value === ZERO ? '' : value, x + offset / 2, y + CELL_SIZE / 4)
         }
      }
   }

   canvas.addEventListener('mousemove', debounce((event) => {
      const { offsetX, offsetY } = event
      activeCell = getHoveredElement(cells, CELL_SIZE, offsetX, offsetY)
   }, 50));

   canvas.addEventListener('mouseleave', () => {
      activeCell = null
   });

   canvas.addEventListener('click', () => {
      const { row, column, value } = activeCell
      const [activeCellValue] = cells.filter(cell => cell.value === value)
      const [zeroCell] = cells.filter(cell => cell.value === ZERO)
      const closestRowElements = cells.filter(cell => cell.row === row && (cell.column === column - 1 || cell.column === column + 1))
      const closestColumnElements = cells.filter(cell => cell.column === column && (cell.row === row - 1 || cell.row === row + 1))
      const closestValues = [...closestRowElements.map(elem => elem.value), ...closestColumnElements.map(elem => elem.value)]
      const isNearZero = closestValues.includes(ZERO)
      if (isNearZero) {
         zeroCell.value = value
         activeCellValue.value = ZERO
         getTurnCounter(turnCounter)
         localStorage.setItem('cells', JSON.stringify(cells))
         draw(cells)
         const cellsValues = cells.map(({ value }) => value)
         __(checkWin(cellsValues))
      }
   });

   domShuffleButton.addEventListener('click', () => {
      const newCells = fillField()
      localStorage.setItem('cells', JSON.stringify(newCells))
      draw(newCells)
   });
   draw(cells)

}