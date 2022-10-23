import './style.css'
import { initGame } from '/game'
import { debounce } from './game/helpers'

const app = document.querySelector('#app')

const { offsetWidth, offsetHeight } = document.body
const canvasSize = (offsetWidth + offsetHeight) / 2

const getCanvasSize = () => ~~canvasSize * 0.5

app.innerHTML = `
<canvas id='canvas' width=${getCanvasSize()} height=${getCanvasSize()}>   
</canvas>
<div>Counts: <span id='counter'>0</span></div>
<div>Game time: <span id='time'>00:00</span></div>
<button id='shuffle'>Shuffle and start</button>
`

initGame(canvasSize)


window.addEventListener('resize', debounce(() => initGame(canvasSize)))



