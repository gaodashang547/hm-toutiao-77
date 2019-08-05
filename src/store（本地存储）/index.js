// 存储信息的时候：
// 1. 约定信息的KEY是什么  hm-toutiao-77-user
// 2. 存储信息的值是什么   用户信息对象 字符串格式json
// 3. 获取信息的值是什么    用户信息对象 json对象的形式
const KEY = 'hm-toutiao-77-user'

export default {
  setUser (user) {
    // 存储用户信息到sessionStorage（在用户刚刚登录的时候对用户的信息进行存储 views/login/index.vue）
    window.sessionStorage.setItem(KEY, JSON.stringify(user))
    // 注意  存储的是时候是要用json 字符创的形式来存储
    // 同时 从sessionStorage中取出使用的时候应该转换为json对象的格式也就是说是key：value的格式
  },
  getUser () {
    // 获取用户信息从sessionStorage，因为在存储的时候是json字符转的格式所以要转换为json对象的形式
    return JSON.parse(window.sessionStorage.getItem(KEY) || '{}')
  }
}

// 在登录的时候就是将用户信息保存在浏览器端
//  1 cookie  设置了有效期后 会在有效期结束之后存储的用户信息消失
//  2 localStorage  这是本地存储 永久性的生效
//  3 sessionStorage：它的特性是 在关闭浏览器之后 会话消失 再次打开浏览器之后
//    需要重新登录。
//  注意： 后台 对token 也有控制 2 小时之后就会消失
