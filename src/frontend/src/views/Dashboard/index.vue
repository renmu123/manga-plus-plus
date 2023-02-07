<template>
  <div class="library">
    <libraryCard
      v-for="library in libraryList"
      :key="library.id"
      :data="library"
    ></libraryCard>
  </div>
  <!-- <n-button @click="visible = true"> 添加库 </n-button>

  <fileBrowserDialog
    v-model:visible="visible"
    v-model="path"
  ></fileBrowserDialog> -->
</template>

<script setup lang="ts">
import fileBrowserDialog from "@/components/fileBrowserDialog/index.vue";
import libraryCard from "@/components/libraryCard.vue";

import { library } from "@/api";
import type { Library } from "@/types/index";

const libraryList = ref<Library[]>([]);
const getLibraryList = async () => {
  const res = await library.list();
  libraryList.value = res.data;
  console.log(libraryList.value);
};

getLibraryList();

const visible = ref(true);

const path = ref("/");
</script>

<style scoped></style>
