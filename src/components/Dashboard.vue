<template>
  <v-fade-transition>
    <div :class="{ dashboard: true, 'dashboard--expanded': value }">
      <div class="dashboard__actions">
        <v-btn icon @click="localValue = false">
          <v-icon size="40">mdi-close</v-icon>
        </v-btn>
      </div>

      <v-container class="mt-6">
        <v-row align="center">
          <v-col :cols="6">
            <v-row>
              <v-col v-for="(metric, index) in metrics" :key="index" :cols="4">
                <metric-card v-bind="metric" />
              </v-col>
            </v-row>
          </v-col>

          <v-col :cols="6">
            <chart v-bind="charts[1]" />
          </v-col>

          <v-col :cols="6">
            <chart v-bind="charts[0]" />
          </v-col>
          <v-col :cols="6">
            <chart v-bind="charts[2]" />
          </v-col>
        </v-row>
      </v-container>
    </div>
  </v-fade-transition>
</template>

<script>
import Chart from '@/components/Charts/Chart.vue';
import MetricCard from '@/components/MetricCard.vue';

export default {
  name: 'Dashboard',
  components: { MetricCard, Chart },
  props: {
    value: { type: Boolean, default: false },
  },
  data() {
    return {
      metrics: [
        { label: 'Новые инциденты', value: 12, change: 5 },
        { label: 'Готовые инциденты', value: 5, change: 1 },
        { label: 'Инцидентов в&nbsp;работе', value: 8, change: 2 },
        { label: 'Площади вырубок Га', value: 120, change: 10 },
        { label: 'Количество поездок', value: 14, change: 5 },
        { label: 'Км пути на 1 вырубленный Га', value: 21, change: 2 },
      ],

      charts: [
        {
          label: 'Га к очистке по территории',
          type: 'bar',
          chartdata: {
            labels: [
              '2019 (факт)',
              '2020 (факт)',
              '2021 (факт)',
              '2022 (план)',
              '2023 (план)',
              '2024 (план)',
              '2025 ( план)',
            ],
            datasets: [
              {
                label: 'Га к очистке',
                data: [23, 10, 15, 15, 20, 25, 23],
                barThickness: 40,
                backgroundColor: ['#757575', '#757575', '#757575', '#50749a', '#50749a', '#50749a', '#50749a'],
              },
            ],
          },
        },
        {
          label: 'Количество поездок',
          type: 'line',
          chartdata: {
            labels: [
              '2019 (факт)',
              '2020 (факт)',
              '2021 (факт)',
              '2022 (план)',
              '2023 (план)',
              '2024 (план)',
              '2025 ( план)',
            ],
            datasets: [
              {
                label: 'Поездок',
                data: [23, 10, 15, 15, 20, 25, 23],
                borderColor: '#50749a',
                tension: 0.2,
                fill: true,
              },
            ],
          },
        },
        {
          label: 'Километры пути на 1 вырубленный Га',
          type: 'line',
          chartdata: {
            labels: [
              '2019 (факт)',
              '2020 (факт)',
              '2021 (факт)',
              '2022 (план)',
              '2023 (план)',
              '2024 (план)',
              '2025 ( план)',
            ],
            datasets: [
              {
                label: 'Поездок',
                data: [530, 580, 639, 550, 430, 350, 300],
                borderColor: '#50749a',
                tension: 0.2,
                fill: true,
              },
            ],
          },
        },
      ],
    };
  },
  computed: {
    localValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('update:value', val);
      },
    },
  },
};
</script>

<style lang="scss">
.dashboard {
  position: absolute;
  right: 100%;
  width: 100%;
  top: 0;
  height: calc(100vh - 64px);
  overflow-y: auto;

  background-color: $--white;
  z-index: 210;

  transition: right 0.5s;
  transition-delay: 0s;

  &--expanded {
    transition-delay: 0.3s;
    right: 0;
  }

  &__actions {
    position: absolute;
    right: 64px;
    top: 20px;
  }
}
</style>
