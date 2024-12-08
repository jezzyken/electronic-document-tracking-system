import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        brown: "#a52a2a",
        firebrick: "#b22222",
        chocolate: "#d2691e",
        sandybrown: "#f4a460",
        tan: "#d2b48c",

        primary: "#a52a2a",
        secondary: "#b22222",
        accent: "#d2691e",
        info: "#f4a460",
        warning: "#d2b48c",
      },
    },

    options: {
      customProperties: true,
    },
  },
  icons: {
    iconfont: "mdi",
  },
});
