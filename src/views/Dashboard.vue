<template>
  <v-app class="dashboard">
    <the-header />

    <v-main class="dashboard__main">
      <div class="dashboard__view">
        <the-menu />
        <leaflet-map />
        <the-bottom-sheet />
      </div>
      <the-sidebar />
    </v-main>
  </v-app>
</template>

<script>
import TheHeader from '@/components/TheHeader.vue';
import LeafletMap from '@/components/LeafletMap.vue';
import TheMenu from '@/components/TheMenu.vue';
import TheBottomSheet from '@/components/TheBottomSheet.vue';
import TheSidebar from '@/components/TheSidebar.vue';

export default {
  name: 'Dashboard',
  components: { TheHeader, LeafletMap, TheMenu, TheBottomSheet, TheSidebar },
  data() {
    return {};
  },
};
</script>

<style lang="scss">
.dashboard {
  &__main {
    .v-main__wrap {
      display: flex;
    }
  }
  &__view {
    position: relative;
    flex-grow: 1;

    .v-dialog__content {
      position: absolute;
    }
    .v-dialog,
    .v-sheet:not(.v-sheet--outlined) {
      box-shadow: none;
    }
  }
}
</style>
