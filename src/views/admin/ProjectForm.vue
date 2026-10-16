<!-- src/views/admin/ProjectForm.vue —— 新增 / 编辑项目表单（独立路由页） -->
<template>
  <el-card class="form-card" shadow="never">
    <template #header>
      <div class="card-head">
        <span class="card-title">
          <el-icon><EditPen /></el-icon> {{ isEdit ? '编辑项目' : '新增项目' }}
        </span>
      </div>
    </template>

    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="项目名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入项目名称" clearable />
      </el-form-item>

      <el-form-item label="项目状态" prop="status">
        <el-select v-model="form.status" style="width: 100%">
          <el-option label="已完成" value="已完成" />
          <el-option label="开发中" value="开发中" />
          <el-option label="规划中" value="规划中" />
        </el-select>
      </el-form-item>

      <el-form-item label="项目简介" prop="desc">
        <el-input v-model="form.desc" type="textarea" :rows="2" placeholder="一句话描述项目" />
      </el-form-item>

      <el-form-item label="详细信息">
        <el-input
          v-model="form.details"
          type="textarea"
          :rows="4"
          placeholder="项目的技术架构、功能模块等详细描述"
        />
      </el-form-item>

      <el-form-item label="技术标签">
        <el-input v-model="form.tagsText" placeholder="用逗号分隔，如：Vue 3, Element Plus" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleSave">保存</el-button>
        <el-button @click="handleCancel">取消</el-button>
      </el-form-item>
    </el-form>

    <!-- 保存成功提示 -->
    <el-alert
      v-if="saved"
      class="save-tip"
      type="success"
      show-icon
      :closable="false"
      title="保存成功！正在返回项目列表…"
    />
  </el-card>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProjectStore } from '../../stores/projectStore'

const route = useRoute()
const router = useRouter()
const projectStore = useProjectStore()
// getter（返回函数）与 actions 可直接通过 store 实例访问
const { getProjectById, addProject, updateProject } = projectStore

// 判断是新增还是编辑模式
const editId = computed(() => route.params.id)
const isEdit = computed(() => !!editId.value)

// 加载现有数据（编辑模式）或初始化空表单（新增模式）
const existing = isEdit.value ? getProjectById(editId.value) : null

const form = reactive({
  name: existing?.name || '',
  status: existing?.status || '开发中',
  desc: existing?.desc || '',
  details: existing?.details || '',
  tagsText: existing?.tags ? existing.tags.join(', ') : ''
})

const formRef = ref(null)
const saved = ref(false)

const rules = {
  name: [{ required: true, message: '项目名称不能为空', trigger: 'blur' }],
  desc: [{ required: true, message: '项目简介不能为空', trigger: 'blur' }]
}

const handleSave = async () => {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  // 将逗号分隔的标签文本转为数组
  const tags = form.tagsText
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)

  const data = {
    name: form.name.trim(),
    status: form.status,
    desc: form.desc.trim(),
    details: form.details.trim(),
    tags
  }

  if (isEdit.value) {
    updateProject(editId.value, data)
  } else {
    addProject(data)
  }

  saved.value = true
  // 保存后使用 replace 跳回列表，避免按返回键又回到表单
  setTimeout(() => {
    router.replace({ name: 'admin-projects' })
  }, 800)
}

const handleCancel = () => {
  router.go(-1)
}
</script>

<style scoped>
.save-tip {
  margin-top: 14px;
}
</style>
