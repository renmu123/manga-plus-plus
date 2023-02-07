<template>
  <div class="comic">
    <comicCard v-for="comic in list" :key="comic.id" :data="comic"></comicCard>
  </div>
</template>

<script setup lang="ts">
import comicCard from "@/components/comicCard.vue";

import { comic } from "@/api";
import type { Comic } from "@/types/index";

const route = useRoute();
const id = Number(route.params.id);

const list = ref<Comic[]>([]);
const idCursor = ref(0);
const getList = async () => {
  const res = await comic.list({
    libraryId: id,
    idCursor: idCursor.value,
    size: 50,
  });
  list.value = list.value.concat(res.data);
  idCursor.value = list.value[list.value.length - 1].id;
  console.log(list.value);
};

getList();

const visible = ref(true);

const path = ref("/");
</script>

<style scoped></style>
