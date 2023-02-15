<template>
  <!-- <teleport to="#modal"> -->
  <el-dialog v-model="showSetting_" :show-close="false" title="设置" :close-on-click-modal="false">
    <el-descriptions class="description" :column="2">
      <el-descriptions-item label="" >当前保存路径</el-descriptions-item>
      <el-descriptions-item label="">{{ settingStore.saveDir }}</el-descriptions-item>
      <el-descriptions-item label=""><el-button type="primary"
          @click="selectDir">选择保存路径</el-button></el-descriptions-item>
      <el-descriptions-item label="" v-if="settingStore.tempSaveDir !== ''">{{
        settingStore.tempSaveDir
      }}</el-descriptions-item>
    </el-descriptions>
    <!-- <el-button type="primary" @click="selectDir" style="margin-left: 20px;">选择保存路径</el-button>
    <el-descriptions class="description" :column="1">
      <el-descriptions-item label="" v-if="settingStore.tempSaveDir !== ''">{{
        settingStore.tempSaveDir
      }}</el-descriptions-item>

    </el-descriptions> -->
    <!-- <div>
      <span>当前保存路径</span>
    </div> -->

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">关闭</el-button>
        <el-button type="primary" @click="saveSetting">保存</el-button>
      </span>
    </template>
  </el-dialog>
  <!-- </teleport> -->
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useSettingStore } from "@/store/settingStore"

const settingStore = useSettingStore()


const emit = defineEmits(["close"]);

const props = defineProps({
  showSetting: {
    type: Boolean,
    required: true,
    default: false
  }
});

const showSetting_ = computed(() => {
  return props.showSetting;
});


const close = () => {
  emit("close");
};

const saveSetting = () => {
  settingStore.saveDir = settingStore.tempSaveDir
  myAPI.changeSaveDir(settingStore.saveDir)
}

const selectDir = () => {
  myAPI.handleShowSettingDialog()
}
</script>

<style scoped lang="scss">
.info {
  text-align: center;
  line-height: 200%;
}

.description {
  padding: 20px 20px 0px 20px;
  background-color: #ffffff;
}
</style>
