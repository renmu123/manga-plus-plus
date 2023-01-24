<template>
  <n-button @click="visible = true"> 添加库 </n-button>

  <fileBrowserDialog
    v-model:visible="visible"
    v-model="path"
  ></fileBrowserDialog>
</template>

<script setup lang="ts">
import fileBrowserDialog from "@/components/fileBrowserDialog/index.vue";

const visible = ref(true);

const path = ref("/");
</script>

<style scoped></style>
