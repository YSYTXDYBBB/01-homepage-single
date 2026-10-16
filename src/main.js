import { createApp } from 'vue'
import { createPinia } from 'pinia'
// Element Plus 全局注册：一次性引入所有组件与样式
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import App from './App.vue'
import router from './router'   // 新建的 router/index.js

// Element Plus 基础样式与暗色主题变量
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import './assets/main.css'

const app = createApp(App)

// 全局注册 Element Plus 图标组件（模板中可直接使用 <House /> 等）
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 注意：必须先 use(pinia) 再 use(router)，
// 因为路由守卫内部会访问 Pinia Store，需要 Pinia 先完成注册
app.use(createPinia())
app.use(router)
app.use(ElementPlus, { locale: zhCn })
app.mount('#app')
