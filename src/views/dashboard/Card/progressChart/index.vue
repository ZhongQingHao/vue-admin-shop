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
        min:0,
        max:100,
      },
      yAxis:{
        // 隐藏y轴
        show:false,
        // 均分
        type:'category'
      },
      // 系列
      series:[{
        // 柱状图
        type:'bar',
        data:[78],
        // 柱状图的宽度设置
        barWidth:10,
        color:"yellowgreen", //颜色设置
        // 背景颜色设置
        showBackground:true,
        backgroundStyle:{
          color:"#eee",
        },
        // 设置文本标签
        label:{
          show:true,// 显示
          // 改变文本的内容
          formatter:'|',
          // 文本标签位置调试
          position:'right'
        }


      },],
      // 布局
      grid:{
        left:0,
        top:0,
        right:0,
        bottom:0
      },

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
