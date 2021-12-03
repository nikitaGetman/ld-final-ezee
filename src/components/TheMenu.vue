<template>
  <v-navigation-drawer v-model="expanded" hide-overlay expand-on-hover absolute height="unset" class="the-menu">
    <v-list nav dense>
      <v-list-item link @click="loadIncidents">
        <v-list-item-icon>
          <v-icon>mdi-alert</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Инциденты</v-list-item-title>
      </v-list-item>

      <v-list-item link @click="showPLans">
        <v-list-item-icon>
          <v-icon>mdi-floor-plan</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Планы</v-list-item-title>
      </v-list-item>

      <v-list-item link @click="showDashboard">
        <v-list-item-icon>
          <v-icon>mdi-chart-pie</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Дашборд</v-list-item-title>
      </v-list-item>

      <v-divider class="my-2"></v-divider>

      <v-list-item link @click="showStatistic">
        <v-list-item-icon>
          <v-icon>mdi-chart-bar</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Рейтинг</v-list-item-title>
      </v-list-item>

      <v-list-item link @click="showReports">
        <v-list-item-icon>
          <v-icon>mdi-table-large</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Отчеты</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'TheMenu',
  data() {
    return {
      expanded: true,
    };
  },
  methods: {
    hideEmblema() {
      this.$bus.$emit('hideEmblema');
    },
    showEmblema() {
      this.$bus.$emit('showEmblema');
    },
    fadeOut() {
      this.expanded = false;
      setTimeout(() => {
        this.expanded = true;
      }, 2000);
    },
    loadIncidents() {
      this.$bus.$emit('panToRegion', 'RU-SVE');
      this.$bus.$emit('loadIncidents');
      this.fadeOut();
      this.showEmblema();
    },
    showDashboard() {
      this.$bus.$emit('showDashboard');
      this.fadeOut();
      this.showEmblema();
    },
    showPLans() {
      this.$bus.$emit('showPlans');
      this.fadeOut();
      this.showEmblema();
    },
    showStatistic() {
      this.$bus.$emit('showStatistic');
      this.fadeOut();
      this.hideEmblema();
    },
    showReports() {
      this.$bus.$emit('showReports');
      this.fadeOut();
      this.hideEmblema();
    },
  },
};
</script>

<style lang="scss">
.the-menu {
  border-bottom-right-radius: 12px;
  z-index: 50 !important;
  overflow: visible !important;
  box-shadow: inset 0 -4px 4px 0 rgba(0, 0, 0, 0.1);
  .v-navigation-drawer__content {
    overflow: visible !important;
  }
}
</style>
