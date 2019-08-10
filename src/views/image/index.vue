<template>
  <div class="container">
    <el-card>
      <div slot="header">
        <my-bread>素材管理</my-bread>
      </div>
      <div class="btn">
        <el-radio-group v-model="reqParams.collect" @change="changeCollect" size="small">
          <el-radio-button :label="false">全部</el-radio-button>
          <el-radio-button :label="true">收藏</el-radio-button>
        </el-radio-group>
        <el-button type="success" size="small" style="float:right" @click="tianjia">添加素材</el-button>
      </div>
      <div class="img_list">
        <div class="img_item" v-for="item in images" :key="item.id">
          <img :src="item.url" alt />
          <div class="foot">
            <span
              class="el-icon-star-off"
              :class="{selected:item.is_collected}"
              @click="toggle(item)"
            ></span>
            <span @click="deletes(item.id)" class="el-icon-delete"></span>
          </div>
        </div>
      </div>
      <el-pagination
        v-if="total > reqParams.per_page"
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="reqParams.per_page"
        :current-page="reqParams.page"
        @current-change="changePager"
      ></el-pagination>
    </el-card>
    <el-dialog title="添加素材" :visible.sync="dialogVisible" width="400px">
      <el-upload
        class="avatar-uploader"
        action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :headers="head"
        name="image"
      >
        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import store from '@/store（本地存储）'
export default {
  data () {
    return {
      // 提交参数
      reqParams: {
        // 默认为全部选中
        collect: false,
        page: 1,
        per_page: 10
      },
      //  图片列表数据
      images: [],
      //  总条数
      total: 0,
      //  控制添加素材的对话框的显示与隐藏
      dialogVisible: false,
      //   图片上传成功的地址
      imageUrl: null,
      //  由于上传用户头像时 需要携带 token 所以要重新设置 上传组件的头部信息
      head: {
        Authorization: `Bearer ${store.getUser().token}`
      }
    }
  },
  created: function () {
    //   获取列表素材
    this.getImages()
  },
  methods: {
    deletes (id) {
      // 点击图标删除图片
      this.$confirm('您确定要进行此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await this.$http.delete(
            `http://ttapi.research.itcast.cn/mp/v1_0/user/images/${id}`
          )
          this.$message.success('您已经成功删除')
          this.getImages()
        })

        .catch(() => {})
    },
    // 添加收藏  或者是取消收藏
    async toggle (item) {
      const {
        data: { data }
      } = await this.$http.put(
        `http://ttapi.research.itcast.cn/mp/v1_0/user/images/${item.id}`,
        { collect: !item.is_collected }
      )
      // 在这里提示 信息是否成功
      this.$message.success(data.collect ? '添加收藏成功' : '取消收藏')
      //  更新当前图片状态
      item.is_collected = data.collect
    },

    //  上传头像成功后要做什么 的函数
    handleAvatarSuccess (res) {
      // 获取图片地址显示img标签
      // 通过 console.log(res)可以获取图片地址 res.data.url
      this.imageUrl = res.data.url
      // 提示上传成功
      this.$message.success('图片上传成功')
      //   设置一个一次性的定时器 2s后关闭对话框 并更新图片列表
      window.setTimeout(() => {
        this.dialogVisible = false
        this.reqParams.page = 1
        this.getImages()
      }, 2000)
    },

    tianjia () {
      // 上传完图片之后 再次打开啊上传图片的 组件应当将当前的imgUrl 设置成空 也就是清空图片
      this.imageUrl = null
      // 添加素材的点击事件 dialogVisible 默认是false 是隐藏的
      // 在这个这个函数中做了一件事 就是将dialogVisible 的值改为true
      // 用来控制上传素材对话框的显示与隐藏
      this.dialogVisible = true
    },
    //  点击收藏与全部按钮之间的切换
    changeCollect () {
      this.reqParams.page = 1
      this.getImages()
    },
    //   点击分页按钮 触发事件  当前的显示页等于一个新页 并重新请求图片显示页面
    changePager (newPage) {
      this.reqParams.page = newPage
      //   console.log(13)
      this.getImages()
    },
    async getImages () {
      const {
        data: { data }
      } = await this.$http.get(
        'http://ttapi.research.itcast.cn/mp/v1_0/user/images',
        { params: this.reqParams }
      )
      this.images = data.results
      this.total = data.total_count
    }
  }
}
// <img v-if="imageUrl" :src="imageUrl" class="avatar">
// <i v-else class="el-icon-plus avatar-uploader-icon"></i>
// 如果图片上传成功了 就像是图片   如果图片上传失败了 就显示 十字行图片

// 分析：在上传图片的组件中
//   action 上传图片的接口地址根据文档可以查询到，el-upload自己发送请求 则需要完整的路径地址
// 同时在上传图片的时候 需要设置请求头 加上认证信息  也就是要设置token
// :on-success="handleAvatarSuccess"   这个是上传成功时候的回调函数
// img标签， 上传成功之后预览图片的位置，imageUrl赋值上传成功之后的图片地址
//    imageUrl 默认是null时 看到的是上传图片是的十字图标
//    imageUrl 上传成功后有值 看到的是上传图片后的预览
// name="image" z在上传的过程中后台所接受的也就是所需要的名称字段是image
// :headers="head" 在上传用户头像的时候设置请求头
</script>
<style scoped lang="less">
.img_list {
  margin-top: 30px;
}
.img_item {
  height: 200px;
  width: 200px;
  border: 1px dashed #ddd;
  position: relative;
  display: inline-block;
  margin-right: 70px;
  margin-bottom: 30px;
}
.img_item img {
  height: 100%;
  width: 100%;
  display: block;
}
.foot {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 30px;
  line-height: 30px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  text-align: center;
}
span {
  margin: 0 20px;
}
.selected {
  color: red;
}
</style>
