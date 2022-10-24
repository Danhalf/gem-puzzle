import './style.css';
import { initGame, renderCanvas } from '/game';
import { debounce } from './game/helpers';

const app = document.querySelector('#app');

const { offsetWidth, offsetHeight } = document.body;
const canvasSize = (offsetWidth + offsetHeight) / 2;

const getCanvasSize = () => ~~canvasSize * 0.5;

renderCanvas(app);

window.addEventListener(
  'resize',
  debounce(() => renderCanvas(app))
);
