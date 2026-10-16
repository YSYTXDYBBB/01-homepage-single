<!-- src/views/ArticlesView.vue —— 文章中心（嵌套路由父级布局） -->
<template>
  <el-card class="layout-card" shadow="never">
    <template #header>
      <div class="card-head">
        <span class="card-title"><el-icon><Document /></el-icon> 文章中心</span>
        <!-- el-menu：子页面导航（router 模式） -->
        <el-menu
          class="sub-menu"
          mode="horizontal"
          router
          :default-active="$route.path"
          :ellipsis="false"
        >
          <el-menu-item index="/articles">文章列表</el-menu-item>
        </el-menu>
      </div>
    </template>
    <!-- 子路由出口：文章列表 / 文章详情 -->
    <RouterView />
  </el-card>
</template>

<script setup>
// 纯布局组件，无额外逻辑
</script>

<style scoped>
.sub-menu {
  border-bottom: none;
  background: transparent;
}
</style>
