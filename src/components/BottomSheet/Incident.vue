<template>
  <div class="bottom-sheet">
    <base-loader :active="loading" />

    <v-container v-if="model" fluid class="pa-0">
      <v-row align="center" class="mb-1">
        <v-col cols="6">
          <span class="text-h6">Инцидент: Зарастание просеки</span>
        </v-col>
        <v-col cols="3">
          <span class="text-body-1">
            <span class="grey--text text--darken-2 mr-1">Риск:</span>
            <span :class="`bottom-sheet__risk bottom-sheet__risk--${model.properties.dangerLevel}`">{{
              riskLevel
            }}</span>
          </span>
        </v-col>
      </v-row>

      <div class="text-body-2">
        <span class="bottom-sheet__label">Местоположение:</span>
        <span>{{ address }} - {{ incidentCoordinates }}</span>
      </div>
      <div class="text-body-2">
        <span class="bottom-sheet__label">Ответственный:</span>
        <span>Иванов Д.C., зам. рук. министерства энергетики РФ по Свердловской области</span>
      </div>

      <div class="text-body-2">
        <span class="bottom-sheet__label">Напряжение ЛЭП:</span>
        <span>{{ parseInt(model.properties.voltage, 10) / 1000 }} кВ</span>
      </div>

      <div class="text-body-2">
        <span class="bottom-sheet__label">Ширина просеки:</span>
        <span>{{ getWidthByVoltage(model.properties.voltage) }} м</span>
      </div>

      <div class="text-body-2">
        <span class="bottom-sheet__label">Зарастание просеки:</span>
        <span>{{ model.properties.rawData.area }} м2</span>
      </div>

      <div class="text-body-2">
        <span class="bottom-sheet__label">Дата обнаружения:</span>
        <span>{{ discoveryDate }}</span>
      </div>
      <div class="text-body-2">
        <span class="bottom-sheet__label">Последнее посещение:</span>
        <span>{{ lastVisitDate }}</span>
      </div>

      <div class="text-body-2">
        <span class="bottom-sheet__label">Точность:</span>
        <span>{{ Math.round(model.properties.accuracy * 100) }}%</span>
      </div>

      <div class="d-flex mt-2">
        <v-btn color="success" outlined small>
          <v-icon left>mdi-check</v-icon>
          Есть коллизия
        </v-btn>
        <v-btn color="red" small outlined class="mx-2">
          <v-icon left>mdi-close</v-icon>
          Нет коллизии
        </v-btn>
        <v-btn color="primary" outlined small>
          <v-icon left>mdi-magnify-expand</v-icon>
          Недостаточно данных</v-btn
        >
      </div>

      <v-row v-if="model.properties.rawData" class="mt-2">
        <v-col cols="3">
          <div class="text-caption bottom-sheet__label">Снимок 1:</div>
          <img :src="`data:image/jpeg;base64,${model.properties.rawData.images[0]}`" class="bottom-sheet__image" />
        </v-col>

        <v-col cols="3">
          <div class="text-caption bottom-sheet__label">Снимок 2:</div>
          <img :src="`data:image/jpeg;base64,${model.properties.rawData.images[1]}`" class="bottom-sheet__image" />
        </v-col>
      </v-row>

      <v-row align="start" class="mt-4" dense>
        <v-col cols="6">
          <div class="text-caption bottom-sheet__label">История (GIF):</div>
          <v-img src="@/assets/images/location_1_anim.gif" contain max-width="420px" />
        </v-col>

        <v-col cols="6">
          <div class="text-caption bottom-sheet__label">Vegetation Index:</div>
          <v-img src="@/assets/images/location_1_vegetation.png" contain max-width="420px" />
        </v-col>
        <v-col cols="6">
          <div class="text-caption bottom-sheet__label">Infrared:</div>
          <v-img src="@/assets/images/location_1_infrared.png" contain max-width="420px" />
        </v-col>
        <v-col cols="6">
          <div class="text-caption bottom-sheet__label">Moisture Index:</div>
          <v-img src="@/assets/images/location_1_moisture.png" contain max-width="420px" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import BaseLoader from '@/components/BaseLoader.vue';
import RISK_LEVELS from '@/constants/risks';
import apiService from '@/services/api';
import { getWidthByVoltage } from '@/utils/common';

import { loadYmap } from 'vue-yandex-maps';
import config from '@/constants/yandex-map';

export default {
  name: 'BottomSheetIncident',
  components: { BaseLoader },
  props: { id: { type: [Number, String], required: true } },
  data() {
    return {
      loading: false,
      model: null,

      address: null,
    };
  },
  computed: {
    incidentCoordinates() {
      if (!this.model) return null;
      return this.model.geometry.coordinates;
    },
    riskLevel() {
      return this.model && RISK_LEVELS.find(r => r.value === this.model.properties.dangerLevel).text;
    },
    discoveryDate() {
      return '3 декабря 2021г.';
    },
    lastVisitDate() {
      return '15 августа 2014г.';
    },
  },
  watch: {
    id: {
      immediate: true,
      handler() {
        this.fetch();
      },
    },
  },
  created() {},
  methods: {
    getWidthByVoltage,
    fetch() {
      this.loading = true;
      apiService
        .fetchIncident(this.id)
        .then(incident => {
          this.model = incident;
          return loadYmap(config);
        })
        // eslint-disable-next-line
        .then(() => ymaps.geocode(this.model.geometry.coordinates, { results: 1 }))
        .then(res => {
          const obj = res.geoObjects.get(0);
          this.address = obj ? res.geoObjects.get(0).properties.get('text') : '';
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style lang="scss">
.bottom-sheet {
  height: 100%;
  overflow-y: auto;
  padding-bottom: 32px;

  &__label {
    display: inline-block;
    width: 170px;
    color: $--semi-grey;
  }

  &__image {
    width: 100%;
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
