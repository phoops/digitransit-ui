import { VectorTile } from '@mapbox/vector-tile';
import Protobuf from 'pbf';
import pick from 'lodash/pick';
import Relay from 'react-relay/classic';

import { circle, LatLng, latLng } from 'leaflet';
import { StopAlertsQuery } from '../../../util/alertQueries';
import { getActiveAlertSeverityLevel } from '../../../util/alertUtils';
import {
  drawRoundIcon,
  drawTerminalIcon,
  drawRoundIconAlertBadge,
} from '../../../util/mapIconUtils';
import { isFeatureLayerEnabled } from '../../../util/mapLayerUtils';

/**
 * The period of time, in ms, to have the results cached.
 */
const CACHE_PERIOD_MS = 1000 * 60 * 5; // 5 minutes
const cache = {};

// y: 60.17279076699917, latitude
// x: 24.910694360733032, longitude
const mockedStops = {
  layers: {
    stops: [
      {
        geom: {
          lng: 11.220277,
          lat: 43.790988,
        },
        properties: {
          gtfsId: 'ATAF:2464',
          name: 'MICCINESI',
          code: 'FM1029',
          platform: 'null',
          desc: 'Fermata miccinesi',
          parentStation: 'null',
          type: 'BUS',
          patterns: '[{"headsign":"Merikatu","type":"BUS","shortName":"24"}]',
        },
      },
    ],
  },
};

class MintStops {
  constructor(
    tile,
    config,
    mapLayers,
    getCurrentTime = () => new Date().getTime(),
  ) {
    this.tile = tile;
    this.config = config;
    this.mapLayers = mapLayers;
    this.promise = this.getPromise();
    this.getCurrentTime = getCurrentTime;
  }

  static getName = () => 'stop';

  clearStops() {
    const leafletMap = this.tile.props.leaflet.map;
    for (const i in leafletMap._layers) {
      if (leafletMap._layers[i]._path != undefined) {
        try {
          leafletMap.removeLayer(leafletMap._layers[i]);
        } catch (e) {
          console.log(`problem with ${e}${leafletMap._layers[i]}`);
        }
      }
    }
  }

  drawStop(feature) {
    if (
      !isFeatureLayerEnabled(
        feature,
        MintStops.getName(),
        this.mapLayers,
        this.config,
      )
    ) {
      return;
    }
    console.log('Stop coordinates', feature.geom);
    console.log('Tile coordinates', this.tile.coords);
    // this.getTileBoundingBox(this.tile, this.tile.coords.z);

    circle(feature.geom, { radius: 4 }).addTo(this.tile.props.leaflet.map);

    // if (feature.properties.type === 'FERRY') {
    //   drawTerminalIcon(
    //     this.tile,
    //     feature.geom,
    //     feature.properties.type,
    //     this.tile.coords.z >= this.config.terminalNamesZoom
    //       ? feature.properties.name
    //       : false,
    //   );
    //   return;
    // }

    // Old implementation for drawing directly on canvas with
    // custom pixels coordinates
    // let scale;

    // if (large) {
    //   /* stop marker expansion for overlapping double stops */
    //   scale = 1.4;
    // } else if (
    //   this.tile.props.hilightedStops &&
    //   this.tile.props.hilightedStops.includes(feature.properties.gtfsId)
    // ) {
    //   scale = 2;
    // } else {
    //   scale = 1;
    // }
    // const { iconRadius } = drawRoundIcon(
    //   this.tile,
    //   feature.geom,
    //   feature.properties.type,
    //   scale,
    //   feature.properties.platform !== 'null'
    //     ? feature.properties.platform
    //     : false,
    // );

    // if (alertSeverityLevel) {
    //   drawRoundIconAlertBadge(
    //     this.tile,
    //     feature.geom,
    //     iconRadius,
    //     alertSeverityLevel,
    //   );
    // }
  }

