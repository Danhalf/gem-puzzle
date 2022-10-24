import { FIELD_SIZE } from './constants';

export const displayTime = (seconds) => {
  const format = (val) => `0${Math.floor(val)}`.slice(-2);
  const minutes = (seconds % 3600) / 60;

  return [minutes, seconds % 60].map(format).join(':');
};

export const sliceArray = (array, length = FIELD_SIZE) => {
  const result = [];
  const rowValuesArray = [...array];
  while (rowValuesArray.length) result.push(rowValuesArray.splice(0, length));
  return result;
};

export function debounce(cb, timeout = 200) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      cb.apply(this, args);
    }, timeout);
  };
}

export const isCellChange = (prevValue) => {
  return () => prevValue;
};

export const getHoveredElement = (coordinates, size, cx, cy) =>
  coordinates.find(({ x, y }) => {
    const hor = cx > x && cx < x + size;
    const vert = cy > y && cy < y + size;
    return hor && vert;
  });
