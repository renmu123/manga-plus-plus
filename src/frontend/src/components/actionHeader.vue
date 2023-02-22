<template>
  <div class="action-header">
    <div class="left">
      <n-icon size="25" class="action-icon">
        <ArrowBackFilled class="back" @click="back"></ArrowBackFilled>
      </n-icon>
      <n-icon size="25" class="action-icon">
        <HomeFilled class="home" @click="home"></HomeFilled>
      </n-icon>
    </div>
    <div class="right">
      <n-icon size="25" class="action-icon">
        <FavoriteRound class="donate" @click="setting"></FavoriteRound>
      </n-icon>
      <n-icon size="25" class="action-icon">
        <SettingsRound class="setting" @click="setting"></SettingsRound>
      </n-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  HomeFilled,
  ArrowBackFilled,
  SettingsRound,
  FavoriteRound,
} from "@vicons/material";

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
    margin: 0px 5px;
  }
  .home {
  }
  .back {
  }
  .right {
    margin-left: auto;
  }
  .donate {
    color: red;
  }
  .setting {
  }
}
</style>
