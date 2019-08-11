<template>
  <div id="pub-container">
    <el-card>
      <div slot="header">
          <!-- 使用面包屑的封装组件 -->
        <my-bread>{{articleId?"修改文章":"发布文章"}}</my-bread>
      </div>
      <el-form label-width="100px">
        <el-form-item label="标题：">
          <el-input v-model="article.title" style="width:400px"></el-input>
        </el-form-item>
        <el-form-item label="内容：">
             <quill-editor v-model="article.content"  :options="editorOption"></quill-editor>
      <!--  这里上述的代码是用来实现呈现出富文本的 首先在绑定个options的属性 -->
        </el-form-item>
        <el-form-item label="封面：">
          <el-radio-group v-model="article.cover.type" @change="changeType">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
         <!-- 这里用来放置素材组件 -->
         <!-- 封装后的组件的使用 对 article.cover.type的值进行判断当type的值等于1 的时候使用单图
         当type的值等于3的时候 则使用到的是三图 也就是将自己封装后的my-image这组件进行3次的复用 -->
        <div v-if="article.cover.type===1">
             <my-image v-model="article.cover.images[0]"></my-image>
        </div>
         <div v-if="article.cover.type===3">
             <my-image v-model="article.cover.images[0]"></my-image>
             <my-image v-model="article.cover.images[1]"></my-image>
             <my-image v-model="article.cover.images[2]"></my-image>
        </div>
        </el-form-item>
        <el-form-item label="频道：">
            <my-channel v-model="article.channel_id"></my-channel>
        </el-form-item>
        <el-form-item v-if="!this.articleId">
            <el-button type="primary" @click="submit(false)">发表</el-button>
            <el-button @click="submit(true)">存入草稿</el-button>
        </el-form-item>
        <el-form-item v-else>
            <el-button type="success" @click="updated(false)">修改</el-button>
            <el-button @click="updated(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
//  这里是下载并引入了 一个第三方包，
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'

export default {
  components: {
    quillEditor
  },
  //    将第三方进行了注册 用来富文本的实现
  data () {
    return {
      article: {
        content: null,
        title: null,
        cover: {
          type: 1,
          // 这是图片列表
          images: []
        },
        channel_id: null
      },
      //   此处是在npm 文档中查询可知 如何去配置一个富文本的
      // 首先在要标签中动态的绑定一个属性： :options="editorOption"
      // 然后在data中去声明 这个属性 已及 总文档中声明的配置项
      editorOption: {
        placeholder: '',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'header': 1 }, { 'header': 2 }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            ['image']
          ]
        }
      },
      // 修改文章时 所需要的参数也就是说文章ID
      articleId: null
    }
  },

  watch: {
    // 不仅仅是data找那个的数据可以去监听 $route 实例的数据也是可以的
    $route () {
      if (!this.$route.query.id) {
        // 当 地址栏中没有id 则应当将文章的ID设置成null同时恢复默认数据
        this.articleId = null
        this.article = {
          content: null,
          title: null,
          cover: {
            type: 1,
            // 这是图片列表
            images: []
          },
          channel_id: null
        }
      }
    }
  },

  created () {
    // 当文件初始化完成的时候 立刻去地址栏中获取参数
    // 在这里 router 是获取方法的 而 route才是获取具体的数据 或者是值的
    this.articleId = this.$route.query.id
    // 如果有id  就修改文章 获取当前数据
    if (this.articleId) {
      this.getArticleId()
    }
  },

  methods: {
    //  这里是获取指定的文章数据
    async  getArticleId () {
      const { data: { data } } = await this.$http.get('articles/' + this.articleId)
      this.article = data
    },
    // 在根据选择的cover.type的值不同 在选择的同时 将获取到的图片列表设置成空数组即可
    changeType () {
      // 重置图片数据
      this.article.cover.images = []
    },
    async  submit (draft) {
      await this.$http.post(`articles?draft=${draft}`, this.article)
      this.$message.success(draft ? '文章存入草稿成功' : '文章发布成功')
      // 发表成功后跳转到内容管理页面
      this.$router.push('/content')
    },
    //   通过接口文档可以得知到在发送请求时 在query中进行传参时 通过判断draft的true或者是
    // false 来区分到底是发表文章还是存入草稿中去  fslse 则是代表了发表文章  而true则是代表了 、
    // 存入草稿
    async  updated (draft) {
      await this.$http.put(`articles/${this.articleId}?draft=${draft}`, this.article)
      this.$message.success(draft ? '文章存入草稿成功' : '文章修改成功')
      // 发表成功后跳转到内容管理页面
      this.$router.push('/content')
    }
  }

}
</script>
<style lang="less" scoped>
  .img-btn{
      width:170px;
      height:170px;
      border:1px dashed pink;
      position: relative;
    img {
        width: 100px;
        height: 100px;
        display: block;
        position: absolute;
        left:35px;
        top:35px;
     }
    }
</style>
