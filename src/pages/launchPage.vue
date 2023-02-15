<template>
  <div id='myDiv'>
    <el-button id='startButton' style="" type="success" @click="toDashboard">启动传输服务</el-button>
  </div>
</template>
<script lang="ts" setup>
import { useRouter } from "vue-router";
import { ref, onMounted } from 'vue'
import { useDeviceStore } from "@/store/deviceStore";
import { useFileStore } from "@/store/fileStore";
import { useSettingStore } from "@/store/settingStore";

const router = useRouter()
const deviceStore = useDeviceStore();
const fileStore = useFileStore();
const settingStore = useSettingStore();

function toDashboard() {

  router.push('/dashBoard')
}

onMounted(() => {
  myAPI.handleFileResult((e: any, res: any) => {
    fileStore.addFile(res)
  })
  myAPI.handleUpdateIP((e: any, ipList: any) => {
    deviceStore.devices = Array.from(ipList)
    deviceStore.index = 0
  })
  myAPI.handleSelectSaveDirResult((e: any, res: any) => {
    settingStore.tempSaveDir = res
  })
  myAPI.handleGetSaveDir((e: any, res: any) => {
    settingStore.saveDir = res
  })
  myAPI.getSaveDir() 

})

</script>


<style scoped>
#myDiv {
  widows: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
}

#startButton {
  height: 100px;
  width: 200px;
  font-size: 25px;

}
</style>
