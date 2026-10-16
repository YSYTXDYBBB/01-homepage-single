<!-- src/views/admin/ProjectManage.vue —— 项目管理（el-table + el-dialog 增删改查） -->
<template>
  <div class="admin-manage">
    <div class="manage-head">
      <el-tag type="info" effect="plain">共 {{ projects.length }} 个项目</el-tag>
      <el-button type="primary" @click="openCreate">
        <el-icon><Plus /></el-icon> 新增项目
      </el-button>
    </div>

    <!-- el-table：项目列表 -->
    <el-table :data="projects" stripe style="width: 100%">
      <el-table-column prop="id" label="编号" width="70" />
      <el-table-column prop="name" label="项目名称" min-width="160" />
      <el-table-column label="状态" width="110">
        <template #default="{ row }">
          <el-tag
            :type="row.status === '已完成' ? 'success' : 'warning'"
            size="small"
            effect="dark"
          >
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="技术标签" min-width="200">
        <template #default="{ row }">
          <el-tag
            v-for="tag in row.tags"
            :key="tag"
            size="small"
            effect="plain"
            round
            class="row-tag"
          >
            {{ tag }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" size="small" link @click="openEdit(row)">编辑</el-button>
          <!-- el-popconfirm：删除二次确认 -->
          <el-popconfirm
            title="确定删除该项目吗？"
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

    <el-empty v-if="projects.length === 0" description="暂无项目，点击右上角「新增项目」添加。" />

    <!-- el-dialog：新增 / 编辑项目对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑项目' : '新增项目'"
      width="560px"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
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
          <el-input v-model="form.tagsText" placeholder="用逗号分隔，如：Vue 3, Element Plus, Pinia" />
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
import { useProjectStore } from '../../stores/projectStore'

const projectStore = useProjectStore()
// 解构 state 时使用 storeToRefs 保持响应式
const { projects } = storeToRefs(projectStore)
// actions 可直接解构使用
const { addProject, updateProject, deleteProject } = projectStore

const dialogVisible = ref(false)
const editingId = ref(null)
const isEdit = computed(() => editingId.value !== null)
const formRef = ref(null)

const emptyForm = { name: '', status: '开发中', desc: '', details: '', tagsText: '' }
const form = reactive({ ...emptyForm })

const rules = {
  name: [{ required: true, message: '项目名称不能为空', trigger: 'blur' }],
  desc: [{ required: true, message: '项目简介不能为空', trigger: 'blur' }]
}

// 新增：重置表单并打开对话框
const openCreate = () => {
  editingId.value = null
  Object.assign(form, emptyForm)
  dialogVisible.value = true
}

// 编辑：回填数据并打开对话框
const openEdit = (row) => {
  editingId.value = row.id
  Object.assign(form, {
    name: row.name,
    status: row.status,
    desc: row.desc,
    details: row.details || '',
    tagsText: row.tags ? row.tags.join(', ') : ''
  })
  dialogVisible.value = true
}

const handleSave = async () => {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  // 将逗号分隔的标签文本转为数组
  const data = {
    name: form.name.trim(),
    status: form.status,
    desc: form.desc.trim(),
    details: form.details.trim(),
    tags: form.tagsText.split(',').map((t) => t.trim()).filter(Boolean)
  }

  if (isEdit.value) {
    updateProject(editingId.value, data)
    ElMessage.success('项目已更新')
  } else {
    addProject(data)
    ElMessage.success('项目已新增')
  }
  dialogVisible.value = false
}

const handleDelete = (row) => {
  deleteProject(row.id)
  ElMessage.success(`已删除项目「${row.name}」`)
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
.row-tag {
  margin-right: 6px;
}
</style>
