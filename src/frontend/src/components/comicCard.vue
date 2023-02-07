<template>
  <div class="comic-card">
    <div
      class="comic-content"
      :style="{
        backgroundImage: `url(${data.cover})`,
      }"
    >
      <div class="wrapper">
        <n-popover
          :show-arrow="false"
          class="comic-card-action"
          style="padding: 0"
        >
          <template #trigger>
            <DehazeFilled class="action"></DehazeFilled>
          </template>

          <div class="item-container">
            <!-- <div class="item" @click="scan">扫描</div> -->
            <div class="item" @click="edit">编辑</div>
          </div>
        </n-popover>
      </div>
    </div>
    <router-link :to="{ name: 'comic', params: { id: data.id } }">
      {{ data.name }}
    </router-link>

    <n-modal v-model:show="editDialogVisible">
      <n-card
        style="width: 600px"
        title="模态框"
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
            <n-input v-model:value="detail.name" placeholder="输入库名称" />
          </n-form-item>
          <n-form-item label="路径" path="dir">
            <n-input v-model:value="detail.dir" disabled />
          </n-form-item>
          <n-form-item label="介绍" path="summary">
            <n-input
              v-model:value="detail.summary"
              type="textarea"
              placeholder="请输入简介"
            />
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
import { comic, common } from "@/api";
import type { Comic } from "@/types/index";
import { DehazeFilled } from "@vicons/material";
import { UploadCustomRequestOptions } from "naive-ui";

export interface Props {
  data: Comic;
}

const props = withDefaults(defineProps<Props>(), {});

// const scan = async () => {
//   await comic.scan(props.data.id);
// };

const uploadUrl = computed(
  () => `${import.meta.env.VITE_API_URL}/common/cover/upload`
);
const editDialogVisible = ref(false);
const detail = ref<Comic>({});
const edit = async () => {
  const res = await comic.query(props.data.id);
  detail.value = res.data;

  editDialogVisible.value = true;
};

const rules = ref({
  name: {
    required: true,
    message: "请输入库名称",
    trigger: "blur",
  },
  cover: {
    required: true,
    message: "请选择封面",
    trigger: ["blur"],
  },
  config: {},
});

const confirm = async () => {
  await comic.edit(detail.value);
  editDialogVisible.value = false;
  // comic.scan(props.data.id);
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
.comic-card {
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  margin-left: 15px;
}
.comic-content {
  width: 150px;
  height: 212px;
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
.comic-content:hover .wrapper {
  display: block;
}
.footer {
  display: flex;
  justify-content: center;
}
</style>

<style lang="scss">
.comic-card-action {
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
