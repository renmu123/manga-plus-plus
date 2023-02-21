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
    <router-link
      :to="{
        name: 'comic',
        params: { id: data.id, libraryId: libraryId },
      }"
    >
      {{ data.name }}
    </router-link>

    <n-modal v-model:show="editDialogVisible">
      <n-card
        style="width: 600px"
        title="漫画编辑"
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

          <n-form-item label="标签" path="tags">
            <n-dynamic-tags v-model:value="detail.tagsData">
              <template #input="{ submit, deactivate }">
                <n-auto-complete
                  ref="autoCompleteInstRef"
                  size="small"
                  v-model:value="inputValue"
                  :options="tagOptions"
                  placeholder="输入或选择标签"
                  :clear-after-select="true"
                  @select="submit($event)"
                  @blur="deactivate"
                  :get-show="() => true"
                />
              </template>
              <template #trigger="{ activate, disabled }">
                <n-button
                  size="small"
                  type="primary"
                  dashed
                  @click="activate()"
                >
                  添加
                </n-button>
              </template>
            </n-dynamic-tags>
          </n-form-item>
          <n-form-item label="作者" path="author">
            <n-select
              placeholder="请选择或新建作者"
              v-model:value="detail.authorsData"
              filterable
              multiple
              tag
              :options="authorOptions"
            />
          </n-form-item>
          <n-form-item label="阅读状态" path="readingStatus">
            <n-select
              placeholder="请选择阅读状态"
              v-model:value="detail.readingStatus"
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
          <n-form-item label="连载状态" path="status">
            <n-select
              placeholder="请选择连载状态"
              v-model:value="detail.status"
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
import { comic, common, tag, author } from "@/api";
import type { Comic } from "@/types/index";
import { DehazeFilled } from "@vicons/material";
import { keyBy, cloneDeep } from "lodash-es";
import { UploadCustomRequestOptions } from "naive-ui";

export interface Props {
  data: Comic;
  libraryId: number;
}

const props = withDefaults(defineProps<Props>(), {});

const uploadUrl = computed(
  () => `${import.meta.env.VITE_API_URL}/common/cover/upload`
);
const editDialogVisible = ref(false);
// @ts-ignore
const detail = ref<Comic>({});
const edit = async () => {
  const res = await comic.query(props.data.id);
  detail.value = res.data;
  detail.value.tagsData = detail.value.tags.map((item) => item.name);
  detail.value.authorsData = detail.value.authors.map((item) => item.name);

  editDialogVisible.value = true;
  getTagList();
  getAuthorList();
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

const inputValue = ref("");

const confirm = async () => {
  const data = cloneDeep(detail.value);

  //////////// tag
  const createdTagIds = (data.tagsData || [])
    .map((name) => {
      return tagMap.value[name]?.id;
    })
    .filter((id) => {
      return !!id;
    });
  const unCreatedTag = (data.tagsData || []).filter((name) => {
    return !tagMap.value[name];
  });
  let newCreateTagIds = [];
  if (unCreatedTag.length !== 0) {
    // 新建缺少的tag
    const res = await tag.addMany({ names: unCreatedTag });
    newCreateTagIds = res.data.map((item: { id: number }) => item.id);
  }
  // @ts-ignore
  data.tags = createdTagIds.concat(newCreateTagIds);
  delete data.tagsData;

  ///////////// author
  const createdAuthorIds = (data.authorsData || [])
    .map((name) => {
      return authorMap.value[name]?.id;
    })
    .filter((id) => {
      return !!id;
    });
  const unCreatedAuthor = (data.authorsData || []).filter((name) => {
    return !authorMap.value[name];
  });
  let newCreateAuthorIds = [];
  if (unCreatedAuthor.length !== 0) {
    // 新建缺少的author
    const res = await author.addMany({ names: unCreatedAuthor });
    newCreateAuthorIds = res.data.map((item: { id: number }) => item.id);
  }
  // @ts-ignore
  data.authors = createdAuthorIds.concat(newCreateAuthorIds);
  delete data.authorsData;

  // 提交
  await comic.edit(data);
  editDialogVisible.value = false;
};

// 标签
const tagList = ref<{ id: number; name: string }[]>([]);
const tagOptions = computed(() => {
  const data = tagList.value
    .map((tag) => {
      return {
        label: tag.name,
        value: tag.name,
      };
    })
    .filter((item) => {
      if ((detail.value.tagsData || []).includes(item.value)) {
        return false;
      }
      return true;
    });

  if (inputValue.value !== null) {
    data.unshift({ label: inputValue.value, value: inputValue.value });
  }

  return data;
});
const tagMap = computed(() => {
  return keyBy(tagList.value, "name");
});
const getTagList = async () => {
  const res = await tag.list();
  tagList.value = res.data;
};

// 作者
const authorList = ref<{ id: number; name: string }[]>([]);
const authorOptions = computed(() => {
  const data = authorList.value
    .map((author) => {
      return {
        label: author.name,
        value: author.name,
      };
    })
    .filter((item) => {
      if ((detail.value.authorsData || []).includes(item.value)) {
        return false;
      }
      return true;
    });

  return data;
});
const authorMap = computed(() => {
  return keyBy(authorList.value, "name");
});
const getAuthorList = async () => {
  const res = await author.list();
  authorList.value = res.data;
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
  margin-right: 15px;
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
