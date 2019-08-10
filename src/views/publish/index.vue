<template>
  <div id="pub-container">
    <el-card>
      <div slot="header">
          <!-- 使用面包屑的封装组件 -->
        <my-bread>发布文章</my-bread>
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
          <el-radio-group v-model="article.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
         <!-- 这里用来放置素材组件 -->
         <my-image></my-image>
        </el-form-item>
        <el-form-item label="频道：">
            <my-channel v-model="article.channel_id"></my-channel>
        </el-form-item>
        <el-form-item>
            <el-button type="primary">发表</el-button>
            <el-button >存入草稿</el-button>
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
        title: null,
        cover: {
          type: 1,
          image: []
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
      }
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
