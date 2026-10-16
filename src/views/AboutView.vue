<!-- src/views/AboutView.vue —— 关于本站（网站技术说明，区别于个人主页） -->
<template>
  <el-card class="layout-card" shadow="never">
    <template #header>
      <div class="card-head">
        <span class="card-title"><el-icon><InfoFilled /></el-icon> 关于本站</span>
      </div>
    </template>
    <p class="about-desc">
      本站是基于 Vue 3 + Vue Router + Pinia + Element Plus 构建的单页面应用（SPA），
      作为 Web 课程实验四「状态管理与 UI 组件库应用」的实验成果。
      首次加载后所有页面切换均由前端路由完成，不刷新整个页面。
    </p>
  </el-card>

  <el-card class="layout-card" shadow="never">
    <template #header>
      <div class="card-head">
        <span class="card-title"><el-icon><Cpu /></el-icon> 技术栈</span>
      </div>
    </template>
    <!-- el-descriptions：技术栈描述列表 -->
    <el-descriptions :column="2" border>
      <el-descriptions-item label="框架">Vue 3（组合式 API）</el-descriptions-item>
      <el-descriptions-item label="路由">Vue Router 4（Hash 模式）</el-descriptions-item>
      <el-descriptions-item label="状态管理">Pinia（state / getters / actions）</el-descriptions-item>
      <el-descriptions-item label="UI 组件库">Element Plus</el-descriptions-item>
      <el-descriptions-item label="构建工具">Vite</el-descriptions-item>
      <el-descriptions-item label="部署">GitHub Actions + GitHub Pages</el-descriptions-item>
    </el-descriptions>
  </el-card>

  <el-card class="layout-card" shadow="never">
    <template #header>
      <div class="card-head">
        <span class="card-title"><el-icon><Guide /></el-icon> 路由结构</span>
        <el-tag type="info" effect="plain">共 {{ routes.length }} 条路由</el-tag>
      </div>
    </template>
    <!-- el-table：表格展示路由配置 -->
    <el-table :data="routes" size="small" stripe>
      <el-table-column prop="path" label="路径" width="230">
        <template #default="{ row }">
          <code class="route-code">{{ row.path }}</code>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称" width="130" />
      <el-table-column prop="desc" label="说明" />
      <el-table-column label="权限" width="90">
        <template #default="{ row }">
          <el-tag v-if="row.auth" type="danger" size="small" effect="plain">需登录</el-tag>
          <el-tag v-else type="success" size="small" effect="plain">公开</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </el-card>

  <el-card class="layout-card" shadow="never">
    <template #header>
      <div class="card-head">
        <span class="card-title"><el-icon><Grid /></el-icon> Element Plus 组件清单</span>
      </div>
    </template>
    <!-- el-table：展示本实验使用的组件及其作用 -->
    <el-table :data="components" size="small" stripe>
      <el-table-column prop="name" label="组件" width="170">
        <template #default="{ row }">
          <el-tag type="primary" size="small" effect="plain">{{ row.name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="usage" label="使用位置" width="150" />
      <el-table-column prop="desc" label="作用" />
    </el-table>
  </el-card>

  <el-card class="layout-card" shadow="never">
    <template #header>
      <div class="card-head">
        <span class="card-title"><el-icon><Reading /></el-icon> 实验知识点</span>
      </div>
    </template>
    <!-- el-collapse：折叠面板 -->
    <el-collapse v-model="activePanels">
      <el-collapse-item title="1. Pinia 状态管理" name="1">
        <ul class="knowledge-list">
          <li>state —— 存储响应式数据的函数，相当于组件的 data</li>
          <li>getters —— 基于 state 派生计算值，具有缓存特性</li>
          <li>actions —— 修改 state 的唯一推荐入口，支持同步 / 异步</li>
          <li>storeToRefs —— 解构 state 与 getters 时保持响应式</li>
        </ul>
      </el-collapse-item>
      <el-collapse-item title="2. 状态持久化与路由守卫" name="2">
        <ul class="knowledge-list">
          <li>localStorage —— 在 state 初始化时读取、actions 修改后写入</li>
          <li>beforeEach —— 在守卫内部调用 useUserStore，读取登录状态</li>
          <li>meta.requiresAuth —— 标记需要登录才能访问的页面</li>
        </ul>
      </el-collapse-item>
      <el-collapse-item title="3. Element Plus 组件库" name="3">
        <ul class="knowledge-list">
          <li>全局注册 —— 在 main.js 中 use(ElementPlus) 并引入样式</li>
          <li>属性 / 事件 / 插槽 —— 通过文档查阅并配置组件行为</li>
          <li>暗色主题 —— 引入 dark/css-vars.css 并切换 html.dark 类名</li>
        </ul>
      </el-collapse-item>
      <el-collapse-item title="4. 工程化与部署" name="4">
        <ul class="knowledge-list">
          <li>Vue Router + Pinia + Element Plus 三者整合</li>
          <li>vite base 配置 —— 适配 GitHub Pages 子路径</li>
          <li>GitHub Actions —— 推送 main 分支后自动构建并部署</li>
        </ul>
      </el-collapse-item>
    </el-collapse>
  </el-card>
</template>

<script setup>
import { ref } from 'vue'

const activePanels = ref(['1', '2'])

// 路由结构数据（el-table 展示）
const routes = [
  { path: '/', name: '—', desc: '重定向到 /home', auth: false },
  { path: '/home', name: 'home', desc: '个人主页（含成长时间线）', auth: false },
  { path: '/projects', name: 'projects', desc: '项目中心（父路由）', auth: false },
  { path: '/projects/:id', name: 'project-detail', desc: '项目详情（动态路由）', auth: false },
  { path: '/articles', name: 'articles', desc: '文章中心（父路由）', auth: false },
  { path: '/articles/:id', name: 'article-detail', desc: '文章详情（动态路由）', auth: false },
  { path: '/about', name: 'about', desc: '关于本站', auth: false },
  { path: '/login', name: 'login', desc: '身份认证', auth: false },
  { path: '/admin', name: 'admin', desc: '后台管理（嵌套路由）', auth: true },
  { path: '/admin/profile', name: 'admin-profile', desc: '编辑个人简介', auth: true },
  { path: '/admin/projects', name: 'admin-projects', desc: '项目管理', auth: true },
  { path: '/admin/articles', name: 'admin-articles', desc: '文章管理', auth: true },
  { path: '/:pathMatch(.*)*', name: 'not-found', desc: '404 通配符页面', auth: false }
]

// Element Plus 组件清单（用于实验报告说明各组件作用）
const components = [
  { name: 'el-container', usage: 'App / AdminView', desc: '页面整体布局容器，配合 header / main / aside / footer 使用' },
  { name: 'el-header / el-main / el-footer', usage: 'App.vue', desc: '顶栏 / 内容区 / 底栏三段式布局' },
  { name: 'el-aside', usage: 'AdminView', desc: '后台管理侧边栏容器' },
  { name: 'el-menu / el-menu-item', usage: 'AppHeader / AdminView', desc: '导航菜单，开启 router 模式后可直接跳转路由' },
  { name: 'el-card', usage: '全站', desc: '卡片容器，支持 header 插槽与 shadow 阴影效果' },
  { name: 'el-button', usage: '全站', desc: '按钮，支持 type / plain / link 等样式' },
  { name: 'el-avatar', usage: 'AppHeader / ProfileCard', desc: '头像展示' },
  { name: 'el-descriptions', usage: 'ProfileCard / 详情页', desc: '描述列表，展示键值对信息' },
  { name: 'el-form / el-form-item', usage: '登录 / 表单页', desc: '表单容器与表单项，支持 rules 校验' },
  { name: 'el-input', usage: '表单 / 搜索框', desc: '文本输入框，支持 clearable、前缀图标、textarea 类型' },
  { name: 'el-select / el-option', usage: '后台表单', desc: '下拉选择器' },
  { name: 'el-table / el-table-column', usage: '后台管理 / 关于', desc: '表格与列，展示列表数据' },
  { name: 'el-dialog', usage: '项目管理 / 文章管理', desc: '对话框，用于新增与编辑内容' },
  { name: 'el-timeline / el-timeline-item', usage: 'HomeView', desc: '时间线，展示成长经历里程碑' },
  { name: 'el-tag', usage: '全站', desc: '标签，用于分类、状态与统计展示' },
  { name: 'el-progress', usage: 'SkillList', desc: '进度条，展示技能熟练度' },
  { name: 'el-rate', usage: 'HomeView', desc: '评分，以星级展示技能等级' },
  { name: 'el-switch', usage: 'AppHeader', desc: '开关，切换深浅色主题' },
  { name: 'el-alert', usage: '简历 / 文章详情', desc: '提示信息条' },
  { name: 'el-divider', usage: '多处', desc: '分隔线' },
  { name: 'el-empty', usage: '列表页', desc: '空状态占位' },
  { name: 'el-result', usage: '详情 / 404 页', desc: '结果页，用于错误或成功反馈' },
  { name: 'el-collapse', usage: 'AboutView', desc: '折叠面板，收起 / 展开内容块' },
  { name: 'ElMessage', usage: '各交互处', desc: '轻量消息提示（命令式调用）' }
]
</script>

<style scoped>
.about-desc {
  margin: 0;
  font-size: 14px;
  line-height: 1.9;
  color: var(--el-text-color-regular);
}
.route-code {
  color: var(--el-color-primary);
  font-size: 12.5px;
}
.knowledge-list {
  margin: 0;
  padding-left: 18px;
  list-style: none;
  font-size: 13.5px;
  line-height: 2;
  color: var(--el-text-color-regular);
}
</style>
