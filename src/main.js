import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/global.css'
import axios from 'axios'
import * as echarts from 'echarts';
Vue.prototype.$echarts = echarts


//hot pot 192.168.43.56
//宿舍ipconfig debug 192.168.88.103
//release 49.234.221.164
//办公室ip 172.19.15.71
//axios.defaults.baseURL = 'http://172.19.15.65:1248/'
axios.defaults.baseURL = 'http://106.52.47.136:12481/'
Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
