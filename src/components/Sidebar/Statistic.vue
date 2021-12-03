<template>
  <div class="statistic">
    <base-loader :active="loading" />

    <div class="text-h6">Статистика</div>
    <div class="text-body-2 my-2">Рейтинг выполнения планов вырубок по регионам.</div>

    <v-simple-table fixed-header height="700px" class="statistic__table mt-2" dense>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left statistic__region">Регион</th>
            <th class="text-left">Выполнено</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in model" :key="item.iso" class="statistic__row" @click="openRegion(item.iso)">
            <td class="statistic__region">{{ item.name }}</td>
            <td :class="`text-center statistic__rating--${getColor(item.rating)}`">
              {{ Math.round(item.rating * 100) }} %
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
import BaseLoader from '@/components/BaseLoader.vue';
import apiService from '@/services/api';

export default {
  name: 'Statistic',
  components: { BaseLoader },
  data() {
    return {
      loading: false,
      model: null,
    };
  },
  created() {
    this.loading = true;
    apiService
      .fetchStatistic()
      .then(res => {
        this.model = res;
        this.$bus.$emit('showRegionsRating', res);
      })
      .finally(() => {
        this.loading = false;
      });
  },
  methods: {
    openRegion(code) {
      this.$bus.$emit('panToRegion', code);
    },
    getColor(rating) {
      if (rating < 0.5) return 'red';
      if (rating < 0.75) return 'orange';
      return 'green';
    },
  },
};
</script>

<style lang="scss">
.statistic {
  height: 100%;
  display: flex;
  flex-direction: column;

  &__row {
    cursor: pointer;
  }
  &__region {
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  &__rating {
    &--red {
      color: red;
    }
    &--orange {
      color: orange;
    }
    &--green {
      color: $--green;
    }
  }
}
</style>
