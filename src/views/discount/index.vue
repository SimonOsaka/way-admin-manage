<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input :placeholder="$t('discount.discountIdPlaceHolder')" v-model="listQuery.discountId" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input :placeholder="$t('discount.commodityIdPlaceHolder')" v-model="listQuery.commodityId" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('discount.search') }}</el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column label="商品图片" width="80">
        <template slot-scope="scope">
          <img :src="scope.row['commodityImageUrl']" class="shop_logo">
        </template>
      </el-table-column>
      <el-table-column prop="id" label="优惠 ID"/>
      <el-table-column prop="commodityName" label="商品名称"/>
      <el-table-column prop="limitTimeExpire" label="过期时间" width="160"/>
      <el-table-column label="商品分类">
        <template slot-scope="scope">
          {{ scope.row.commodityCate | discountCommodityCate }}
        </template>
      </el-table-column>
      <el-table-column prop="commodityPrice" label="商品价格"/>
      <el-table-column prop="commodityId" label="商家商品 ID"/>
      <el-table-column prop="shopPosition" label="商家地址"/>
      <el-table-column align="center" label="操作" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-if="scope.row.isDeleted === 0" size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination :current-page="listQuery.pageNum" :page-sizes="[10,20,30,50]" :page-size="listQuery.pageSize" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
import { queryDiscount, deleteDiscount } from '@/api/discount'
import waves from '@/directive/waves' // 水波纹指令

export default {
  name: 'DiscountList',
  directives: {
    waves
  },
  data() {
    return {
      list: [],
      listLoading: false,
      total: null,
      listQuery: {
        discountId: '',
        commodityId: '',
        pageNum: 1,
        pageSize: 20
      },
      tableData: []
    }
  },
  created() {
    this.getList()
  },
  destroyed() {},
  methods: {
    getList() {
      this.listLoading = true
      queryDiscount(this.listQuery).then(response => {
        this.list = response.data.discountBoList
        this.total = response.data.discountTotal
        this.listLoading = false
      }, error => {
        console.error(error)
        this.listLoading = false
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
    handleDelete(row, status) {
      this.$confirm('确认执行此操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDiscount({ discountId: row['id'] }).then(response => {
          const index = this.list.indexOf(row)
          this.list.splice(index, 1)
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
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
