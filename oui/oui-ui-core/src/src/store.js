import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    barColor: 'rgba(0, 0, 0, .8), rgba(0, 0, 0, .8)',
    barImage: '',
    drawer: null,
    menus: [],
    hostname: '',
    lang: ''
  },
  mutations: {
    SET_BAR_IMAGE (state, payload) {
      state.barImage = payload
    },
    SET_DRAWER (state, payload) {
      state.drawer = payload
    },
    setIsMobile(state, ismobile){
      state.isMobile = ismobile;
    },
    setMenus(state, menus) {
      state.menus = menus;
    },
    setLang(state, lang) {
      state.lang = lang;
    },
    setHostname(state, hostname) {
      state.hostname = hostname;
    }
  },
  actions: {

  },
})
