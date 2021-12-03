<template>
  <div class="sidebar" :class="{ 'sidebar--active': !!type }">
    <div class="sidebar__actions">
      <v-btn icon class="ml-1" @click="type = null">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </div>

    <v-slide-x-transition mode="out-in">
      <incidents v-if="type === 'incidents'" />
      <statistic v-if="type === 'statistic'" />
      <clusters v-if="type === 'clusters'" />
      <plans v-if="type === 'plans'" />
    </v-slide-x-transition>
  </div>
</template>

<script>
import Incidents from '@/components/Sidebar/Incidents.vue';
import Statistic from '@/components/Sidebar/Statistic.vue';
import Clusters from '@/components/Sidebar/Clusters.vue';
import Plans from '@/components/Sidebar/Plans.vue';

export default {
  name: 'TheSidebar',
  components: { Incidents, Statistic, Clusters, Plans },
  data() {
    return {
      type: null,
    };
  },
  mounted() {
    this.$bus.$on('loadIncidents', this.loadIncidents);
    this.$bus.$on('loadClusters', this.loadClusters);
    this.$bus.$on('showStatistic', this.showStatistic);
    this.$bus.$on('showPlans', this.showPlans);
  },
  beforeDestroy() {
    this.$bus.$off('loadIncidents', this.loadIncidents);
    this.$bus.$off('showStatistic', this.showStatistic);
    this.$bus.$off('loadClusters', this.loadClusters);
    this.$bus.$off('showPlans', this.showPlans);
  },
  methods: {
    loadIncidents() {
      this.type = 'incidents';
    },
    showStatistic() {
      this.type = 'statistic';
    },
    loadClusters() {
      this.type = 'clusters';
    },
    showPlans() {
      this.type = 'plans';
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
  z-index: 90;
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
