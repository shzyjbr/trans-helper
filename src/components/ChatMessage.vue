<template>
  <div class="main-layout">
    <div class="header">
      <h4 >{{ deviceStore.devices[deviceStore.index] }}</h4>
    </div>
    <div class="main">
      <el-scrollbar style="width: 100%;">
        <li v-for="file in fileList" :key="file.filename">
          <div style="margin-left: 10px;margin-top: 10px;" v-if="file.mine">
            <span>文件:"{{ file.filename }}"发送{{ file.isSuccess ? '成功' : '失败' }}</span>
          </div>
          <!-- <el-divider /> -->
        </li>
      </el-scrollbar>
    </div>
    <div class="footer">
      <el-button type="primary" class="mybtn" @click="transferFile"><span style="font-size: 15px;">传输文件</span></el-button>
      <el-button type="primary" class="mybtn" @click="transferDir">传输文件夹</el-button>
    </div>
  </div>


</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { useDeviceStore } from "@/store/deviceStore";
import { useFileStore } from "@/store/fileStore";

const deviceStore = useDeviceStore();
const fileStore = useFileStore();
const fileList = computed(() => {
  return fileStore.getFiles(deviceStore.getCurrentIP())
})

const transferFile = () => {
  fileStore.sendFile()

}

const transferDir = () => {
  fileStore.sendDir()
}

const showFiles = () => {
  console.log(fileStore.getFiles(deviceStore.getCurrentIP()))
}

const changeSaveDir = () => {
  myAPI.changeSaveDir()
}
</script>

<style lang="css" scoped>
.main-layout {
  width: 100%;
  /* display: flex;
  flex-direction: column; */
  position: relative;
}

.header {
  /* flex: 3;
  display: flex;
  justify-content: center; */
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  height: 20px;
  width: 100%;
  border-bottom: 1px solid hsl(0, 5%, 60%);
}

.main {
  position: absolute;
  width: 100%;
  top: 20px;
  bottom: 75px;
}

.footer {
  /* flex: 5;
  display: flex;
  justify-content: center; */
  position: absolute;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-content:center;
  align-items:center;
  height: 70px;
  width: 100%;
  border-top: 1px solid hsl(0, 5%, 60%);
}

.mybtn {
  width: 100px;
  height: 50px;
  font-size: 15px;
  margin-top: 3px;
  margin-bottom: 3px;
}
</style>
