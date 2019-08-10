<template>
 <el-select :value="value" placeholder="请选择" clearable>
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
    }
  }
}
</script>
<style lang="less" scoped>

</style>
