<!-- src/views/AdminView.vue —— 后台管理（嵌套路由父级布局 + 权限守卫） -->
<template>
  <!-- el-container + el-aside + el-main：侧边栏布局 -->
  <el-container class="admin-layout">
    <el-aside width="210px" class="admin-aside">
      <div class="admin-brand">
        <el-avatar :size="42" :src="profile.avatar" />
        <div class="admin-user">
          <strong>{{ username || '未登录' }}</strong>
          <span>管理员</span>
        </div>
      </div>

      <!-- el-menu：后台导航（router 模式） -->
      <el-menu router :default-active="activeIndex" class="admin-menu">
        <el-menu-item index="/admin/profile">
          <el-icon><EditPen /></el-icon>
          <span>个人简介编辑</span>
        </el-menu-item>
        <el-menu-item index="/admin/projects">
          <el-icon><Grid /></el-icon>
          <span>项目管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/articles">
          <el-icon><Document /></el-icon>
          <span>文章管理</span>
        </el-menu-item>
      </el-menu>

      <div class="admin-aside-footer">
        <el-button type="danger" plain size="small" class="logout-btn" @click="handleLogout">
          退出登录
        </el-button>
      </div>
    </el-aside>

    <el-main class="admin-main">
      <div class="admin-main-head">
        <span class="card-title"><el-icon><Setting /></el-icon> 后台管理</span>
        <el-tag type="success" effect="plain">当前用户：{{ username || '未登录' }}</el-tag>
      </div>
      <el-divider />
      <!-- 子路由出口：个人简介编辑 / 项目管理 / 文章管理 -->
      <RouterView />
    </el-main>
  </el-container>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import { useUserStore } from '../stores/userStore'
import { useProfileStore } from '../stores/profileStore'

const route = useRoute()
const router = useRouter()

const userStore = useUserStore()
// 解构 state 时使用 storeToRefs 保持响应式
const { username } = storeToRefs(userStore)
// actions 可直接解构使用
const { logout } = userStore

const profileStore = useProfileStore()
const { profile } = storeToRefs(profileStore)

// 子路由（如 /admin/projects/new）也高亮对应菜单
const activeIndex = computed(() => {
  const menus = ['/admin/profile', '/admin/projects', '/admin/articles']
  return menus.find((m) => route.path.startsWith(m)) || route.path
})

const handleLogout = () => {
  logout()
  ElMessage.success('已退出登录')
  // 退出后跳回首页
  router.push({ name: 'home' })
}
</script>

<style scoped>
.admin-layout {
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 16px;
  box-shadow: var(--el-box-shadow-light);
  overflow: hidden;
  min-height: 460px;
}
.admin-aside {
  border-right: 1px solid var(--el-border-color-lighter);
  display: flex;
  flex-direction: column;
  padding: 16px 0;
  background: var(--el-fill-color-light);
}
.admin-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 16px 14px;
}
.admin-user {
  display: flex;
  flex-direction: column;
  line-height: 1.3;
}
.admin-user strong {
  font-size: 14px;
  color: var(--el-text-color-primary);
}
.admin-user span {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}
.admin-menu {
  border-right: none;
  background: transparent;
  flex: 1;
}
.admin-aside-footer {
  padding: 12px 16px 0;
}
.logout-btn {
  width: 100%;
}
.admin-main-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
</style>
