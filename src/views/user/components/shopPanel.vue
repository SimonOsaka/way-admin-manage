<template>
  <div class="app-container">
    <div>商家信息</div>
    <el-select v-model="select" :loading="loading" :remote-method="remoteMethod" style="height: 48px;" placeholder="请选择" filterable remote clearable @change="handleSelected">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
        <div>
          <div style="line-height: 14px;">
            <span>{{ item.label }}</span>
          </div>
          <span style="font-size: 12px; color: #b4b4b4;">{{ item.address }}</span>
        </div>
      </el-option>
    </el-select>
    <el-row>
      <el-col>
        <el-card class="box-card">
          <div>
            商家名称：{{ shop.name }}
          </div>
          <div>
            地址：{{ shop.address }}
          </div>
          <div>
            是否可以合并：{{ shop.result }}
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { queryShopList, getShop } from '@/api/shop'
import { querySpUserShop } from '@/api/spUserShop'
import waves from '@/directive/waves' // 水波纹指令

export default {
  name: 'ShopPanel',
  directives: {
    waves
  },
  data() {
    return {
      select: '',
      loading: false,
      options: [],
      shop: {
        id: '',
        name: '',
        address: '',
        result: ''
      }
    }
  },
  created() {
  },
  destroyed() {},
  methods: {
    handleSelected(value) {
      console.log(value)
      getShop({ id: value }).then(response => {
        const shop = response.data.shopBo
        this.shop.id = value
        this.shop.name = shop.shopName
        this.shop.address = shop.shopAddress
        querySpUserShop({ shopId: value }).then(response => {
          const spUserShopList = response.data.spUserShopList
          if (spUserShopList.length > 0) {
            const spUserShop = spUserShopList[0]
            if (spUserShop.userLoginId === 0) {
              this.shop.result = '可以合并'
              this.$emit('shopSearch', this.shop.id)
            } else {
              this.shop.result = '不可以合并，已经绑定用户'
            }
          } else {
            this.shop.result = '可以合并'
          }
        })
      })
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          queryShopList({ shopName: query }).then(response => {
            const shopList = response.data.shopBoList
            this.options = shopList.map(item => {
              return { value: item.id, label: item.shopName, address: item.shopAddress }
            })
          })
        }, 1000)
      } else {
        this.options = []
      }
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
