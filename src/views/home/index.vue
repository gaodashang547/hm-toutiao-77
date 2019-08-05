<template>
  <el-container class="zhuti">
    <el-aside :width="isCollapse?'64px':'200px'">
      <div class="logo" v-bind:class="{min:isCollapse}"  ></div>
      <el-menu
        default-active="1"
        background-color="#001e32"
        text-color="#fff"
        active-text-color="#ffd04b"
        v-bind:collapse="isCollapse"
        :collapse-transition="false"

      >
        <el-menu-item index="/1">
          <i class="el-icon-menu"></i>
          <span slot="title">首页</span>
        </el-menu-item>
        <el-menu-item index="/2">
          <i class="el-icon-folder-opened"></i>
          <span slot="title">内容管理</span>
        </el-menu-item>
        <el-menu-item index="/3">
          <i class="el-icon-picture"></i>
          <span slot="title">素材管理</span>
        </el-menu-item>
        <el-menu-item index="/4">
          <i class="el-icon-tickets"></i>
          <span slot="title">发布文章</span>
        </el-menu-item>
        <el-menu-item index="/5">
          <i class="el-icon-chat-dot-round"></i>
          <span slot="title">评论管理</span>
        </el-menu-item>
        <el-menu-item index="/6">
          <i class="el-icon-user"></i>
          <span slot="title">粉丝管理</span>
        </el-menu-item>
        <el-menu-item index="/7">
          <i class="el-icon-s-tools"></i>
          <span slot="title">个人设置</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <span class="el-icon-s-fold" @click="dianji()"></span>
        <span class="text">江苏传智博客科技教育有限公司</span>
        <el-dropdown class="my-dropdown">
          <!-- <img src="../../assets/images/avatar.jpg" alt=""> -->
          <span class="el-dropdown-link">
            <img src="../../assets/images/avatar.jpg" alt />
            用户名称
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item class="el-icon-setting icon">个人设置</el-dropdown-item>

            <el-dropdown-item class="el-icon-unlock icon">退出登陆</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>

      <el-main>
      <router-view></router-view>
      </el-main>
    <!-- 上面是 主页 欢迎页面的视图出口 -->
    </el-container>
  </el-container>
</template>

<script>
export default {
  data: function () {
    return { isCollapse: false }
  },
  methods: {
    dianji: function () {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>

<style lang="less" scoped>
.zhuti {
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
.el-aside {
  background-color: #001e32;
}

.el-header {
  border-bottom: 1px solid #ddd;
  line-height: 60px;
  .el-icon-s-fold {
    font-size: 24px;
    vertical-align: middle;
  }
  .text {
    vertical-align: middle;
    padding-left: 10px;
  }
  .my-dropdown {
    float: right;
    img {
      width: 30px;
      height: 30px;
      vertical-align: middle;
    }
    .el-dropdown-link {
      font-weight: bold;
    }
  }
}
.logo {
  width: 100%;
  height: 60px;
  background-color: #002143;
  background: url("../../assets/images/logo_admin.png") no-repeat center;
}
.min{
  background-image:url('../../assets/images/logo_admin_01.png');
  background-size:30px 30px;
}
.el-menu{
  border-right:none
}
.icon{
  display:block;

}

.el-icon-setting:before{
  margin-right: 10px
}
.el-icon-unlock:before{
  margin-right:10px
}
</style>
