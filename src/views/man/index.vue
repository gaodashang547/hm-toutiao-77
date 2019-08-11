<template>
  <div id="container">
    <el-card>
      <div slot="header">
        <my-bread>个人设置</my-bread>
      </div>
      <!-- 下面这是element-ui提供栅格系统将整个页面分成了24份在个人设置这个模块重是均分成两个部分
      故 各占12分-->
      <el-row>
        <el-col :span="12">
          <!-- 表单 -->
          <el-form label-width="120px">
            <el-form-item label="编号：">{{userForm.id}}</el-form-item>
            <el-form-item label="手机：">{{userForm.mobile}}</el-form-item>
            <el-form-item label="媒体名称">
              <el-input v-model="userForm.name"></el-input>
            </el-form-item>
            <el-form-item label="媒体介绍">
              <el-input type="textarea" :rows="5" v-model="userForm.intro"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="userForm.email"></el-input>
            </el-form-item>
              <el-form-item>
            <el-button type="primary" @click="saveUserInfo">保存设置</el-button>
             </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <!-- 上传组件 -->
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
          >
            <img v-if="userForm.photo" :src="userForm.photo" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <p style="text-align:center;font-size:18px;">修改头像</p>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script >
import store from '@/store（本地存储）'
import eventBus from '@/components (公用级别的组件 )/eventBus'
export default {
  data () {
    return {
      userForm: {
        name: '',
        intro: '',
        email: '',
        id: '',
        mobile: '',
        photo: ''
      },
      imageUrl: null
    }
  },
  created () {
    //   将用户信息渲染到页面上
    this.getUserInfo()
  },
  methods: {
    //   获取用户信息
    async getUserInfo () {
      const { data: { data } } = await this.$http.get('user/profile')
      this.userForm = data
    },
    // 保存用户信息
    async saveUserInfo () {
      // patch 请求是局部请求
      await this.$http.patch('user/profile', {
        // 安装后台需要的提交的数据
        name: this.userForm.name,
        intro: this.userForm.intro,
        email: this.userForm.email
      })
      this.$message.success('保存设置成功')
      //   当你刷新页面的时候HOME组件使用本地存储 更新本地存储
      store.setUser({ name: this.userForm.name })
      eventBus.$emit('updateName', this.userForm.name)
    }
  }
}
</script>

<style scoped  lang="less" >
</style>
