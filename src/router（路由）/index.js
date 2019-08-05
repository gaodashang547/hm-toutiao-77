// 定义一个router对象 导出给main.js使用
import VueRouter from 'vue-router'
import Vue from 'vue'
import Login from '@/views/login'
import Home from '@/views/home'
import Wellcome from '@/views/wellcome'
Vue.use(VueRouter)

const router = new VueRouter({
  // 路由匹配规则
  routes: [
    { path: '/login', name: 'login', component: Login },
    { path: '/',
      name: 'home',
      component: Home,
      redirect: '/wellcome',
      children: [
        { path: '/wellcome', name: 'wellcome', component: Wellcome }
      ]

    }

  ]
})

export default router
