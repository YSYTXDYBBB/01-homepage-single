<template>
  <el-card class="info-card" shadow="hover">
    <template #header>
      <div class="card-head">
        <span class="card-title"><el-icon><UserFilled /></el-icon> 个人基本信息</span>
        <!-- 具名插槽：允许父组件在头部插入按钮（如编辑资料按钮） -->
        <slot name="actions"></slot>
      </div>
    </template>

    <!-- 编辑模式：el-form + el-input 表单组件 -->
    <el-form
      v-if="isEditing"
      ref="formRef"
      :model="editingProfile"
      :rules="rules"
      label-width="90px"
      class="profile-form"
    >
      <el-form-item label="姓名" prop="name">
        <el-input v-model="editingProfile.name" placeholder="请输入姓名" clearable />
      </el-form-item>
      <el-form-item label="专业" prop="major">
        <el-input v-model="editingProfile.major" placeholder="请输入专业" clearable />
      </el-form-item>
      <el-form-item label="班级">
        <el-input v-model="editingProfile.className" placeholder="请输入班级" />
      </el-form-item>
      <el-form-item label="学号">
        <el-input v-model="editingProfile.studentId" placeholder="请输入学号" />
      </el-form-item>
      <el-form-item label="简介摘要">
        <el-input v-model="editingProfile.introShort" placeholder="一句话简介" />
      </el-form-item>
      <el-form-item label="完整简介">
        <el-input
          v-model="editingProfile.intro"
          type="textarea"
          :rows="4"
          placeholder="请输入完整简介"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveEdit">保存</el-button>
        <el-button @click="cancelEdit">取消</el-button>
      </el-form-item>
    </el-form>

    <!-- 展示模式：el-avatar + el-descriptions -->
    <div v-else class="profile">
      <el-avatar :size="104" :src="profile.avatar" class="profile-avatar" />
      <el-descriptions :column="1" class="profile-desc" border>
        <el-descriptions-item label="姓名">
          <strong class="profile-name">{{ profile.name }}</strong>
        </el-descriptions-item>
        <el-descriptions-item label="专业">{{ profile.major }}</el-descriptions-item>
        <el-descriptions-item label="班级">{{ profile.className }}</el-descriptions-item>
        <el-descriptions-item label="学号">{{ profile.studentId }}</el-descriptions-item>
      </el-descriptions>
    </div>
  </el-card>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'

// defineProps 接收父组件传递的数据
const props = defineProps({
  profile: { type: Object, required: true }
})

// defineEmits 通知父组件更新数据
const emit = defineEmits(['update-profile'])

// defineModel 实现编辑状态的双向绑定
const isEditing = defineModel('isEditing', { type: Boolean, default: false })

// el-form 实例，用于表单校验
const formRef = ref(null)
const rules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  major: [{ required: true, message: '请输入专业', trigger: 'blur' }]
}

// 用副本接收数据，避免直接修改 props
const editingProfile = reactive({ ...props.profile })

// 监听编辑模式开启，重置副本数据
watch(isEditing, (val) => {
  if (val) Object.assign(editingProfile, props.profile)
})

const saveEdit = async () => {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) {
    ElMessage.error('请检查必填项：姓名与专业不能为空')
    return
  }
  // 触发事件，将数据传回父组件
  emit('update-profile', { ...editingProfile })
}

const cancelEdit = () => {
  isEditing.value = false
}
</script>

<style scoped>
.profile {
  display: flex;
  gap: 24px;
  align-items: center;
  flex-wrap: wrap;
}
.profile-avatar {
  flex: none;
  box-shadow: var(--el-box-shadow-light);
}
.profile-desc {
  flex: 1 1 300px;
}
.profile-name {
  font-size: 18px;
  letter-spacing: 1px;
}
</style>
