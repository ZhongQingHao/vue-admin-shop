<template>
  <div>
    <el-card>
      <el-row>
        <el-col :span="12" class="header-search">
          <span>名称 </span>
          <el-input placeholder="请输入名称，回车检索" style="width: 200px"></el-input>
          &nbsp;&nbsp;&nbsp;
          <span>状态</span>
          <!-- v-model="value" -->
          <el-select v-model="searchForm.status" placeholder="请选择">
            <el-option
              v-for="item in statusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="12" class="header-button">
          <el-button type="primary" size="mini">搜索</el-button>
          <el-button @click="add" type="success" size="mini">新增</el-button>
          <el-button @click="editWebhook" type="danger" size="mini"
            >webHook设置</el-button
          >
          <el-button @click="showChart(0)" type="warning" size="mini">看板</el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- tables表格展示区域 -->
    <el-card style="margin: 10px 0px">
      <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
        <el-table-column align="center" label="序号" width="50"
          ><template slot-scope="scope">{{ scope.$index + 1 }}</template></el-table-column
        >
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="url" label="URL"></el-table-column>
        <el-table-column prop="warnWord" label="关键字"></el-table-column>
        <el-table-column prop="spec" label="cron" width="130"></el-table-column>
        <el-table-column prop="timeout" label="限时(秒)" width="80"></el-table-column>
        <el-table-column label="状态" width="100">
          <template slot-scope="scope">
            <el-tag v-if="(scope.row.status == 9)" type="danger">无法访问</el-tag>
            <el-tag v-if="(scope.row.status == 1)" type="success">正常</el-tag>
            <el-tag v-if="(scope.row.status == 2)" type="danger">警告</el-tag>
            <!-- <span v-html="genStatus(scope.row.status)"></span> -->
          </template>
        </el-table-column>
        <el-table-column label="启用" width="80">
          <template slot-scope="scope">
            <el-switch
              @change="changeCronState(scope.row)"
              v-model="scope.row.cronState"
              :active-value="1"
              :inactive-value="2"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center" width="300">
          <template slot-scope="scope">
            <el-button @click="detail(scope.row)" size="mini">明细</el-button>
            <el-button
              @click="showChart(scope.row.id)"
              v-show="scope.row.status > 0"
              type="warning"
              size="mini"
              >看板</el-button
            >
            <el-button @click="edit(scope.row)" type="primary" size="mini"
              >编辑</el-button
            >
            <el-button @click="del(scope.row)" type="danger" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 按钮ui -->
    <el-dialog title="编辑" :visible.sync="addFormVisible">
      <el-form :model="form" label-width="120px" ref="ruleForm">
        <el-form-item label="名称"
          ><el-input v-model="form.name"></el-input
        ></el-form-item>
        <el-form-item label="网址url"
          ><el-input v-model="form.url"></el-input
        ></el-form-item>
        <el-form-item label="Cron"
          ><el-input v-model="form.spec"></el-input
        ></el-form-item>
        <el-form-item label="告警词"
          ><el-input
            v-model="form.warnWord"
            placeholder="告警词汇, 逗号,分隔"
            autocomplete="true"
          ></el-input
        ></el-form-item>
        <!-- <el-form-item label="status"><el-input v-model="form.status"></el-input></el-form-item> -->
        <el-form-item label="启用状态">
          <el-select v-model="form.cronState" placeholder="请选择启用状态">
            <el-option label="启用" :value="1"></el-option>
            <el-option label="禁用" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="通知类型"
          ><el-input
            v-model="form.notifyType"
            placeholder="0: 不通知, 1: webhook"
          ></el-input
        ></el-form-item>
        <!-- <el-form-item label="通知id"><el-input v-model="form.notifyId"></el-input></el-form-item> -->
        <el-form-item label="请求限时"
          ><el-input v-model="form.timeout" placeholder="请求限时(秒)"></el-input
        ></el-form-item>
        <el-form-item label="备注"
          ><el-input v-model="form.remark"></el-input
        ></el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">保 存</el-button>
      </div>
    </el-dialog>

    <!-- 编辑webhook -->
    <el-dialog title="编辑" :visible.sync="webhookShow">
      <el-form :model="form" label-width="120px" ref="ruleForm">
        <el-form-item label="网址url"
          ><el-input v-model="webhook.url"></el-input
        ></el-form-item>
        <el-form-item label="Template"
          ><el-input type="textarea" :rows="7" v-model="webhook.template"></el-input
        ></el-form-item>
        <el-form-item label="启用状态">
          <el-select v-model="webhook.state" placeholder="请选择启用状态">
            <el-option label="启用" :value="1"></el-option>
            <el-option label="禁用" :value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="webhookShow = false">取 消</el-button>
        <el-button type="primary" @click="saveWebhook">保 存</el-button>
      </div>
    </el-dialog>

    <!-- desc -->
    <el-dialog title="任务明细" :visible.sync="detailVisible" width="80%">
      <el-table :data="tasklogList">
        <el-table-column align="center" label="序号" width="50"
          ><template slot-scope="scope">{{ scope.$index + 1 }}</template></el-table-column
        >
        <el-table-column prop="name" label="名称" width="200"></el-table-column>
        <el-table-column label="时间" width="190"
          ><template slot-scope="scope">{{
            (scope.row.createdAt + "").substring(0, 19)
          }}</template></el-table-column
        >
        <el-table-column prop="spec" label="cron" width="130"></el-table-column>
        <el-table-column prop="duration" label="响应(ms)" width="80"></el-table-column>
        <el-table-column prop="warnWord" label="关键字"></el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column label="状态" width="80">
          <template slot-scope="scope"
            >
            <span v-html="genStatus(scope.row.status)"></span
          >

          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 数据看板 -->
    <el-dialog title="数据看板" :visible.sync="chartVisible" fullscreen="true">
      <v-chart class="chartLog" :option="option" :update-options="{ notMerge: true }" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Monitoring",
  data() {
    return {
      listLoading: false,
      detailVisible: false,
      addFormVisible: false,
      chartVisible: false,
      lwidth: 80,
      tasklogList: [],
      list: [
        {
          id: 1,
          name: "test",
          url: "http://www.qq.com",
          warnWord: "哈咯",
          spec: "* * * * /5",
          timeout: 5,
          status: 9,
          cronState: 1,
        },
      ],
      logLimit: 50,
      isStarted: "1",
      searchForm: {
        name: "",
        status: "",
      },
      statusList: [
        // { value: "", label: "全部" },
        { value: "1", label: "正常" },
        { value: "2", label: "告警" },
        { value: "9", label: "无法访问" },
      ],
      form: {
        id: 0,
        name: "",
        url: "",
        warnWord: "",
        cronState: 1,
        notifyType: 1,
        notifyId: 1,
        spec: "* */2 * * * *",
        timeout: "",
        remark: "",
        // status: '',
      },
      webhookShow: false,
      webhook: {},
      total: 0,
      pageNum: 1,
      pageSize: 20,
      option: null,
    };
  },
  // created() {
  //   this.fetchData();
  //   request
  //     .get("/api/task/getwatch")
  //     .then((res) => (this.isStarted = res.data + ""));
  //   request
  //     .get("/api/notify/get?id=1")
  //     .then((res) => (this.webhook = res.data));
  // },
  methods: {
    dsearch() {
      this.fetchData();
    },
    fetchData() {
      request
        .get("/api/task/list", {
          params: {
            name: this.searchForm.name,
            status: this.searchForm.status,
            limit: 1000,
          },
        })
        .then((res) => {
          console.log(res);
          this.total = res.data.length;
          if (res.data) this.list = res.data;
        });
    },
    genStatus(s) {
      return s == 1
        ? '<el-tag type="success">正常</el-tag>'
        : s == 2
        ? '<el-tag type="danger">警告</el-tag>'
        : s == 9
        ? '<el-tag type="danger">无法访问</el-tag>'
        : "未初始化";
    },

    showResult() {
      this.result = syntaxHighlight(JSON.stringify(this.genHtml(this.value), null, 2));
    },
    setWacth(val) {
      request
        .get("/api/task/setwatch?start=" + val)
        .then((res) => this.$message.success("操作成功!"));
    },
    add() {
      this.form = this.$options.data().form;
      this.addFormVisible = true;
    },
    edit(row) {
      Object.assign(this.form, row);
      this.addFormVisible = true;
    },
    save() {
      request.post("/api/task/save", this.form).then((res) => {
        this.$message.success("保存成功!");
        this.addFormVisible = false;
        this.fetchData();
      });
    },
    changeCronState(row) {
      request
        .post("/api/task/save", { id: row.id, cronState: row.cronState })
        .then((res) => this.$message.success("操作成功!"));
    },
    detail(row) {
      request
        .get("/api/tasklog/list?limit=" + this.logLimit + "&taskId=" + row.id)
        .then((res) => {
          this.detailVisible = true;
          if (res.data) return (this.tasklogList = res.data);
          this.tasklogList.splice(0, this.tasklogList.length);
        });
    },
    editWebhook() {
      this.webhookShow = true;
    },
    saveWebhook() {
      request.post("/api/notify/save", this.webhook).then((res) => {
        this.$message.success("保存成功!");
        this.addFormVisible = false;
      });
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
      this.chartVisible = true;
      getOption(id).then((data) => {
        this.option = data;
      });
    },
  },
};
</script>

<style>
.header-search {
  /* margin-left: 25px; */
}

.header-button {
  width: 400px;
  text-align: right;
  /* margin-right: 400px; */
}
</style>
