import { Injectable } from '@angular/core';

import * as geolib from 'geolib';
import { distrCenter } from './DistrCenter';

import { ShopPoint } from './ShopPoint';
import { ShopPointAndDistance } from './ShopPointAndDistance';
import { shopPoints } from './ShopPoints';

@Injectable({
  providedIn: 'root',
})
export class TrackCalcService {
  constructor() {}

  calcDistances() {
    console.time("calcDistances");
    for (const shop of shopPoints) {
      shop.nearestShops = this.calcNearestShops(shop, shopPoints);
    }
    console.timeEnd("calcDistances");

    this.calcDistanceToDC(shopPoints);

    console.dir(shopPoints);
  }

  calcNearestShops(
    shop: ShopPoint,
    shopPoints: ShopPoint[]
  ): ShopPointAndDistance[] {
    const result: ShopPointAndDistance[] = [];

    for (const shopTmp of shopPoints) {
      if (shopTmp.id === shop.id) {
        continue;
      }

      const dist = geolib.getDistance(
        { latitude: shop.lat, longitude: shop.lng },
        { latitude: shopTmp.lat, longitude: shopTmp.lng }
      );

      if (result.length < 10) {
        result.push({ point: shopTmp, dist: dist });
      }
    }

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
