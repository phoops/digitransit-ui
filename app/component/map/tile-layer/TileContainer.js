import flatten from 'lodash/flatten';
import omit from 'lodash/omit';
import L from 'leaflet';

import { isBrowser } from '../../../util/browser';
import { isLayerEnabled } from '../../../util/mapLayerUtils';

class TileContainer {
  constructor(coords, done, props, config) {
    const markersMinZoom = Math.min(
      config.cityBike.cityBikeMinZoom,
      config.stopsMinZoom,
      config.terminalStopsMinZoom,
    );

    this.coords = coords;
    this.props = props;
    this.extent = 4096;
    this.scaleratio = (isBrowser && window.devicePixelRatio) || 1;
    this.tileSize = (this.props.tileSize || 256) * this.scaleratio;
    this.ratio = this.extent / this.tileSize;
    this.el = this.createElement();
    this.clickCount = 0;

    if (this.coords.z < markersMinZoom || !this.el.getContext) {
      setTimeout(() => done(null, this.el), 0);
      return;
    }

    this.ctx = this.el.getContext('2d');

    this.layers = this.props.layers
      .filter(Layer => {
        const layerName = Layer.getName();
        const isEnabled = isLayerEnabled(layerName, this.props.mapLayers);
        if (
          layerName === 'stop' &&
          (this.coords.z >= config.stopsMinZoom ||
            this.coords.z >= config.terminalStopsMinZoom)
        ) {
          return isEnabled;
        }
        if (
          layerName === 'citybike' &&
          this.coords.z >= config.cityBike.cityBikeMinZoom
        ) {
          return isEnabled;
        }
        if (
          layerName === 'parkAndRide' &&
          this.coords.z >= config.parkAndRide.parkAndRideMinZoom
        ) {
          return isEnabled;
        }
        if (
          layerName === 'ticketSales' &&
          this.coords.z >= config.ticketSales.ticketSalesMinZoom
        ) {
          return isEnabled;
        }
        return false;
      })
      .map(Layer => new Layer(this, config, this.props.mapLayers));

    this.el.layers = this.layers.map(layer => omit(layer, 'tile'));

    Promise.all(this.layers.map(layer => layer.promise)).then(() =>
      done(null, this.el),
    );
  }

  project = point => {
    const size =
      this.extent * 2 ** (this.coords.z + (this.props.zoomOffset || 0));
    const x0 = this.extent * this.coords.x;
    const y0 = this.extent * this.coords.y;
    const y1 = 180 - (point.y + y0) * 360 / size;
    return {
      lon: (point.x + x0) * 360 / size - 180,
      lat: 360 / Math.PI * Math.atan(Math.exp(y1 * (Math.PI / 180))) - 90,
    };
  };

  createElement = () => {
    const el = document.createElement('canvas');
    el.setAttribute('class', 'leaflet-tile');
    el.setAttribute('height', this.tileSize);
    el.setAttribute('width', this.tileSize);
    el.onMapClick = this.onMapClick;
    return el;
  };

  onMapClick = (e, _point) => {
    let nearest;
    let features;

    if (this.layers) {
      features = flatten(
        this.layers.map(
          layer =>
            layer.features &&
            layer.features.map(feature => ({
              layer: layer.constructor.getName(),
              feature,
            })),
        ),
      );

      nearest = features.filter(feature => {
        if (!feature) {
          return false;
        }

        const { lat, lng } = e.latlng;
        const dist = L.latLng(lat, lng).distanceTo(feature.feature.geom)
        // dist is the distance in meter between a feature point on a tile
        // and the clicked position on a tile
        if (dist < 20) {
          return true;
        }
        return false;
      });

      console.log("nearest", nearest)

      if (nearest.length === 0 && e.type === 'click') {
        // Must filter double clicks used for map navigation
        if (!this.timer) {
          this.timer = setTimeout(() => {
            this.timer = null;
            return this.onSelectableTargetClicked([], e.latlng);
          }, 300);
        } else {
          clearTimeout(this.timer);
          this.timer = null;
        }
        return false;
      }
      if (nearest.length === 0 && e.type === 'contextmenu') {
        // no need to check double clicks
        return this.onSelectableTargetClicked([], e.latlng);
      }
      if (nearest.length === 1) {
        L.DomEvent.stopPropagation(e);
        // open menu for single stop
        const latLon = L.latLng(nearest[0].feature.geom);
        return this.onSelectableTargetClicked(nearest, latLon, true);
      }
      L.DomEvent.stopPropagation(e);
      return this.onSelectableTargetClicked(nearest, e.latlng, true); // open menu for a list of stops
    }
    return false;
  };
}

export default TileContainer;
