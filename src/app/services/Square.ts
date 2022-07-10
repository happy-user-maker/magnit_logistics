import * as geolib from 'geolib';
import { ShopPoint } from './ShopPoint';
import { shopPoints } from './ShopPoints';
import * as _ from 'lodash';
import { ShopPointAndDistance } from './ShopPointAndDistance';

export const arraySize = 100;
const stepX = 0.05;
const stepY = 0.025;

export type Square = {
  shops: Array<ShopPoint>;
};

// @ts-ignore
export const squares: Array<Array<Square>> = createArray(arraySize, arraySize);
const topLeft = [52.0, 38.0];
const bottomRight = [49.55, 43.0];

const scaleXLeftRight = [topLeft[1], bottomRight[1]]; // 5/50 = 0.1
const scaleX: Array<number> = [];

const scaleYTopBottom = [topLeft[0], bottomRight[0]]; // 2.55/50 = 0.05
const scaleY: Array<number> = [];

// lat - y
// lon - x

//    1  2  3
//    4  5  6
//    7  8  9

// 0: 0  1  2  3  4
// 1: 0  1  2  3  4
// 2: 0  1 [2] 3  4
// 3: 0  1  2  3  4
// 4: 0  1  2  3  4

export function getNearestSquareIndexes(
  indY: number,
  indX: number,
  size: number
): Array<{ indY: number; indX: number }> {
  const indYmin = Math.max(indY - size, 0);
  const indXmin = Math.max(indX - size, 0);

  const indYmax = Math.min(indY + size, arraySize - 1);
  const indXmax = Math.min(indX + size, arraySize - 1);

  const result = [];
  for (let iY = indYmin; iY < indYmax; iY++) {
    for (let iX = indXmin; iX < indXmax; iX++) {
      result.push({ indY: iY, indX: iX });
    }
  }

  return result;
}

export function getNearestShops(lat: number, lon: number, shopId: number): Array<ShopPointAndDistance> {
  const index = getIndex(lat, lon);

  const result: Array<ShopPointAndDistance> = [];

  for (let radius = 1; radius < 10; radius++) {
    const nearestInd = getNearestSquareIndexes(index.y, index.x, radius);
    for (const ind of nearestInd) {
      const sq = squares[ind.indY][ind.indX];
      for (const shop of sq.shops) {
        if (shop.id === shopId) {
          continue;
        }

        result.push({
          point: shop,
          dist: geolib.getDistance(
            { lat: shop.lat, lon: shop.lng },
            { lat: lat, lon: lon },
            1,
          ),
        });
      }
    }

    if (result.length > 5) break;
  }

  return _.sortBy(result,
    (shop: ShopPointAndDistance) => {
      return shop.dist;
    },
  );
}

export function forAllSquares(
  callback: (indY: number, indX: number, sq: Square) => void
) {
  for (let indY = 0; indY < arraySize; indY++) {
    for (let indX = 0; indX < arraySize; indX++) {
      callback(indY, indX, squares[indY][indX]);
    }
  }
}

// for diff dy = 0.05
// lat : 49.55   49.60   49.65   49.70
// diff: 0       0.05    0.1     0.15
//   y : 0       1
export function getIndex(lat: number, lon: number) {
  const y = Math.floor((lat - bottomRight[0]) / stepY);
  if (y < 0 || y >= arraySize) {
    throw new Error(`Value out of range: ${lat}`);
  }

  const x = Math.floor((lon - topLeft[1]) / stepX);
  if (x < 0 || x >= arraySize) {
    throw new Error(`Value out of range: ${lat}`);
  }

  return { y, x };
}

export function getPoint(indY: number, indX: number) {
  const lat = bottomRight[0] + indY * stepY;
  const lon = topLeft[1] + indX * stepX;
  return { lat, lon };
}

initScales();

function initScales() {
  const cellWidth1 = geolib.getDistance(
    { lat: topLeft[0], lon: topLeft[1] },
    { lat: topLeft[0], lon: bottomRight[1] }
  );
  const cellWidth2 = geolib.getDistance(
    { lat: bottomRight[0], lon: topLeft[1] },
    { lat: bottomRight[0], lon: bottomRight[1] }
  );
  console.log('cellWidth1', cellWidth1, cellWidth1 / arraySize);
  console.log('cellWidth2', cellWidth2, cellWidth1 / arraySize);

  const cellHeight1 = geolib.getDistance(
    { lat: topLeft[0], lon: topLeft[1] },
    { lat: bottomRight[0], lon: topLeft[1] }
  );
  const cellHeight2 = geolib.getDistance(
    { lat: topLeft[0], lon: bottomRight[1] },
    { lat: bottomRight[0], lon: bottomRight[1] }
  );
  console.log('cellHeight1', cellHeight1, cellHeight1 / arraySize);
  console.log('cellHeight2', cellHeight2, cellHeight2 / arraySize);

  for (let ind = 0; ind < arraySize; ind = ind + 1) {
    scaleX.push(topLeft[1] + ind * stepX);
  }

  for (let ind = 0; ind < arraySize; ind = ind + 1) {
    scaleY.push(topLeft[0] - ind * stepY);
  }
  console.dir(scaleX);
  console.dir(scaleY);

  squaresInit();

  for (const shop of shopPoints) {
    const ind = getIndex(shop.lat, shop.lng);
    squares[ind.y][ind.x].shops.push(shop);
  }
  console.log('squares:');
  console.dir(squares);
}

export function squaresInit() {
  for (let ind = 0; ind < arraySize; ind = ind + 1) {
    fillRow(ind);
  }
}

function fillRow(rowNum: number) {
  for (let ind = 0; ind < arraySize; ind = ind + 1) {
    squares[rowNum][ind] = {
      shops: [],
    } as Square;
  }
}

// https://stackoverflow.com/questions/966225/how-can-i-create-a-two-dimensional-array-in-javascript/966938#966938
function createArray(length: number) {
  var arr = new Array(length || 0),
    i = length;

  if (arguments.length > 1) {
    const args = Array.prototype.slice.call(arguments, 1);
    //@ts-ignore
    while (i--) arr[length - 1 - i] = createArray.apply(this, args);
  }

  return arr;
}
