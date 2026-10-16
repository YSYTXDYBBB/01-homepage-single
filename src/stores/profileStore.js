// src/stores/profileStore.js
// 个人信息 Store —— 管理个人基本资料，使用 localStorage 实现持久化
import { defineStore } from 'pinia'

// 默认个人信息
const defaultProfile = {
  avatar:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Crect width='120' height='120' fill='%2334d399'/%3E%3Ccircle cx='60' cy='45' r='22' fill='%23ffffff'/%3E%3Cpath d='M18 120c0-24 19-38 42-38s42 14 42 38z' fill='%23ffffff'/%3E%3C/svg%3E",
  name: '余诗语',
  major: '计算机科学与技术',
  className: '计科 2 班',
  studentId: '249980842',
  introShort: '热爱前端开发与交互设计，喜欢把想法变成看得见的页面。',
  intro:
    '我是余诗语，计算机科学与技术专业 2 班学生。从大一开始接触 Web 前端，独立完成过进销存管理系统、互联网专家服务平台等课程项目。平时喜欢用 AI 帮忙解决生活中的小问题，课余时间拍照、读书，相信有志者事竟成。'
}

// 默认技能 / 兴趣列表
const defaultSkills = [
  { id: 1, name: 'Vue 3', level: 5, expanded: false, desc: '熟悉组合式 API、响应式原理与组件化开发，能用 Vite 独立搭建前端项目。' },
  { id: 2, name: 'JavaScript', level: 4, expanded: false, desc: '掌握 ES6+ 语法、异步编程以及 DOM / BOM 操作。' },
  { id: 3, name: 'HTML / CSS', level: 4, expanded: false, desc: '能高保真还原设计稿，熟练使用 Flex、Grid 布局与移动端响应式适配。' },
  { id: 4, name: 'MySQL', level: 3, expanded: false, desc: '掌握基础建表、增删改查，了解索引、简单联表查询与 SQL 优化基础。' },
  { id: 5, name: '网络基础', level: 3, expanded: false, desc: '熟悉 HTTP / HTTPS 协议，了解请求响应流程，掌握抓包调试基础。' },
  { id: 6, name: '绘画', level: 4, expanded: false, desc: '捕捉生活中的小美满，享受绘画带来的成就感。' },
  { id: 7, name: '摄影', level: 3, expanded: false, desc: '喜欢记录校园生活，擅长人像与风光构图。' },
  { id: 8, name: '阅读', level: 5, expanded: false, desc: '偏爱科幻小说与人物传记，年均阅读 20 本以上，乐此不疲。' }
]

// 从 localStorage 读取持久化的个人信息，读取失败时回退到默认值
function loadProfile() {
  try {
    const saved = localStorage.getItem('profile')
    if (saved) {
      return { ...defaultProfile, ...JSON.parse(saved) }
    }
  } catch (e) {
    console.warn('读取本地个人信息失败，使用默认值', e)
  }
  return defaultProfile
}

// 从 localStorage 读取持久化的技能列表
function loadSkills() {
  try {
    const saved = localStorage.getItem('skills')
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (e) {
    console.warn('读取本地技能数据失败，使用默认值', e)
  }
  return defaultSkills
}

export const useProfileStore = defineStore('profile', {
  // ======================== state ========================
  state: () => ({
    profile: loadProfile(),
    skills: loadSkills()
  }),

  // ======================== getters ========================
  getters: {
    // 展示用的姓名 + 专业
    displayName(state) {
      return `${state.profile.name} · ${state.profile.major}`
    }
  },

  // ======================== actions ========================
  actions: {
    // 更新个人信息：合并新数据到 state，并同步写入 localStorage
    updateProfile(newProfile) {
      this.profile = { ...this.profile, ...newProfile }
      localStorage.setItem('profile', JSON.stringify(this.profile))
    },

    // 切换技能展开/收起状态
    toggleSkill(skill) {
      const target = this.skills.find((s) => s.id === skill.id)
      if (target) {
        target.expanded = !target.expanded
        localStorage.setItem('skills', JSON.stringify(this.skills))
      }
    }
  }
})
