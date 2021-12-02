import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import ru from 'vuetify/src/locale/ru.ts';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    options: { customProperties: true },
    dark: false,
    themes: {
      light: {
        primary: '#50749a',
        secondary: '#2f4881',
        blue: '#50749a',
        darkBlue: '#2f4881',
        gray: '#e0e0e0',
      },
    },
  },
  lang: {
    locales: { ru },
    current: 'ru',
  },
});
