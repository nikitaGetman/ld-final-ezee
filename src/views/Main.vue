<template>
  <v-app class="main">
    <the-header />

    <v-main class="main__body">
      <div class="main__view">
        <the-menu />
        <leaflet-map />
        <the-bottom-sheet />
      </div>
      <the-sidebar />

      <dashboard :value.sync="isDashboardVisible" />
      <reports :value.sync="isReportsVisible" />
    </v-main>
  </v-app>
</template>

<script>
import TheHeader from '@/components/TheHeader.vue';
import LeafletMap from '@/components/LeafletMap.vue';
import TheMenu from '@/components/TheMenu.vue';
import TheBottomSheet from '@/components/TheBottomSheet.vue';
import TheSidebar from '@/components/TheSidebar.vue';
import Dashboard from '@/components/Dashboard.vue';
import Reports from '@/components/Reports.vue';

export default {
  name: 'MainPage',
  components: { Dashboard, TheHeader, LeafletMap, TheMenu, TheBottomSheet, TheSidebar, Reports },
  data() {
    return {
      isDashboardVisible: false,
      isReportsVisible: false,
    };
  },
  created() {
    this.$bus.$on('showDashboard', this.showDashboard);
    this.$bus.$on('showReports', this.showReports);
  },
  beforeDestroy() {
    this.$bus.$off('showDashboard', this.showDashboard);
    this.$bus.$off('showReports', this.showReports);
  },
  methods: {
    showDashboard() {
      this.isDashboardVisible = true;
    },
    showReports() {
      this.isReportsVisible = true;
    },
  },
};
</script>

<style lang="scss">
.main {
  &__body {
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
