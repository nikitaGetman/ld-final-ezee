<template>
  <div class="metric">
    <div class="metric__label" v-html="label"></div>
    <div class="metric__value">
      {{ value }}
      <span :class="`metric__change metric__change--${change > 0 ? 'up' : 'down'}`">
        {{ change > 0 && '+' }}{{ change }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MetricCard',
  props: {
    label: { type: String, required: true },
    value: { type: Number, required: true },
    change: { type: Number, required: true },
  },
};
</script>

<style lang="scss">
.metric {
  padding: 12px 0 4px 12px;
  border: 2px solid $--blue;
  border-radius: 4px;

  &__label {
    height: 48px;
    line-height: 1em;
    font-size: 18px;
    font-weight: 500;
  }
  &__value {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    font-weight: 500;
  }
  &__change {
    margin-left: 4px;
    padding: 0 4px;

    font-size: 16px;
    color: $--white;
    border-radius: 4px;

    transform: translateY(-8px);

    &--up {
      background-color: green;
    }
    &--down {
      background-color: red;
    }
  }
}
</style>
