<template>
  <div class="comic-detail-container">
    <div class="comic-info-content">
      <div class="cover"></div>
      <div class="info">
        <p class="name">{{ detail.name }}</p>
        <p class="author">
          作者：
          <span
            v-for="author in detail.authors"
            :key="author.id"
            class="author-name"
            @click="search({ authors: author.id })"
            >{{ author.name }}&nbsp;
          </span>
        </p>
        <p class="tag">
          标签：
          <span
            v-for="tag in detail.tags"
            :key="tag.id"
            class="tag-name"
            @click="search({ tags: tag.id })"
            >{{ tag.name }}&nbsp;
          </span>
        </p>
        <p class="other"></p>
        <p class="summary">简介：{{ detail.summary }}</p>
      </div>
    </div>
    <div class="chapter-content"></div>
  </div>
</template>

<script setup lang="ts">
import { comic } from "@/api";
import type { Comic } from "@/types/index";

const route = useRoute();
const router = useRouter();

const id = Number(route.params.id);

// @ts-ignore
const detail = ref<Comic>({});
const getDetail = async () => {
  const res = await comic.query(id, {
    includeChapters: 1,
    includeTags: 1,
    includeAuthors: 1,
  });
  detail.value = res.data;
};

getDetail();

const search = (data: any) => {
  router.push({ name: "library", query: data });
};
</script>

<style scoped lang="scss">
.comic-detail-container {
  .comic-info-content {
    display: flex;
    margin-bottom: 20px;
    .cover {
      width: 150px;
      height: 212px;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center center;
      position: relative;
      background-color: skyblue;
      flex: none;
    }
    .info {
      margin-left: 20px;

      .name {
        font-weight: bold;
        font-size: 18px;
      }
      .author-name {
        cursor: pointer;
        color: var(--link-color);
      }
      .tag {
        .tag-name {
          cursor: pointer;
          color: var(--link-color);
        }
      }
      .summary {
      }
    }
  }
  .chapter-content {
  }
}
</style>
