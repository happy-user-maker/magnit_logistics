import { distrCenter } from './services/DistrCenter';
import { Component, OnInit } from '@angular/core';
import { latLng, tileLayer } from 'leaflet';

import * as L from 'leaflet';
import { shopPoints } from './services/ShopPoints';
import { TrackCalcService } from './services/track-calc.service';
import { forAllSquares, getPoint, Square } from './services/Square';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'magnit_logistics';
  options = {
    layers: [
      tileLayer(
        'http://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png',
        //'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        { maxZoom: 15, attribution: 'magnit' }
      )
    ],
    zoom: 11,
    center: latLng(51.6683, 39.1919)
  };

  map!: L.Map;

  constructor(private trackCalcService: TrackCalcService) {
  }

  ngOnInit() {
    this.map = L.map('map', this.options);

    const dc = L.circleMarker([distrCenter.lat, distrCenter.lng], {
      color: '#ffffff00',
      fillColor: '#ff3355',
      fillOpacity: 1,
      radius: 10,
    }).bindPopup(`${distrCenter.lat}, ${distrCenter.lng}`);
    dc.addTo(this.map);

    this.trackCalcService.calcDistances();
    //const data = filterData(shopPoints);

    for (const point of shopPoints) {
      const marker = L.circleMarker([point.lat, point.lng], {
        color: '#ffffff00',
        fillColor: '#5555ff',
        fillOpacity: 0.6,
        radius: 6,
      }).addTo(this.map);

      marker.bindPopup(`${point.lat}, ${point.lng} - ${point.nearestShops?.length > 0 ? point.nearestShops[0].dist : 0}`);
    }

    this.drawSquares();
  }


  drawSquares() {
    forAllSquares((indY: number, indX: number, sq: Square) =>{
      const point = getPoint(indY, indX);

      const marker = L.circleMarker([point.lat, point.lon], {
        color: '#ffffff',
        fillColor: '#000000',
        fillOpacity: 1.0,
        radius: 3,
      }).addTo(this.map);

      marker.bindPopup(`${point.lat}, ${point.lon} ${sq.shops.length}`);

    });
  }
}
