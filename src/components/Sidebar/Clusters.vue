<template>
  <div class="clusters">
    <base-loader :active="loading" />

    <div class="text-h6">Кластеры</div>

    <div class="clusters__content">
      <div v-for="(item, index) in clusters" :key="item.properties.id" class="cluster">
        <div class="cluster__title">Кластер №{{ index + 1 }}</div>
        <div class="cluster__body">
          <v-row no-gutters>
            <v-col cols="3">
              <span class="cluster__label">Приоритет:</span>
            </v-col>
            <v-col cols="9">
              <span>Высокий</span>
            </v-col>

            <v-col cols="3">
              <span class="cluster__label">Площадь:</span>
            </v-col>
            <v-col cols="9">
              <span>{{ item.area }}</span>
            </v-col>

            <v-col cols="3">
              <span class="cluster__label">Округ:</span>
            </v-col>
            <v-col cols="9">
              <span>Свердловская область, городской округ Красноуральск</span>
            </v-col>

            <template v-if="clusterRoutes && clusterRoutes[index].distance">
              <v-col cols="3">
                <span class="cluster__label">Расстояние:</span>
              </v-col>
              <v-col cols="9">
                <span>{{ clusterRoutes[index].distance }}</span>
              </v-col>

              <v-col cols="3">
                <span class="cluster__label">Время в пути:</span>
              </v-col>
              <v-col cols="9">
                <span>{{ clusterRoutes[index].time }}</span>
              </v-col>
            </template>
          </v-row>
          <v-btn
            color="primary"
            class="mt-2"
            small
            :disabled="!clusterRoutes || !clusterRoutes[index].graph"
            outlined
            @click="showPath(clusterRoutes[index].graph)"
            >Проложить маршрут</v-btn
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BaseLoader from '@/components/BaseLoader.vue';
import apiService from '@/services/api';

import { loadYmap } from 'vue-yandex-maps';
import 'leaflet-draw';

/* eslint-disable no-undef */
export default {
  name: 'SidebarClusters',
  components: { BaseLoader },
  data() {
    return {
      loading: false,

      clusters: null,

      clusterRoutes: null,
    };
  },
  computed: {},
  watch: {
    clusters(val) {
      this.$bus.$emit('showClusters', val);
      this.fetchRoutes();
    },
  },
  created() {
    loadYmap({ apiKey: '6b68307b-23e6-4b58-ba7c-cd14578e37c9', lang: 'ru_RU', version: '2.1' });

    this.fetchClusters();
  },
  methods: {
    fetchClusters() {
      this.loading = true;
      apiService
        .fetchClusters()
        .then(clusters => {
          this.clusters = clusters.features.map(feature => {
            const polygon = L.polygon(feature.geometry.coordinates);
            const area = Math.round(L.GeometryUtil.geodesicArea(polygon.getLatLngs()[0]) / 10000);
            return { ...feature, area: `${area} га` };
          });
        })
        .finally(() => {
          this.loading = false;
        });
    },
    showPath(path) {
      this.$bus.$emit('createPath', path);
    },
    fetchRoutes() {
      Promise.all(this.clusters.map(cluster => this.buildPath(cluster))).then(result => {
        this.clusterRoutes = result;
      });
    },
    buildPath(cluster) {
      function fetchGraphHopperRoute(toPoint) {
        const ghRouting = new GraphHopper.Routing({ key: '6f1b504e-b994-4e5f-9b6c-9d5f57beb36c' });
        ghRouting.addPoint(new GHInput(56.838011, 60.597474));
        ghRouting.addPoint(new GHInput(toPoint));
        return ghRouting.doRequest().catch(() => {});
      }

      return new Promise(resolve => {
        const startPoint = [56.838011, 60.597474];
        const endPoint = L.geoJSON(cluster)
          .getBounds()
          .getCenter();

        const model = { startPoint, endPoint };

        const multiRoute = new ymaps.multiRouter.MultiRoute({
          referencePoints: [startPoint, [endPoint.lat, endPoint.lng]],
          params: { results: 1 },
        });

        multiRoute.model.events.add('requestsuccess', () => {
          const activeRoute = multiRoute.getActiveRoute();
          if (activeRoute) {
            model.distance = activeRoute.properties.get('distance').text;
            model.time = activeRoute.properties.get('duration').text;
          }
          fetchGraphHopperRoute(endPoint)
            .then(res => {
              model.graph = res;
            })
            .finally(() => resolve(model));
        });

        multiRoute.model.events.add('requestfail', () => {
          fetchGraphHopperRoute(endPoint)
            .then(res => {
              model.graph = res;
            })
            .finally(() => resolve(model));
        });
      });
    },
  },
};
</script>

<style lang="scss">
.clusters {
  height: 100%;
  display: flex;
  flex-direction: column;

  &__content {
    margin-top: 24px;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }
}
.cluster {
  margin-bottom: 12px;
  padding-bottom: 4px;

  &:not(:last-child) {
    border-bottom: 1px solid $--grey;
  }
  &__body {
    margin-top: 4px;
    font-size: 14px;
  }

  &__title {
    font-weight: 500;
  }
  &__label {
    color: $--semi-grey;
  }
}
</style>
