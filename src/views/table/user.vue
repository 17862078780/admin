
<template>
  <div>
    <br>
    <!-- 动态查询这里只实现根据用户名的动态查询 -->
    <el-form :inline="true">
      <el-form-item label="根据姓名模糊查询">
        <el-input v-model="searchMap.username" placeholder="请输入名字中的key"></el-input>
      </el-form-item>
      <el-button type="primary" @click="fetchData()">搜索用户</el-button>
      <el-button type="primary" @click="handleEdit('')">新增用户</el-button>
    </el-form>
    <!-- 查询展示列表 -->
    <el-table :data="list" border style="width: 100%">
      <el-table-column prop="_id" label="用户id" width="210"></el-table-column>
      <el-table-column prop="username" label="用户名" width="80"></el-table-column>
      <el-table-column prop="sex" label="性别" width="40"></el-table-column>
      <el-table-column prop="avatar" label="头像" width="80"></el-table-column>
      <el-table-column prop="mobile" label="手机号" width="120"></el-table-column>
      <el-table-column prop="birthday" :formatter="dateFormat" label="生日" width="120"></el-table-column>
      <el-table-column prop="address" label="地址" width="180"></el-table-column>
      <el-table-column prop="role.desc" label="角色" width="120"></el-table-column>
      <el-table-column prop="interest" label="爱好" width="360"></el-table-column>

      <el-table-column fixed="right" label="操作" width="147">
        <template slot-scope="scope">
          <el-button @click="handleEdit(scope.row._id)" type size="small">修改</el-button>
          <el-button @click="handleDelete(scope.row.id)" type="danger" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页插件 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5,10,20]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 修改和新增窗口 -->
    <el-dialog title="编辑" :visible.sync="dialogFormVisible">
      <el-form label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="pojo.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="pojo.password"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="pojo.sex" filterable placeholder="请选择性别">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="头像">
          <el-input v-model="pojo.avatar"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="pojo.mobile"></el-input>
        </el-form-item>
        <el-form-item label="生日">
          <el-input v-model="pojo.birthday"></el-input>
        </el-form-item>
        <el-form-item label="爱好">
          <el-input v-model="pojo.interest"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="pojo.address"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-input v-model="pojo.role.desc"></el-input>
        </el-form-item>

        <el-button type="primary" @click="handleSave()">保存</el-button>
        <el-button @click="dialogFormVisible = false">关闭</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import userApi from "@/api/user";
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
      pojo: {
        role:{
          desc:''
        }
      }, // 编辑表单绑定的实体对象
      id: "" ,// 当前用户修改的ID
       options: [
        {
          value: "男",
          label: "男"
        },
        {
          value: "女",
          label: "女"
        }
      ],
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      userApi
        .search(this.currentPage, this.pageSize, this.searchMap)
        .then(response => {
          this.list = response.data.rows;
          this.total = response.data.total;
        });
    },
    handleSave() {
      userApi.update(this.id, this.pojo).then(response => {
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
      this.pojo.desc='';
      this.dialogFormVisible = true; // 打开窗口
      if (id !== "") {
        // 修改
        userApi.findById(id).then(response => {
          if (response.flag) {
            this.pojo = response.data;
          }
        });
      } else {
        this.pojo = {}; // 清空数据
        this.pojo.desc='默认';
      }
    },
    handleDelete(id) {
      this.$confirm("确定要删除此纪录吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        userApi.deleteById(id).then(response => {
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
    //时间格式化
    dateFormat: function(row, column) {
      var date = row[column.property];
      // console.log(date);dug用
      if (date == undefined) {
        return "";
      }
      return moment(date).format("YYYY-MM-DD");
    },
    // 分页
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize = val; //动态改变
      this.currentPage = 1;
      this.fetchData();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.currentPage = val; //动态改变
      this.fetchData();
    }
  }
};
</script>
