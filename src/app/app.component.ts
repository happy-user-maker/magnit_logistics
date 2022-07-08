import { distrCenter } from './services/DistrCenter';
import { Component, OnInit } from '@angular/core';
import { latLng, tileLayer } from 'leaflet';

import * as L from 'leaflet';
import { shopPoints } from './services/ShopPoints';
import { TrackCalcService } from './services/track-calc.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'magnit_logistics';
  options = {
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 15, attribution: 'magnit' })
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

    const data = filterData(shopPoints);

    for (const point of data) {
      const marker = L.circleMarker([point.lat, point.lon], {
        color: '#ffffff00',
        fillColor: '#5555ff',
        fillOpacity: 0.5,
        radius: 6,
      }).addTo(this.map);

      marker.bindPopup(`${point.lat}, ${point.lon}`);
    }

    this.trackCalcService.calcDistances()
  }
}

function filterData(data: any) {
  const result: any = [];

  for (const d of data) {
    addDataPointGeo(d, result);
  }

  return result;
}

function addDataPointGeo(d: any, result: any) {
  const pos = { lat: d.lat, lon: d.lng };

  if (pos) {
    result.push({
      lat: pos.lat,
      lon: pos.lon,
    });
  }
}
