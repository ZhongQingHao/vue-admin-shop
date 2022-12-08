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
        // 均分
        type:'category'
      },
      yAxis:{show:false},
      // 系列
      series:[{
        type:'line',
        data:[20,10,33,50,90],
        // 拐点样式设置
        itemStyle:{
          // 透明的0
          opacity:0
        },
        // 线条样式
        lineStyle:{
          color:"purple"
        },
        // 弧度设置
        smooth:true,
        // 填充颜色
        areaStyle:{
          color:{
            type:"linear",
            x:0,
            y:0,
            x2:0,
            y2:1,
            colorStops:[
              {
                offset:0,
                color:"purple", // 0%处的颜色
              },
              {
                offset:1,
                color:"#fff",// 100% 处的颜色
              },
            ],
            global:false, // 默认值false
          },
        },
      },],
      // 布局
      grid:{
        left:0,
        top:0,
        right:0,
        bottom:0
      }
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
