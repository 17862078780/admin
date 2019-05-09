<template>
  <div>
    <br>
    <!-- 条件查询栏 -->
    <el-form :inline="true">
      <!-- 实现按在线状态/SN/MAC/厂商/型号/活跃时间段查询； -->
      <!-- 厂商 -->
      <el-form-item label>
        <el-input v-model="searchMap.vendor" placeholder="请输入厂商精确全称"></el-input>
      </el-form-item>
      <!-- sn -->
      <el-form-item label>
        <el-input v-model="searchMap.sn" placeholder="请输入SN号"></el-input>
      </el-form-item>
      <el-form-item label>
        <el-input v-model="searchMap.mac" placeholder="请输入MAC号"></el-input>
      </el-form-item>
      <el-form-item label>
          <el-select v-model="searchMap.stats" filterable placeholder="请选择在线状态">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      <!-- 活跃时间段 -->
      <el-date-picker
      v-model="searchMap.startTime"
      type="datetime"
      placeholder="选择活跃时间起止时间"
      align="right"
      :picker-options="pickerOptions1">
    </el-date-picker>

    <el-date-picker
      v-model="searchMap.endTime"
      type="datetime"
      placeholder="选择活跃时间终止时间"
      align="right"
      :picker-options="pickerOptions1">
    </el-date-picker>

      <el-button type="primary" @click="fetchData()">查询</el-button>
      <el-button type="primary" @click="handleEdit('')">新增</el-button>
    </el-form>
    <!-- 数据显示表格 -->
    <el-table :data="list" border stripe fit style="width: 100%">
      <el-table-column prop="_id" label="id" width="210"></el-table-column>
      <el-table-column prop="vendor" label="厂商" width="120"></el-table-column>
      <el-table-column prop="model" label="型号" width="80"></el-table-column>
      <el-table-column prop="sn" label="SN设备号" width="180"></el-table-column>
      <el-table-column prop="mac" label="mac号" width="180"></el-table-column>
      <el-table-column prop="version" label="软件版本" width="110"></el-table-column>
      <el-table-column prop="stats" label="在线状态" width="80"></el-table-column>
      <el-table-column prop="registrationTime" label="注册时间" :formatter="dateFormat" width="180"></el-table-column>
      <el-table-column prop="activeTime" label="活跃时间" :formatter="dateFormat" width="180"></el-table-column>
      <el-table-column prop="desc" label="描述" width="590"></el-table-column>

      <el-table-column fixed="right" label="操作" width="147">
        <template slot-scope="scope">
          <el-button @click="handleEdit(scope.row._id)" type size="mini">修改</el-button>
          <el-button @click="handleDelete(scope.row._id)" type="danger" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页插件 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5,10,20,100,200]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 编辑窗口 -->
    <el-dialog title="编辑" :visible.sync="dialogFormVisible">
      <el-form label-width="80px">
        <el-form-item label="厂商">
          <el-input v-model="pojo.vendor"></el-input>
        </el-form-item>
        <el-form-item label="型号">
          <el-input v-model="pojo.model"></el-input>
        </el-form-item>
        
        <el-form-item label="SN">
          <el-input v-model="pojo.sn"></el-input>
        </el-form-item>
        <el-form-item label="MAC">
          <el-input v-model="pojo.mac"></el-input>
        </el-form-item>
        <el-form-item label="软件版本">
          <el-select v-model="pojo.version" filterable placeholder="请选择软件版本">
            <el-option
              v-for="item in options_version"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="在线状态">
          <el-select v-model="pojo.stats" filterable placeholder="请选择在线状态">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备描述">
          <el-input v-model="pojo.desc" placeholder="设备描述" type="textarea" :rows="2"></el-input>
        </el-form-item>
        <el-button type="primary" @click="handleSave()">保存</el-button>
        <el-button @click="dialogFormVisible = false">关闭</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import equipmentApi from "@/api/equipment";
import moment from "moment";
export default {
  data() {
    return {
      list: [],
      total: 0, // 总记录数
      currentPage: 1, // 当前页
      pageSize: 10, // 每页大小
      searchMap: {}, // 查询条件
      dialogFormVisible: false, // 编辑窗口是否可见
      pojo: {}, // 编辑表单绑定的实体对象
      id: "", // 当前用户修改的ID
      options: [
        {
          value: "在线",
          label: "在线"
        },
        {
          value: "离线",
          label: "离线"
        }
      ],
      options_version:[{
          value: "1.0.0",
          label: "1.0.0"
        },
        {
          value: "2.0.0",
          label: "2.0.0"
        }],
        pickerOptions1: {
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },
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
          type: response.flag ? "success" : "error"
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
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val; //动态改变
      this.currentPage = 1;
      this.fetchData();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val; //动态改变
      this.fetchData();
    },
    //时间格式化
    dateFormat: function(row, column) {
      var date = row[column.property];
      // console.log(date);dug用
      if (date == undefined) {
        return "";
      }
      return moment(date).format("YYYY-MM-DD HH:mm:ss");
    }
  }
};
</script>
