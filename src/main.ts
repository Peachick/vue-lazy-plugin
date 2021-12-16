import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

import VLazy from './directives/lazy/lazy'
Vue.use(VLazy, {
  error: '/error.gif',
  loading: '/loading.gif'
})

new Vue({
  render: h => h(App),
}).$mount('#app')
