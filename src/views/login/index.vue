<template>
  <div id="container">
    <el-card class="my-card">
      <img src="../../assets/images/logo_index.png" alt />
      <el-form ref="loginForm" :model="loginForm" v-bind:rules="loginRules" status-icon>
        <el-form-item prop="mobile">
          <el-input v-model="loginForm.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input
            v-model="loginForm.code"
            placeholder="请输入验证码"
            style="width:230px;margin-right:18px"
          ></el-input>
          <el-button>发送验证码</el-button>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-bind:value="true">我已阅读并同意用户协议和隐私条款</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width:100%;margin-top
          :-30px;" @click="login()">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import store from '@/store（本地存储）'
export default {
  data: function () {
    // 自定义校验规则：
    //   validator：valiatePass来制定校验函数
    // 但是要切记自定义函数要在return之前来定义函数
    // 函数的约定：fn（rule，valuecallback）
    // 1. rule 是应用当前字段的校验对象 不会使用
    // 2 value 字段的指
    // 3 callback回调函数
    //  1 校验成功 callback（）
    //  2 如果是校验失败，callback（new Error（'失败时候的提示内容'））

    //  申明校验函数  在return之前

    const checkMobile = (rule, value, callback) => {
      if (!/^1[3-9]\d{9}$/.test(value)) {
        // 利用正则表达式
        return callback(new Error('您输入的号码格式不对'))
      } // 如果失败了 在直接return 并返回一个失败时所提出的的信息内容

      callback()
    }
    return {
      loginForm: {
        mobile: '13911111111',
        code: '246810'
      },
      // Form组件提供了表单验证的功能，只是需要通过rules属性传入约定的验证规则，并将Form-item属性传入的prop
      // 设置为需要校验的字段名即可
      // 得到：
      //  1 el-from家属性rules绑定数据 传入约定的验证规则
      //  2 el-from-item 指定一个属性prop值是字段的名称

      // 表单校验规则数据
      loginRules: {
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { len: 6, message: '*长度是6位数*', trigger: 'blur' }
        ]
      }
    }
  },
  //  这是对于整体的表单进行校验 通过element-ui提供的form表单组件提供的方法利用当前组件去调用
  // validate这个方法   this.$refs.当前的组件.validata（（参数）=>{}）
  methods: {
    login: function () {
      this.$refs.loginForm.validate((asd) => {
        // 这里this.$refs 它会找到当前所有表示ref属性的元素 通过获取DOM对象 才能用这个DOM对象来调用组件中提供的方法
        if (asd) {
          this.$http.post('http://ttapi.research.itcast.cn/mp/v1_0/authorizations', this.loginForm).then(res => {
            // console.log('校验成功')
            // 如果校验成功 则页面跳转去首页
            // console.log(res.data)
            // res 相应对象  包含相应主体
            store.setUser(res.data.data)

            this.$router.push('/')
          })
            .catch(() => {
              this.$message.error('手机号或密码错误哦，亲！')
            })
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
#container {
  position: absolute;
  width: 100%;
  height: 100%;
  // 背景图定位 / 背景图尺寸 contain 等比缩放完整在容器内显示  cover  等比缩放完全铺面容器
  background: url(../../assets/images/login_bg.jpg) no-repeat center / cover;
}

.my-card {
  width: 400px;
  height: 340px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.my-card img {
  display: block;
  width: 200px;
  margin: 0 auto;
  margin-bottom: 10px;
}
</style>
