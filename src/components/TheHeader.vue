<template>
  <v-app-bar app color="blue" class="header">
    <div class="header__logo">
      <v-img src="@/assets/images/min_brand.png" height="48" contain max-width="142"></v-img>
    </div>

    <div class="header__profile">
      <div class="header__name">Иванов Д. С.</div>
      <div class="header__position">Министерство энергетики РФ</div>
    </div>
  </v-app-bar>
</template>

<script>
export default {
  name: 'TheHeader',
};
</script>

<style lang="scss">
.header {
  z-index: 500 !important;
  box-shadow: inset 0 -12px 10px 0 rgba(0, 0, 0, 0.15), 0px 2px 4px -1px rgb(0 0 0 / 20%),
    0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%) !important;

  &__logo {
    margin-left: auto;
  }
  &__profile {
    margin-left: 36%;
    display: flex;
    flex-direction: column;
    white-space: nowrap;
    color: white;
  }
  &__name {
    font-weight: 500;
    line-height: 1.3em;
    font-size: 17px;
  }
  &__position {
    font-size: 11px;
  }
}
</style>
