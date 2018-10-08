<template>
  <div style="display: inline-block;">
    <img :src="src" :style="customStyle" @click="onPreview()">

    <el-dialog :visible.sync="dialogVisible" title="预览" append-to-body>
      <img :src="src" class="preview">
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      default: ''
    },
    customStyle: {
      type: String,
      default: 'width: 128px; height: 128px;'
    }
  },
  data() {
    return {
      dialogVisible: false
    }
  },
  methods: {
    onPreview(url) {
      this.dialogVisible = true
    }
  }
}
</script>

<style scoped>
img {
  border: 1px dotted black;
}
.preview {
  height: 400px;
  width: 400px;
}
</style>
