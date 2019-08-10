// 注册所有components下的组件成为全局组件
import MyBread from '@/components (公用级别的组件 )/my-bread'
import MyChannel from '@/components (公用级别的组件 )/my-channel'
import MyImage from '@/components (公用级别的组件 )/my-image'

export default {
  install (Vue) {
    // 安装函数 当Vue.use(使用插件) install 被调用
    // Vue 全局的vue对象
    Vue.component(MyBread.name, MyBread)
    Vue.component(MyChannel.name, MyChannel)
    Vue.component(MyImage.name, MyImage)
  }
}
