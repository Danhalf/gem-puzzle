import './style.css';
import { renderCanvas } from '/game';
import { debounce } from './game/helpers';

const app = document.querySelector('#app');

const { offsetWidth, offsetHeight } = document.body;


renderCanvas(app);

window.addEventListener(
   'resize',
   debounce(() => renderCanvas(app))
);
