<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input :placeholder="$t('shop.shopNamePlaceholder')" v-model="listQuery.shopName" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('shop.search') }}</el-button>

      <el-checkbox-group v-model="checkboxVal">
        <el-checkbox label="shopAddress">商家地址</el-checkbox>
        <el-checkbox label="shopTel">商家电话</el-checkbox>
        <el-checkbox label="shopBusinessTime">商家营业时间</el-checkbox>
      </el-checkbox-group>
    </div>

    <el-table v-loading="listLoading" :data="list" :key="key" border fit highlight-current-row style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="商家信息">
              <span>{{ scope.row.shopInfo }}</span>
            </el-form-item>
            <el-form-item label="商家基础分类">
              <span>{{ scope.row.wayShopCateRoot.cateName }}</span>
            </el-form-item>
            <el-form-item label="商家子分类">
              <span>{{ scope.row.wayShopCateLeaf.cateName }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="商家logo" width="80">
        <template slot-scope="scope">
          <img :src="scope.row['shopLogoUrl']" class="shop_logo">
        </template>
      </el-table-column>
      <el-table-column prop="id" label="商家 ID" />
      <el-table-column prop="shopName" label="商家名称" width="180" />
      <el-table-column v-for="(shop, i) in formThead" :key="shop.prop.concat(i)" :label="shop.label">
        <template slot-scope="scope">
          {{ scope.row[shop.prop] }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="商家状态" width="100" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-tag>{{ shopStatusMap[scope.row['isDeleted']] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="180" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-if="scope.row.isDeleted === 2" size="mini" type="primary" @click="handleModifyStatus(scope.row, 5)">通过</el-button>
          <el-button v-if="scope.row.isDeleted === 2 || scope.row.isDeleted === 4" size="mini" type="warning" @click="handleModifyStatus(scope.row, 3)">驳回</el-button>
          <el-button v-if="scope.row.isDeleted === 0" size="mini" type="info" @click="handleModifyStatus(scope.row, 4)">下线</el-button>
          <el-button v-if="scope.row.isDeleted !== 1 && scope.row.isDeleted !== 0" size="mini" type="danger" @click="handleModifyStatus(scope.row, 1)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination :current-page="listQuery.pageNum" :page-sizes="[10,20,30,50]" :page-size="listQuery.pageSize" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
import { queryShopList, modifyShopStatus } from '@/api/shop'
import waves from '@/directive/waves' // 水波纹指令
const defaultFormThead = ['shopAddress', 'shopTel', 'shopBusinessTime']

export default {
  name: 'ShopList',
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
        shopName: undefined
      },
      shopStatusMap: {},
      tableData: [],
      key: 1, // table key
      formTheadOptions: [
        { label: '商家地址', prop: 'shopAddress' },
        { label: '商家电话', prop: 'shopTel' },
        { label: '商家营业时间', prop: 'shopBusinessTime' }
      ],
      checkboxVal: defaultFormThead, // checkboxVal
      formThead: [
        { label: '商家地址', prop: 'shopAddress' },
        { label: '商家电话', prop: 'shopTel' },
        { label: '商家营业时间', prop: 'shopBusinessTime' }
      ] // 默认表头 Default header
    }
  },
  watch: {
    checkboxVal(valArr) {
      this.formThead = this.formTheadOptions.filter(
        i => valArr.indexOf(i.prop) >= 0
      )
      this.key = this.key + 1 // 为了保证table 每次都会重渲 In order to ensure the table will be re-rendered each time
    }
  },
  created() {
    this.getList()
  },
  destroyed() {},
  methods: {
    getList() {
      this.listLoading = true
      queryShopList(this.listQuery).then(response => {
        this.list = response.data.shopBoList
        this.shopStatusMap = response.data.shopStatusMap
        this.total = response.data.shopBoTotal

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
    handleCreate() {
      this.$router.push({ path: '/shop/create' })
    },
    handleUpdate(row) {
      this.$router.push({ path: '/shop/update', query: {
        id: row['id']
      }})
    },
    handleModifyStatus(row, status) {
      this.$confirm('确认执行操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        modifyShopStatus({ id: row['id'], shopStatus: status }).then(response => {
          const index = this.list.indexOf(row)
          this.list[index].isDeleted = status
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

<style scoped>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>

