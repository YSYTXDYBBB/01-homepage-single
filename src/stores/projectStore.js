// src/stores/projectStore.js
// 项目 Store —— 管理项目列表的增删改查，使用 localStorage 实现持久化
import { defineStore } from 'pinia'

// 默认项目数据
const defaultProjects = [
  {
    id: 1,
    name: '进销存管理系统',
    status: '已完成',
    desc: '基于 Vue 3 + Element Plus 实现商品、库存、订单管理，支持权限与数据统计。',
    details:
      '本项目采用前后端分离架构，前端使用 Vue 3 组合式 API 开发，后端使用 Node.js。实现了商品分类、库存预警、订单流水导出等高级功能。',
    tags: ['Vue 3', 'Element Plus', 'Pinia']
  },
  {
    id: 2,
    name: '互联网专家服务平台',
    status: '开发中',
    desc: '面向专家与用户的预约咨询平台，包含专家列表、预约、订单等模块。',
    details:
      '项目正在开发中，目前已完成了专家列表展示、详情页以及预约表单的校验逻辑，正在对接支付接口。',
    tags: ['Vue', 'Node.js', 'MySQL']
  },
  {
    id: 3,
    name: '个人主页组件化实验',
    status: '已完成',
    desc: '将单页 HTML 迁移为 Vue 工程，完成组件拆分、组合式 API 与插槽练习。',
    details:
      '本实验通过将单页 HTML 迁移到 Vue 工程，深入理解了组件边界划分、props 单向数据流、defineModel 双向绑定以及作用域插槽的实际应用。',
    tags: ['Vue 3', '组合式 API', '插槽']
  }
]

// 从 localStorage 读取持久化的项目列表
function loadProjects() {
  try {
    const saved = localStorage.getItem('projects')
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (e) {
    console.warn('读取本地项目数据失败，使用默认值', e)
  }
  return defaultProjects
}

export const useProjectStore = defineStore('project', {
  // ======================== state ========================
  state: () => ({
    projects: loadProjects()
  }),

  // ======================== getters ========================
  getters: {
    // 根据 id 查找单个项目
    getProjectById: (state) => (id) => {
      const numId = Number(id)
      return state.projects.find((p) => p.id === numId)
    },
    // 项目总数
    totalProjects(state) {
      return state.projects.length
    },
    // 已完成项目数量
    doneCount(state) {
      return state.projects.filter((p) => p.status === '已完成').length
    }
  },

  // ======================== actions ========================
  actions: {
    // 新增项目
    addProject(data) {
      const nextId = this.projects.length
        ? Math.max(...this.projects.map((p) => p.id)) + 1
        : 1
      this.projects.push({ ...data, id: nextId })
      this.persist()
    },

    // 更新项目
    updateProject(id, data) {
      const numId = Number(id)
      const idx = this.projects.findIndex((p) => p.id === numId)
      if (idx !== -1) {
        this.projects[idx] = { ...this.projects[idx], ...data }
        this.persist()
      }
    },

    // 删除项目
    deleteProject(id) {
      const numId = Number(id)
      const idx = this.projects.findIndex((p) => p.id === numId)
      if (idx !== -1) {
        this.projects.splice(idx, 1)
        this.persist()
      }
    },

    // 持久化到 localStorage
    persist() {
      localStorage.setItem('projects', JSON.stringify(this.projects))
    }
  }
})
