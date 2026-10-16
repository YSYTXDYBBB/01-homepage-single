<!-- src/views/admin/ProfileEdit.vue —— 编辑个人简介 -->
<template>
  <ProfileCard
    v-model:isEditing="isEditing"
    :profile="profile"
    @update-profile="handleUpdate"
  >
    <template #actions>
      <!-- el-button：进入编辑模式 -->
      <el-button
        v-if="!isEditing"
        type="primary"
        plain
        size="small"
        @click="isEditing = true"
      >
        <el-icon><EditPen /></el-icon> 编辑资料
      </el-button>
    </template>
  </ProfileCard>

  <!-- el-alert：保存成功提示 -->
  <el-alert
    v-if="saved"
    class="save-tip"
    type="success"
    show-icon
    :closable="false"
    title="个人信息已成功更新并保存到本地！"
  />
</template>

<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import ProfileCard from '../../components/ProfileCard.vue'
import { useProfileStore } from '../../stores/profileStore'

const profileStore = useProfileStore()
// 解构 state 时使用 storeToRefs 保持响应式
const { profile } = storeToRefs(profileStore)
// actions 可直接解构使用
const { updateProfile } = profileStore

const isEditing = ref(false)
const saved = ref(false)

const handleUpdate = (newProfile) => {
  updateProfile(newProfile)
  isEditing.value = false
  // 显示保存提示，2 秒后自动消失
  saved.value = true
  setTimeout(() => (saved.value = false), 2000)
}
</script>

<style scoped>
.save-tip {
  margin-top: 14px;
}
</style>
