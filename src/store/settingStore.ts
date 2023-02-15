import { defineStore } from "pinia";


export const useSettingStore = defineStore({
    id: "device_store",
    state: () => ({
        saveDir: "",
        tempSaveDir: ''
    }),
    actions: {
        // 供启动的时候初始化saveDir
        updateSaveDir() {
            myAPI.getSaveDir((_saveDir:string) => {
                this.saveDir = _saveDir
            })
        },

    }
})