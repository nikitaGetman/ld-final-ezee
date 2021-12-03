<template>
  <div :class="{ reports: true, 'reports--expanded': value }">
    <div class="reports__actions">
      <v-btn icon @click="localValue = false">
        <v-icon size="40">mdi-close</v-icon>
      </v-btn>
    </div>

    <v-container class="mt-2">
      <div class="text-h5 text-center">Инциденты</div>
      <v-simple-table fixed-header height="82vh" class="mt-2">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-center" style="width: 32px;">
                №
              </th>
              <th class="text-center">
                № Пролета
              </th>
              <th class="text-center">
                Класс ЛЭП
              </th>
              <th class="text-center">
                Площадь
              </th>
              <th class="text-center">
                Округ
              </th>
              <th class="text-center">
                Дата
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in incidents" :key="item.id">
              <td class="text-center">{{ index + 1 }}</td>
              <td class="text-center">{{ (index + 1) * 2 }}</td>
              <td class="text-center">{{ item.properties.voltage / 1000 }} кВ</td>
              <td class="text-center">{{ Math.round(Math.random() * 10) + 1 }} м2</td>
              <td class="text-center">Свердловская область</td>
              <td class="text-center">3 декабря 2021г.</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-container>
  </div>
</template>

<script>
import apiService from '@/services/api';

export default {
  name: 'Reports',
  props: {
    value: { type: Boolean, default: false },
  },
  data() {
    return {
      incidents: null,
    };
  },
  computed: {
    localValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('update:value', val);
      },
    },
  },
  created() {
    apiService.fetchIncidents().then(incidents => {
      this.incidents = incidents.features;
    });
  },
};
</script>

<style lang="scss">
.reports {
  position: absolute;
  right: 0;
  width: 100%;
  top: 0;
  height: calc(100vh - 64px);
  overflow-y: auto;

  background-color: $--white;
  z-index: 210;

  display: none;

  &--expanded {
    display: block;
  }

  &__actions {
    position: absolute;
    right: 64px;
    top: 20px;
  }
}
</style>
