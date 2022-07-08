import { shop_points as shop_points_js } from '../data/shop_points';
import { ShopPoint } from './ShopPoint';

export const shopPoints: ShopPoint[] = shop_points_js.map((sp) => {
  return {
    // constants
    id: sp.id,
    city: parseInt(sp.city),

    lat: parseFloat(sp.lat),
    lng: parseFloat(sp.lng),

    address: sp.address,
    type: sp.type,
    weekend: sp.weekend,
    time: sp.time,

    // additional
    nearestShops: [],
    distance: 0, // to the center
  };
});
