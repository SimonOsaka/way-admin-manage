<template>
  <div class="app-container">
    <div>用户信息</div>
    <el-input v-model="input" :maxlength="11" placeholder="请输入内容" class="input-with-select">
      <el-select slot="prepend" v-model="select" placeholder="请选择" style="width: 110px;">
        <el-option label="手机号" value="1"/>
        <el-option label="用户名称" value="2"/>
      </el-select>
      <el-button slot="append" icon="el-icon-search" @click="handleSearchUser"/>
    </el-input>
    <el-row>
      <el-col>
        <el-card class="box-card">
          <div>
            注册日期：{{ user.regDate }}
          </div>
          <div>
            是否可以合并：{{ result }}
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { queryUser } from '@/api/user'
import { querySpUserShop } from '@/api/spUserShop'
import waves from '@/directive/waves' // 水波纹指令

export default {
  name: 'UserPanel',
  directives: {
    waves
  },
  data() {
    return {
      input: '',
      select: '1',
      user: {
        id: '',
        regDate: ''
      },
      result: ''
    }
  },
  created() {
  },
  destroyed() {},
  methods: {
    handleSearchUser() {
      if (this.input === '') {
        return
      }
      this.user.regDate = ''
      const userInput = { pageNum: 1, pageSize: 1 }
      if (this.select === '1') {
        userInput.loginTel = this.input
      } else if (this.select === '2') {
        userInput.loginName = this.input
      } else {
        return
      }
      queryUser(userInput).then(response => {
        const userList = response.data.userLoginBoList
        const userListCount = response.data.userLoginTotal
        if (userListCount > 0) {
          const userOneList = userList.map(item => {
            return { id: item.id, regDate: item.createTime }
          })
          this.user = userOneList[0]
          querySpUserShop({ userLoginId: this.user.id }).then(response => {
            const spUserShopList = response.data.spUserShopList
            console.log(spUserShopList.length)
            if (spUserShopList.length === 0) {
              this.result = '可以合并'
              this.$emit('userSearch', this.user.id)
            } else {
              this.result = '不可以合并'
            }
          })
        } else {
          this.result = '不可以合并，用户不存在'
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-select .el-input {
  width: 130px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
</style>
