<template>
<div>
  <br>
  <el-form :inline="true">
          <el-form-item label="菜单名称">
<el-input v-model="searchMap.name" placeholder="菜单名称"></el-input></el-form-item>
          <el-form-item label="父菜单ID，一级菜单为0">
<el-input v-model="searchMap.parent_id" placeholder="父菜单ID，一级菜单为0"></el-input></el-form-item>
          <el-form-item label="菜单URL">
<el-input v-model="searchMap.url" placeholder="菜单URL"></el-input></el-form-item>
          <el-form-item label="授权(多个用逗号分隔，如：sys:user:add,sys:user:edit)">
<el-input v-model="searchMap.perms" placeholder="授权(多个用逗号分隔，如：sys:user:add,sys:user:edit)"></el-input></el-form-item>
          <el-form-item label="类型   0：目录   1：菜单   2：按钮">
<el-input v-model="searchMap.type" placeholder="类型   0：目录   1：菜单   2：按钮"></el-input></el-form-item>
          <el-form-item label="菜单图标">
<el-input v-model="searchMap.icon" placeholder="菜单图标"></el-input></el-form-item>
          <el-form-item label="排序">
<el-input v-model="searchMap.order_num" placeholder="排序"></el-input></el-form-item>
          <el-form-item label="创建人">
<el-input v-model="searchMap.create_by" placeholder="创建人"></el-input></el-form-item>
          <el-form-item label="创建时间">
<el-input v-model="searchMap.create_time" placeholder="创建时间"></el-input></el-form-item>
          <el-form-item label="更新人">
<el-input v-model="searchMap.last_update_by" placeholder="更新人"></el-input></el-form-item>
          <el-form-item label="更新时间">
<el-input v-model="searchMap.last_update_time" placeholder="更新时间"></el-input></el-form-item>
          <el-form-item label="是否删除  -1：已删除  0：正常">
<el-input v-model="searchMap.del_flag" placeholder="是否删除  -1：已删除  0：正常"></el-input></el-form-item>

    <el-button type="primary" @click="fetchData()">查询</el-button>
    <el-button type="primary" @click="handleEdit('')">新增</el-button>
  </el-form>
  <el-table
    :data="list"
    border
    style="width: 100%">
          <el-table-column prop="id" label="编号" width="80"></el-table-column>
          <el-table-column prop="name" label="菜单名称" width="80"></el-table-column>
          <el-table-column prop="parent_id" label="父菜单ID，一级菜单为0" width="80"></el-table-column>
          <el-table-column prop="url" label="菜单URL" width="80"></el-table-column>
          <el-table-column prop="perms" label="授权(多个用逗号分隔，如：sys:user:add,sys:user:edit)" width="80"></el-table-column>
          <el-table-column prop="type" label="类型   0：目录   1：菜单   2：按钮" width="80"></el-table-column>
          <el-table-column prop="icon" label="菜单图标" width="80"></el-table-column>
          <el-table-column prop="order_num" label="排序" width="80"></el-table-column>
          <el-table-column prop="create_by" label="创建人" width="80"></el-table-column>
          <el-table-column prop="create_time" label="创建时间" width="80"></el-table-column>
          <el-table-column prop="last_update_by" label="更新人" width="80"></el-table-column>
          <el-table-column prop="last_update_time" label="更新时间" width="80"></el-table-column>
          <el-table-column prop="del_flag" label="是否删除  -1：已删除  0：正常" width="80"></el-table-column>

    <el-table-column
      fixed="right"
      label="操作"
      width="100">
      <template slot-scope="scope">
        <el-button @click="handleEdit(scope.row.id)" type="text" size="small">修改</el-button>
        <el-button @click="handleDelete(scope.row.id)" type="text" size="small">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
      <el-pagination
      @size-change="fetchData"
      @current-change="fetchData"
      :current-page="currentPage"
      :page-sizes="[5,10,20]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>  
  <el-dialog title="编辑" :visible.sync="dialogFormVisible">
    <el-form label-width="80px">
        <el-form-item label="菜单名称"><el-input v-model="pojo.name"></el-input></el-form-item>
        <el-form-item label="父菜单ID，一级菜单为0"><el-input v-model="pojo.parent_id"></el-input></el-form-item>
        <el-form-item label="菜单URL"><el-input v-model="pojo.url"></el-input></el-form-item>
        <el-form-item label="授权(多个用逗号分隔，如：sys:user:add,sys:user:edit)"><el-input v-model="pojo.perms"></el-input></el-form-item>
        <el-form-item label="类型   0：目录   1：菜单   2：按钮"><el-input v-model="pojo.type"></el-input></el-form-item>
        <el-form-item label="菜单图标"><el-input v-model="pojo.icon"></el-input></el-form-item>
        <el-form-item label="排序"><el-input v-model="pojo.order_num"></el-input></el-form-item>
        <el-form-item label="创建人"><el-input v-model="pojo.create_by"></el-input></el-form-item>
        <el-form-item label="创建时间"><el-input v-model="pojo.create_time"></el-input></el-form-item>
        <el-form-item label="更新人"><el-input v-model="pojo.last_update_by"></el-input></el-form-item>
        <el-form-item label="更新时间"><el-input v-model="pojo.last_update_time"></el-input></el-form-item>
        <el-form-item label="是否删除  -1：已删除  0：正常"><el-input v-model="pojo.del_flag"></el-input></el-form-item>

        <el-button type="primary" @click="handleSave()">保存</el-button>
        <el-button @click="dialogFormVisible = false" >关闭</el-button>
    </el-form>
  </el-dialog>
</div>
</template>
<script>
import menuApi from '@/api/menu'
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
      cityList: [], // 城市列表
      id: '' // 当前用户修改的ID
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      menuApi.search(this.currentPage, this.pageSize, this.searchMap).then(response => {
        this.list = response.data.rows
        this.total = response.data.total
      })
    },
    handleSave() {
      menuApi.update(this.id, this.pojo).then(response => {
        this.$message({
          message: response.message,
          type: (response.flag ? 'success' : 'error')
        })
        if (response.flag) { // 如果成功
          this.fetchData() // 刷新列表
        }
      })
      this.dialogFormVisible = false // 关闭窗口
    },
    handleEdit(id) {
      this.id = id
      this.dialogFormVisible = true // 打开窗口
      if (id !== '') { // 修改
        menuApi.findById(id).then(response => {
          if (response.flag) {
            this.pojo = response.data
          }
        })
      } else {
        this.pojo = {} // 清空数据
      }
    },
    handleDelete(id) {
      this.$confirm('确定要删除此纪录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        menuApi.deleteById(id).then(response => {
          this.$message({ message: response.message, type: (response.flag ? 'success' : 'error') })
          if (response.flag) {
            this.fetchData() // 刷新数据
          }
        })
      })
    }
  }
}
</script>
