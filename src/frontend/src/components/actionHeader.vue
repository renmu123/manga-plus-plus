<template>
  <div class="action-header">
    <div class="left">
      <n-icon size="25">
        <HomeFilled class="home action-icon" @click="home"></HomeFilled>
      </n-icon>
      <n-icon size="25">
        <ArrowBackFilled
          class="back action-icon"
          @click="back"
        ></ArrowBackFilled>
      </n-icon>
    </div>
    <div class="right">
      <n-icon size="25">
        <SettingsRound
          class="setting action-icon"
          @click="setting"
        ></SettingsRound>
      </n-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { HomeFilled, ArrowBackFilled, SettingsRound } from "@vicons/material";

const router = useRouter();

const home = () => {
  router.push({ name: "dashboard" });
};
const back = () => {
  router.back();
};
const setting = () => {
  router.push({ name: "setting" });
};
</script>

<style scoped lang="scss">
.action-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  .action-icon {
    cursor: pointer;
  }
  .home {
  }
  .back {
  }
  .right {
    margin-left: auto;
  }
  .setting {
  }
}
</style>
