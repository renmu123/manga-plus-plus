<template>
  <div class="container">
    <div class="search">
      <n-input placeholder="搜索">
        <template #suffix>
          <n-icon :component="SearchOutlined" />
        </template>
      </n-input>
      <n-icon
        :component="FilterListOutlined"
        class="filter"
        size="30"
        @click="openFilterDrawer"
      />
    </div>

    <div class="comic">
      <comicCard
        v-for="comic in list"
        :key="comic.id"
        :data="comic"
      ></comicCard>
    </div>

    <n-drawer v-model:show="filterVisible" :width="502" placement="right">
      <n-drawer-content>
        <n-form ref="formRef" label-width="auto" :model="tempFilterData">
          <n-form-item label="标签">
            <n-select
              placeholder="请选择标签"
              v-model:value="tempFilterData.tags"
              filterable
              multiple
              :options="tagList"
            />
          </n-form-item>
          <n-form-item label="作者">
            <n-select
              placeholder="请选择作者"
              v-model:value="tempFilterData.authors"
              filterable
              multiple
              :options="authorList"
            />
          </n-form-item>
        </n-form>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<script setup lang="ts">
import comicCard from "@/components/comicCard.vue";
import { SearchOutlined, FilterListOutlined } from "@vicons/material";

import { comic, common, tag, author } from "@/api";

import type { Comic } from "@/types/index";
import { cloneDeep } from "lodash-es";

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
};

getList();

const tagList = ref<{ id: number; name: string }[]>([]);
const getTagList = async () => {
  const res = await tag.list();
  tagList.value = res.data;
};

const authorList = ref<{ id: number; name: string }[]>([]);
const getAuthorList = async () => {
  const res = await author.list();
  authorList.value = res.data;
};

const filterVisible = ref(true);

watch(
  filterVisible,
  (newVal) => {
    if (newVal) {
      getTagList();
      getAuthorList();

      tempFilterData.value = cloneDeep(filterData.value);
    }
  },
  { immediate: true }
);

const filterData = ref({
  authors: [],
  tags: [],
});

const tempFilterData = ref({
  authors: [],
  tags: [],
});

const openFilterDrawer = () => {
  filterVisible.value = true;
};

console.log(route.query);
if (route.query) {
  if (route.query.tags) {
  }
  if (route.query.authors) {
  }
}
</script>

<style scoped lang="scss">
.container {
  .search {
    margin: 0px 15px;
    margin-bottom: 40px;
    display: flex;
    align-items: center;
    .filter {
      margin-left: 10px;
      cursor: pointer;
    }
  }
}
</style>
