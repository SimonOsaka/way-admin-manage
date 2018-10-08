<template>
  <div>
    <img :src="imageUrls[0]" :style="customStyle" @click="onPreview()">
    <el-dialog :visible.sync="dialogVisible" title="预览" append-to-body>
      <el-carousel>
        <el-carousel-item v-for="(imageUrl, i) in imageUrls" :key="i">
          <img :src="imageUrl" class="preview">
        </el-carousel-item>
      </el-carousel>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    imageUrls: {
      type: Array,
      default: function() {
        return []
      }
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
    onPreview() {
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
  height: 240px;
  width: 320px;
}
</style>
