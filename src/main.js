import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// @是某一个路径的别名 src路径别名 在vue-cli创建的项目下才可使用
// 目录下是有默认索引文件 index.js 就是索引文件   。js ,vue .json

import '@/style（less）/index.less'
import router from '@/router（路由）'

// 先引入axios
import axios from 'axios'
//   在vue这个跟组件的原型上挂载一个axios  这样所有的 都能够继承 真个 axios

Vue.prototype.$http = axios

Vue.config.productionTip = false
// 这是创造了一个vue的根实例
Vue.use(ElementUI)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

// main.js 这是入口文件它 的职责是：
// 1 创建vue的根实例
// 2. 用来导入项目所以来的资源（js包，css文件，其他资源）
