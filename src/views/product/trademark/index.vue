<template>
  <div>

      <el-button
        type="primary"
        @click="showDialog"
        icon="el-icon-plus"
        style="margin: 10px 0px"
        >添加</el-button
      >
      <!-- <el-input v-model="input" placeholder="请输入内容"></el-input> -->
    <!-- 按钮 -->

    <!-- 表格组件 -->
    <el-table style="width: 100%" border :data="list">
      <el-table-column prop="id" label="序号" width="80px" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="wdith">
      </el-table-column>
      <el-table-column prop="logoUrl" label="品牌LOGO" width="wdith">
        <template slot-scope="{ row, $index }">
          <img :src="row.logoUrl" alt="" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="wdith">
        <template slot-scope="{ row, $index }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="updateTradeMark(row)"
            >修改</el-button
          >
          <el-button type="danger" icon="el-icon-delete" size="mini"
            @click="deleteTradeMark(row)">删除</el-button
          >
        </template>
        <!-- <el-button type="primary" icon="el-icon-edit"  size="mini" circle></el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini" circle></el-button> -->
      </el-table-column>
    </el-table>

    <!--  
      
      分页器 
      
    
    
    -->

    <el-pagination
      style="margin-to: 20px; textAlign: center"
      @size-change="handleSizeChange"
      @current-change="getPageList"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :pager-count="7"
      :page-size="limit"
      layout="prev, pager, next,jumper,->,sizes,total"
      :total="total"
    >
    </el-pagination>

    <!-- 对话框 -->
    <el-dialog :title="tmForm.id?'修改品牌':'添加品牌'" :visible.sync="dialogFormVisible">
      <!--  form表单 -->
      <el-form style="width: 80%" :model="tmForm" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌logo" label-width="100px" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark">确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "trademark",
  // data(){
  //   return {
  //     tabledata: [
  //   {"name":'spider',"logo":"logo","id":1},
  //   {"name":'张三',"logo":"logo2","id":2},
  //   {"name":'李四',"logo":"logo3","id":3}],
  //     dialogTableVisible: false,
  //       dialogFormVisible: false,
  //       form: {
  //         name: '',
  //         region: '',
  //         date1: '',
  //         date2: '',
  //         delivery: false,
  //         type: [],
  //         resource: '',
  //         desc: ''
  //       },
  //       formLabelWidth: '120px'
  //   }
  data() {
    // 自定义表单验证 element
    var validateTmName = (rule,value,callback) =>{
        if (value.length <2 || value.length >10){
          // 放行：不满足条件放行一个错误
          callback(new Error('品牌名称2-10位'))
        }else{
          // 放行
          callback()
        }
      };
    return {
      dialogTableVisible: false,
      // 隐藏
      dialogFormVisible: false,
      page: 1,
      limit: 3,
      total: 0,
      formLabelWidth: "120px",
      list: [],
      tmForm: {
        tmName: "",
        logoUrl: "",
      },
      rules: {
        // required必填选项 message提示信息，trigger：用户行为设置 （事件的设置blur填空时 change修改不满足时）
          tmName: [
            { required: true, message: '请输入品牌名称', trigger: 'blur' },
            // 品牌名称长度2-10 change 文本发生变化时
            //{ min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'change' }
            // 自定义表单验证 品牌名称长度2-10 change 文本发生变化时
            { validator: validateTmName,trigger:'change'}
          ],
          logoUrl: [
            { required: true, message: '请选择品牌logo'}
          ],
      }
    };
  },
  mounted() {
    this.getPageList();
  },
  methods: {
    // 获取品牌列表接口
    async getPageList(pager = 1) {
      this.page = pager;
      const { page, limit } = this;
      let result = await this.$API.tradmark.reqTradeMarkList(page, limit);
      if (result.code == 200) {
        // 分别是展示数据总条数与列表
        this.total = result.data.total;
        this.list = result.data.records;
      }
      // console.log(result)
    },
    // 以下切换页 以上替代
    // handleCurrenChange(pager){
    //   this.page = pager
    //   this.getPageList();

    handleSizeChange(limit) {
      this.limit = limit;
      this.getPageList();
    },
    // 图片上传成功
    handleAvatarSuccess(res, file) {
      // res 上传成功之后返回的前端数据
      // file 上传成功之后服务器返回的前端数据
      // 收集品牌图片的地址，因为需要指定给服务器
      this.tmForm.logoUrl = res.data;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    // 显示对话框
    showDialog() {
      this.dialogFormVisible = true;
      this.tmForm = { tmName: "", logoUrl: "" };
    },
    // 更新品牌
    updateTradeMark(row) {
      // row 当前用户选中的这个品牌信息
      console.log(row);
      this.dialogFormVisible = true;
      this.tmForm = { ...row };
    },
    // 删除品牌
    deleteTradeMark(row){
      this.$confirm(`此操作将删除${row.tmName}, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          // 当用户点击确认按钮时
          let result = await this.$API.tradmark.deleteTradeMark(row.id)
          if (result.code == 200){
            this.$message({
            type: 'success',
            message: '删除成功!'
          });
          // 刷新品牌信息
          this.getPageList(this.list.length>1?this.page:this.page-1)
          }
        }).catch(() => {
          // 当用户点击取消按钮时
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },


    // 添加或者更新
    // 发请求 添加品牌 修改品牌 基于表单内有无ID判断 添加没有ID 修改则配置ID
    addOrUpdateTradeMark() {
      // 当全部表单验证通过时，再发起请求
      this.$refs.ruleForm.validate(async (success) =>{
        // 如果全部字段符合条件
        if (success){
          let result = await this.$API.tradmark.reqAddOrUpdataTradeMark(
            this.tmForm
          );
          if (result.code == 200) {
            // 弹出信息 有ID修改品牌成功，无ID则是添加
            this.$message({
              type: "success",
              message: this.tmForm.id ? "修改品牌成功" : "添加品牌成功",
            });
            this.dialogFormVisible = false;
            // 添加或修改品牌成功再次获取列表
            // 如果添加品牌成功停留在第一页，如果是修改品牌应该留在当前页
            this.getPageList(this.tmForm.id ? this.page : 1);
          } 
        }else{
            console.log('error submmit!!')
            return false
          }
      })
    
    },
  },

};
</script>



<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
