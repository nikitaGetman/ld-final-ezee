<template>
  <div class="map">
    <yandex-map
      :settings="mapConfig.settings"
      :options="mapConfig.options"
      :coords="mapConfig.coords"
      :controls="mapConfig.controls"
      :zoom="mapConfig.zoom"
      @map-was-initialized="initMap"
    >
    </yandex-map>

    <map-legend :params="params" @update="updateParams" />
  </div>
</template>

<script>
/* eslint-disable no-undef */
import MapLegend from '@/components/MapLegend.vue';
import towersData from '@/api/towers.json';
import linesData from '@/api/lines.json';
import settings from '@/constants/yandex-map';
import { getLineColorByVoltage } from '@/utils/common';

const localState = {
  regionsData: null,
};

export default {
  name: 'TheMap',
  components: { MapLegend },
  data() {
    return {
      mapConfig: {
        settings,
        coords: [60, 59],
        zoom: 6,
        controls: [], // 'zoomControl'
        options: {
          autoFitToViewport: 'always',
          type: 'yandex#satellite',
          minZoom: 4,
          // restrictMapArea: [
          //   [40, 70],
          //   [70, 40],
          // ],
        },
      },

      params: {
        lines: { value: true, title: 'Показывать ЛЭП' },
        heatmap: { value: false, title: 'Показывать тепловую карту опасных районов' },
        regions: { value: false, title: 'Показывать регионы' },
      },

      map: null,
      linesManager: null,
      regionManager: null,
      heatmap: null,
    };
  },
  mounted() {
    this.$bus.$on('panToRegion', this.highlightRegion);
  },
  beforeDestroy() {
    this.heatmap.destroy();
    this.map.destroy();

    this.$bus.$off('panToRegion', this.highlightRegion);
  },
  methods: {
    updateParams({ key, value }) {
      this.params[key].value = value;

      const updateMethods = {
        lines: this.toggleLines,
        heatmap: this.toggleHeatmap,
        regions: this.toggleRegions,
      };

      updateMethods[key]();
    },
    toggleLines() {
      if (this.params.lines.value) {
        const hintLayout = ymaps.templateLayoutFactory.createClass(
          `<div class="lines-hint">
            <div>ЛЭП {{ properties.voltageHint }}</div>
          </div>`,
          {
            // Определяем метод getShape, который
            // будет возвращать размеры макета хинта.
            // Это необходимо для того, чтобы хинт автоматически
            // сдвигал позицию при выходе за пределы карты.
            // getShape() {
            //   const el = this.getElement();
            //   let result = null;
            //   if (el) {
            //     const { firstChild } = el;
            //     result = new ymaps.shape.Rectangle(
            //       new ymaps.geometry.pixel.Rectangle([
            //         [0, 0],
            //         [firstChild.offsetWidth, firstChild.offsetHeight],
            //       ])
            //     );
            //   }
            //   return result;
            // },
          }
        );
        const formattedLines = {
          ...linesData,
          features: linesData.features.map(line => ({
            ...line,
            options: { ...getLineColorByVoltage(line.properties.voltage), hintLayout, openHintOnHover: true },
            properties: {
              ...line.properties,
              voltageHint: line.properties.voltage ? `${parseInt(line.properties.voltage, 10) / 1000}кВ` : '',
            },
          })),
        };
        this.linesManager.add(formattedLines);
      } else {
        this.linesManager.removeAll();
      }
    },
    toggleHeatmap() {
      if (this.params.heatmap.value) {
        // const bounds = [
        //   [56.5, 56.3],
        //   [63.5, 64.6],
        // ];

        this.heatmap.setData(towersData);
      } else {
        this.heatmap.setData([]);
      }
    },
    toggleRegions() {
      if (this.params.regions.value) {
        this.regionManager.add(localState.regionsData);
      } else {
        this.regionManager.removeAll();
      }
    },

    setMapCenter(center, zoom = 9) {
      this.map.panTo(center).then(() => {
        this.map.setZoom(zoom, { duration: 500 });
      });
    },

    highlightRegion(regionName) {
      const [region] = localState.regionsData.filter(
        reg => reg.id === regionName || reg.properties.name === regionName
      );
      this.regionManager.removeAll();
      this.regionManager.add(region);

      // Находим оптимальный центр и уровень масштабирования карты.
      ymaps.util
        .requireCenterAndZoom(this.map.getType(), this.regionManager.getBounds(), this.map.container.getSize())
        .then(result => {
          // Устанавливаем карте оптимальный центр и зум.
          this.setMapCenter(result.center, result.zoom);
        });
    },

    initMap(map) {
      this.map = map;
      this.map.setType('yandex#satellite');

      const zoomControl = new ymaps.control.ZoomControl({
        options: {
          size: 'small',
          position: {
            top: 220,
            left: 10,
          },
        },
      });
      this.map.controls.add(zoomControl);

      this.initLinesLayer();
      this.initHeatmapLayer();
      this.initRegionsLayer();
    },

    initLinesLayer() {
      this.linesManager = new ymaps.ObjectManager();
      this.map.geoObjects.add(this.linesManager);
      this.toggleLines();
    },
    initHeatmapLayer() {
      ymaps.modules.require(['Heatmap'], Heatmap => {
        this.heatmap = new Heatmap([], {
          radius: 10,
          dissipating: true,
          intensityOfMidpoint: 0.2,
          gradient: {
            0.1: 'rgba(128, 255, 0, 0.7)',
            0.2: 'rgba(255, 255, 0, 0.8)',
            0.7: 'rgba(234, 72, 58, 0.9)',
            1.0: 'rgba(162, 36, 25, 1)',
          },
        });
        this.heatmap.setMap(this.map);
        this.toggleHeatmap();
      });
    },
    initRegionsLayer() {
      // Создадим менеджер объектов.
      this.regionManager = new ymaps.ObjectManager();
      this.map.geoObjects.add(this.regionManager);

      ymaps.ready(['polylabel.create']).then(() => {
        // Создадим макет подписей полигонов: с текстом
        const textLayouts = {
          label: '<div>{{properties.hintContent}}</div>',
          hint: ymaps.templateLayoutFactory.createClass('<div>{{properties.hintContent}}</div>'),
        };
        // Загрузим регионы.
        ymaps.borders
          .load('RU', {
            lang: 'ru',
            quality: 1,
          })
          .then(result => {
            const options = {
              // Стандартный вид текста будет темный с белой обводкой.
              labelDefaults: 'light',
              // Макет подписи.
              labelLayout: textLayouts.label,
              // Цвет заливки.
              fillColor: 'rgba(80, 116, 154, 0.3)',
              // Цвет обводки.
              strokeColor: 'rgba(255, 255, 255, 0.5)',
              // Отключим показ всплывающей подсказки при наведении на полигон.
              openHintOnHover: false,
              // Размер текста подписей зависит от масштаба.
              // На уровнях зума 3-6 размер текста равен 12, а на уровнях зума 7-18 равен 14.
              labelTextSize: { '3_6': 12, '7_18': 14 },
              cursor: 'pointer',
              labelDotCursor: 'pointer',
              // Допустимая погрешность в расчете вместимости подписи в полигон.
              labelPermissibleInaccuracyOfVisibility: 4,
            };
            // Добавляем полигоны в менеджер объектов.
            // В свойство regionName запишем название региона.
            // Присваиваем регионам опции, нужные для модуля подписей полигонов.
            localState.regionsData = result.features.map(feature => ({
              ...feature,
              options,
              id: feature.properties.iso3166,
              properties: { ...feature.properties, regionName: feature.properties.iso3166 },
            }));

            // Запускаем модуль подписей.
            // eslint-disable-next-line
            polylabelModule = new ymaps.polylabel.create(this.map, this.regionManager);

            this.toggleRegions();
          });
      });
    },
  },
};
</script>

<style lang="scss">
.map {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: calc(100vh - 64px);

  .ymap-container {
    width: 100%;
    height: 100%;
  }
}

.lines-hint {
  color: $--gold-line;
  white-space: nowrap;
  font-size: 12px;
}
</style>
