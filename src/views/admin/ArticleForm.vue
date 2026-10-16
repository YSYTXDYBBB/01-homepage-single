<!-- src/views/admin/ArticleForm.vue —— 新增 / 编辑文章表单（独立路由页） -->
<template>
  <el-card class="form-card" shadow="never">
    <template #header>
      <div class="card-head">
        <span class="card-title">
          <el-icon><EditPen /></el-icon> {{ isEdit ? '编辑文章' : '新增文章' }}
        </span>
      </div>
    </template>

    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="form.title" placeholder="请输入文章标题" clearable />
      </el-form-item>

      <el-form-item label="文章分类" prop="category">
        <el-select v-model="form.category" style="width: 100%">
          <el-option label="前端开发" value="前端开发" />
          <el-option label="后端开发" value="后端开发" />
          <el-option label="生活随笔" value="生活随笔" />
          <el-option label="读书笔记" value="读书笔记" />
          <el-option label="其他" value="其他" />
        </el-select>
      </el-form-item>

      <el-form-item label="文章摘要" prop="summary">
        <el-input v-model="form.summary" type="textarea" :rows="2" placeholder="一句话概括文章内容" />
      </el-form-item>

      <el-form-item label="正文内容">
        <el-input
          v-model="form.content"
          type="textarea"
          :rows="10"
          placeholder="请输入文章正文，可用换行分段"
        />
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
      title="保存成功！正在返回文章列表…"
    />
  </el-card>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useArticleStore } from '../../stores/articleStore'

const route = useRoute()
const router = useRouter()
const articleStore = useArticleStore()
// getter（返回函数）与 actions 可直接通过 store 实例访问
const { getArticleById, addArticle, updateArticle } = articleStore

// 判断是新增还是编辑模式
const editId = computed(() => route.params.id)
const isEdit = computed(() => !!editId.value)

// 加载现有数据（编辑模式）或初始化空表单（新增模式）
const existing = isEdit.value ? getArticleById(editId.value) : null

const form = reactive({
  title: existing?.title || '',
  category: existing?.category || '前端开发',
  summary: existing?.summary || '',
  content: existing?.content || ''
})

const formRef = ref(null)
const saved = ref(false)

const rules = {
  title: [{ required: true, message: '文章标题不能为空', trigger: 'blur' }],
  summary: [{ required: true, message: '文章摘要不能为空', trigger: 'blur' }]
}

const handleSave = async () => {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  const data = {
    title: form.title.trim(),
    category: form.category,
    summary: form.summary.trim(),
    content: form.content.trim()
  }

  if (isEdit.value) {
    updateArticle(editId.value, data)
  } else {
    addArticle(data)
  }

  saved.value = true
  // 保存后使用 replace 跳回列表，避免按返回键又回到表单
  setTimeout(() => {
    router.replace({ name: 'admin-articles' })
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
