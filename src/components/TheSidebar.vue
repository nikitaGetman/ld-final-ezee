<template>
  <div class="sidebar" :class="{ 'sidebar--active': visible }">
    <div class="sidebar__actions">
      <v-btn icon class="ml-1" @click="visible = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </div>

    <v-slide-x-transition mode="out-in">
      <incidents v-if="type === 'incidents'" />
      <statistic v-if="type === 'statistic'" />
      <clusters v-if="type === 'clusters'" />
    </v-slide-x-transition>
  </div>
</template>

<script>
import Incidents from '@/components/Sidebar/Incidents.vue';
import Statistic from '@/components/Sidebar/Statistic.vue';
import Clusters from '@/components/Sidebar/Clusters.vue';

export default {
  name: 'TheSidebar',
  components: { Incidents, Statistic, Clusters },
  data() {
    return {
      type: null,
      visible: false,
    };
  },
  mounted() {
    this.$bus.$on('loadIncidents', this.loadIncidents);
    this.$bus.$on('loadClusters', this.loadClusters);
    this.$bus.$on('showStatistic', this.showStatistic);
  },
  beforeDestroy() {
    this.$bus.$off('loadIncidents', this.loadIncidents);
    this.$bus.$off('showStatistic', this.showStatistic);
    this.$bus.$off('loadClusters', this.loadClusters);
  },
  methods: {
    loadIncidents() {
      this.visible = true;
      this.type = 'incidents';
    },
    showStatistic() {
      this.visible = true;
      this.type = 'statistic';
    },
    loadClusters() {
      this.visible = true;
      this.type = 'clusters';
    },
  },
};
</script>

<style lang="scss">
.sidebar {
  width: 0px;
  height: calc(100vh - 64px);
  position: relative;
  overflow: hidden;
  background-color: $--white;
  z-index: 400;
  transition: width 0.5s;

  &--active {
    width: 400px;
    padding: 12px 16px;
    box-shadow: 0px 0px 16px 3px rgb(0 0 0 / 10%);
  }

  &__actions {
    position: absolute;
    right: 12px;
    top: 12px;
    z-index: 100;
  }
}
</style>
