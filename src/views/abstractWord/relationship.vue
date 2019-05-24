<template>
  <div class="app-container">
    <el-row>
      <el-col :span="8">
        <el-tree
          ref="tree"
          :props="props"
          :load="loadNode"
          :expand-on-click-node="false"
          node-key="id"
          lazy
          highlight-current
          @node-click="handleNodeClick"/>
      </el-col>
      <el-col :span="16">
        <el-select
          v-model="selectedOptions"
          :remote-method="remoteMethod"
          :loading="loading"
          multiple
          filterable
          remote
          reserve-keyword
          placeholder="请输入关键词">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
        <el-button :loading="submitLoading" type="primary" @click="onSubmit">保存</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { queryAbstractWord, queryAbstractWordByName, queryAbstractWordRelationship, saveAbstractWordRelationship } from '@/api/abstractWord'
import waves from '@/directive/waves' // 水波纹指令

export default {
  name: 'AbstractWordRelationship',
  directives: {
    waves
  },
  data() {
    return {
      list: [],
      listQuery: {
      },
      props: {
        label: 'name',
        isLeaf: 'leaf'
      },
      submitLoading: false,
      /*
       * select
       */
      loading: false,
      options: [],
      selectedOptions: []
    }
  },
  created() {
  },
  destroyed() {},
  methods: {
    loadNode(node, resolve) {
      console.log(node)
      if (node.level === 0) {
        return resolve([{ id: 0, name: '抽象词树（点击创建根节点）', leaf: false }])
      }
      this.listQuery.pid = node.data.id
      this.getTreeNodes(resolve)
    },
    getTreeNodes(callback) {
      queryAbstractWord(this.listQuery).then(response => {
        const wordBo = response.data.commodityAbstractWordBo
        const wordList = wordBo.commodityAbstractWordList
        this.list = []
        wordList.forEach(word => {
          this.list.push({
            id: word.id,
            name: word.name,
            leaf: word.leaf === 1,
            shopCateLeafId: word.shopCateLeafId
          })
        })
        callback(this.list)
      }, error => {
        console.error(error)
      })
    },
    remoteMethod(query) {
      console.log(query)
      if (query === '') {
        this.options = []
        return
      }

      this.loading = true
      setTimeout(() => {
        this.loading = false
        queryAbstractWordByName({ name: query, leaf: 1 }).then(response => {
          const commodityAbstractWordBo = response.data.commodityAbstractWordBo
          const abstractWordMapList = commodityAbstractWordBo.abstractWordMapList
          if (abstractWordMapList.length > 0) {
            this.options = abstractWordMapList.map(item => {
              return { value: item.id, label: item.fullPathName }
            })
          }
        })
      }, 500)
    },
    onSubmit() {
      console.log('submit!')
      const currentNodeId = this.$refs.tree.getCurrentKey()
      if (currentNodeId === null) {
        this.$message({
          message: '选择一个节点！',
          type: 'warning'
        })
        return
      }
      const currentNodeData = this.$refs.tree.getCurrentNode()
      console.log(currentNodeData)
      if (!currentNodeData.leaf) {
        this.$message({
          message: '选择一个叶子节点！',
          type: 'warning'
        })
        return
      }
      console.log(this.selectedOptions)
      this.submitLoading = true
      saveAbstractWordRelationship({ abstractWordId: currentNodeId, abstractWordIdList: this.selectedOptions }).then(response => {
        this.submitLoading = false
        this.$message({
          message: '保存抽象词关联成功！',
          type: 'success'
        })
      }, error => {
        console.log(error)
        this.submitLoading = false
      })
    },
    handleNodeClick(data) {
      console.log(data)
      if (data.id === 0 || !data.leaf) {
        return
      }
      this.selectedOptions = []
      queryAbstractWordRelationship({ abstractWordId: data.id }).then(response => {
        const abstractWordRelationshipBoList = response.data.abstractWordRelationshipBoList
        if (abstractWordRelationshipBoList.length > 0) {
          const abstractWordRelationshipList = abstractWordRelationshipBoList[0].abstractWordRelationshipList
          this.options = abstractWordRelationshipList.map(item => {
            return { value: item.abstractWordId, label: item.fullName }
          })
          this.selectedOptions = abstractWordRelationshipList.map(item => {
            return item.abstractWordId
          })
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
