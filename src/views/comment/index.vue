<template>
  <div id="container">
    <el-card>
      <div slot="header">
        <my-bread>内容管理</my-bread>
      </div>
      <el-table v-bind:data="coments">
        <el-table-column label="标题" prop="title"></el-table-column>
        <el-table-column label="总评论数" prop="total_comment_count"></el-table-column>
        <el-table-column label="粉丝品论数" prop="fans_comment_count"></el-table-column>
        <el-table-column label="状态">
           <template slot-scope="scope">
            {{scope.row.comment_status?'正常':'关闭'}}
          </template>
        </el-table-column>
        <el-table-column label="操作" >
            <template slot-scope="scope">
                <el-button @click="toggleStatus(scope.row)" v-if="!scope.row.comment_status" type="success" size="small">打开评论</el-button>
                <el-button @click="toggleStatus(scope.row)" v-else type="danger" size="small">关闭评论</el-button>
            </template>
            <!-- 上述是作用域插槽 根据约定是需要用template对其进行包裹 -->
        </el-table-column>
      </el-table>
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
  </div>
</template>
<script>
export default {
  data () {
    return {
      reqParams: {
        response_type: 'comment',
        page: 1,
        per_page: 20
      },
      //   先声明一个列表数据 默认为空数组
      coments: [],
      total: 0
    }
  },
  //   在created这个生命周期中来渲染数据列表
  created () {
    this.getComments()
  },
  methods: {
    //  根据文档向后台发送请求 来获取列表数据
    async getComments () {
      const { data: { data } } = await this.$http.get('http://ttapi.research.itcast.cn/mp/v1_0/articles', { params: this.reqParams })
      //  根据文档可以看到 需要渲染人列表数据 也就是请求返回的数据中的data.results 所以
      // 发送请求成功之后 对提前声明的数据列表进行赋值，分页功能中的总页数 就是数据返回的data.total_count
      this.coments = data.results
      this.total = data.total_count
    },
    // 分页功能 触发这个函数并传入一个newPage参数 并设置    this.reqParams.page = newPage 同时更新列表数据
    changePager (newPage) {
      this.reqParams.page = newPage
      //   console.log(13)
      this.getComments()
    },
    //  切换打开  关闭评论功能
    async toggleStatus (row) {
      const { data: { data } } = await this.$http.put(`comments/status?article_id=${row.id}`,
        { allow_comment: !row.comment_status })
      this.$message.success(data.allow_comment ? '打开评论成功' : '关闭评论成功')
      // 根据后台给出的data.allow_comment的真假状态 给出相应的文字提示
      row.comment_status = data.allow_comment
      // 通过利用当前状态相等于后台返回的状态 来对该行数据进行更新
    }
  }
}

</script>
<style lang="less" scoped>
</style>
