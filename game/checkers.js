import { FIELD_SIZE } from "./constants";
import { sliceArray } from "./helpers";

export const checkWin = (combination, length = FIELD_SIZE ** 2 - 1) => {
   const currentCombination = sliceArray(combination, FIELD_SIZE);
   const winCombination = sliceArray(
      [...Array.from({ length }, (_, i) => i + 1), 0],
      FIELD_SIZE
   );
   return currentCombination.join`` === winCombination.join``;
};

export const isSolutionPossible = (cells) => {
   let count;
   let sum = cells.flat().map(((element, index, array) => {
      let count = 0;
      for (let c = index; c < array.length; c++) element > array[c] && 0 != array[c] && count++;
      return count
   })).reduce(((acc, curr) => acc + curr), 0);
   return cells.forEach(((el, idx) => {
      el.forEach((elem => {
         0 === elem && (count = idx + 1)
      }))
   })), sum += count, sum % 2 == cells.length % 2
}