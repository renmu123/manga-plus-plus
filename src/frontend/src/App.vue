<template>
  <div class="main-container">
    <n-notification-provider>
      <n-dialog-provider>
        <actionHeader></actionHeader>
        <RouterView />
      </n-dialog-provider>
    </n-notification-provider>
  </div>
</template>

<script setup lang="ts">
import actionHeader from "@/components/actionHeader.vue";
</script>

<style scoped lang="scss">
.main-container {
  padding: 20px;
}
</style>
