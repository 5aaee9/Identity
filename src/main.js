// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import resource from "vue-resource"

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  resource,
  template: '<App/>',
  components: {
    App
  }
})
Vue.use(resource)