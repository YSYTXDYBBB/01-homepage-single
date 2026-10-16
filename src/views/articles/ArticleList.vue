<!-- src/views/articles/ArticleList.vue —— 文章列表（公开浏览） -->
<template>
  <div class="article-list-page">
    <div class="list-toolbar">
      <!-- el-tag：文章总数统计 -->
      <el-tag type="info" effect="plain">共 {{ totalArticles }} 篇文章</el-tag>
      <el-tag
        v-for="category in categories"
        :key="category"
        type="success"
        effect="plain"
        round
      >
        {{ category }}
      </el-tag>
    </div>

    <el-card
      v-for="article in articles"
      :key="article.id"
      class="article-card"
      shadow="hover"
    >
      <template #header>
        <div class="card-head">
          <span class="article-title">{{ article.title }}</span>
          <el-tag size="small" effect="dark">{{ article.category }}</el-tag>
        </div>
      </template>

      <p class="article-summary">{{ article.summary }}</p>

      <div class="article-footer">
        <span class="article-date">
          <el-icon><Calendar /></el-icon> {{ article.createdAt }}
        </span>
        <el-button type="primary" link @click="toDetail(article.id)">
          阅读全文
          <el-icon class="el-icon--right"><ArrowRight /></el-icon>
        </el-button>
      </div>
    </el-card>

    <!-- el-empty：无数据时的空状态 -->
    <el-empty v-if="articles.length === 0" description="暂无文章" />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useArticleStore } from '../../stores/articleStore'

const router = useRouter()
const articleStore = useArticleStore()
// 解构 state 与 getter 时使用 storeToRefs 保持响应式
const { articles, totalArticles, categories } = storeToRefs(articleStore)

// 编程式导航：跳转到文章详情
const toDetail = (id) => {
  router.push({ name: 'article-detail', params: { id } })
}
</script>

<style scoped>
.list-toolbar {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}
.article-card {
  margin-bottom: 14px;
}
.article-title {
  font-weight: 600;
  color: var(--el-text-color-primary);
}
.article-summary {
  margin: 0;
  font-size: 13.5px;
  line-height: 1.75;
  color: var(--el-text-color-regular);
}
.article-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
}
.article-date {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12.5px;
  color: var(--el-text-color-secondary);
}
</style>
