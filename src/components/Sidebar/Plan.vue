<template>
  <div :class="`plan plan--${disabled ? 'disabled' : ''}`" v-on="$listeners">
    <div class="plan__title">План {{ plan.year }} год</div>
    <v-row no-gutters>
      <v-col cols="4">
        <span class="plan__label">Площадь план:</span>
      </v-col>
      <v-col cols="8">
        <span>{{ plan.areaTotal }}</span>
      </v-col>

      <v-col cols="4">
        <span class="plan__label">Площадь факт:</span>
      </v-col>
      <v-col cols="8">
        <span>{{ plan.areaDone }}</span>
      </v-col>

      <v-col cols="4">
        <span class="plan__label">Дата начала:</span>
      </v-col>
      <v-col cols="8">
        <span>{{ plan.startDate }}</span>
      </v-col>

      <v-col cols="4">
        <span class="plan__label">Дата завершения:</span>
      </v-col>
      <v-col cols="8">
        <span>{{ plan.endDate }}</span>
      </v-col>

      <v-col cols="4">
        <span class="plan__label">Ответственный:</span>
      </v-col>
      <v-col cols="8">
        <span>Иванов. Д. С.</span>
      </v-col>

      <v-progress-linear :value="progress" class="mt-2" :color="color" />
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'SidebarPlan',
  props: {
    plan: { type: Object, required: true },
    disabled: { type: Boolean, default: false },
  },
  computed: {
    progress() {
      return Math.round((this.plan.areaDone / this.plan.areaTotal) * 100);
    },
    color() {
      if (this.progress === 100) return 'green';
      if (this.plan.year < 2021) return 'red';
      return 'primary';
    },
  },
};
</script>

<style lang="scss">
.plan {
  padding: 12px 4px;
  transition: all 0.2s;

  &:hover {
    cursor: pointer;
    background-color: #f5f5f5;
  }

  &--disabled {
    cursor: not-allowed !important;
    opacity: 0.4;
  }

  &:not(:last-child) {
    border-bottom: 1px solid $--grey;
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
    font-size: 14px;
    color: $--semi-grey;
  }
}
</style>
