<template>
  <!-- Element Plus 布局容器：包含 header / main / footer 时自动纵向排列 -->
  <el-container class="app-shell">
    <!-- 顶部导航 -->
    <el-header class="app-shell__header" height="auto">
      <AppHeader />
    </el-header>

    <!-- 路由出口：路由匹配的页面组件将在此处渲染 -->
    <el-main class="app-shell__main">
      <RouterView />
    </el-main>

    <!-- 底部 -->
    <el-footer class="app-shell__footer" height="auto">
      <AppFooter />
    </el-footer>
  </el-container>
</template>

<script setup>
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
</script>
