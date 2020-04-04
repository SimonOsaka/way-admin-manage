<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" label-position="top" class="form-container">

      <div class="createPost-main-container">

        <el-form-item label="主题">
          <div v-html="postForm.subject"/>
        </el-form-item>

        <el-form-item label="商品">
          <div v-html="commodityListOptions[0]['label']"/>
        </el-form-item>

        <el-form-item label="内容">
          <div v-html="postForm.postContent"/>
        </el-form-item>

      </div>
    </el-form>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import { fetchArticle } from '@/api/article'

const defaultForm = {
  subject: '', // 文章题目
  postContent: '', // 文章内容
  commodityId: undefined, // 商品id
  postId: undefined
}

export default {
  name: 'ArticleDetail',
  components: { Tinymce },
  data() {
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      status: 'draft',
      commodityListOptions: []
    }
  },
  created() {
    const id = this.$route.params && this.$route.params.id
    this.fetchData(id)
  },
  methods: {
    fetchData(id) {
      fetchArticle(id).then(response => {
        const data = response.data

        this.postForm.postId = id
        this.postForm.subject = data.subject
        this.postForm.postContent = data.postContent
        this.commodityListOptions.push({ label: data.commodityName, value: data.commodityId })
        this.postForm.commodityId = data.commodityId

        // set page title
        this.setPageTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    setPageTitle() {
      const title = 'Edit Article'
      document.title = `${title} - ${this.postForm.postId}`
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 20px 45px 20px 50px;
  }

}

.label-color {
  color: #ccc;
}

</style>
