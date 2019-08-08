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
          <el-select v-model="reqParams.channel_id" placeholder="请选择" clearable>
            <el-option
              v-for="item in channelOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 在给后台传递日期的时候 是以TTue Aug 13 2019 00:00:00 GMT+0800 (中国标准时间)
        这种标准格式向后台传递的 而后台的数据接口却无法解读 所以element-ui 则提供了一种属性
        value-format="yyyy-MM-dd" 可以将标准格式的时间转化为年月日的格式-->
        <el-form-item label="日期：">
          <el-date-picker
            v-model="dateArr"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="changeDate"
            value-format="yyyy-MM-dd"
          ></el-date-picker>

        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="shuaixuan">筛选</el-button>
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
              <!-- 作用于插槽 一般都是用template进行包裹  给其标签内部设置slot-scope="scope"
                 通过scope.row 来获取想要获取到的值
                -->
              <el-tag v-if="scope.row.status===0" type="info">草稿</el-tag>
              <el-tag v-if="scope.row.status===1" type="">待审核</el-tag>
              <el-tag v-if="scope.row.status===2" type="success">审核通过</el-tag>
              <el-tag v-if="scope.row.status===3" type="warning">审核失败</el-tag>
              <el-tag v-if="scope.row.status===4" type="danger">删除</el-tag>
            </template>

          </el-table-column>
          <el-table-column label="发布时间" prop="pubdate"></el-table-column>
          <el-table-column label="操作" prop="img">
           <template slot-scope="scope">
             <!-- 给跳转图标设置点击事件并将参数（也就是需要跳转的文章的id）传递进去 -->
             <el-button type="primary" icon="el-icon-edit" @click="tiao(scope.row.id)" circle></el-button>
             <el-button type="danger" icon="el-icon-delete" @click="del(scope.row.id)" circle ></el-button>
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
       <!-- current-change 这是element-ui 中提供的 事件 -->
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
  // computed 计算属性使用的场景：当你需要一个新的数据 需要依赖data中的数据
  // watch 侦听器的使用场景：当你需要监听一个属性的值的变化时，去做一些开销较大的操作（异步操作）
  watch: {
    'reqParams.channel_id': function (newVal, oldVal) {
      if (newVal === '') {
        this.reqParams.channel_id = null
      }
    }
  },
  // 获取频道下拉选项数据
  created: function () {
    this.getChannelOptions()
    // 获取文章列表数据
    this.getArtciles()
  },
  methods: {
    // 点击图标删除文章
    del (id) {
      // 弹出确认框 点击确认后发 送删除请求  相应成功后涮新文章列表
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const abc = await this.$http.delete(`/articles/${id}`)
        console.log(abc)

        this.$message.success('您已删除文章成功')
        this.getArtciles()
      }).catch(() => {})
      // 在点击删除按钮后通过控制台发现我们发送的初始id值和后台通过json.parse转换后
      // 返回给我们通过axios获取的id值对应不上，Id的数值超出了js的最大安全值
      // 最大安全值：
      //  Number.MAX_SAFE_INTEGER   如果超出了最大安全值的计算和转换 都会出现误差 并报错
    },
    // 点击编辑按钮进行跳转 在跳转的同时 需要将文章的id一同传递获取所以要在地址后面 进行字符串的拼接
    // 将文章的id 拼接在地址的后面
    tiao (id) {
      this.$router.push('/publish?id=' + id)
    },
    //   筛选时日期的控制
    changeDate (dateArr) {
      if (dateArr) {
        this.reqParams.end_pubdate = dateArr[1]
        this.reqParams.begin_pubdate = dateArr[0]
      } else {
        this.reqParams.begin_pubdate = null
        this.reqParams.end_pubdate = null
      }

      console.log(dateArr)
    },
    // 根据条件进行筛选从新渲染页面
    shuaixuan () {
      this.reqParams.page = 1
      this.getArtciles()
    },
    // 改变分页时间所对应的的函数
    changePager (newPage) {
      this.reqParams.page = newPage
      this.getArtciles()
    },
    // 在发送请求时 使用asyn 和使用await的条件是
    //  1 必须是是用promise对象的时候
    //  2 给返回promise的函数前 加上await关键字，用来直接获取到成功的结果
    //  3 但是是用await这个关键字的函数之外 必须是加上asyn的这个关键字来进行曲修饰
    //
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
    // 使用作用于插槽 results之外的数据 articles掺入了表格组件，帮你做了遍历，每一项数据插槽 row=“每一项数据”
    // 所以使用每一项数据 其实就是组件内部的数据  通过scope.row 来获取想要获取到的数据
    }
  }
}
</script>
<style scoped  lang="less"  >
   .el-card{
     margin-top:40px;
   }
</style>
