import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false
// 这是创造了一个vue的根实例
new Vue({
  render: h => h(App)
}).$mount('#app')
// main.js 这是入口文件它 的职责是：
// 1 创建vue的根实例
// 2. 用来导入项目所以来的资源（js包，css文件，其他资源）
