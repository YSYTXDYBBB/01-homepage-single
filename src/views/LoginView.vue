<!-- src/views/LoginView.vue —— 身份认证页面 -->
<template>
  <el-card class="login-card" shadow="hover">
    <template #header>
      <div class="card-head">
        <span class="card-title"><el-icon><Lock /></el-icon> 后台登录</span>
      </div>
    </template>

    <!-- el-form：登录表单，配合 rules 做校验 -->
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="top"
      class="login-form"
      @keyup.enter="handleLogin"
    >
      <el-form-item label="用户名" prop="username">
        <el-input
          v-model="form.username"
          placeholder="请输入用户名"
          :prefix-icon="User"
          clearable
        />
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input
          v-model="form.password"
          type="password"
          placeholder="请输入密码"
          :prefix-icon="Lock"
          show-password
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" class="login-btn" @click="handleLogin">
          登录
        </el-button>
      </el-form-item>
    </el-form>

    <!-- el-alert：演示提示 -->
    <el-alert
      type="info"
      :closable="false"
      show-icon
      title="提示"
      description="任意用户名 + 密码 123456 即可登录（实验演示用）"
    />
  </el-card>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import { useUserStore } from '../stores/userStore'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
// actions 可直接解构使用，无需 storeToRefs
const { login } = userStore

const formRef = ref(null)
const form = ref({ username: '', password: '' })

// 表单校验规则：密码必须为 123456
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) =>
        value === '123456' ? callback() : callback(new Error('密码错误，请输入 123456')),
      trigger: 'blur'
    }
  ]
}

const handleLogin = async () => {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  // 写入 Pinia Store，同时持久化到 localStorage
  login(form.value.username.trim())
  ElMessage.success('登录成功，欢迎回来！')

  // 如果有 redirect 查询参数，跳转到该地址；否则跳转到后台管理
  const redirect = route.query.redirect
  if (redirect) {
    router.replace(redirect)
  } else {
    // 使用 replace 替换历史记录，避免按返回键又回到登录页
    router.replace({ name: 'admin' })
  }
}
</script>

<style scoped>
.login-card {
  max-width: 440px;
  margin: 0 auto;
}
.login-form {
  margin-bottom: 8px;
}
.login-btn {
  width: 100%;
}
</style>
