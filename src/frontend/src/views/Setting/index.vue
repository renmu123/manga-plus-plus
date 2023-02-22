<template>
  <div class="setting-container">
    <div>
      <h2>库管理</h2>
      <n-button type="primary"> 添加 </n-button>
      <div class="library-container">
        <div v-for="library in libraryList" :key="library.id" class="library">
          <span class="library-name">
            {{ library.name }}
          </span>
          <n-button quaternary type="error"> 删除 </n-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { library, comic } from "@/api";
import type { Library } from "@/types/index";

const libraryList = ref<Library[]>([]);

const getLibraryList = async () => {
  const res = await library.list();
  libraryList.value = res.data;
};
getLibraryList();
</script>

<style scoped lang="scss">
/* .setting-container {
  display: flex;
  justify-content: center;
} */
.library-container {
  border: 1px solid gray;
  border-radius: 4px;
  margin: 20px 0px;
  padding: 10px;

  :not(:last-child(.library)) {
    margin-bottom: 10px;
  }
  .library-name {
    margin-right: 20px;
  }
}
</style>
