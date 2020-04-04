<template>
  <div class="app-container">
    <el-form ref="listQuery" :model="listQuery" label-position="left">
      <el-row>
        <el-col :span="8">
          <el-form-item>
            <el-input v-model="listQuery.keywords" :maxlength="20" placeholder="输入关键字"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item>
            <el-input v-model="listQuery.postId" :maxlength="20" placeholder="输入ID"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" plain @click="getList">查询</el-button>
        </el-col>
      </el-row>
    </el-form>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.postId }}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="状态" width="110">
        <template slot-scope="{row}">
          <el-tag :type="row.postStatus | statusFilter">
            {{ row.postStatus | statusTextFilter }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column min-width="300px" label="标题">
        <template slot-scope="{row}">
          <router-link :to="'/article/detail/'+row.postId" class="link-type">
            <span>{{ row.subject }}</span>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="scope">
          <el-popconfirm title="确定审核吗？" confirm-button-text="通过并发布" cancel-button-text="驳回" icon="el-icon-info" icon-color="red" @onConfirm="onConfirm(scope.row.postId)" @onCancel="onCancel(scope.row.postId)">
            <el-button slot="reference">审核</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList" />
  </div>
</template>

<script>
import { fetchList, auditArticle } from '@/api/article'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'ArticleList',
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: 'success',
        1: 'danger',
        2: 'warning',
        3: 'info'
      }
      return statusMap[status]
    },
    statusTextFilter(status) {
      const statusMap = {
        0: '已发布',
        1: '已删除',
        2: '审核中',
        3: '草稿'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        keywords: '',
        postId: undefined,
        page: 1,
        pageSize: 20
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    onConfirm(postId) {
      console.log('onConfirm')
      auditArticle({ postId, pass: 1 }).then(response => {
        this.$message({
          message: '通过成功',
          type: 'success',
          showClose: true,
          duration: 1000
        })
        this.getList()
      })
    },
    onCancel(postId) {
      this.$prompt('请输入驳回内容', '提示', {
        confirmButtonText: '驳回',
        cancelButtonText: '取消',
        inputValidator: (value) => {
          if (!value) return false
          return true
        },
        inputErrorMessage: '必须要填写内容'
      }).then(({ value }) => {
        auditArticle({ postId, pass: 0, rejectContent: value }).then(response => {
          this.$message({
            message: '驳回成功',
            type: 'success',
            showClose: true,
            duration: 1000
          })

          this.getList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入驳回内容'
        })
      })
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
