// 配置一个axios  导出一个配置好的axios
import axios from 'axios'
import store from '@/store（本地存储）'
import router from '@/router（路由）'
import JSONBig from 'json-bigint'
// 下载并引入 json-bigint 这个第三方包并进行配置通过这个第三方包来解决
// 超过js的最大安全值 也就是说来解决ID值不匹配的问题
// 进行配置
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'
axios.defaults.transformResponse = [
  (data) => {
    // data  此时是后台返回给我们的数据
    // data 如果后台没有返回数据 此时data是null
    // JSONBig.parse(null) 报错 阻止程序运行
    // 在这里 通过try{}catch(){}  来捕获异常  如果 后台返回的data是个null 并且没有通过try{}catch(){}来进行捕获异常
    // 则上述中格式转换会报错 阻止程序的继续往下执行 若是捕获了异常则直接接返回一个原有data 即可
    try {
      return JSONBig.parse(data)
    } catch (e) {
      return data
    }
  }
]
// 只会执行一次
// axios.defaults.headers = {
//   Authorization: `Bearer ${store.getUser().token}`
// }
// 在每次请求之前，获取token信息，追加在headers中
// 请求拦截器：在每次请求前 做某一些事情
axios.interceptors.request.use((config) => {
  // 修改config
  config.headers = {
    Authorization: `Bearer ${store.getUser().token}`
  }
  // alert(0)
  // console.log(config)

  return config
}, (error) => {
  // 错误处理
  return Promise.reject(error)
})
// 响应拦截器：在每次响应后 做某一些事情
axios.interceptors.response.use((res) => {
  // 成功的时候做一些事情
  return res
}, (err) => {
  // 失败的时候做一些事情
  // 获取响应状态码 err对象包含响应对象  err.response
  // 响应对象中包含状态码  err.response.status
  if (err.response.status === 401) {
    // 跳转到登录页面 this.$router.push('/login')
    // 方式1：
    // $router.push('/login') 其实 地址栏改成  #/login
    // location.hash = '#/login'
    // 方式2：
    // 此时没有vue实例，$router对象获取不到，通过router实例直接使用
    router.push('/login')
  }
  return Promise.reject(err)
  // promise。reject（） 这是返回一个失败的promise对象
  // Promise.rslove() 这是返回一个成功的promise对象
  // reject 是在失败的时候应该调用的回调函数
  // reslove 是在成功的时候应该调用的回调函数
  // promise.then（成功）
  // promise.catch（失败）
})

// 进行导出
export default axios
