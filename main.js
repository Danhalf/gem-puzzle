import './style.css';
import { renderCanvas } from '/game';
import { debounce } from './game/helpers';

document.body.insertAdjacentHTML('afterbegin', `<main id='app'></main>`);

const app = document.querySelector('#app');

renderCanvas(app);

window.addEventListener(
  'resize',
  debounce(() => renderCanvas(app))
);
