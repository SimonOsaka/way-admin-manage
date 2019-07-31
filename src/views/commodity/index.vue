<template>
  <div class="app-container">

    <div class="filter-container">
      <el-row>
        <el-col :span="5">
          <el-input :placeholder="$t('commodity.commodityIdPlaceHolder')" v-model="listQuery.id" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-col>
        <el-col :span="5">
          <el-input :placeholder="$t('commodity.shopIdPlaceHolder')" v-model="listQuery.shopId" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-col>
        <el-col :span="5">
          <el-select v-model="listQuery.status" style="width: 200px;" clearable placeholder="商品状态">
            <el-option
              v-for="item in commodityStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-col>
        <el-col :span="5">
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('commodity.search') }}</el-button>
        </el-col>
      </el-row>
    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column label="商品图片" width="80">
        <template slot-scope="scope">
          <gallery-preview :image-urls="scope.row['imageUrls']" :custom-style="imageStyle"/>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="商品 ID" width="80"/>
      <el-table-column prop="name" label="商品名称"/>
      <el-table-column prop="price" align="center" label="商品价格" width="100"/>
      <el-table-column align="center" label="商品状态" width="100" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-tag>{{ commodityStatusMap[scope.row.isDeleted] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="270" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button-group>
            <el-button v-if="scope.row.isDeleted === 2" size="mini" type="primary" @click="handleModifyStatus(scope.row, 5)">通过</el-button>
            <el-button v-if="scope.row.isDeleted === 2" size="mini" type="warning" @click="handleReject(scope.row, 3)">驳回</el-button>
            <el-button v-if="scope.row.isDeleted === 0" size="mini" type="info" @click="handleModifyStatus(scope.row, 4)">下架</el-button>
            <el-button v-if="scope.row.isDeleted !== 1 && scope.row.isDeleted !== 0" size="mini" type="danger" @click="handleModifyStatus(scope.row, 1)">删除</el-button>
            <el-button size="mini" @click="handleCommodityLogDetail(scope.row)">日志</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="commodityLog.dialogCommodityLogVisable" title="日志列表" >
      <el-table v-loading="commodityLog.logLoading" :data="commodityLog.logList" :max-height="400">
        <el-table-column width="80" align="left" property="typeDesc" label="类型"/>
        <el-table-column width="50" align="left" property="sourceDesc" label="平台"/>
        <el-table-column width="300" align="left" property="content" label="内容"/>
        <el-table-column width="150" align="left" property="createTime" label="日期"/>
      </el-table>
    </el-dialog >

    <div class="pagination-container">
      <el-pagination :current-page="listQuery.pageNum" :page-sizes="[10,20,30,50]" :page-size="listQuery.pageSize" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
import { queryCommodity, modifyCommodityStatus, queryCommodityLogList, queryAllCommodityStatus } from '@/api/commodity'
import waves from '@/directive/waves' // 水波纹指令
import galleryPreview from '@/components/ImagePreview/galleryPreview'

export default {
  name: 'CommodityList',
  components: {
    galleryPreview
  },
  directives: {
    waves
  },
  data() {
    return {
      list: [],
      listLoading: false,
      total: null,
      listQuery: {
        id: '',
        shopId: '',
        status: undefined,
        pageNum: 1,
        pageSize: 20
      },
      commodityStatusMap: {},
      commodityStatusOptions: [],
      tableData: [],
      commodityLog: {
        logLoading: false,
        logList: [],
        dialogCommodityLogVisable: false
      },
      imageStyle: 'width: 64px; height: 64px; border: none;'
    }
  },
  created() {
    queryAllCommodityStatus().then(response => {
      this.commodityStatusMap = response.data.commodityStatusMap
      for (const commodityStatusKey in this.commodityStatusMap) {
        if (this.commodityStatusMap.hasOwnProperty(commodityStatusKey)) {
          const commodityStatusValue = this.commodityStatusMap[commodityStatusKey]
          this.commodityStatusOptions.push({
            value: commodityStatusKey,
            label: commodityStatusValue
          })
        }
      }
      const commodityStatusDefault = response.data.commodityStatusDefault
      this.listQuery.status = commodityStatusDefault
      this.getList()
    })
  },
  destroyed() {},
  methods: {
    getList() {
      this.listLoading = true
      // this.listQuery.shopId = this.$store.getters.shop.id
      queryCommodity(this.listQuery).then(response => {
        this.list = response.data.commodityBoList
        if (this.list) {
          this.list.forEach(element => {
            element['imageUrls'] = []
            if (element['imgUrl']) {
              element['imageUrls'].push(element['imgUrl'])
            }
            if (element['imgUrl1']) {
              element['imageUrls'].push(element['imgUrl1'])
            }
            if (element['imgUrl2']) {
              element['imageUrls'].push(element['imgUrl2'])
            }
            if (element['imgUrl3']) {
              element['imageUrls'].push(element['imgUrl3'])
            }
            if (element['imgUrl4']) {
              element['imageUrls'].push(element['imgUrl4'])
            }
          })
        }
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
    },
    handleReject(row, status) {
      this.$prompt('请输入驳回原因', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValidator: (value) => {
          console.log(value)
          if (value === '') {
            return '请输入驳回原因'
          } else if (value < 1 || value > 100) {
            return '驳回原因在1-100字之间'
          }
          return true
        }
      }).then(({ value }) => {
        modifyCommodityStatus({ id: row['id'], status: status, rejectContent: value }).then(response => {
          const index = this.list.indexOf(row)
          this.list[index].isDeleted = status
          this.$message({
            type: 'success',
            message: '驳回成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消驳回'
        })
      })
    },
    handleCommodityLogDetail(row) {
      this.commodityLog.dialogCommodityLogVisable = true
      this.logLoading = true
      queryCommodityLogList({ commodityId: row['id'] }).then(response => {
        this.commodityLog.logList = response.data.commodityLogBoList
        this.commodityLog.logLoading = false
      }, error => {
        this.commodityLog.logList = []
        this.commodityLog.logLoading = false
        console.error(error)
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
