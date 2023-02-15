import { defineStore } from "pinia";
// import { getIPAddress } from "@/utils/utils.js"

export const useDeviceStore = defineStore({
    id: "device_store",
    state: () => ({
        devices: [],
        index:-1,
        localIP: myAPI.getLocalIP(),
    }),
    actions: {
        addDevice(ip:string) {
            this.devices.push(ip)
        },
        removeDevice(ip:string) {
            this.devices = this.devices.filter(item => item!== ip)
        },
        openChat(ip:string){
            let idx = 0
            for(let i = 0;i < this.devices.length; i++) {
                if(this.devices[i] === ip) {
                    idx = i;
                    break;
                }
            }
            this.index = idx;
        },
        getCurrentIP() {
            return this.devices[this.index]
        }
    }
})