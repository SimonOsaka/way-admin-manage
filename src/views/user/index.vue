<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input :placeholder="$t('user.userIdPlaceHolder')" v-model="listQuery.id" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input :placeholder="$t('user.loginTelPlaceHolder')" v-model="listQuery.loginTel" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input :placeholder="$t('user.loginNamePlaceHolder')" v-model="listQuery.loginName" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('user.search') }}</el-button>

    </div>

    <el-table v-loading="listLoading" :data="list" :key="key" border fit highlight-current-row style="width: 100%">
      <el-table-column prop="id" label="用户 ID"/>
      <el-table-column prop="loginTel" label="用户手机"/>
      <el-table-column prop="loginName" label="用户名称"/>
      <el-table-column prop="createTime" label="用户注册时间" class-name="small-padding fixed-width"/>
      <el-table-column align="center" label="操作" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-if="scope.row.isUsed === 0" size="mini" type="text" plain @click="handleDisable(scope.row)">禁用</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination :current-page="listQuery.pageNum" :page-sizes="[10,20,30,50]" :page-size="listQuery.pageSize" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
import { queryUser, disableUser } from '@/api/user'
import waves from '@/directive/waves' // 水波纹指令

export default {
  name: 'UserList',
  directives: {
    waves
  },
  data() {
    return {
      list: null,
      total: null,
      listLoading: false,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        loginName: '',
        loginTel: '',
        id: null
      },
      tableData: [],
      key: 1 // table key
    }
  },
  created() {
    this.getList()
  },
  destroyed() {},
  methods: {
    getList() {
      this.listLoading = true
      queryUser(this.listQuery).then(response => {
        this.list = response.data.userLoginBoList
        this.total = response.data.userLoginTotal

        this.listLoading = false
      }, error => {
        this.listLoading = false
        console.error(error)
      })
    },
    handleFilter() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getList()
    },
    handleDisable(row) {
      this.$confirm('确认执行操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        disableUser({ id: row['id'] }).then(response => {
          const index = this.list.indexOf(row)
          this.list[index].isUsed = 1
          this.$message({
            type: 'success',
            message: '执行成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消执行'
        })
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.shop_logo {
  width: 64px;
  height: 64px;
}
</style>
