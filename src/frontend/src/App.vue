<template>
  <div class="main-container">
    <n-notification-provider>
      <n-dialog-provider>
        <RouterView />
      </n-dialog-provider>
    </n-notification-provider>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.main-container {
  padding: 20px;
}
</style>
