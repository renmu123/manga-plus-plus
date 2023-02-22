<template>
  <n-modal v-model:show="visible">
    <n-card
      style="width: 600px"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
      class="donate-container"
    >
      <div class="donate-content">
        <p>这个项目花费了我大量的精力，请帮帮我！！！</p>
        <p>赞助一瓶快乐水</p>
      </div>
      <template #footer>
        <div class="donate-footer">
          <n-button
            type="primary"
            size="medium"
            @click="visible = false"
            class="donate-footer-button"
            >这次一定</n-button
          >
          <n-popconfirm
            @positive-click="visible = false"
            @negative-click="visible = false"
            positive-text="这次一定"
            negative-text="这次一定"
          >
            <template #trigger>
              <n-button
                type="warning"
                size="medium"
                class="donate-footer-button"
                >下次一定</n-button
              >
            </template>
            没有下一次了！！
          </n-popconfirm>
        </div>
      </template>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import { useVModel } from "@vueuse/core";

export interface Props {
  modelValue?: string;
  visible: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  visible: true,
});
const emit = defineEmits(["update:visible"]);

const visible = useVModel(props, "visible", emit);

const close = () => {
  visible.value = false;
};
</script>

<style scoped lang="scss">
.donate-footer {
  display: flex;
  justify-content: space-around;
}
</style>
