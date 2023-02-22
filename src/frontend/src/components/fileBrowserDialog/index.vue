<template>
  <n-modal v-model:show="visible">
    <n-card
      style="width: 600px"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
      class="file-browser-container"
    >
      <div class="file-browser-content">
        <div class="file-browser-content-header">
          <n-icon size="25" class="icon pointer" @click="getData(data.parent)">
            <ArrowBackIosFilled></ArrowBackIosFilled>
          </n-icon>
          <div class="file-browser-current-path">
            {{ currentPath }}
          </div>
        </div>
        <div class="file-browser-content-items">
          <div
            class="file-browser-content-item"
            v-for="item in data.list || []"
            :key="item.name"
            @click="getData(item.path)"
          >
            <n-icon size="25" class="icon">
              <FolderFilled v-if="item.type === 'directory'"></FolderFilled>
              <InsertDriveFileSharp
                v-if="item.type === 'file'"
              ></InsertDriveFileSharp>
            </n-icon>

            <span class="file-browser-content-item-name">{{ item.name }}</span>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="file-browser-footer">
          <n-button
            type="primary"
            size="medium"
            @click="cancel"
            class="file-browser-footer-button"
            >取消</n-button
          >
          <n-button
            type="primary"
            size="medium"
            @click="confirm"
            class="file-browser-footer-button"
            >选中</n-button
          >
        </div>
      </template>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import { useVModel } from "@vueuse/core";
import {
  FolderFilled,
  InsertDriveFileSharp,
  ArrowBackIosFilled,
} from "@vicons/material";
import { common } from "@/api";

export interface Props {
  modelValue?: string;
  visible: boolean;
  include?: string;
}
const props = withDefaults(defineProps<Props>(), {
  visible: true,
  include: "directory",
  modelValue: "/",
});
const emit = defineEmits([
  "update:visible",
  "update:modelValue",
  "confirm",
  "close",
]);

const visible = useVModel(props, "visible", emit);
const currentPath = useVModel(props, "modelValue", emit);

const close = () => {
  visible.value = false;
};

const cancel = () => {
  close();
};
const confirm = () => {
  emit("confirm", currentPath);
  close();
};

const data = ref<{
  list: { name: string; path: string; type: string }[];
  parent: string;
}>({
  list: [],
  parent: "",
});

const getData = async (path: string) => {
  const res = await common.fileSystem({
    path: path,
    include: "directory",
  });
  data.value = res.data;
  currentPath.value = path;
};
getData(currentPath.value);
</script>

<style scoped lang="scss">
.file-browser-content {
  &-header {
    font-size: 18px;
    display: flex;
    align-items: center;
    margin-left: 10px;

    .file-browser-current-path {
      margin-left: 20px;
    }
  }
  &-items {
    margin-top: 20px;
    max-height: 70vh;
    overflow: auto;
  }
  &-item {
    padding: 10px 10px;
    display: flex;
    cursor: pointer;
    &-name {
      margin-left: 20px;
    }
  }
  &-item:hover {
    background-color: #f6f6f6;
  }
}
.file-browser-footer {
  text-align: right;
  &-button {
    margin: 0px 10px;
  }
}
</style>
