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

      <v-list-item link @click="showStatistic">
        <v-list-item-icon>
          <v-icon>mdi-chart-bar</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Рейтинг</v-list-item-title>
      </v-list-item>

      <v-list-item link>
        <v-list-item-icon>
          <v-icon>mdi-account-multiple</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Вырубки</v-list-item-title>
      </v-list-item>

      <v-list-item link @click="showDashboard">
        <v-list-item-icon>
          <v-icon>mdi-chart-pie</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Дашборд</v-list-item-title>
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
    },
    showStatistic() {
      this.$bus.$emit('showStatistic');
      this.fadeOut();
    },
    showDashboard() {
      this.$bus.$emit('showDashboard');
      this.fadeOut();
    },
    showPLans() {
      this.$bus.$emit('showPlans');
      this.fadeOut();
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
