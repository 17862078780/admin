<template>
  <div>
    <br>
    <!-- 条件查询栏 -->
    <el-form :inline="true">
      <el-form-item label>
        <el-input v-model="searchMap.vendor" placeholder></el-input>
      </el-form-item>
      <el-form-item label>
        <el-input v-model="searchMap.model" placeholder></el-input>
      </el-form-item>
      <el-form-item label>
        <el-input v-model="searchMap.sn" placeholder></el-input>
      </el-form-item>
      <el-form-item label>
        <el-input v-model="searchMap.mac" placeholder></el-input>
      </el-form-item>
      <el-form-item label>
        <el-input v-model="searchMap.version" placeholder></el-input>
      </el-form-item>
      <el-form-item label>
        <el-input v-model="searchMap.stats" placeholder></el-input>
      </el-form-item>
      <el-form-item label>
        <el-input v-model="searchMap.registrationTime" placeholder></el-input>
      </el-form-item>
      <el-form-item label>
        <el-input v-model="searchMap.activeTime" placeholder></el-input>
      </el-form-item>
      <el-form-item label>
        <el-input v-model="searchMap.desc" placeholder></el-input>
      </el-form-item>

      <el-button type="primary" @click="fetchData()">查询</el-button>
      <el-button type="primary" @click="handleEdit('')">新增</el-button>
    </el-form>
    <!-- 数据显示表格 -->
    <el-table :data="list" border style="width: 100%">
      <el-table-column prop="_id" label="id" width="80" v-show="false" ></el-table-column>
      <el-table-column prop="vendor" label="厂商" width="120"></el-table-column>
      <el-table-column prop="model" label="型号" width="80"></el-table-column>
      <el-table-column prop="sn" label="SN设备号" width="180"></el-table-column>
      <el-table-column prop="mac" label="mac号" width="180"></el-table-column>
      <el-table-column prop="version" label="软件版本" width="110"></el-table-column>
      <el-table-column prop="stats" label="在线状态" width="80"></el-table-column>
      <el-table-column prop="registrationTime" label="注册时间" width="180"></el-table-column>
      <el-table-column prop="activeTime" label="活跃时间" width="180"></el-table-column>
      <el-table-column prop="desc" label="描述" width="550"></el-table-column>

      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="handleEdit(scope.row._id)" type="text" size="small">修改</el-button>
          <el-button @click="handleDelete(scope.row._id)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页插件 -->
    <el-pagination
      @size-change="fetchData"
      @current-change="fetchData"
      :current-page="currentPage"
      :page-sizes="[5,10,20]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 编辑窗口 -->
    <el-dialog title="编辑" :visible.sync="dialogFormVisible">
      <el-form label-width="80px">
        <el-form-item label = "厂商">
          <el-input v-model="pojo.vendor"></el-input>
        </el-form-item>
        <el-form-item label = "型号">
          <el-input v-model="pojo.model"></el-input>
        </el-form-item>
        <el-form-item label = "SN">
          <el-input v-model="pojo.sn"></el-input>
        </el-form-item>
        <el-form-item label = "MAC">
          <el-input v-model="pojo.mac"></el-input>
        </el-form-item>
        <el-form-item label = "软件版本">
          <el-input v-model="pojo.version"></el-input>
        </el-form-item>
        <el-form-item label = "在线状态">
          <el-input v-model="pojo.stats"></el-input>
        </el-form-item>
        <el-form-item label = "注册时间">
          <el-input v-model="pojo.registrationTime"></el-input>
        </el-form-item>
        <el-form-item label = "活跃时间">
          <el-input v-model="pojo.activeTime"></el-input>
        </el-form-item>
        <el-form-item label = "设备描述">
          <el-input v-model="pojo.desc"></el-input>
        </el-form-item>

        <el-button type="primary" @click="handleSave()">保存</el-button>
        <el-button @click="dialogFormVisible = false">关闭</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import equipmentApi from "@/api/equipment";
export default {
  data() {
    return {
      list: [],
      total: 0, // 总记录数
      currentPage: 1, // 当前页
      pageSize: 5, // 每页大小
      searchMap: {}, // 查询条件
      dialogFormVisible: false, // 编辑窗口是否可见
      pojo: {}, // 编辑表单绑定的实体对象
      cityList: [], // 城市列表
      id: "" // 当前用户修改的ID
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      equipmentApi
        .search(this.currentPage, this.pageSize, this.searchMap)
        .then(response => {
          this.list = response.data.rows;
          this.total = response.data.total;
        });
    },
    handleSave() {
      equipmentApi.update(this.id, this.pojo).then(response => {
        this.$message({
          message: response.message,
          type: response.flag ? "成功" : "失败"
        });
        if (response.flag) {
          // 如果成功
          this.fetchData(); // 刷新列表
        }
      });
      this.dialogFormVisible = false; // 关闭窗口
    },
    handleEdit(id) {
      this.id = id;
      this.dialogFormVisible = true; // 打开窗口
      if (id !== "") {
        // 修改
        equipmentApi.findById(id).then(response => {
          if (response.flag) {
            this.pojo = response.data;
          }
        });
      } else {
        this.pojo = {}; // 清空数据
      }
    },
    // 删除
    handleDelete(id) {
      this.$confirm("确定要删除此纪录吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        equipmentApi.deleteById(id).then(response => {
          this.$message({
            message: response.message,
            type: response.flag ? "success" : "error"
          });
          if (response.flag) {
            this.fetchData(); // 刷新数据
          }
        });
      });
    }
  }
};
</script>
