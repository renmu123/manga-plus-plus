<template>
  <div>
    <span class="pre"></span>
    <img :src="currentImage" alt="" class="image" />
    <span class="next"></span>
  </div>
</template>

<script setup lang="ts">
import { chapter } from "@/api";
import { useEventListener } from "@vueuse/core";

const route = useRoute();

const id = Number(route.params.id);

const data = ref({});
const getDetail = async () => {
  const res = await chapter.query(id);
  data.value = res.data;

  getImages();
};

getDetail();

const page = ref(0);
const currentImage = computed(() => {
  return imageList.value[page.value];
});

const imageList = ref([]);
const start = ref(0);
const getImages = async () => {
  const res = await chapter.getImages(id, { start: start.value, offset: 3 });
  imageList.value = res.data.data;
  nextDisabled.value = false;

  res.data.data.map((item: string) => {
    preload(item);
  });

  start.value += 1;
};

const nextDisabled = ref(true);
const next = async () => {
  if (nextDisabled.value) return;
};

const pre = async () => {};

function preload(image: string) {
  const img = new Image();
  img.src = image;
}
</script>

<style scoped>
.pre {
  cursor: pointer;
  position: absolute;
  width: 20px;
  height: 20px;
  background-color: skyblue;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
}
.image {
  height: 100%;
  object-fit: contain;
  object-position: 50% 50%;
}
.next {
  cursor: pointer;
  position: absolute;
  width: 20px;
  height: 20px;
  background-color: skyblue;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
}
</style>
