import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const moduleFiles = require.context("./modules", false, /\.js$/);
const modules = moduleFiles.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, "$1");
  const module = moduleFiles(modulePath).default || moduleFiles(modulePath);
  modules[moduleName] = module;
  return modules;
}, {});

export default new Vuex.Store({
  modules,
});
