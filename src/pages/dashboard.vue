<template>
    <el-container class="layout-container-demo" style="height: 100%;width:100%;margin-top: 2px;">
        <el-aside width="200px"
            style="display: flex; flex-direction: column;border-right: 1px solid #ccc;border-top: 1px solid #ccc;">

            <div class="deviceSpan">
                <div>
                    <h3>可连接设备</h3>
                </div>
            </div>
            <div style="flex: 90;">
                <el-scrollbar>
                    <el-menu>
                        <ListItem v-for="(device, index) in deviceStore.devices" :devicename="device"
                            :active="deviceStore.index === index" @click="choose(index)">
                        </ListItem>
                    </el-menu>
                </el-scrollbar>
            </div>
            <div style="flex: 5;">
                <div class="toolbar">
                    <!-- <el-button type="primary" class="mybtn" @click="changeSaveDir">改变保存路径</el-button> -->
                    <el-icon id="setting" style="margin: 20px; margin-top: 5px" size="25" @click="openSetting">
                        <setting />
                    </el-icon>

                </div>
            </div>



        </el-aside>

        <el-container>



            <el-main style="display:flex;flex-direction: column;" v-if="!chooseOne">
                <div class="header"></div>
                <div class="main">点右侧连接一个设备进行传输</div>
                <div class="footer"></div>

            </el-main>
            <!-- <div class="inner-text"></div> -->

            <chat-message v-if="chooseOne"></chat-message>


        </el-container>
    </el-container>
    <setting-modal :showSetting="showSetting" @close="closeSetting"></setting-modal>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { Menu as IconMenu, Message, Setting } from '@element-plus/icons-vue'
import ListItem from '@/components/ListItem.vue'
import ChatMessage from '@/components/ChatMessage.vue'
import SettingModal from "@/components/SettingModal.vue";
import { useDeviceStore } from "@/store/deviceStore";
import { useFileStore } from "@/store/fileStore";
import { useSettingStore } from "@/store/settingStore";


const deviceStore = useDeviceStore();
const fileStore = useFileStore();
const settingStore = useSettingStore();

//展示设置
const showSetting = ref(false);

const chooseOne = ref(false)
const choose = (item: any) => {
    console.log(item)
    chooseOne.value = true
    deviceStore.index = item
    console.log(deviceStore.getCurrentIP())
}
const openSetting = () => {
    showSetting.value = true
}

const closeSetting = () => {
    showSetting.value = false
    settingStore.tempSaveDir = ""
}


</script>

<style scoped>
.header {
    flex: 45;
}

.main {
    flex: 10;
    margin-left: 250px;
}

.footer {
    flex: 45;
}

.deviceSpan {
    flex: 5;
    background-color: #4fc09e;
    display: flex;
    align-items: center;
    justify-content: center;
}

#setting:hover {
    background-color: #a8b39bb6;
}
</style>
