<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input :placeholder="$t('commodity.shopIdPlaceHolder')" v-model="listQuery.shopId" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('commodity.search') }}</el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column label="商品图片" width="80">
        <template slot-scope="scope">
          <img :src="scope.row['imgUrl']" class="shop_logo">
        </template>
      </el-table-column>
      <el-table-column prop="id" label="商品 ID" width="80"/>
      <el-table-column prop="name" label="商品名称"/>
      <el-table-column prop="price" label="商品价格" width="100"/>
      <el-table-column align="center" label="商品状态" width="100" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-tag>{{ commodityStatusMap[scope.row.isDeleted] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="270" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-if="scope.row.isDeleted === 2" size="mini" type="primary" @click="handleModifyStatus(scope.row, 5)">通过</el-button>
          <el-button v-if="scope.row.isDeleted === 2" size="mini" type="warning" @click="handleModifyStatus(scope.row, 3)">驳回</el-button>
          <el-button v-if="scope.row.isDeleted === 0" size="mini" type="info" @click="handleModifyStatus(scope.row, 4)">下架</el-button>
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
import { queryCommodity, modifyCommodityStatus } from '@/api/commodity'
import waves from '@/directive/waves' // 水波纹指令

export default {
  name: 'CommodityList',
  directives: {
    waves
  },
  data() {
    return {
      list: [],
      listLoading: false,
      total: null,
      listQuery: {
        shopId: '',
        pageNum: 1,
        pageSize: 20
      },
      commodityStatusMap: {},
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
      // this.listQuery.shopId = this.$store.getters.shop.id
      queryCommodity(this.listQuery).then(response => {
        this.list = response.data.commodityBoList
        this.commodityStatusMap = response.data.commodityStatusMap
        this.total = response.data.commodityTotal
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
    handleModifyStatus(row, status) {
      this.$confirm('确认执行此操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        modifyCommodityStatus({ id: row['id'], status: status }).then(response => {
          const index = this.list.indexOf(row)
          this.list[index].isDeleted = status
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
