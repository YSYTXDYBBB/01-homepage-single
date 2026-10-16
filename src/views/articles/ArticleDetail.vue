<!-- src/views/articles/ArticleDetail.vue —— 文章详情（动态路由 :id） -->
<template>
  <div v-if="article" class="article-detail-view">
    <div class="detail-head">
      <h3>{{ article.title }}</h3>
      <div class="article-meta">
        <el-tag size="small" effect="dark">{{ article.category }}</el-tag>
        <span class="article-date">
          <el-icon><Calendar /></el-icon> {{ article.createdAt }}
        </span>
      </div>
    </div>

    <!-- el-alert：摘要提示框 -->
    <el-alert
      class="article-summary-alert"
      type="success"
      :closable="false"
      show-icon
      title="摘要"
      :description="article.summary"
    />

    <el-divider content-position="left">正文</el-divider>
    <div class="article-content">
      <p v-for="(para, idx) in paragraphs" :key="idx">{{ para }}</p>
    </div>

    <div class="detail-actions">
      <el-button type="primary" @click="toList">返回列表</el-button>
      <el-button @click="goBack">返回上一页</el-button>
    </div>
  </div>

  <!-- 无效文章编号处理：el-result 结果页 -->
  <el-result
    v-else
    icon="warning"
    title="文章不存在"
    :sub-title="`编号为 ${id} 的文章未找到，可能已被删除或地址有误。`"
  >
    <template #extra>
      <el-button type="primary" @click="toList">返回文章列表</el-button>
    </template>
  </el-result>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useArticleStore } from '../../stores/articleStore'

const route = useRoute()
const router = useRouter()

const articleStore = useArticleStore()
// getter（返回函数）可直接通过 store 实例访问
const { getArticleById } = articleStore

const id = computed(() => route.params.id)
const article = computed(() => getArticleById(id.value))

// 将正文按换行符拆分为段落
const paragraphs = computed(() => {
  if (!article.value) return []
  return article.value.content.split('\n').filter((p) => p.trim())
})

const toList = () => {
  router.push({ name: 'article-list' })
}

const goBack = () => {
  router.go(-1)
}
</script>

<style scoped>
.detail-head {
  margin-bottom: 16px;
}
.detail-head h3 {
  margin: 0 0 8px;
  font-size: 18px;
  color: var(--el-text-color-primary);
}
.article-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}
.article-date {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.article-content {
  font-size: 14px;
  line-height: 1.9;
  color: var(--el-text-color-regular);
}
.article-content p {
  margin: 0 0 12px;
  text-indent: 2em;
}
.detail-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}
</style>
