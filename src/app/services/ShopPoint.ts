import { ShopPointAndDistance } from "./ShopPointAndDistance";

export type ShopPoint = {
  // constants
  id: number,
  city: number,

  lat: number,
  lng: number,

  address: string,
  type: string,
  weekend: string,
  time: string | boolean,

  // additional
  nearestShops: ShopPointAndDistance[],
  distance: number, // to the center
}
