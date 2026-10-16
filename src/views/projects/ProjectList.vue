<!-- src/views/projects/ProjectList.vue —— 项目列表（嵌套子路由） -->
<template>
  <div class="project-list-page">
    <div class="list-toolbar">
      <!-- el-tag：统计信息 -->
      <el-tag type="info" effect="plain">共 {{ projects.length }} 个项目</el-tag>
      <el-tag type="success" effect="plain">已完成 {{ doneCount }} 个</el-tag>
    </div>

    <!-- el-row / el-col：栅格布局，一行两列（小屏一行一列） -->
    <el-row :gutter="16">
      <el-col
        v-for="project in projects"
        :key="project.id"
        :xs="24"
        :sm="12"
        class="project-col"
      >
        <el-card class="project-card" shadow="hover">
          <template #header>
            <div class="card-head">
              <span class="project-name">{{ project.name }}</span>
              <el-tag
                :type="project.status === '已完成' ? 'success' : 'warning'"
                effect="dark"
                size="small"
              >
                {{ project.status }}
              </el-tag>
            </div>
          </template>

          <p class="project-desc">{{ project.desc }}</p>

          <div class="project-tags">
            <el-tag
              v-for="tag in project.tags"
              :key="tag"
              size="small"
              effect="plain"
              round
            >
              {{ tag }}
            </el-tag>
          </div>

          <div class="project-actions">
            <!-- el-button + 编程式导航跳转到项目详情 -->
            <el-button type="primary" plain size="small" @click="toDetail(project.id)">
              查看详情
              <el-icon class="el-icon--right"><ArrowRight /></el-icon>
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-empty v-if="projects.length === 0" description="暂无项目" />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useProjectStore } from '../../stores/projectStore'

const router = useRouter()
const projectStore = useProjectStore()
// 解构 state 与 getter 时使用 storeToRefs 保持响应式
const { projects, doneCount } = storeToRefs(projectStore)

// 编程式导航：跳转到项目详情
const toDetail = (id) => {
  router.push({ name: 'project-detail', params: { id } })
}
</script>

<style scoped>
.list-toolbar {
  display: flex;
  gap: 8px;
  margin-bottom: 14px;
}
.project-col {
  margin-bottom: 16px;
}
.project-card {
  height: 100%;
}
.project-name {
  font-weight: 600;
  color: var(--el-text-color-primary);
}
.project-desc {
  margin: 0;
  font-size: 13.5px;
  line-height: 1.7;
  color: var(--el-text-color-regular);
}
.project-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 12px;
}
.project-actions {
  margin-top: 14px;
  display: flex;
  justify-content: flex-end;
}
</style>
