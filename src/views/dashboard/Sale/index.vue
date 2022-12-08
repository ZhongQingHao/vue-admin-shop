<template>
<el-card class="box-card" style="margin:10px 0">
  <div slot="header" class="clearfix">
    <!-- v-model="activeName" @tab-click="handleClick" -->
    <!-- 头部左侧内容 -->
    <el-tabs class="tab" v-model="activeName">
    <el-tab-pane label="销售额" name="销售额"></el-tab-pane>
    <el-tab-pane label="访问量" name="访问量"></el-tab-pane>
  </el-tabs>
  <!-- 头部右侧内容 -->
  <div class="right">
    <span>今日</span>
    <span>本周</span>
    <span>本月</span>
    <span>本年</span>
    <!-- v-model="value1" -->
    <el-date-picker class="date"
      type="daterange"
      range-separator="-"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      size="mini">
    </el-date-picker>
  </div>


    <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
  </div>
  <div>
    <el-row :gutter="10">
    <el-col :span="18">
    <div class="charts" ref="charts">

    </div>
    </el-col>
    <el-col :span="6" class="content-right">
      <h3>门店销售额排名</h3>
      <ul>
        <li>
          <span class="content-rindex">1</span>
          <span>肯德基</span>
          <span class="content-rvalue">123456</span>
        </li>
        <li>
          <span class="content-rindex">2</span>
          <span>肯德基</span>
          <span class="content-rvalue">123456</span>
        </li>
        <li>
          <span class="content-rindex">3</span>
          <span>肯德基</span>
          <span class="content-rvalue">123456</span>
        </li>
        <li>
          <span>4</span>
          <span>肯德基</span>
          <span class="content-rvalue">123456</span>
        </li>
        <li>
          <span>5</span>
          <span>肯德基</span>
          <span class="content-rvalue">123456</span>
        </li>
        <li>
          <span>6</span>
          <span>肯德基</span>
          <span class="content-rvalue">123456</span>
        </li>
        <li>
          <span>7</span>
          <span>肯德基</span>
          <span class="content-rvalue">123456</span>
        </li>
      </ul>
    </el-col>
    </el-row>

  </div>
</el-card>
</template>

<script>
import * as echarts from 'echarts';
export default {
  name:'',
  data(){
    return {
      activeName:'销售额',
    }
  },
  mounted(){
    // 初始化echarts实例
    let mycharts = echarts.init(this.$refs.charts);
    // 配置数据
    mycharts.setOption({
      title:{
        text:"销售额趋势",
      },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      axisTick: {
        alignWithLabel: true
      }
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ],
  series: [
    {
      name: 'Direct',
      type: 'bar',
      barWidth: '60%',
      data: [10, 52, 200, 334, 390, 330, 220,200,100,220,180,300]
    }
  ]
})
  },

}
</script>

<style scoped>
.clearfix{
  position: relative;
  display: flex;
  justify-content: space-between;
  font-family: '微软雅黑';
}
.tab{
  width:100%;
}
.right{
  position: absolute;
  right:0;

}
.date{
  margin: 0px 20px;
  width:200px
}
.right span{
  margin:0px 10px;
}

.charts{
  width: 100%;
  height: 300px;
}
.el-col{
  padding: 0px;
}

.content-right span{
  margin:0px 10px;
}
.content-rindex{
  float:left;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background:black;
  color:white;
  text-align: center;
}
.content-rvalue{
  float: right;

}


ul{
  list-style: none;
  width:100%;
  height: 300px;
  padding: 0px;
}
ul li{
  height: 8%;
  margin:10px 0px;
}


</style>
