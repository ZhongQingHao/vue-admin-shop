<template>
  <!-- 容器 -->
  <div class="charts" ref="charts">
    <span></span>
  </div>

</template>

<script>
import * as echarts from 'echarts';
export default {
  name:'',
  mounted(){
    // 初始化echarts实例
    let linecharts = echarts.init(this.$refs.charts);
    // 配置数据
    linecharts.setOption({
      xAxis:{
        // 隐藏x轴
        show:false,
        type:'category'
      },
      yAxis:{
        show:false
      },
      // 系列
      series:[{
        // 柱状图
        type:'bar',
        data:[20,10,33,50,90,10,20],
      }],
      // 布局
      grid:{
        left:0,
        top:0,
        right:0,
        bottom:0
      },
      tooltip:{},

    })
  }
}
</script>

<style scoped>

.charts{
  width: 100%;
  height: 100%;
}

</style>
