<template>
  <header class="app-header">
    <div class="brand">
      <!-- el-avatar：展示用户头像 -->
      <el-avatar :size="48" :src="profile.avatar" class="brand-avatar" />
      <div class="brand-text">
        <h1>个人主页</h1>
        <p>Vue 3 + Pinia + Element Plus 综合实验</p>
      </div>
    </div>

    <!-- el-menu：菜单导航（router 模式，index 即为跳转路径） -->
    <el-menu
      class="header-menu"
      mode="horizontal"
      :ellipsis="false"
      router
      :default-active="activeIndex"
    >
      <el-menu-item index="/home">
        <el-icon><House /></el-icon>
        <span>个人主页</span>
      </el-menu-item>
      <el-menu-item index="/projects">
        <el-icon><Grid /></el-icon>
        <span>项目中心</span>
      </el-menu-item>
      <el-menu-item index="/articles">
        <el-icon><Document /></el-icon>
        <span>文章中心</span>
      </el-menu-item>
      <el-menu-item index="/about">
        <el-icon><InfoFilled /></el-icon>
        <span>关于本站</span>
      </el-menu-item>
      <el-menu-item v-if="!isLoggedIn" index="/login">
        <el-icon><User /></el-icon>
        <span>登录</span>
      </el-menu-item>
      <el-menu-item v-else index="/admin">
        <el-icon><Setting /></el-icon>
        <span>后台管理</span>
      </el-menu-item>
    </el-menu>

    <div class="header-actions">
      <!-- el-switch：主题切换 -->
      <el-switch
        v-model="isDark"
        inline-prompt
        active-text="深色"
        inactive-text="浅色"
        style="--el-switch-on-color: #1e293b; --el-switch-off-color: #0ea5e9"
      />
      <!-- el-button：退出登录（已登录时显示） -->
      <el-button
        v-if="isLoggedIn"
        type="danger"
        plain
        size="small"
        @click="handleLogout"
      >
        退出
      </el-button>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import { useUserStore } from '../stores/userStore'
import { useProfileStore } from '../stores/profileStore'

const route = useRoute()
const router = useRouter()

const userStore = useUserStore()
// 解构 state 时使用 storeToRefs 保持响应式
const { isLoggedIn } = storeToRefs(userStore)
// actions 可直接解构使用
const { logout } = userStore

const profileStore = useProfileStore()
const { profile } = storeToRefs(profileStore)

// 当前高亮菜单项：子路由（如 /projects/1）也高亮对应的一级菜单
const activeIndex = computed(() => {
  const topPaths = ['/home', '/projects', '/articles', '/about', '/admin', '/login']
  return topPaths.find((p) => route.path === p || route.path.startsWith(p + '/')) || route.path
})

const handleLogout = () => {
  logout()
  ElMessage.success('已退出登录')
  router.push({ name: 'home' })
}

// ================= 主题切换 =================
const isDark = ref(false)

watch(isDark, (val) => {
  // Element Plus 暗色主题依赖 html.dark 类名
  document.documentElement.classList.toggle('dark', val)
  localStorage.setItem('theme', val ? 'dark' : 'light')
})

onMounted(() => {
  const saved = localStorage.getItem('theme')
  if (saved === 'dark' || saved === 'light') {
    isDark.value = saved === 'dark'
  } else {
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
})
</script>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  gap: 18px;
  flex-wrap: wrap;
  padding: 14px 20px;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 16px;
  box-shadow: var(--el-box-shadow-light);
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}
.brand-text h1 {
  margin: 0;
  font-size: 19px;
  color: var(--el-text-color-primary);
}
.brand-text p {
  margin: 3px 0 0;
  font-size: 12.5px;
  color: var(--el-text-color-secondary);
}

.header-menu {
  flex: 1 1 auto;
  border-bottom: none;
  background: transparent;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: auto;
}
</style>
