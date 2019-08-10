// 定义一个router对象 导出给main.js使用
import VueRouter from 'vue-router'
import Vue from 'vue'

import Login from '@/views/login'
import Home from '@/views/home'
import Wellcome from '@/views/wellcome'
import Article from '@/views/article'
import Image from '@/views/image'
import NotFound from '@/views/404'
import store from '@/store（本地存储）'
Vue.use(VueRouter)

const router = new VueRouter({
  // 路由匹配规则
  routes: [
    { path: '/login', name: 'login', component: Login },
    { path: '/',
      name: 'home',
      component: Home,
      redirect: 'wellcome',
      children: [
        { path: '/wellcome', name: 'wellcome', component: Wellcome },
        { path: '/content', name: 'article', component: Article },
        { path: '/image', name: 'image', component: Image }
      ]
    },
    // 处理404
    { path: '*', name: '404', component: NotFound }
  ]
})
router.beforeEach((to, from, next) => {
  // // 1. 判断是不是登录路由
  // if (to.path === '/login') return next()
  // // 2. 判断是否登录
  // if (!store.getUser().token) return next('/login')
  // // 3. 放行
  // next()
  if (to.path !== '/login' && !store.getUser().token) return next('/login')
  next()
})

export default router
