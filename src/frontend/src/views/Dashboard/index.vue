<template>
  <div class="library">
    <libraryCard
      v-for="library in libraryList"
      :key="library.id"
      :data="library"
    ></libraryCard>
  </div>
</template>

<script setup lang="ts">
import libraryCard from "@/components/libraryCard.vue";

import { library, comic } from "@/api";
import type { Library } from "@/types/index";

const libraryList = ref<Library[]>([]);
const getLibraryList = async () => {
  const res = await library.list();
  libraryList.value = res.data;
};

getLibraryList();

const recentAddComics = ref([]);

const getComics = async () => {
  const res = await comic.recentAdded({
    size: 8,
  });
  recentAddComics.value = res.data;
};
</script>

<style scoped></style>
