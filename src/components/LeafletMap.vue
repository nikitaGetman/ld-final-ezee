<template>
  <div class="map-wrapper">
    <div id="map"></div>

    <map-legend :params="params" @update="updateParams" />
  </div>
</template>

<script>
import 'leaflet-layervisibility';
import MapLegend from '@/components/MapLegend.vue';
import regionsData from '@/api/regions.json';
import { getLineColorByVoltage, getRegionColorByRating, generateRegionsManager } from '@/utils/common';
import apiService from '@/services/api';

// Plugins
// Esri - https://esri.github.io/esri-leaflet/examples/

/* eslint-disable no-undef */
const token = 'pk.eyJ1IjoibmlraXRhZ2V0bWFuIiwiYSI6ImNrd2pnb2loNDB5eW4ycXBrdnA4ajFiZ2EifQ.zGP7lxsxRR0hX7dRejOWFA';
const config = {
  center: [58.3, 60],
  zoom: 7,
  minZoom: 3,
  zoomControl: false,
  wheelPxPerZoomLevel: 20,
  wheelDebounceTime: 20,
  worldCopyJump: true,
};

export default {
  name: 'LeafletMap',
  components: { MapLegend },
  data() {
    return {
      map: null,
      linesManager: null,
      regionsManager: null,
      regionRatingManager: null,
      singleRegionManager: null,
      incidentsManager: null,
      clusterManager: null,
      pathManager: null,

      linesData: null,

      params: {
        lines: true,
        linesType: {},
        regions: false,
      },
    };
  },
  mounted() {
    this.initMap();
    this.$bus.$on('panToRegion', this.selectRegion);
    this.$bus.$on('showIncidents', this.setupIncidents);
    this.$bus.$on('showClusters', this.setupClusters);
    this.$bus.$on('panToIncident', this.panToIncident);
    this.$bus.$on('createPath', this.createPath);
    this.$bus.$on('showRegionsRating', this.showRegionRating);
  },
  beforeDestroy() {
    this.$bus.$off('panToRegion', this.selectRegion);
    this.$bus.$off('showIncidents', this.setupIncidents);
    this.$bus.$off('showClusters', this.setupClusters);
    this.$bus.$off('panToIncident', this.panToIncident);
    this.$bus.$off('createPath', this.createPath);
    this.$bus.$off('showRegionsRating', this.showRegionRating);
  },
  methods: {
    updateParams({ key, value }) {
      this.params[key] = value;

      const updateMethods = {
        lines: this.toggleLines,
        linesType: this.showLines,
        regions: this.toggleRegions,
      };

      updateMethods[key]();
    },
    toggleLines() {
      if (!this.linesManager) return;

      if (this.params.lines) {
        this.linesManager.show();
      } else {
        this.linesManager.hide();
      }
    },
    toggleHeatmap() {
      // HEATMAP plugins
      // https://github.com/Leaflet/Leaflet.heat
      // https://github.com/domoritz/leaflet-maskcanvas
    },
    toggleRegions() {
      if (!this.regionsManager) return;

      if (this.params.regions) {
        if (this.singleRegionManager) {
          this.singleRegionManager.hide();
        }
        this.regionsManager.show();
      } else {
        if (this.singleRegionManager) {
          this.singleRegionManager.show();
        }
        this.regionsManager.hide();
      }
    },

    selectRegion(regionCode) {
      this.updateParams({ key: 'regions', value: false });

      if (this.singleRegionManager) {
        this.singleRegionManager.remove();
      }
      const region = {
        ...regionsData,
        features: regionsData.features.filter(f => f.properties.iso === regionCode),
      };
      this.singleRegionManager = L.geoJSON(region, {
        pane: 'tilePane',
        style: {
          weight: 3,
          opacity: 0.8,
          dashArray: '10',
          color: '#7a6054',
          fillOpacity: 0,
        },
      });

      this.map.flyToBounds(this.singleRegionManager.getBounds(), { maxZoom: 7 });

      setTimeout(() => {
        this.singleRegionManager.addTo(this.map);
      }, 1000);
    },
    openIncidentInfo(incidentId) {
      this.$bus.$emit('openIncidentInfo', incidentId);
    },

    panToIncident(feature) {
      const { coordinates } = feature.geometry;
      this.map.flyToBounds(L.latLngBounds(coordinates, coordinates), { maxZoom: 10 });
      this.openIncidentInfo(feature.properties.id);
    },

    initMap() {
      this.map = L.map('map', config);

      L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        // https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}
        // http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
        attribution: 'Imagery © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors,',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 256,
        zoomOffset: 0,
        accessToken: token,
      }).addTo(this.map);

      this.showLines();
      this.showRegions();
      this.toggleRegions();
    },
    showLines() {
      const promise = this.linesData ? Promise.resolve(this.linesData) : apiService.fetchLines();

      promise.then(linesData => {
        this.linesData = linesData;

        const values = Object.values(this.params.linesType)
          .filter(v => !!v)
          .map(v => ({ from: v.valueFrom * 1000, to: v.valueTo * 1000 }));

        // Filter lines by voltage
        let lines = [];
        if (values && values.length === 5) {
          lines = linesData;
        } else if (values && values.length > 0) {
          lines = {
            ...linesData,
            features: linesData.features.filter(feat => {
              const voltage = parseInt(feat.properties.voltage, 10);
              return !!values.find(v => v.from <= voltage && v.to >= voltage);
            }),
          };
        }

        if (this.linesManager) {
          this.linesManager.remove();
        }
        this.linesManager = L.geoJSON(lines, {
          style: feature => getLineColorByVoltage(feature.properties.voltage),
          onEachFeature: (feature, layer) => {
            const { voltage = null } = layer.feature.properties;
            layer.bindTooltip(`ЛЭП ${voltage ? `${parseInt(voltage, 10) / 1000}кВ` : ''}`, { sticky: true });
          },
        })
          .setZIndex(10)
          .addTo(this.map);

        this.toggleLines();
      });
    },
    showRegions() {
      this.regionsManager = generateRegionsManager(
        regionsData,
        {
          fillColor: '#50749a',
          weight: 2,
          opacity: 0.5,
          color: 'white',
          dashArray: '3',
          fillOpacity: 0.2,
        },
        null,
        L,
        this.map
      )
        .bringToBack()
        .addTo(this.map);

      this.toggleRegions();
    },
    setupIncidents(incidents) {
      this.showLines();
      this.resetLayers(['linesManager', 'singleRegionManager']);

      const markers = incidents.map(incident => {
        const icon = L.divIcon({
          html: `<i class="v-icon notranslate mdi mdi-alert-circle theme--dark"></i>`,
          className: `map-marker map-marker--level-${incident.properties.dangerLevel}`,
        });
        const marker = L.marker(L.latLng(incident.geometry.coordinates), { icon, riseOnHover: true }).on({
          click: () => this.panToIncident(incident),
        });

        return marker;
      });

      this.incidentsManager = L.layerGroup(markers);
      this.map.addLayer(this.incidentsManager);
    },
    setupClusters(clusters) {
      this.resetLayers(['linesManager', 'incidentsManager', 'singleRegionManager']);

      this.clusterManager = L.geoJSON(clusters, {
        style: { color: '#F44336', weight: 2, dashArray: '3', fillColor: '#F44336', fillOpacity: 0.3 },
      }).addTo(this.map);

      this.map.flyToBounds(this.clusterManager.getBounds(), { maxZoom: 9 });
    },
    createPath({ paths }) {
      this.resetLayers(['singleRegionManager', 'clusterManager', 'incidentsManager']);

      const { points, snapped_waypoints: snappedWaypoints } = paths[0];
      const path = L.geoJSON(points, { style: { color: '#89c769', weight: 8, opacity: 1 } });
      const startMarker = L.marker(L.latLng(snappedWaypoints.coordinates[0].reverse()));
      const endMarker = L.marker(L.latLng(snappedWaypoints.coordinates[1].reverse()));
      this.pathManager = L.layerGroup([path, startMarker, endMarker]);

      this.map.addLayer(this.pathManager);
      this.map.flyToBounds(path.getBounds());
    },

    showRegionRating(rating) {
      this.resetLayers();

      const ratingMap = rating.reduce((acc, item) => ({ ...acc, [item.iso]: item }), {});
      const onEachFeature = (feature, layer) => {
        const color = getRegionColorByRating(ratingMap[feature.properties.iso].rating);
        layer.setStyle({ fillColor: color, fillOpacity: 0.2, weight: 2, color });
      };

      this.regionRatingManager = generateRegionsManager(regionsData, null, onEachFeature, L, this.map);

      this.map.addLayer(this.regionRatingManager);
      this.map.flyToBounds(this.regionRatingManager.getBounds(), { paddingTopLeft: [-1000, -100] });
    },

    resetLayers(except = []) {
      if (!except.includes('linesManager') && this.linesManager) {
        this.linesManager.remove();
        this.linesManager = null;
      }
      if (!except.includes('regionsManager') && this.regionsManager) {
        this.regionsManager.remove();
        this.regionsManager = null;
      }
      if (!except.includes('regionRatingManager') && this.regionRatingManager) {
        this.regionRatingManager.remove();
        this.regionRatingManager = null;
      }
      if (!except.includes('singleRegionManager') && this.singleRegionManager) {
        this.singleRegionManager.remove();
        this.singleRegionManager = null;
      }
      if (!except.includes('incidentsManager') && this.incidentsManager) {
        this.incidentsManager.remove();
        this.incidentsManager = null;
      }
      if (!except.includes('clusterManager') && this.clusterManager) {
        this.clusterManager.remove();
        this.clusterManager = null;
      }
      if (!except.includes('pathManager') && this.pathManager) {
        this.pathManager.remove();
        this.pathManager = null;
      }
    },
  },
};
</script>

<style lang="scss">
.map-wrapper {
  position: relative;
}
.map-marker {
  .v-icon {
    padding: 3px;
    border-radius: 50%;
    transform: translate(-30%, -30%);
  }

  &--level {
    &-1 {
      .v-icon {
        background-color: #f44336;
      }
    }
    &-2 {
      .v-icon {
        background-color: #ff9800;
      }
    }
    &-3 {
      .v-icon {
        background-color: #ffea00;
      }
    }
  }
}
#map {
  width: 100%;
  height: calc(100vh - 64px);
  z-index: 1;
}
</style>
