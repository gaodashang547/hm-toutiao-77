<template>
  <div id="my-image">
    <!-- 这是一个图片按钮 -->
    <div class="img-btn" @click="open">
      <img :src="value||defaultImageUrl" alt />
    </div>
    <!-- 这里是element-ui 提供的对话框 -->
    <el-dialog title="选择素材" :visible.sync="dialogVisible" width="700px">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="素材库" name="image">
          <el-radio-group v-model="reqParams.collect" size="mini" @tab-click="collectChange">
            <el-radio-button :label="false">全部</el-radio-button>
            <el-radio-button :label="true">收藏</el-radio-button>
          </el-radio-group>
          <div class="img-list">
            <div
              class="img-item"
              :class="{selected:selectedImageUrl===item.url}"
              @click="selectedUrl(item.url)"
              v-for="item in images"
              :key="item.id"
            >
              <img :src="item.url" alt />
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
          </div>
        </el-tab-pane>
        <el-tab-pane label="上传图片" name="upload">
          <el-upload
            class="avatar-uploader"
            action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :headers="head"
            name="image"
          >
            <img v-if="uploadImageUrl" :src="uploadImageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-tab-pane>
      </el-tabs>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="comfirmImage()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import defaultImageUrl from '../assets/images/default.png'
import store from '@/store（本地存储）'
export default {
  name: 'my-image',
  props: ['value'],
  data () {
    return {
      // 控制对话框的显示与隐藏
      dialogVisible: false,
      // 控制选中的选项卡，选项卡的那么的值
      activeName: 'image',
      // 传递的参数
      reqParams: {
        page: 1,
        per_page: 8,
        collect: false
      },
      //  图片的列表数据
      images: [],
      total: 0,
      // 设置一个属性 来记录点击图片的url地址，
      selectedImageUrl: null,
      head: {
        Authorization: `Bearer ${store.getUser().token}`
      },
      // 这是记录图片上传的地址
      uploadImageUrl: null,
      // 在这里记录封面图的地址
      // value: defaultImageUrl
      defaultImageUrl
    }
  },
  methods: {
    //  确认图片
    comfirmImage () {
      // 让图片按钮能够显示你选中的或者是上传的图片地址
    // vue 3.0  是基于webpack的 他会打包所有资源 如果 src 绑定的是数据  则  不会去打包背后的资源的
    // 只是会去打包 url js文件 或者是利用import 导入的资源  它才会去打包的

      //  这个现实封面的逻辑就是  利用if进行判断  当它 的选项卡的名字是叫做image的时候它的默认的url地址
      //  就是会用它在全部中选中勾选的那张图片的url地址 如果 它的选项卡的名字不是叫做image的时候 ，则它的默认
      //  的url地址就或会用上传图片的url地址
      if (this.activeName === 'image') {
        // this.value = this.selectedImageUrl
        this.$emit('input', this.selectedImageUrl)
        // 子组件向父组件传值
      } else {
        // this.value = this.uploadImageUrl
        this.$emit('input', this.uploadImageUrl)
      }
      this.dialogVisible = false
    },
    // 成功的上传图片是触发的函数
    handleAvatarSuccess (res) {
      // 图片的预览
      this.uploadImageUrl = res.data.url
    },
    //  设置成这个选中的图片地址 就等同于当前点击的图片的地址
    selectedUrl (url) {
      this.selectedImageUrl = url
    },
    // 这是点击图片按钮 弹出对话框将dialogVisible的值改为true
    open () {
      this.dialogVisible = true
      // 在上传成功之后  在此打开对话框原有的重重标记 应当全部都清空
      // 所以 要将它 的选中图片的地址和在上传的地址均设置成null
      this.selectedImageUrl = null
      this.uploadImageUrl = null
      // 这是获取素材列表数据
      this.getImages()
    },
    // 这是获取图片
    async getImages () {
      const {
        data: { data }
      } = await this.$http.get('user/images', { params: this.reqParams })
      this.images = data.results
      this.total = data.total_count
    },
    // 这是点击切换全部与收藏时触发的事件
    collectChange () {
      this.reqParams.page = 1
      this.getImages()
    },
    // 这是切换分页的时候触发的事件
    changePager (newPage) {
      this.reqParams.page = newPage
      this.getImages()
    }
  }
}
</script>

<style lang="less" scoped>
#my-image{
  display:inline-block;
  margin-right:30px;
}

.img-btn {
  width: 170px;
  height: 170px;
  border: 1px dashed pink;
  position: relative;
  img {
    width: 100px;
    height: 100px;
    display: block;
    position: absolute;
    left: 35px;
    top: 35px;
  }
}
.dialog-footer {
  text-align: center;
  display: block;
  width: 100%;
}
.img-list {
  margin-top: 10px;
}
.img-item {
  width: 140px;
  height: 120px;
  border: 1px dashed #ddd;
  display: inline-block;
  margin-right: 15px;
  margin-bottom: 10px;
  position: relative;
  &.selected {
    &::after {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.2) url("../assets/images/selected.png")
        no-repeat center/50px 50px;
      //   利用双伪元素 给要遍历的img-item 添加一个叫做selected的类，同时给要遍历的img-item 绑定一个事件当点击图片的时候
      // 触发这个事件函数 设置一个属性来记录图片的url地址 同时在进行判断当记录的图片的地址等同于当前点击的图片地址
      // 时  给img-item  添加上selected这个类 同时已经给这个类设置了样式 当添加上这个类的时候  就出现了点击图片选中打勾 的效果
    }
  }
  img {
    width: 100%;
    height: 100%;
    display:  block;
    object-fit: contain;
  }
}
</style>
