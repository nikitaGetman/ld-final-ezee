<template>
  <div class="plans">
    <base-loader :active="loading" />

    <div class="text-h6">Планы вырубок</div>

    <div class="d-flex align-baseline my-4">
      <span class="text-body-1 mr-4 grey--text text--darken-1">Регион:</span>
      <v-select v-model="region" :items="regions" placeholder="Не выбрано" solo dense hide-details />
    </div>

    <v-divider class="mb-4" />

    <div class="plans__content">
      <div class="text-subtitle-1 mb-2">Активные</div>

      <div v-if="model" class="plans__list">
        <plan v-for="(plan, index) in model.active" :key="index" :plan="plan" @click="openPlan(plan)" />
      </div>

      <v-divider class="my-4" />

      <div class="text-subtitle-1">Архив</div>

      <div v-if="model" class="plans__list">
        <plan v-for="(plan, index) in model.archive" :key="index" :plan="plan" disabled @click="openPlan(plan)" />
      </div>
    </div>
  </div>
</template>

<script>
import BaseLoader from '@/components/BaseLoader.vue';
import Plan from '@/components/Sidebar/Plan.vue';
import apiService from '@/services/api';

export default {
  name: 'Plans',
  components: { BaseLoader, Plan },
  data() {
    return {
      loading: false,
      model: null,

      region: 1,
      regions: [{ value: 1, text: 'Свердловская область' }],
    };
  },
  created() {
    this.$bus.$emit('resetMapLayers');
    this.$bus.$emit('panToRegion', 'RU-SVE');

    this.loading = true;
    apiService
      .fetchPlans()
      .then(res => {
        this.model = res;
      })
      .finally(() => {
        this.loading = false;
      });
  },
  methods: {
    openPlan(plan) {
      if (plan.year === 2021) {
        this.loading = true;
        apiService
          .fetchPlan(plan.id)
          .then(clusters => {
            this.$bus.$emit('showClusters', clusters);
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },
  },
};
</script>

<style lang="scss">
.plans {
  height: 100%;
  display: flex;
  flex-direction: column;

  &__content {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }
}
</style>
