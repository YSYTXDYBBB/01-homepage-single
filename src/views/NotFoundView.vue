<!-- src/views/NotFoundView.vue —— 404 页面 -->
<template>
  <el-card class="layout-card" shadow="never">
    <!-- el-result：结果页组件展示 404 -->
    <el-result icon="error" title="404 · 页面走丢了" :sub-title="`你访问的地址 ${path} 不存在或已被移除。`">
      <template #extra>
        <el-button type="primary" @click="toHome">返回首页</el-button>
        <el-button @click="goBack">返回上一页</el-button>
      </template>
    </el-result>
  </el-card>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 显示当前无法匹配的路径
const path = computed(() => route.fullPath)

const toHome = () => {
  router.push({ name: 'home' })
}

// 编程式导航：返回上一页
const goBack = () => {
  router.go(-1)
}
</script>
