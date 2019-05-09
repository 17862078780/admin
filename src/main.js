import Vue from 'vue'
// 引入moment插件
import moment from 'moment'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN'

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import '@/icons' // icon
import '@/permission' // 权限

Vue.use(ElementUI, { locale })

Vue.config.productionTip = false
// 定义时间格式过滤器
Vue.filter('dateformat', function(dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return moment(dataStr).format(pattern)

})
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
