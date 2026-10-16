<!-- src/views/admin/ArticleManage.vue —— 文章管理（el-table + el-dialog 增删改查） -->
<template>
  <div class="admin-manage">
    <div class="manage-head">
      <el-tag type="info" effect="plain">共 {{ articles.length }} 篇文章</el-tag>
      <el-button type="primary" @click="openCreate">
        <el-icon><Plus /></el-icon> 新增文章
      </el-button>
    </div>

    <!-- el-table：文章列表 -->
    <el-table :data="articles" stripe style="width: 100%">
      <el-table-column prop="id" label="编号" width="70" />
      <el-table-column prop="title" label="标题" min-width="180" />
      <el-table-column label="分类" width="120">
        <template #default="{ row }">
          <el-tag size="small" effect="dark">{{ row.category }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="发布日期" width="120" />
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" size="small" link @click="openEdit(row)">编辑</el-button>
          <!-- el-popconfirm：删除二次确认 -->
          <el-popconfirm
            title="确定删除该文章吗？"
            confirm-button-text="删除"
            cancel-button-text="取消"
            confirm-button-type="danger"
            @confirm="handleDelete(row)"
          >
            <template #reference>
              <el-button type="danger" size="small" link>删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <el-empty v-if="articles.length === 0" description="暂无文章，点击右上角「新增文章」添加。" />

    <!-- el-dialog：新增 / 编辑文章对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑文章' : '新增文章'"
      width="600px"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
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
            :rows="8"
            placeholder="请输入文章正文，可用换行分段"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import { useArticleStore } from '../../stores/articleStore'

const articleStore = useArticleStore()
// 解构 state 时使用 storeToRefs 保持响应式
const { articles } = storeToRefs(articleStore)
// actions 可直接解构使用
const { addArticle, updateArticle, deleteArticle } = articleStore

const dialogVisible = ref(false)
const editingId = ref(null)
const isEdit = computed(() => editingId.value !== null)
const formRef = ref(null)

const emptyForm = { title: '', category: '前端开发', summary: '', content: '' }
const form = reactive({ ...emptyForm })

const rules = {
  title: [{ required: true, message: '文章标题不能为空', trigger: 'blur' }],
  summary: [{ required: true, message: '文章摘要不能为空', trigger: 'blur' }]
}

const openCreate = () => {
  editingId.value = null
  Object.assign(form, emptyForm)
  dialogVisible.value = true
}

const openEdit = (row) => {
  editingId.value = row.id
  Object.assign(form, {
    title: row.title,
    category: row.category,
    summary: row.summary,
    content: row.content || ''
  })
  dialogVisible.value = true
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
    updateArticle(editingId.value, data)
    ElMessage.success('文章已更新')
  } else {
    addArticle(data)
    ElMessage.success('文章已新增')
  }
  dialogVisible.value = false
}

const handleDelete = (row) => {
  deleteArticle(row.id)
  ElMessage.success(`已删除文章「${row.title}」`)
}
</script>

<style scoped>
.manage-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}
</style>
