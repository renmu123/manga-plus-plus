<template>
  <div class="chapter-card">
    <div
      class="chapter-content"
      :style="{
        backgroundImage: `url(${data.cover})`,
      }"
    >
      <div class="wrapper">
        <n-popover
          :show-arrow="false"
          class="chapter-card-action"
          style="padding: 0"
        >
          <template #trigger>
            <DehazeFilled class="action"></DehazeFilled>
          </template>

          <div class="item-container">
            <div class="item" @click="edit">编辑</div>
          </div>
        </n-popover>
      </div>
    </div>
    <router-link
      :to="{
        name: 'images',
        params: { id: data.id },
      }"
    >
      {{ data.name }}
    </router-link>

    <n-modal v-model:show="editDialogVisible">
      <n-card
        style="width: 600px"
        title="编辑"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
        :closable="true"
        :on-close="
          () => {
            editDialogVisible = false;
          }
        "
      >
        <n-form ref="formRef" label-width="auto" :model="detail" :rules="rules">
          <n-form-item label="名称" path="name">
            <n-input v-model:value="detail.name" placeholder="输入名称" />
          </n-form-item>
          <n-form-item label="路径" path="dir">
            <n-input v-model:value="detail.dir" disabled />
          </n-form-item>

          <n-form-item label="封面" path="cover">
            <div style="width: 100%">
              <n-upload
                :action="uploadUrl"
                :custom-request="customRequest"
                :show-file-list="false"
              >
                <n-button>上传文件</n-button>
              </n-upload>
              <n-input
                v-model:value="detail.cover"
                placeholder="封面"
                disabled
              />
            </div>
          </n-form-item>
          <n-form-item label="排序" path="sort">
            <n-input-number
              v-model.number:value="detail.sort"
              placeholder="请输入排序"
            />
          </n-form-item>
          <n-form-item label="分类" path="category">
            <n-select
              placeholder="请选择分类"
              v-model:value="detail.category"
              :options="categoryOptions"
            />
          </n-form-item>
          <n-form-item label="简介" path="summary">
            <n-input
              v-model:value="detail.summary"
              type="textarea"
              placeholder="请输入简介"
            />
          </n-form-item>
        </n-form>

        <template #footer>
          <div class="footer">
            <n-button attr-type="button" @click="editDialogVisible = false">
              取消
            </n-button>
            <n-button
              attr-type="button"
              @click="confirm"
              type="primary"
              style="margin-left: 20px"
            >
              确认
            </n-button>
          </div>
        </template>
      </n-card>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { common, chapter } from "@/api";
import type { Chapter } from "@/types/index";
import { DehazeFilled } from "@vicons/material";
import { keyBy, cloneDeep } from "lodash-es";
import { UploadCustomRequestOptions } from "naive-ui";

export interface Props {
  data: Chapter;
}

const props = withDefaults(defineProps<Props>(), {});

const uploadUrl = computed(
  () => `${import.meta.env.VITE_API_URL}/common/cover/upload`
);
const editDialogVisible = ref(false);
// @ts-ignore
const detail = ref<Chapter>({});
const edit = async () => {
  const res = await chapter.query(props.data.id);
  detail.value = res.data;

  editDialogVisible.value = true;
};

const rules = ref({
  name: {
    required: true,
    message: "请输入名称",
    trigger: "blur",
  },
  cover: {
    required: true,
    message: "请选择封面",
    trigger: ["blur"],
  },
  config: {},
});

const categoryOptions = ref([
  { label: "单行本", value: 1 },
  { label: "连载", value: 2 },
  { label: "番外", value: 3 },
]);

const confirm = async () => {
  const data = cloneDeep(detail.value);

  // 提交
  await chapter.edit(data);
  editDialogVisible.value = false;
};

const customRequest = ({
  file,
  data,
  headers,
  withCredentials,
  action,
  onFinish,
  onError,
  onProgress,
}: UploadCustomRequestOptions) => {
  const formData = new FormData();

  formData.append("file", file.file as File);
  common
    .uploadCover(formData)
    .then(({ data }) => {
      detail.value.cover = data.path;

      onFinish();
    })
    .catch((error) => {
      onError();
    });
};

watch(editDialogVisible, (newVal) => {
  if (newVal) {
    // 开启弹框
  } else {
    // 关闭弹框
  }
});
</script>

<style scoped lang="scss">
.chapter-card {
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  margin-right: 15px;
}
.chapter-content {
  width: 100px;
  height: 141px;
  // background-color: skyblue;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
  cursor: pointer;
  position: relative;

  .wrapper {
    display: none;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 8px;
    .action {
      position: absolute;
      right: 5px;
      bottom: 5px;
      cursor: pointer;
      width: 20px;
      height: 20px;
    }
  }
}
.chapter-content:hover .wrapper {
  display: block;
}
.footer {
  display: flex;
  justify-content: center;
}
</style>

<style lang="scss">
.chapter-card-action {
  .item-container {
    .item {
      cursor: pointer;
      padding: 10px 20px;
      min-width: 80px;
    }
    .item:hover {
      background-color: rgba(0, 0, 0, 0.2);
    }
  }
}
</style>
