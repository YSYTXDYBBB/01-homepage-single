<template>
  <el-card class="info-card" shadow="hover">
    <template #header>
      <div class="card-head">
        <span class="card-title"><el-icon><Notebook /></el-icon> 个人简介</span>
        <!-- el-button：展开 / 收起切换 -->
        <el-button
          :type="showDetail ? 'info' : 'primary'"
          plain
          size="small"
          @click="showDetail = !showDetail"
        >
          {{ showDetail ? '收起简介' : '展开简介' }}
        </el-button>
      </div>
    </template>

    <!-- 默认插槽：父组件可以决定显示长简介还是短简介，如果不传则使用默认内容 -->
    <slot :showDetail="showDetail">
      <p v-if="showDetail" class="intro-text">{{ profile.intro }}</p>
      <p v-else class="intro-text">{{ profile.introShort }}</p>
      <!-- el-alert：提示信息 -->
      <el-alert
        v-if="!showDetail"
        class="intro-tip"
        type="info"
        show-icon
        :closable="false"
        title="当前为简介摘要，点击右上角「展开简介」查看完整内容"
      />
    </slot>
  </el-card>
</template>

<script setup>
defineProps({
  profile: { type: Object, required: true }
})
// 双向绑定展开/收起状态
const showDetail = defineModel('showDetail', { type: Boolean, default: false })
</script>

<style scoped>
.intro-text {
  margin: 0;
  font-size: 14px;
  line-height: 1.9;
  color: var(--el-text-color-regular);
  white-space: pre-line;
}
.intro-tip {
  margin-top: 12px;
}
</style>
