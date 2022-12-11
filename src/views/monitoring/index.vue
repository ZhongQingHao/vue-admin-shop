<template>
  <div>

    <el-card style="margin: 20px 0px">
      <el-row>
    <el-col :span="8" class="header-search">
      <span>名称 </span>
      <el-input  placeholder="请输入名称，回车检索" style="width:200px;"></el-input>
      &nbsp;&nbsp;&nbsp;
      <span>状态</span>
      <el-select v-model="value" placeholder="请选择">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
    </el-col>
    <el-col :span="16" class="header-button">
      <el-button type="primary">搜索</el-button>
      <el-button type="success">新增</el-button>
      <el-button type="danger">webHook设置</el-button>
      <el-button type="warning">看板</el-button>
    </el-col>
    </el-row>
    </el-card>

    <el-card style="margin: 10px 0px">
      <el-table
    :data="tableData"
    border
    style="width: 100%">
    <el-table-column
      prop="id"
      label="序号"
      width="80"
      type="index">
    </el-table-column>
    <el-table-column
      prop="name"
      label="名称"
      width="220">
    </el-table-column>
    <el-table-column
      prop="address"
      label="URL">
    </el-table-column>
    <el-table-column
      prop="Desc"
      label="备注">
    </el-table-column>
    <el-table-column
      prop="Cron"
      label="Cron"
      width="100">
    </el-table-column>
    <el-table-column
      prop="time"
      label="限时(秒)"
      width="80">
    </el-table-column>
    <el-table-column
      prop="status"
      label="启用"
      width="80">
    </el-table-column>
    <el-table-column
      prop="operator"
      label="操作">
    </el-table-column>
  </el-table>

    </el-card>


  </div>


</template>

<script>
export default {
  name: 'Monitoring',
  data: function() {
        return {
          listLoading: false,
          detailVisible: false,
          addFormVisible:false,
          chartVisible:false,
          lwidth: 80,
          tasklogList: [],
          list: [],
          logLimit: 50,
          isStarted: '1',
          searchForm: {
            name: '',
            status: ''
          },
          statusList: [
            {value: '', label: '全部'},
            {value: '1', label: '正常'},
            {value: '2', label: '告警'},
            {value: '9', label: '无法访问'},
          ],
          form: {
            id: 0,
            name: '',
            url: '',
            warnWord: '',
            cronState: 1,
            notifyType: 1,
            notifyId: 1,
            spec: '* */2 * * * *',
            timeout: '',
            remark: '',
            // status: '',
          },
          webhookShow: false,
          webhook: {},
          total: 0,
          pageNum: 1,
          pageSize: 20,
          option: null
        }
      },
      created() {
        this.fetchData()
        request.get('/api/task/getwatch').then(res => this.isStarted = res.data + '')
        request.get('/api/notify/get?id=1').then(res => this.webhook = res.data)
      },
      methods: {
        dsearch() {
          this.fetchData()
        },
        fetchData() {
          request.get('/api/task/list', { params: {
            name: this.searchForm.name,
            status: this.searchForm.status,
            limit: 1000,
          }}).then(res => {
            console.log(res);
            this.total = res.data.length
            if (res.data) this.list = res.data
          })
        },
        genStatus(s) {
          return s == 1 ? '<i class="success">正常</i' : s == 2 ? '<b class="red">告警</b>' : s == 9 ? '<b class="red">无法访问</b>' : '未初始化'
        },
        showResult() {
          this.result = syntaxHighlight(JSON.stringify(this.genHtml(this.value), null, 2))
        },
        setWacth(val) {
          request.get('/api/task/setwatch?start=' + val).then(res => this.$message.success('操作成功!'))
        },
        add() {
          this.form = this.$options.data().form
          this.addFormVisible = true
        },
        edit(row){
          Object.assign(this.form, row)
          this.addFormVisible = true
        },
        save() {
          request.post('/api/task/save', this.form).then(res => {
            this.$message.success('保存成功!')
            this.addFormVisible = false
            this.fetchData()
          })
        },
        changeCronState(row) {
          request.post('/api/task/save', {id: row.id, cronState: row.cronState}).then(res => this.$message.success('操作成功!'))
        },
        detail(row) {
          request.get('/api/tasklog/list?limit=' + this.logLimit + '&taskId=' + row.id).then(res => {
            this.detailVisible = true;
            if (res.data) return this.tasklogList = res.data
            this.tasklogList.splice(0, this.tasklogList.length)
          })
        },
        editWebhook() {
          this.webhookShow = true
        },
        saveWebhook() {
          request.post('/api/notify/save', this.webhook).then(res => {
            this.$message.success('保存成功!')
            this.addFormVisible = false
          })
        },
        handleSizeChange(val) {
          console.log(`每页 ${val} 条`);
          this.pageSize = val;
          this.fetchData();
        },
        handleCurrentChange(val) {
          console.log(`当前页: ${val}`);
          this.pageNum = val;
          this.fetchData();
        },
        showChart(id) {
          this.chartVisible = true
          getOption(id).then(data => {
            this.option = data
          })
        }
      }
}
</script>

<style scoped>
.header-search {
  /* margin-left: 25px; */
}

.header-button{
 width: 400px;
 text-align: right;
 /* margin-right: 400px; */
}
</style>
