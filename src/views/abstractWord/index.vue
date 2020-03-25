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
        <el-form ref="form" :model="form" label-width="100px">
          <el-form-item label="商家子分类">
            <el-cascader
              v-model="selectedOption"
              :options="cateList"
              :disabled="cascaderDisabled"
              expand-trigger="hover"/>
          </el-form-item>
          <el-form-item label="当前节点名称">
            <div>{{ showParentNodeName }}</div>
            <el-popover
              v-model="popoverVisiable"
              placement="bottom"
              width="160">
              <el-input v-model="newNodeName"/>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="popoverVisiable = false">取消</el-button>
                <el-button type="primary" size="mini" plain @click="onEdit">确定</el-button>
              </div>
              <el-button slot="reference" type="text">修改名称</el-button>
            </el-popover>
            <el-button type="text" @click="onDelete">删除</el-button>
          </el-form-item>
          <el-form-item label="关联词名称">
            <el-input v-model="form.name"/>
          </el-form-item>
          <el-form-item>
            <el-button :loading="submitLoading" type="primary" plain @click="onSubmit">创建</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { queryAbstractWord, createAbstractWord, deleteAbstractWord, updateAbstractWord } from '@/api/abstractWord'
import { queryAllCate } from '@/api/shopCate'
import waves from '@/directive/waves' // 水波纹指令

export default {
  name: 'AbstractWord',
  directives: {
    waves
  },
  data() {
    return {
      form: {
        name: '',
        pid: 0,
        shopCateLeafId: 0
      },
      showParentNodeName: '',
      list: [],
      listQuery: {
        pid: 0
      },
      props: {
        label: 'name',
        isLeaf: 'leaf'
      },
      cateList: [],
      cateLeafMap: {},
      selectedOption: [],
      cascaderDisabled: false,
      popoverVisiable: false,
      newNodeName: '',
      submitLoading: false
    }
  },
  created() {
    this.loadAllShopCate()
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
    loadAllShopCate() {
      queryAllCate().then(response => {
        const cateRootList = response.data.cateRootBoList
        cateRootList.forEach(rootCate => {
          const leafCateList = rootCate.leafList
          const childrenList = []
          leafCateList.forEach(leafCate => {
            childrenList.push({ label: leafCate.cateName, value: leafCate.id })
            this.cateLeafMap[leafCate.id] = rootCate.id
          })
          this.cateList.push({ label: rootCate.cateName, value: rootCate.id, children: childrenList })
        })
      })
    },
    onSubmit() {
      console.log('submit!')
      if (this.selectedOption.length !== 2) {
        this.$message({
          message: '选择商家分类',
          type: 'warning'
        })
        return
      }
      if (this.form.name === '') {
        this.$message({
          message: '输入新的抽象词！',
          type: 'warning'
        })
        return
      }
      const currentNodeId = this.$refs.tree.getCurrentKey()
      if (currentNodeId === null) {
        this.$message({
          message: '选择一个节点！',
          type: 'warning'
        })
        return
      }
      this.form.pid = currentNodeId
      this.form.shopCateLeafId = this.selectedOption[this.selectedOption.length - 1]
      console.log(this.selectedOption)
      this.submitLoading = true
      createAbstractWord(this.form).then(response => {
        this.submitLoading = false
        this.form.name = ''
        queryAbstractWord({ pid: currentNodeId }).then(response => {
          const wordBo = response.data.commodityAbstractWordBo
          const wordList = wordBo.commodityAbstractWordList
          const willUpdateChildren = []
          wordList.forEach(word => {
            willUpdateChildren.push({
              id: word.id,
              name: word.name,
              leaf: word.leaf === 1,
              shopCateLeafId: word.shopCateLeafId
            })
          })
          console.log(willUpdateChildren)
          const currentNode = this.$refs.tree.getNode({ id: currentNodeId })
          // 新增第一个子节点未刷新的解决方法，开始
          currentNode.data.leaf = false
          currentNode.indeterminate = false
          currentNode.isLeaf = false
          currentNode.isLeafByUser = false
          currentNode.expanded = true
          // 新增第一个子节点未刷新的解决方法，结束
          console.log(currentNode)
          this.$refs.tree.setCurrentNode(currentNode)
          this.$refs.tree.updateKeyChildren(currentNodeId, willUpdateChildren)
          this.$refs.tree.setCurrentKey(currentNodeId)

          this.$message({
            message: '创建抽象词成功！',
            type: 'success'
          })
        }, error => {
          console.error(error)
        })
      }, error => {
        this.submitLoading = false
        console.error(error)
      })
    },
    onEdit() {
      const currentNodeId = this.$refs.tree.getCurrentKey()
      if (currentNodeId === null || currentNodeId === 0) {
        this.$message({
          message: '根节点不能修改，选择其它节点！',
          type: 'warning'
        })
        return
      }
      if (this.newNodeName === '') {
        this.$message({
          message: '输入新的抽象词名称！',
          type: 'warning'
        })
        return
      }
      updateAbstractWord({ name: this.newNodeName, id: currentNodeId }).then(response => {
        const currentNode = this.$refs.tree.getNode({ id: currentNodeId })
        currentNode.data.name = this.newNodeName
        this.showParentNodeName = this.newNodeName
        this.popoverVisiable = false
      })
    },
    onDelete() {
      const currentNodeId = this.$refs.tree.getCurrentKey()
      if (currentNodeId === null || currentNodeId === 0) {
        this.$message({
          message: '只能删除子节点！',
          type: 'warning'
        })
        return
      }
      this.$confirm('删除【' + this.showParentNodeName + '】, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = { id: currentNodeId }
        deleteAbstractWord(data).then(response => {
          this.$refs.tree.remove(data)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleNodeClick(data) {
      console.log(data)
      if (data.id === 0) {
        this.cascaderDisabled = false
        if (this.selectedOption.length > 0) {
          this.selectedOption = []
        }
      } else {
        this.cascaderDisabled = true
        const shopCateRootId = this.cateLeafMap[data.shopCateLeafId]
        const shopCateLeafId = data.shopCateLeafId
        this.selectedOption = [shopCateRootId, shopCateLeafId]
      }

      this.showParentNodeName = data.name
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
