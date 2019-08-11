<template>
 <el-select :value="value" placeholder="请选择" @change="abc" clearable>
            <el-option
              v-for="item in channelOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
</template>
<script>
export default {
  name: 'my-channel',
  props: ['value'],
  data () {
    return {
      myValue: null,
      channelOptions: []
    }
  },
  created () {
    // 获取频道数据
    this.getChannelOptions()
  },
  methods: {
    async getChannelOptions () {
      const { data: { data } } = await this.$http.get('http://ttapi.research.itcast.cn/mp/v1_0/channels')
      this.channelOptions = data.channels
    },
    abc (val) {
      console.log(val)
      // 空字符处理成null
      if (val === '') val = null
      // 数据提交给父组件使用
      this.$emit('input', val)
    }
  }
}
</script>
<style lang="less" scoped>

</style>
