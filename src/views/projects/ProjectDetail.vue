<!-- src/views/projects/ProjectDetail.vue —— 项目详情（动态路由 :id） -->
<template>
  <div v-if="project" class="project-detail-view">
    <div class="detail-head">
      <h3>{{ project.name }}</h3>
      <el-tag
        :type="project.status === '已完成' ? 'success' : 'warning'"
        effect="dark"
      >
        {{ project.status }}
      </el-tag>
    </div>

    <!-- el-descriptions：描述列表展示项目信息 -->
    <el-descriptions :column="1" border>
      <el-descriptions-item label="项目简介">{{ project.desc }}</el-descriptions-item>
      <el-descriptions-item label="详细信息">
        {{ project.details || '暂无详细描述。' }}
      </el-descriptions-item>
    </el-descriptions>

    <!-- el-divider：带标题的分隔线 -->
    <el-divider content-position="left">技术标签</el-divider>
    <div class="tags">
      <el-tag
        v-for="tag in project.tags"
        :key="tag"
        type="primary"
        effect="plain"
        round
      >
        {{ tag }}
      </el-tag>
    </div>

    <div class="detail-actions">
      <!-- 编程式导航：返回项目列表 -->
      <el-button type="primary" @click="toList">返回列表</el-button>
      <!-- 编程式导航：返回上一页 -->
      <el-button @click="goBack">返回上一页</el-button>
    </div>
  </div>

  <!-- 无效项目编号处理：el-result 结果页 -->
  <el-result
    v-else
    icon="warning"
    title="项目不存在"
    :sub-title="`编号为 ${id} 的项目未找到，可能已被删除或地址有误。`"
  >
    <template #extra>
      <el-button type="primary" @click="toList">返回项目列表</el-button>
    </template>
  </el-result>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProjectStore } from '../../stores/projectStore'

// useRoute() 获取动态路由参数
const route = useRoute()
const router = useRouter()

const projectStore = useProjectStore()
// getter（返回函数）可直接通过 store 实例访问
const { getProjectById } = projectStore

const id = computed(() => route.params.id)

// 路由参数为字符串，按数字编号匹配需先 Number() 转换
const project = computed(() => getProjectById(id.value))

// 编程式导航 —— router.push：新增历史记录，适合普通跳转
const toList = () => {
  router.push({ name: 'project-list' })
}

// 编程式导航 —— router.go(-1)：按历史记录返回
const goBack = () => {
  router.go(-1)
}
</script>

<style scoped>
.detail-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}
.detail-head h3 {
  margin: 0;
  font-size: 18px;
  color: var(--el-text-color-primary);
}
.tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.detail-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}
</style>
