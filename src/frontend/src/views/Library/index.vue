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
        :libraryId="id"
      ></comicCard>
    </div>

    <n-drawer
      v-model:show="filterVisible"
      width="min(450px,90%)"
      placement="right"
    >
      <n-drawer-content>
        <n-form ref="formRef" label-width="auto" :model="tempFilterData">
          <n-form-item label="阅读状态">
            <n-select
              placeholder="请选择阅读状态"
              v-model:value="tempFilterData.readingStatus"
              filterable
              clearable
              :options="[
                { id: 1, name: '未读' },
                { id: 2, name: '阅读中' },
                { id: 3, name: '已读' },
              ]"
              value-field="id"
              label-field="name"
            />
          </n-form-item>
          <n-form-item label="连载状态">
            <n-select
              placeholder="请选择连载状态"
              v-model:value="tempFilterData.status"
              filterable
              clearable
              :options="[
                { id: 1, name: '连载中' },
                { id: 2, name: '已完结' },
              ]"
              value-field="id"
              label-field="name"
            />
          </n-form-item>
          <n-form-item label="标签">
            <n-select
              placeholder="请选择标签"
              v-model:value="tempFilterData.tags"
              filterable
              multiple
              :options="tagList"
              value-field="id"
              label-field="name"
            />
          </n-form-item>
          <n-form-item label="作者">
            <n-select
              placeholder="请选择作者"
              v-model:value="tempFilterData.authors"
              filterable
              multiple
              :options="authorList"
              value-field="id"
              label-field="name"
            />
          </n-form-item>
        </n-form>

        <template #footer>
          <div>
            <n-button @click="filterVisible = false">取消</n-button>
            <n-button type="info" style="margin-left: 20px" @click="filterReset"
              >重置</n-button
            >
            <n-button
              type="primary"
              @click="filterConfirm"
              style="margin-left: 20px"
              >确认</n-button
            >
          </div>
        </template>
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
const idCursor = ref();
const getList = async (init = true) => {
  const filter = cloneDeep(filterData.value);
  // @ts-ignore
  filter.authors = filter.authors.join(",");
  // @ts-ignore
  filter.tags = filter.tags.join(",");

  if (init) {
    const res = await comic.list({
      libraryId: id,
      idCursor: undefined,
      size: 50,
      ...filter,
    });
    list.value = res.data;
    idCursor.value = list.value[list.value.length - 1].id;
  } else {
    const res = await comic.list({
      libraryId: id,
      idCursor: idCursor.value,
      size: 50,
      ...filter,
    });
    list.value = list.value.concat(res.data);
    idCursor.value = list.value[list.value.length - 1].id;
  }
};

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

const filterVisible = ref(false);

const tempFilterData = ref({
  authors: [],
  tags: [],
  readingStatus: undefined,
  status: undefined,
});
const filterData = ref({
  authors: [],
  tags: [],
  readingStatus: undefined,
  status: undefined,
});

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

const openFilterDrawer = () => {
  filterVisible.value = true;
};

if (route.query) {
  if (route.query.tags) {
    // @ts-ignore
    filterData.value.tags = route.query.tags.split(",").map(Number);
  }
  if (route.query.authors) {
    // @ts-ignore
    filterData.value.authors = route.query.authors.split(",").map(Number);
  }
}

getList();

const filterConfirm = () => {
  filterData.value = cloneDeep(tempFilterData.value);
  filterVisible.value = false;
  getList();
};

const filterReset = () => {
  tempFilterData.value = {
    authors: [],
    tags: [],
    readingStatus: undefined,
    status: undefined,
  };
};
</script>

<style scoped lang="scss">
.container {
  .search {
    // margin: 0px 15px;
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
