<template>
  <div class="chart">
    <div v-if="label" class="chart__label">{{ label }}</div>
    <div class="chart__body">
      <canvas ref="canvas"></canvas>
    </div>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const defaultOption = {
  maintainAspectRatio: false,
  plugins: {
    scales: {
      x: {
        beginAtZero: true,
      },
    },
    legend: {
      display: false,
    },
  },

  interaction: {
    intersect: false,
    axis: 'x',
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

export default {
  name: 'Chart',
  props: {
    label: { type: String, default: '' },
    chartdata: { type: Object, required: true },
    options: { type: Object, default: () => ({}) },
    type: { type: String, default: 'bar' },
  },
  data() {
    return {
      chart: null,
    };
  },
  mounted() {
    const ctx = this.$refs.canvas.getContext('2d');
    this.chart = new Chart(ctx, {
      type: this.type,
      data: this.chartdata,
      options: { ...defaultOption, ...this.options },
    });
  },
};
</script>

<style lang="scss">
.chart {
  &__label {
    font-size: 20px;
    font-weight: 500;
    margin-bottom: 12px;
  }
  &__body {
    height: 260px;

    canvas {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