  fetchStatusAndDrawStop = (stopFeature, large) => {
    const { gtfsId } = stopFeature.properties;
    const query = Relay.createQuery(
      Relay.QL`
        query StopStatus($id: String!) {
          stop(id: $id) {
            ${StopAlertsQuery}
          }
        }
      `,
      { id: gtfsId },
    );

    const currentTime = this.getCurrentTime();
    const callback = readyState => {
      //   if (!readyState.done) {
      //     return;
      //   }
      //   const result = Relay.Store.readQuery(query)[0];
      //   if (!result) {
      //     return;
      //   }
      cache[gtfsId] = currentTime;
      //   this.drawStop(
      //     stopFeature,
      //     large,
      //     getActiveAlertSeverityLevel(result.alerts, currentTime / 1000),
      //   );
      this.drawStop(stopFeature);
    };

    const latestFetchTime = cache[gtfsId];
    if (latestFetchTime && latestFetchTime - currentTime < CACHE_PERIOD_MS) {
      Relay.Store.primeCache({ query }, callback);
    } else {
      Relay.Store.forceFetch({ query }, callback);
    }
  };

  getTileBoundingBox(tile, zoom) {
    const x = tile.coords.x;
    const y = tile.coords.y;
    function tile2lon(x, z) {
      return x / Math.pow(2, z) * 360 - 180;
    }
    function tile2lat(y, z) {
      const n = Math.PI - 2 * Math.PI * y / Math.pow(2, z);
      return 180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
    }

    const north = tile2lat(y, zoom);
    const south = tile2lat(y + 1, zoom);
    const west = tile2lon(x, zoom);
    const east = tile2lon(x + 1, zoom);

    return {
      minLat: north,
      minLon: west,
      maxLat: south,
      maxLon: east,
    };
    // // const { lon, lat} = tile.project(tile.coords)
    // // console.log("tile", tile.coords, lon, lat)
    // console.log(
    //   'custom tile coordis',
    //   north,
    //   west,
    //   south,
    //   east
    // );
  }

