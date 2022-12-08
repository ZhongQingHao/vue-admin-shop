<template>
  <el-card>
    <div slot="header" class="header">
      <div class="category-header">
        <span>销售额类别占比</span>
        <el-radio-group v-model="value">
          <el-radio-button label="全部渠道"></el-radio-button>
          <el-radio-button label="线上"></el-radio-button>
          <el-radio-button label="门店"></el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <div>
      <div class="charts" ref="charts"></div>
    </div>
  </el-card>
</template>

  <script>
import * as echarts from 'echarts';
export default {
  name: "",
  data() {
    return {
      value: "全部渠道",
    };
  },
  mounted() {
    //饼图
    let mycharts = echarts.init(this.$refs.charts);
    mycharts.setOption({
      title:{
        text:'直播',
        subtext:1048,
        left:'center',
        top:'center'
      },
      tooltip: {
        trigger: "item",
      },
      // legend: {
      //   top: "5%",
      //   left: "center",
      // },
      series: [
        {
          name: "Access From",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: true,
            position: "outsize",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: "20",
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: true,
          },
          data: [
            { value: 1048, name: "直播" },
            { value: 735, name: "广告" },
            { value: 580, name: "短视频" },
            { value: 484, name: "视频" },
            { value: 300, name: "门店" },
          ],
        },
      ],
    });
    // 绑定事件
     mycharts.on("mouseover",(params)=>{
        // 获取鼠标移动上去的那条数据
        const {name,value} = params.data;
        // 重新设置标题
        mycharts.setOption({
          title:{
            text:name,
            subtext:value
          }
        })      
     })
  },
};
</script>

  <style scoped>
.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header {
  border-bottom: 1px solid #eee;
  margin: 0px 0px;
  padding: 0px 0px;
}
.charts{
  width:100%;
  height: 300px;

}
</style>
