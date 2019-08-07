<template>
  <div id="container">
    <el-card>
      <div slot="header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-form label-width="90px" size="small">
        <el-form-item label="状态：">
          <el-radio-group v-model="reqParams.status">
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道：">
          <el-select v-model="reqParams.channel_id" placeholder="请选择">
            <el-option
              v-for="item in channelOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期：">
          <el-date-picker
            v-model="dateArr"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">筛选</el-button>
        </el-form-item>
      </el-form>
    </el-card>

  <el-card>
    <div slot="header">根据条件查询共查询到{{total}}条结果：</div>
    <!-- 表格组件 -->
     <el-table v-bind:data="articles">
       <el-table-column  label="封面" prop="img" >
         <template slot-scope="scope">
          <el-image v-bind:src="scope.row.cover.images[0]" fit="cover" style='width:120px;height:80px'>
           <div slot="error" class="image-slot">
             <img src="../../assets/images/error.gif" style='width:120px;height:80px' alt="">
          </div>
        </el-image>
           </template>
          </el-table-column>
          <el-table-column label="标题" prop="title"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status===0" type="info">草稿</el-tag>
              <el-tag v-if="scope.row.status===1" type="">待审核</el-tag>
              <el-tag v-if="scope.row.status===2" type="success">审核通过</el-tag>
              <el-tag v-if="scope.row.status===3" type="warning">审核失败</el-tag>
              <el-tag v-if="scope.row.status===4" type="danger">删除</el-tag>
            </template>1

          </el-table-column>
          <el-table-column label="发布时间" prop="pubdate"></el-table-column>
          <el-table-column label="操作" prop="img">
           <template slot-scope="scope">
             <el-button type="primary" icon="el-icon-edit" circle></el-button>
             <el-button type="danger" icon="el-icon-delete" @click="del(scope.row.id)" ></el-button>
           </template>
           </el-table-column>
       </el-table>
    <!-- 分页组件 -->
    <div style="text-align:center; margin-top:30px;">
  <el-pagination
       background
       layout="prev, pager, next"
       v-bind:page-size="reqParams.per_page"
       :total="total"
       @current-change='changePager' >
       <!-- ：total='1000' 这是指定了总条数 -->
       <!-- 默认一页显示10条 ：page-size='reqParams.per_page' 这样可以不用写死 与数据data中形成了一种相对应的形式 -->
    </el-pagination>
    </div>

  </el-card>

   </div>
</template>
<script>
export default {
  data () {
    return {
      // 筛选项表单数据  提交给后台参数
      reqParams: {
        status: null,
        channel_id: null,
        begin_pubdate: null,
        end_pubdate: null,
        page: 1,
        per_page: 20
      },
      // 频道下拉选项数据
      channelOptions: [
      ],
      // 日期数据
      dateArr: [],
      // 这是文章列表数据
      articles: [],
      // 这是文章列表的总条数
      total: 0

    }
  },
  // 获取频道下拉选项数据
  created: function () {
    this.getChannelOptions()
    // 获取文章列表数据
    this.getArtciles()
  },
  methods: {
    // 改变分页时间所对应的的函数
    changePager (newPage) {
      this.reqParams.page = newPage
      this.getArtciles()
    },

    async getChannelOptions () {
      const { data: { data } } = await this.$http.get('http://ttapi.research.itcast.cn/mp/v1_0/channels')
      this.channelOptions = data.channels
    },
    // axios get传参 url?key=value$key=value..
    // axios  get传参 第二传参是对象{params:指定的参数对象} 发送请求的时候会自动拼接在地址后面
    async getArtciles () {
      const { data: { data } } = await this.$http.get('/articles', { params: this.reqParams })
      // 这是获取总共的文章列表
      this.articles = data.results
      // 这是文章的总数据（有多少条）
      this.total = data.total_count
    }
  }
}
</script>
<style scoped  lang="less"  >
   .el-card{
     margin-top:40px;
   }
</style>
