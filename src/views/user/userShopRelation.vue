<template>
  <div class="app-container">
    <el-row>
      <el-col :span="11">
        <userPanel @userSearch="handleUserSearch"/>
      </el-col>
      <el-col :span="2" style="text-align: center; font-size: 48px; padding: 48px 0 0 0;">+</el-col>
      <el-col :span="11">
        <shopPanel @shopSearch="handleShopSearch"/>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="2" :push="11">
        <el-button :loading="loading" type="primary" @click="handleBtnSubmit">提交</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { querySpUserShop, updateSpUserShop } from '@/api/spUserShop'
import userPanel from './components/userPanel'
import shopPanel from './components/shopPanel'
import waves from '@/directive/waves' // 水波纹指令

export default {
  name: 'UserList',
  components: { userPanel, shopPanel },
  directives: {
    waves
  },
  data() {
    return {
      loading: false,
      userLoginId: '',
      shopId: ''
    }
  },
  created() {
  },
  destroyed() {},
  methods: {
    handleUserSearch(value) {
      console.log(value)
      this.userLoginId = value
    },
    handleShopSearch(value) {
      console.log(value)
      this.shopId = value
    },
    handleBtnSubmit() {
      console.log(this.userLoginId, this.shopId)
      if (this.userLoginId === '' || this.shopId === '') {
        return
      }
      this.loading = true
      querySpUserShop({ shopId: this.shopId }).then(response => {
        const spUserShopList = response.data.spUserShopList
        if (spUserShopList.length > 0) {
          const spUserShop = spUserShopList[0]
          if (spUserShop.userLoginId === 0) {
            updateSpUserShop({ id: spUserShop.id, userLoginId: this.userLoginId }).then(response => {
              this.loading = false
              this.userLoginId = ''
              this.shopId = ''
              this.$message({
                message: '关联用户商家成功！',
                type: 'success'
              })
            }, error => {
              console.error(error)
              this.loading = false
            })
          }
        }
      }, error => {
        console.error(error)
        this.loading = false
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
