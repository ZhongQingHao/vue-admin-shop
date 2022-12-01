<template>
  <div>
    <!-- <el-row :gutter="20">
  <el-col :span="16"><div class="grid-content bg-purple"></div></el-col>
  <el-col :span="8"><div class="grid-content bg-purple">
    <el-input v-model="input" placeholder="搜索sku" clearable></el-input>
    <el-button type="primary">搜索</el-button>
  </div></el-col>
</el-row> -->


    <el-row>
      <el-col :span="5">
        <el-input v-model="input" placeholder="搜索sku" @blur="getFindSkuInfo" @keyup.enter.native="getFindSkuInfo" clearable></el-input>

      </el-col>
      <el-col :span="3">
        <el-button type="primary" @click="getFindSkuInfo">搜索</el-button>
      </el-col>

    </el-row>

    <!--  表格 -->
    <el-table :data="flag ? records1 :records" style="width: 100%;" border>
      <el-table-column prop="id" type="index" label="序号" align="center" width="80">
      </el-table-column>
      <el-table-column prop="skuName" label="名称" width="width">
      </el-table-column>
      <el-table-column prop="skuDesc" label="描述" width="width">
      </el-table-column>
      <el-table-column label="默认图片" width="110">
        <template slot-scope="{row,$index}">
          <img :src="row.skuDefaultImg" style="height:80px; width:80px">
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量" width="80">
      </el-table-column>
      <el-table-column prop="price" label="价格" width="80">
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{row,$index}">
          <el-button type="success" icon="el-icon-sort-down" size="mini" title="下架" v-if="row.isSale == 0" @click="cancel(row)"></el-button>
          <el-button type="success" icon="el-icon-sort-up" size="mini" title="上架" v-else @click="sale(row)"></el-button>
          <el-button type="primary" icon="el-icon-edit" size="mini" title="编辑sku信息" @click="edit"></el-button>
          <el-button type="info" icon="el-icon-info" size="mini" title="查看sku信息" @click="getSkuInfo(row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" title="删除sku信息">
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
<el-pagination v-show="!flag"
      @size-change="handleSizeChange"
      @current-change="getSkuList"
      style="text-align:center"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      layout="prev, pager, next, jumper,->,sizes,total"
      :total="total">
    </el-pagination>
<!-- 详情抽屉 -->
<el-drawer
  :title="`${skuInfo.skuName} 详情介绍`"
  :visible.sync="show"
  :before-close="false"
  size="50%">
  <el-row>
    <el-col :span="5">名称</el-col>
    <el-col :span="16">{{skuInfo.skuName}}</el-col>
  </el-row>
  <el-row>
    <el-col :span="5">描述</el-col>
    <el-col :span="16">{{skuInfo.skuDesc}}</el-col>
  </el-row>
  <el-row>
    <el-col :span="5">价格</el-col>
    <el-col :span="16">{{skuInfo.price}}元</el-col>
  </el-row>
  <el-row>
    <el-col :span="5">平台属性</el-col>
    <el-col :span="16">
      <template>
        <el-tag type="success" v-for="(attr,index) in skuInfo.skuAttrValueList" :key="attr.id" style="margin-right:10px">{{attr.attrId}}-{{attr.valueId}}</el-tag>
      </template>
    </el-col>
  </el-row>

  <el-row>
    <el-col :span="5">商品图片</el-col>
    <el-col :span="16">
      <el-carousel height="300px">
        <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
            <img :src="item.imgUrl">
        </el-carousel-item>
      </el-carousel>

    </el-col>
  </el-row>
</el-drawer>

  </div>
</template>

<script>
export default {
  name: "Sku",
  data() {
    return {
      page:1,
      limit:10,
      records1:[],
      records:[],
      total:0,
      skuInfo:{},
      show: false,
      input: '',
      flag:false,
    };
  },
  methods: {
    // 分页器的数据变化时回调方法
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSkuList();
    },
    // 获取sku列表数据的方法
    async getSkuList(pages = 1){
      this.flag = false
      this.records1 = []
      this.page = pages;
      let result = await this.$API.sku.reqSkuList(this.page, this.limit);
      this.total = result.data.total;
      this.records = result.data.records
    },
    // 上架
    async sale(sku) {
      let result = await this.$API.sku.reqSale(sku.id)
      if (result.code == 200){
        sku.isSale = 0
      this.$message({type:'success',message:'上架成功'})
      }
    },
    // 下架
    async cancel(sku) {
      let result = await this.$API.sku.reqCancel(sku.id)
      if (result.code == 200){
        sku.isSale = 1
        this.$message({type:'success',message:'下架成功'})
      }
    },
    async getSkuInfo(sku) {
      let result = await this.$API.sku.reqSkuById(sku.id)
      if (result.code == 200){
        // 展示抽屉
        this.show = true
        this.skuInfo = result.data
      }
    },
    edit(){
      this.$message("正在开发中")
    },
    async getFindSkuInfo() {
      if (this.input.trim() != ''){
        this.flag = true
        let result = await this.$API.sku.reqSkuFindSkuKeyword(this.input)
        this.records1 = result
        if (!result){
          this.$message({type:'success',message:'未检索到信息'})
        }
      }else{
        this.getSkuList()
      }

    }




  },
  mounted(){
    this.getSkuList()

  }
};
</script>

<style>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>

<style scoped>
.el-row .el-col-5 {
  font-size: 18px;
  text-align: right;
}
.el-col {
  margin: 10px 10px;
}

>>> .el-carousel__button {
  width: 10px;
  height: 10px;
  background: red;
  border-radius: 50%;
}
</style>
