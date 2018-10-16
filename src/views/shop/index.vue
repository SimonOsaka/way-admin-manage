<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input :placeholder="$t('shop.shopIdPlaceHolder')" v-model="listQuery.id" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
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
            <el-form-item label="商家资质">
              <el-button v-if="scope.row['wayShopQualification']" type="text" @click="handleQualify(scope.row['wayShopQualification'])">查看资质</el-button>
              <span v-else style="color: red;">无资质</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="商家logo" width="80">
        <template slot-scope="scope">
          <image-preview :src="scope.row['shopLogoUrl']" :custom-style="logoStyle"/>
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
          <el-button-group>
            <el-button v-if="scope.row.isDeleted === 2" size="mini" type="primary" @click="handleModifyStatus(scope.row, 5)">通过</el-button>
            <el-button v-if="scope.row.isDeleted === 2 || scope.row.isDeleted === 4" size="mini" type="warning" @click="handleReject(scope.row, 3)">驳回</el-button>
            <el-button v-if="scope.row.isDeleted === 0" size="mini" type="info" @click="handleModifyStatus(scope.row, 4)">下线</el-button>
            <el-button v-if="scope.row.isDeleted !== 1 && scope.row.isDeleted !== 0" size="mini" type="danger" @click="handleModifyStatus(scope.row, 1)">删除</el-button>
            <el-button size="mini" @click="handleShopLogDetail(scope.row)">日志</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="shopLog.dialogShopLogVisable" title="日志列表" >
      <el-table v-loading="shopLog.logLoading" :data="shopLog.logList" :max-height="400">
        <el-table-column width="80" align="left" property="typeDesc" label="类型"/>
        <el-table-column width="50" align="left" property="sourceDesc" label="平台"/>
        <el-table-column width="300" align="left" property="content" label="内容"/>
        <el-table-column width="150" align="left" property="createTime" label="日期"/>
      </el-table>
    </el-dialog >

    <el-dialog :visible.sync="qualification.dialogVisible" title="商家资质">
      <div style="max-height: 400px; overflow-y: auto;">
        <el-row>
          <el-col :span="8">
            <label>身份证正面</label><image-preview :src="qualification.idcardFrontUrl"/>
          </el-col>
          <el-col :span="8">
            <label>身份证反面</label><image-preview :src="qualification.idcardBackUrl"/>
          </el-col>
          <el-col :span="8">
            <label>手持身份证</label><image-preview :src="qualification.idcardHandUrl"/>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <label>商家门面照片</label><image-preview :src="qualification.shopOutsideUrl"/>
          </el-col>
          <el-col :span="8">
            <label>商家内部照片</label><image-preview :src="qualification.shopInsideUrl"/>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <label style="display:block;">商家资质</label><image-preview :src="qualification.businessLicenseUrl"/>
          </el-col>
          <el-col :span="8"/>
          <el-col :span="8"/>
        </el-row>
        <el-row v-if="qualification.other1Url">
          <el-col :span="24">
            <label style="display:block;">其它资料</label>
            <image-preview v-if="qualification.other1Url" :src="qualification.other1Url"/>
            <image-preview v-if="qualification.other2Url" :src="qualification.other2Url"/>
            <image-preview v-if="qualification.other3Url" :src="qualification.other3Url"/>
            <image-preview v-if="qualification.other4Url" :src="qualification.other4Url"/>
            <image-preview v-if="qualification.other5Url" :src="qualification.other5Url"/>
          </el-col>
        </el-row>
      </div>
    </el-dialog>

    <div class="pagination-container">
      <el-pagination :current-page="listQuery.pageNum" :page-sizes="[10,20,30,50]" :page-size="listQuery.pageSize" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
import { queryShopList, modifyShopStatus, queryShopLogList } from '@/api/shop'
import { getShopQualification } from '@/api/qualification'
import waves from '@/directive/waves' // 水波纹指令
import imagePreview from '@/components/ImagePreview/imagePreview'
const defaultFormThead = ['shopAddress', 'shopTel', 'shopBusinessTime']

export default {
  name: 'ShopList',
  components: {
    imagePreview
  },
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
        shopName: undefined,
        id: undefined
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
      ], // 默认表头 Default header
      shopLog: {
        logLoading: false,
        logList: [],
        dialogShopLogVisable: false
      },
      qualification: {
        dialogVisible: false,
        idcardFrontUrl: '',
        idcardBackUrl: '',
        idcardHandUrl: '',
        shopInsideUrl: '',
        shopOutsideUrl: '',
        businessLicenseUrl: '',
        other1Url: '',
        other2Url: '',
        other3Url: '',
        other4Url: '',
        other5Url: ''
      },
      logoStyle: 'width: 64px; height: 64px; border: none;'
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
        modifyShopStatus({ id: row['id'], shopStatus: status, rejectContent: value }).then(response => {
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
    handleShopLogDetail(row) {
      this.shopLog.dialogShopLogVisable = true
      this.logLoading = true
      queryShopLogList({ shopId: row['id'] }).then(response => {
        this.shopLog.logList = response.data.shopLogBoList

        this.shopLog.logLoading = false
      }, error => {
        this.shopLog.logList = []
        this.shopLog.logLoading = false
        console.error(error)
      })
    },
    handleQualify(q) {
      console.log(q)
      getShopQualification({ id: q['id'] }).then(response => {
        const data = response.data
        if (!data['shopQualificationBo']) {
          return
        }
        const shopQualificationBo = data['shopQualificationBo']
        this.qualification.idcardFrontUrl = shopQualificationBo.idcardFrontImgUrl
        this.qualification.idcardBackUrl = shopQualificationBo.idcardBackImgUrl
        this.qualification.idcardHandUrl = shopQualificationBo.idcardHandImgUrl
        this.qualification.shopInsideUrl = shopQualificationBo.shopInsideImgUrl
        this.qualification.shopOutsideUrl = shopQualificationBo.shopOutsideImgUrl
        this.qualification.businessLicenseUrl = shopQualificationBo.businessLicenseImgUrl
        this.qualification.other1Url = shopQualificationBo.other1ImgUrl
        this.qualification.other2Url = shopQualificationBo.other2ImgUrl
        this.qualification.other3Url = shopQualificationBo.other3ImgUrl
        this.qualification.other4Url = shopQualificationBo.other4ImgUrl
        this.qualification.other5Url = shopQualificationBo.other5ImgUrl
        this.qualification.dialogVisible = true
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

