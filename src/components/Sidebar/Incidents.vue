<template>
  <div class="incidents">
    <base-loader :active="loading" />

    <div class="text-h6">
      Инциденты <span class="grey--text">({{ incidents ? incidents.length : 0 }})</span>
    </div>

    <div class="d-flex align-baseline my-4">
      <span class="text-body-1 mr-4 grey--text text--darken-1">Риск:</span>
      <v-select
        v-model="filter"
        :items="$options.RISK_LEVELS"
        placeholder="Все"
        multiple
        solo
        dense
        hide-details
        clearable
      />
    </div>

    <v-divider class="mb-4" />

    <v-btn color="primary" @click="selectClusters">Выделить кластеры</v-btn>

    <div class="incidents__content">
      <div v-for="item in sortedIncidents" :key="item.properties.id" class="incident" @click="panToIncident(item)">
        <div class="incident__title">Зарастание просеки</div>
        <div class="incident__body">
          <v-row no-gutters>
            <v-col cols="3">
              <span class="incident__label">Риск:</span>
            </v-col>
            <v-col cols="9">
              <span :class="`incident__risk--${getRisk(item).value}`">{{ getRisk(item).text }}</span>
            </v-col>

            <v-col cols="3">
              <span class="incident__label">Точность:</span>
            </v-col>
            <v-col cols="9">
              <span>{{ Math.round(item.properties.accuracy * 100) }}%</span>
            </v-col>

            <v-col cols="3">
              <span class="incident__label">Напряжение:</span>
            </v-col>
            <v-col cols="9">
              <span>{{ Math.round(parseInt(item.properties.voltage, 10) / 1000) }} кВ</span>
            </v-col>

            <v-col cols="3">
              <span class="incident__label">Дата:</span>
            </v-col>
            <v-col cols="9">
              <span>3 декабря 2021г.</span>
            </v-col>

            <v-col cols="3">
              <span class="incident__label">Округ:</span>
            </v-col>
            <v-col cols="9">
              <span>{{ item.properties.address }}</span>
            </v-col>
          </v-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BaseLoader from '@/components/BaseLoader.vue';
import RISK_LEVELS from '@/constants/risks';
import apiService from '@/services/api';

import { loadYmap } from 'vue-yandex-maps';
import config from '@/constants/yandex-map';

export default {
  name: 'Incidents',
  components: { BaseLoader },
  RISK_LEVELS,
  data() {
    return {
      loading: false,
      filter: [1],

      incidents: null,
    };
  },
  computed: {
    filteredIncidents() {
      if (!this.incidents) return [];
      if (this.filter.length) {
        return this.incidents.filter(i => this.filter.includes(i.properties.dangerLevel));
      }
      return this.incidents;
    },
    sortedIncidents() {
      return [...this.filteredIncidents].sort((a, b) => a.properties.dangerLevel - b.properties.dangerLevel);
    },
  },
  watch: {
    filteredIncidents(val) {
      this.$bus.$emit('showIncidents', val);
    },
  },
  created() {
    this.loading = true;
    apiService
      .fetchIncidents()
      .then(incidents => {
        this.incidents = incidents.features;
        return loadYmap(config);
      })
      .then(() =>
        // eslint-disable-next-line
        Promise.all(this.incidents.map(incident => ymaps.geocode(incident.geometry.coordinates, { results: 1 })))
      )
      .then(results => {
        results.forEach((res, index) => {
          const obj = res.geoObjects.get(0);
          this.incidents[index].properties.address = obj ? res.geoObjects.get(0).properties.get('text') : '';
        });
      })
      .finally(() => {
        this.loading = false;
      });
  },
  methods: {
    getRisk(item) {
      return RISK_LEVELS.find(r => r.value === item.properties.dangerLevel);
    },
    selectClusters() {
      this.filter = [];
      this.$nextTick(() => {
        this.$bus.$emit('loadClusters');
      });
    },
    panToIncident(incident) {
      this.$bus.$emit('panToIncident', incident);
    },
  },
};
</script>

<style lang="scss">
.incidents {
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

.incident {
  padding: 8px 4px;
  transition: all 0.2s;

  &:not(:last-child) {
    border-bottom: 1px solid $--grey;
  }

  &:hover {
    cursor: pointer;
    background-color: #f5f5f5;
  }
  &__body {
    margin-top: 4px;
    margin-left: 4px;
    font-size: 14px;
  }

  &__title {
    font-weight: 500;
  }
  &__label {
    color: $--semi-grey;
  }
  &__risk {
    &--1 {
      color: red;
    }
    &--2 {
      color: orange;
    }
  }
}
</style>