  getPromise() {
    const byBoundingBox = this.getTileBoundingBox(
      this.tile,
      this.tile.coords.z,
    );
    const poiUrl = new URL(
      'https://www-stg.muoversintoscana.it/gw/sabrina/api/v1/pois/byBoundingBox',
    );
    poiUrl.search = new URLSearchParams({
      ...byBoundingBox,
      types: 'bus-stop,rail-stop,tram-stop',
    });
    // console.log('request URL', poiUrl.toString());
    if (this.tile.coords.z <= this.config.stopsMinZoom) {
      console.log('request skipped', this.tile.coords.z);
      // clear markers if present
      const leafletMap = this.tile.props.leaflet.map;
      if (leafletMap._layers.length != 0) {
        console.log("cleaning markers")
        this.clearStops()
      }
      return;
    }
    return fetch(poiUrl.toString()).then(res => {
      if (res.status !== 200) {
        return undefined;
      }

      return res.json().then(
        json => {
          // Mocked stops json

          // old implementation
          //   const vt = new VectorTile(new Protobuf(buf));
          // layers: {
          //   stops: [
          //     {
          //       geom: {
          //         lng: 11.220277,
          //         lat: 43.790988,
          //       },
          //       properties: {
          //         gtfsId: 'ATAF:2464',
          //         name: 'MICCINESI',
          //         code: 'FM1029',
          //         platform: 'null',
          //         desc: 'Fermata miccinesi',
          //         parentStation: 'null',
          //         type: 'BUS',
          //         patterns: '[{"headsign":"Merikatu","type":"BUS","shortName":"24"}]',
          //       },
          //     },
          //   ],
          // },
          // skip empty response
          if (!json.data || json.data.length === 0) {
            console.log('empty result skipping', json);
            return;
          }
          const stopsForLayers = {
            layers: {
              stops: json.data.map(poi => ({
                geom: {
                  lng: poi.position.lon,
                  lat: poi.position.lat,
                },
                properties: {
                  gtfsId: poi.additionalData.gtfsId,
                  name: poi.additionalData.name,
                  code: poi.additionalData.code,
                  platform: null,
                  desc: `Fermata ${poi.additionalData.name}`,
                  parentStation: null,
                  type: poi.additionalData.routeType,
                  patterns: JSON.stringify([{
                    headsign: poi.additionalData.name,
                    shortName: poi.additionalData.name,
                    type: poi.additionalData.routeType,
                  }]),
                },
              })),
            },
          };
          console.log('Stops from rest', stopsForLayers);
          this.features = [];

          if (
            stopsForLayers.layers.stops != null &&
            this.tile.coords.z >= this.config.stopsMinZoom
          ) {
            const featureByCode = {};

            for (
              let i = 0, ref = stopsForLayers.layers.stops.length - 1;
              i <= ref;
              i++
            ) {
              //   const feature = stopsForLayers.layers.stops.feature(i);
              const feature = stopsForLayers.layers.stops[i];
              if (
                feature.properties.type &&
                (feature.properties.parentStation === 'null' ||
                  this.config.terminalStopsMaxZoom - 1 <=
                    this.tile.coords.z + (this.tile.props.zoomOffset || 0))
              ) {
                // [[feature.geom]] = feature.loadGeometry();
                // const f = pick(feature, ['geom', 'properties']);
                const f = {
                  geom: feature.geom,
                  properties: feature.properties,
                };
                if (f.properties.code && this.config.mergeStopsByCode) {
                  /* a stop may be represented multiple times in data, once for each transport mode
                     Latest stop erares underlying ones unless the stop marker size is adjusted accordingly.
                     Currently we expand the first marker so that double stops are visialized nicely.
                   */
                  const prevFeature = featureByCode[f.properties.code];
                  if (
                    !prevFeature ||
                    prevFeature.properties.type > f.properties.type
                  ) {
                    featureByCode[f.properties.code] = f;
                  }
                }
                this.features.push(f);
              }
            }
            if (this.config.mergeStopsByCode) {
              /* sort the stops by type so that double stops get consistent visual appearance.
                For example, draw tram stops before bus stops */
              this.features.sort((f1, f2) => {
                if (f1.properties.type > f2.properties.type) {
                  return -1;
                }
                if (f2.properties.type > f1.properties.type) {
                  return 1;
                }
                if (f1.properties.platform) {
                  /* favor stops with platform code over those without it */
                  return 1;
                }
                return 0;
              });
            }
            this.features.forEach(f => {
              /* Note: don't expand separate stops sharing the same code,
                 unless type is different and location actually overlaps. */
              const large =
                this.config.mergeStopsByCode &&
                f.properties.code &&
                featureByCode[f.properties.code] !== f &&
                featureByCode[f.properties.code].properties.type !==
                  f.properties.type &&
                f.geom.x === featureByCode[f.properties.code].geom.x &&
                f.geom.y === featureByCode[f.properties.code].geom.y;
              this.fetchStatusAndDrawStop(f, large);
            });
          } else if (this.tile.coords.z <= this.config.stopsMinZoom) {
            this.clearStops();
            // when we are not drawing the stop circles we can check if
            // we should clear all the stops drawed according to the zoom level
          }

          if (
            stopsForLayers.layers.stations != null &&
            this.config.terminalStopsMaxZoom >
              this.tile.coords.z + (this.tile.props.zoomOffset || 0) &&
            this.tile.coords.z >= this.config.terminalStopsMinZoom
          ) {
            for (
              let i = 0, ref = stopsForLayers.layers.stations.length - 1;
              i <= ref;
              i++
            ) {
              const feature = stopsForLayers.layers.stations.feature(i);
              if (
                feature.properties.type &&
                isFeatureLayerEnabled(
                  feature,
                  'terminal',
                  this.mapLayers,
                  this.config,
                )
              ) {
                [[feature.geom]] = feature.loadGeometry();
                this.features.unshift(pick(feature, ['geom', 'properties']));
                drawTerminalIcon(
                  this.tile,
                  feature.geom,
                  feature.properties.type,
                  this.tile.coords.z >= this.config.terminalNamesZoom
                    ? feature.properties.name
                    : false,
                );
              }
            }
          }
        },
        err => console.log(err), // eslint-disable-line no-console
      );
    });
  }
}

export default MintStops;
