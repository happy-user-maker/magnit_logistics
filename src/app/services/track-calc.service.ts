import { Injectable } from '@angular/core';

import * as geolib from 'geolib';
import { distrCenter } from './DistrCenter';

import { ShopPoint } from './ShopPoint';
import { ShopPointAndDistance } from './ShopPointAndDistance';
import { shopPoints } from './ShopPoints';
import { getNearestShops, squares } from './Square';

if (squares) {
  console.log('ok');
  console.dir(squares);
}

@Injectable({
  providedIn: 'root',
})
export class TrackCalcService {
  constructor() {}

  calcDistances() {
    console.time("calcDistances");
    for (const shop of shopPoints) {
      shop.nearestShops = this.calcNearestShops(shop);
    }
    console.timeEnd("calcDistances");

    this.calcDistanceToDC(shopPoints);

    console.dir(shopPoints);
  }

  calcNearestShops(
    shop: ShopPoint,
  ): ShopPointAndDistance[] {
    const result: ShopPointAndDistance[] = getNearestShops(shop.lat, shop.lng, shop.id);
    return result;
  }

  calcDistanceToDC(
    shopPoints: ShopPoint[]
  ) {
    console.time("calcDistanceToDC");
    const result: ShopPointAndDistance[] = [];

    for (const shop of shopPoints) {
      shop.distance = geolib.getDistance(
        { latitude: shop.lat, longitude: shop.lng },
        { latitude: distrCenter.lat, longitude: distrCenter.lng }
      );
    }

    console.timeEnd("calcDistanceToDC");
  }
}
