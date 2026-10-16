<template>
  <footer class="app-footer">
    <p>© 2025 {{ profile.name }} · {{ profile.major }}</p>
    <!-- el-divider：分隔线 -->
    <el-divider class="footer-divider" />
    <!-- el-tag：技术栈标签 -->
    <div class="footer-tags">
      <el-tag type="primary" effect="plain" round>Vue 3</el-tag>
      <el-tag type="success" effect="plain" round>Pinia</el-tag>
      <el-tag type="warning" effect="plain" round>Element Plus</el-tag>
      <el-tag type="info" effect="plain" round>Vite</el-tag>
    </div>
  </footer>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useProfileStore } from '../stores/profileStore'

const profileStore = useProfileStore()
// 解构 state 时使用 storeToRefs 保持响应式
const { profile } = storeToRefs(profileStore)
</script>

<style scoped>
.app-footer {
  text-align: center;
  color: var(--el-text-color-secondary);
  font-size: 13px;
  padding: 18px 20px 10px;
}
.app-footer p {
  margin: 4px 0;
}
.footer-divider {
  margin: 12px 0;
}
.footer-tags {
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}
</style>
