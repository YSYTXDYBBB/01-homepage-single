<!-- src/views/HomeView.vue —— 个人主页（公开展示） -->
<template>
  <!-- 个人信息卡片（展示模式，不提供编辑按钮） -->
  <ProfileCard :profile="profile">
    <!-- 公开浏览页不放置编辑按钮 -->
  </ProfileCard>

  <!-- 个人简介卡片 -->
  <IntroCard v-model:showDetail="showDetail" :profile="profile" />

  <!-- 技能列表组件 -->
  <SkillList
    v-model:keyword="keyword"
    :skills="skills"
    @toggle-skill="toggleSkill"
  >
    <!-- 作用域插槽：父组件使用子组件遍历的数据定制列表项 -->
    <template #skill-item="{ skill, index }">
      <div class="skill-head">
        <el-tag size="small" effect="plain" round>#{{ index + 1 }}</el-tag>
        <span class="skill-name">{{ skill.name }}</span>
        <!-- el-rate：以星级展示熟练度 -->
        <el-rate :model-value="skill.level" disabled size="small" />
      </div>
      <el-progress
        class="skill-progress"
        :percentage="skill.level * 20"
        :stroke-width="8"
        :show-text="false"
      />
      <p class="skill-desc" v-show="skill.expanded">{{ skill.desc }}</p>
    </template>
  </SkillList>

  <!-- 个人信息页新增：成长时间线（el-timeline） -->
  <el-card class="info-card" shadow="hover">
    <template #header>
      <div class="card-head">
        <span class="card-title"><el-icon><Clock /></el-icon> 成长时间线</span>
        <el-tag type="primary" effect="plain" round>
          {{ timeline.length }} 个里程碑
        </el-tag>
      </div>
    </template>

    <el-timeline>
      <el-timeline-item
        v-for="item in timeline"
        :key="item.title"
        :timestamp="item.date"
        :color="item.color"
        placement="top"
        hollow
      >
        <div class="timeline-content">
          <h4>{{ item.title }}</h4>
          <p>{{ item.desc }}</p>
        </div>
      </el-timeline-item>
    </el-timeline>
  </el-card>
</template>

<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import ProfileCard from '../components/ProfileCard.vue'
import IntroCard from '../components/IntroCard.vue'
import SkillList from '../components/SkillList.vue'
import { useProfileStore } from '../stores/profileStore'

const profileStore = useProfileStore()
// 解构 state 时使用 storeToRefs 保持响应式
const { profile, skills } = storeToRefs(profileStore)
// actions 可直接解构使用，无需 storeToRefs
const { toggleSkill } = profileStore

// 本页局部 UI 状态
const showDetail = ref(false)
const keyword = ref('')

// 成长时间线数据（el-timeline 使用）
const timeline = [
  { date: '2023-09', title: '步入大学', desc: '进入计算机科学与技术专业，系统学习计算机基础知识。', color: '#0ea5e9' },
  { date: '2024-05', title: '完成「进销存管理系统」', desc: '第一次独立完成 Vue 3 + Element Plus 课程项目。', color: '#10b981' },
  { date: '2024-11', title: '完成「互联网专家服务平台」', desc: '负责前端页面搭建与表单校验逻辑。', color: '#f59e0b' },
  { date: '2025-04', title: 'Vue 组件化实验', desc: '将单页 HTML 迁移为 Vue 工程，练习组件拆分、props 与插槽。', color: '#0ea5e9' },
  { date: '2025-06', title: 'Vue Router 路由实验', desc: '完成嵌套路由、动态路由与编程式导航。', color: '#10b981' },
  { date: '2025-09', title: 'Pinia + Element Plus 综合实验', desc: '引入状态管理与组件库，完成个人主页全面重构。', color: '#6366f1' }
]
</script>

<style scoped>
.skill-head {
  display: flex;
  align-items: center;
  gap: 10px;
}
.skill-name {
  flex: 1;
  font-weight: 600;
  font-size: 14.5px;
}
.skill-progress {
  margin-top: 8px;
}
.skill-desc {
  margin: 10px 0 0;
  padding-left: 10px;
  font-size: 13.5px;
  line-height: 1.75;
  color: var(--el-text-color-secondary);
  border-left: 3px solid var(--el-color-success-light-5);
}
.timeline-content h4 {
  margin: 0 0 4px;
  font-size: 15px;
  color: var(--el-text-color-primary);
}
.timeline-content p {
  margin: 0;
  font-size: 13.5px;
  line-height: 1.7;
  color: var(--el-text-color-regular);
}
</style>
