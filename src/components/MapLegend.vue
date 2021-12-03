<template>
  <div class="map-legend" :class="{ 'map-legend--open': open }" @mouseover="open = true" @mouseleave="open = false">
    <v-icon class="map-legend__icon">mdi-help-circle-outline</v-icon>

    <div class="map-legend__content" :class="{ 'map-legend__content--visible': open }">
      <p class="mb-2">Настройки отображения карты</p>

      <v-switch
        :input-value="params.regions"
        label="Показывать регионы"
        hide-details
        @change="updateParam('regions', $event)"
      ></v-switch>

      <v-switch
        :input-value="params.lines"
        label="Показывать ЛЭП"
        hide-details
        @change="updateParam('lines', $event)"
      ></v-switch>

      <div class="grey--text text--darken-1 mt-4">Напряжение ЛЭП:</div>

      <v-row no-gutters>
        <v-col v-for="type in lineTypes" :key="type.key" :cols="6">
          <v-checkbox
            :input-value="!!params.linesType[type.key]"
            :label="type.text"
            dense
            hide-details
            :disabled="!params.lines"
            @change="updateParam('linesType', $event, type)"
          />
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MapLegend',
  props: {
    params: { type: Object, required: true },
  },
  data() {
    return {
      open: false,

      lineTypes: [
        { key: 1, valueFrom: 0, valueTo: 20, text: '1-20 кВ' },
        { key: 2, valueFrom: 21, valueTo: 35, text: '35 кВ' },
        { key: 3, valueFrom: 36, valueTo: 138, text: '110 кВ' },
        { key: 4, valueFrom: 140, valueTo: 220, text: '150-220 кВ' },
        { key: 5, valueFrom: 221, valueTo: 500, text: '500 кВ' },
      ],

      regions: { value: false, title: 'Показывать регионы' },
    };
  },

  created() {
    this.$emit('update', {
      key: 'linesType',
      value: this.lineTypes.reduce((acc, type) => ({ ...acc, [type.key]: type }), {}),
    });
  },
  methods: {
    updateParam(key, val, type = null) {
      if (key === 'linesType') {
        this.$emit('update', { key, value: { ...this.params.linesType, [type.key]: val ? type : undefined } });
      } else {
        this.$emit('update', { key, value: !!val });
      }
    },
  },
};
</script>

<style lang="scss">
.map-legend {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 10;
  overflow: hidden;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  align-items: stretch;

  width: 48px;
  height: 48px;

  padding: 16px;

  background-color: $--white;
  box-shadow: 3px 1px 10px 0px rgba(50, 50, 50, 0.25);
  border-radius: 24px;

  &--open {
    animation-direction: normal;
    animation: toggle 0.3s ease forwards;
  }

  @keyframes toggle {
    0% {
      width: 48px;
      height: 48px;
    }
    25% {
      width: 48px;
      height: 300px;
    }
    100% {
      width: 360px;
      height: 300px;
    }
  }

  &__icon.v-icon {
    position: absolute;
    top: 12px;
    right: 12px;
  }
  &__content {
    opacity: 0;
    transition: all 0.3s;
    transition-delay: 0s;
    &--visible {
      transition-delay: 0.2s;
      opacity: 1;
    }
  }
}
</style>
