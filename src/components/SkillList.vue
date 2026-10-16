<template>
  <el-card class="info-card" shadow="hover">
    <template #header>
      <div class="card-head">
        <span class="card-title"><el-icon><Star /></el-icon> 技能 / 兴趣</span>
        <!-- el-input：搜索框（带前缀图标与一键清空） -->
        <el-input
          v-model="keyword"
          class="skill-search"
          placeholder="搜索技能或兴趣，例如：Vue、绘画"
          :prefix-icon="Search"
          clearable
        />
      </div>
    </template>

    <!-- el-tag：统计信息标签 -->
    <div class="skill-summary">
      <el-tag type="info" effect="plain">共 {{ skills.length }} 项</el-tag>
      <el-tag type="success" effect="plain">匹配 {{ filteredSkills.length }} 项</el-tag>
      <el-tag v-if="keyword.trim()" type="warning" effect="plain">
        关键词：{{ keyword.trim() }}
      </el-tag>
    </div>

    <ul class="skill-list">
      <li
        class="skill-item"
        v-for="(skill, index) in filteredSkills"
        :key="skill.id"
        @click="emit('toggle-skill', skill)"
      >
        <!-- 作用域插槽：将子组件遍历的 skill 和 index 暴露给父组件定制 -->
        <slot name="skill-item" :skill="skill" :index="index">
          <!-- 默认渲染内容 -->
          <div class="skill-head">
            <el-tag size="small" effect="plain" round>#{{ index + 1 }}</el-tag>
            <span class="skill-name">{{ skill.name }}</span>
            <span class="skill-level">
              {{ '★'.repeat(skill.level) }}{{ '☆'.repeat(5 - skill.level) }}
            </span>
          </div>
          <!-- el-progress：按熟练度展示进度条（level 1-5 映射为 20%-100%） -->
          <el-progress
            class="skill-progress"
            :percentage="skill.level * 20"
            :stroke-width="8"
            :show-text="false"
          />
          <p class="skill-desc" v-show="skill.expanded">{{ skill.desc }}</p>
        </slot>
      </li>
    </ul>

    <!-- el-empty：空状态提示 -->
    <el-empty
      v-if="filteredSkills.length === 0"
      :image-size="90"
      description="没有找到匹配的技能，换个关键词试试～"
    />
  </el-card>
</template>

<script setup>
import { computed } from 'vue'
import { Search } from '@element-plus/icons-vue'

const props = defineProps({
  skills: { type: Array, required: true }
})

const emit = defineEmits(['toggle-skill'])

// 双向绑定搜索词
const keyword = defineModel('keyword', { type: String, default: '' })

const filteredSkills = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  if (!kw) return props.skills
  return props.skills.filter(skill =>
    skill.name.toLowerCase().includes(kw) || skill.desc.toLowerCase().includes(kw)
  )
})
</script>

<style scoped>
.skill-search {
  width: 260px;
  max-width: 60vw;
}
.skill-summary {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}
.skill-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.skill-item {
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 12px;
  padding: 12px 14px;
  cursor: pointer;
  transition: border-color .2s, background .2s, transform .15s;
}
.skill-item:hover {
  border-color: var(--el-color-primary-light-5);
  background: var(--el-color-primary-light-9);
  transform: translateX(2px);
}
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
.skill-level {
  color: #f59e0b;
  font-size: 13px;
  letter-spacing: 2px;
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
</style>
