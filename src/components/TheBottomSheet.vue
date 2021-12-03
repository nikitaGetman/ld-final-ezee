<template>
  <v-bottom-sheet v-model="value" :retain-focus="false" hide-overlay persistent no-click-animation attach=".main__view">
    <v-sheet class="the-sheet pt-6 px-4" :class="{ 'the-sheet--expanded': expanded }">
      <div class="the-sheet__actions">
        <v-btn v-if="expanded" icon @click="expanded = false">
          <v-icon>mdi-arrow-collapse</v-icon>
        </v-btn>

        <v-btn v-else icon @click="expanded = true">
          <v-icon>mdi-arrow-expand</v-icon>
        </v-btn>

        <v-btn icon class="ml-1" @click="value = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>

      <incident v-if="isIncident" :id="model" />
    </v-sheet>
  </v-bottom-sheet>
</template>

<script>
import Incident from '@/components/BottomSheet/Incident.vue';

export default {
  name: 'TheBottomSheet',
  components: { Incident },
  data() {
    return {
      value: false,
      expanded: false,

      type: '',
      model: null,
    };
  },
  computed: {
    isIncident() {
      return this.type === 'incident';
    },
  },
  mounted() {
    this.$bus.$on('openRegionInfo', this.openRegionInfo);
    this.$bus.$on('openIncidentInfo', this.openIncidentInfo);
    this.$bus.$on('loadIncidents', this.resetState);
    this.$bus.$on('loadClusters', this.resetState);
    this.$bus.$on('showStatistic', this.resetState);
    this.$bus.$on('showPlans', this.resetState);
  },
  beforeDestroy() {
    this.$bus.$off('openRegionInfo', this.openRegionInfo);
    this.$bus.$off('openIncidentInfo', this.openIncidentInfo);
    this.$bus.$off('loadIncidents', this.resetState);
    this.$bus.$off('loadClusters', this.resetState);
    this.$bus.$off('showStatistic', this.resetState);
    this.$bus.$off('showPlans', this.resetState);
  },
  methods: {
    openRegionInfo(regionCode) {
      console.log('openRegionInfo', regionCode);
    },
    openIncidentInfo(id) {
      this.value = true;
      this.model = id;
      this.type = 'incident';
    },
    resetState() {
      this.value = false;
      this.model = null;
      this.type = '';
    },
  },
};
</script>

<style lang="scss">
.the-sheet {
  box-shadow: 0 -4px 10px 0 rgba(0, 0, 0, 0.1) !important;

  display: flex;
  flex-direction: column;
  position: relative;
  height: 160px;
  transition: all 0.3s ease-in-out;
  &--expanded {
    height: 500px;
  }
  &__actions {
    position: absolute;
    right: 12px;
    top: 12px;
    z-index: 100;
  }
}
</style>
