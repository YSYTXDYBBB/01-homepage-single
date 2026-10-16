// src/stores/articleStore.js
// 文章 Store —— 管理文章列表的增删改查，使用 localStorage 实现持久化
import { defineStore } from 'pinia'

// 默认文章数据
const defaultArticles = [
  {
    id: 1,
    title: '从零开始搭建 Vue 3 + Vite 项目',
    summary: '记录使用 Vite 创建 Vue 3 项目的完整流程，包括项目初始化、目录结构与开发配置。',
    content:
      'Vite 是新一代前端构建工具，利用浏览器原生 ESM 特性实现极速的冷启动与热更新。\n\n搭建步骤：\n1. 使用 npm create vite@latest 创建项目\n2. 选择 Vue 模板\n3. 安装依赖并启动开发服务器\n4. 配置路径别名与环境变量\n\n完成后即可享受毫秒级的热更新体验。',
    category: '前端开发',
    createdAt: '2025-03-10'
  },
  {
    id: 2,
    title: 'Pinia 状态管理最佳实践',
    summary: '介绍 Pinia 的核心概念 state / getters / actions，以及如何使用 storeToRefs 保持响应式。',
    content:
      'Pinia 是 Vue 官方推荐的状态管理库，相比 Vuex 更轻量、更符合组合式 API 风格。\n\n核心概念：\n- state：存储响应式数据的函数\n- getters：基于 state 派生计算值，带缓存\n- actions：修改 state 的方法，支持同步/异步\n\n在组件中使用 storeToRefs 解构 state 和 getters 可保持响应式，actions 则可直接解构使用。',
    category: '前端开发',
    createdAt: '2025-04-02'
  },
  {
    id: 3,
    title: '我的摄影学习笔记',
    summary: '分享学习摄影过程中的构图、光线运用心得，以及几张满意的校园摄影作品。',
    content:
      '摄影是光与影的艺术。学习摄影半年来，我总结了以下几点心得：\n\n1. 构图是骨架：三分法、对称、引导线能让画面更有层次\n2. 光线是灵魂：黄金时刻的柔光最适合拍人像\n3. 后期是点睛：适度调整对比度与饱和度即可\n\n多拍多练，量变终会带来质变。',
    category: '生活随笔',
    createdAt: '2025-05-18'
  }
]

// 从 localStorage 读取持久化的文章列表
function loadArticles() {
  try {
    const saved = localStorage.getItem('articles')
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (e) {
    console.warn('读取本地文章数据失败，使用默认值', e)
  }
  return defaultArticles
}

export const useArticleStore = defineStore('article', {
  // ======================== state ========================
  state: () => ({
    articles: loadArticles()
  }),

  // ======================== getters ========================
  getters: {
    // 根据 id 查找单篇文章
    getArticleById: (state) => (id) => {
      const numId = Number(id)
      return state.articles.find((a) => a.id === numId)
    },
    // 文章总数
    totalArticles(state) {
      return state.articles.length
    },
    // 所有文章分类（去重）
    categories(state) {
      return [...new Set(state.articles.map((a) => a.category))]
    }
  },

  // ======================== actions ========================
  actions: {
    // 新增文章
    addArticle(data) {
      const nextId = this.articles.length
        ? Math.max(...this.articles.map((a) => a.id)) + 1
        : 1
      const now = new Date()
      const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
      this.articles.push({ ...data, id: nextId, createdAt: dateStr })
      this.persist()
    },

    // 更新文章
    updateArticle(id, data) {
      const numId = Number(id)
      const idx = this.articles.findIndex((a) => a.id === numId)
      if (idx !== -1) {
        this.articles[idx] = { ...this.articles[idx], ...data }
        this.persist()
      }
    },

    // 删除文章
    deleteArticle(id) {
      const numId = Number(id)
      const idx = this.articles.findIndex((a) => a.id === numId)
      if (idx !== -1) {
        this.articles.splice(idx, 1)
        this.persist()
      }
    },

    // 持久化到 localStorage
    persist() {
      localStorage.setItem('articles', JSON.stringify(this.articles))
    }
  }
})
