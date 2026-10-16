// src/stores/userStore.js
// 用户认证 Store —— 管理登录状态与用户名，使用 localStorage 实现持久化
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  // ======================== state ========================
  // state 是一个函数，返回初始数据对象；初始化时从 localStorage 读取已保存的值
  state: () => ({
    // 登录状态：默认从 localStorage 恢复
    isLoggedIn: localStorage.getItem('auth') === 'true',
    // 用户名：默认从 localStorage 恢复
    username: localStorage.getItem('username') || ''
  }),

  // ======================== getters ========================
  // getters 基于 state 派生计算值，具有缓存特性
  getters: {
    // 展示用的问候语
    greeting(state) {
      return state.isLoggedIn ? `欢迎回来，${state.username}` : '未登录'
    }
  },

  // ======================== actions ========================
  // actions 是修改 state 的唯一推荐入口，支持同步/异步操作
  actions: {
    // 登录：写入 state 并同步到 localStorage 实现持久化
    login(username) {
      this.isLoggedIn = true
      if (username) {
        this.username = username
      }
      localStorage.setItem('auth', 'true')
      if (username) {
        localStorage.setItem('username', username)
      }
    },

    // 退出登录：清理 state 与 localStorage
    logout() {
      this.isLoggedIn = false
      this.username = ''
      localStorage.removeItem('auth')
      localStorage.removeItem('username')
    }
  }
})
