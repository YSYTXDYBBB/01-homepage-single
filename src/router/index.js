// src/router/index.js
// GitHub Pages 无服务端重写规则，使用 Hash 模式可避免刷新子路由出现 404
import { createRouter, createWebHashHistory } from 'vue-router'
// 注意：不在模块顶层调用 useUserStore()，而是在 beforeEach 内部调用，
// 确保 Pinia 已完成初始化
import { useUserStore } from '../stores/userStore'

const routes = [
  // 默认重定向
  { path: '/', redirect: '/home' },

  // 个人主页
  {
    path: '/home',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    meta: { title: '个人主页' }
  },

  // 关于本站
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue'),
    meta: { title: '关于本站' }
  },

  // 项目中心（嵌套路由）
  {
    path: '/projects',
    name: 'projects',
    component: () => import('../views/ProjectsView.vue'),
    redirect: { name: 'project-list' },
    children: [
      {
        path: '',
        name: 'project-list',
        component: () => import('../views/projects/ProjectList.vue'),
        meta: { title: '项目列表' }
      },
      {
        path: ':id',
        name: 'project-detail',
        component: () => import('../views/projects/ProjectDetail.vue'),
        props: true,
        meta: { title: '项目详情' }
      }
    ]
  },

  // 文章中心（嵌套路由）
  {
    path: '/articles',
    name: 'articles',
    component: () => import('../views/ArticlesView.vue'),
    redirect: { name: 'article-list' },
    children: [
      {
        path: '',
        name: 'article-list',
        component: () => import('../views/articles/ArticleList.vue'),
        meta: { title: '文章列表' }
      },
      {
        path: ':id',
        name: 'article-detail',
        component: () => import('../views/articles/ArticleDetail.vue'),
        props: true,
        meta: { title: '文章详情' }
      }
    ]
  },

  // 身份认证
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: { title: '身份认证' }
  },

  // 后台管理（嵌套路由 + 权限守卫）
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../views/AdminView.vue'),
    redirect: { name: 'admin-profile' },
    meta: { title: '后台管理', requiresAuth: true },
    children: [
      {
        path: 'profile',
        name: 'admin-profile',
        component: () => import('../views/admin/ProfileEdit.vue'),
        meta: { title: '编辑个人简介', requiresAuth: true }
      },
      {
        path: 'projects',
        name: 'admin-projects',
        component: () => import('../views/admin/ProjectManage.vue'),
        meta: { title: '项目管理', requiresAuth: true }
      },
      {
        path: 'projects/new',
        name: 'project-new',
        component: () => import('../views/admin/ProjectForm.vue'),
        meta: { title: '新增项目', requiresAuth: true }
      },
      {
        path: 'projects/:id/edit',
        name: 'project-edit',
        component: () => import('../views/admin/ProjectForm.vue'),
        meta: { title: '编辑项目', requiresAuth: true }
      },
      {
        path: 'articles',
        name: 'admin-articles',
        component: () => import('../views/admin/ArticleManage.vue'),
        meta: { title: '文章管理', requiresAuth: true }
      },
      {
        path: 'articles/new',
        name: 'article-new',
        component: () => import('../views/admin/ArticleForm.vue'),
        meta: { title: '新增文章', requiresAuth: true }
      },
      {
        path: 'articles/:id/edit',
        name: 'article-edit',
        component: () => import('../views/admin/ArticleForm.vue'),
        meta: { title: '编辑文章', requiresAuth: true }
      }
    ]
  },

  // 404 通配符路由
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFoundView.vue'),
    meta: { title: '404' }
  }
]

const router = createRouter({
  // Hash 模式（部署到 GitHub Pages 时刷新子路由不会 404）
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

// ======================== 全局前置守卫 ========================
// 1. 根据 meta.title 更新浏览器标题
// 2. 根据 meta.requiresAuth 实现路由守卫（未登录则跳转登录页）
router.beforeEach((to, from) => {
  // 在守卫函数内部调用 useUserStore()，确保 Pinia 已完成初始化
  const userStore = useUserStore()

  // 更新页面标题
  const title = to.meta.title || '个人主页'
  document.title = `${title} · 余诗语`

  // 路由守卫：需要登录但未登录
  // Pinia store 直接读取属性（自动解包），无需 .value
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    // 携带 redirect 参数，登录成功后跳回原目标
    return {
      name: 'login',
      query: { redirect: to.fullPath }
    }
  }

  // 已登录用户访问登录页，直接跳转后台管理
  if (to.name === 'login' && userStore.isLoggedIn) {
    return { name: 'admin' }
  }
})

export default router
