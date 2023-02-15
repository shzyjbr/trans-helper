import { defineStore } from "pinia";
import FileInfo from "../mode/FileInfo";
import { useDeviceStore } from "./deviceStore"

const deviceStore = useDeviceStore()
export const useFileStore = defineStore({
    id: "file_store",
    state: () => ({
        // key: 不同的ip， value: 来往的文件数组
        files: new Map<string, FileInfo[]>(),
        index: 0,
    }),
    actions: {
        sendFile() {
            // 调用node的文件对话框进行传输并获得文件名, 获得一个Promise
            let promiseResult = myAPI.sendFile(deviceStore.getCurrentIP(), 9999)
            // promiseResult.then((result:any)=> {
            //     console.log('promiseResult', result)
            //     let filePaths = result.filePaths
            //     filePaths.forEach((filePath:any) => {
            //         this.addFile(filePath)
            //     });
            //     // this.addFile('c:zzk/zzk.txt')
            // })
            // promiseResult.catch((error: any) =>{
            //     console.log(error)
            // })
        },
        addFile(file: any) {
            let currentIP = deviceStore.getCurrentIP()
            let fileInfo: FileInfo = {
                filename: file.filename,
                fromIP: deviceStore.localIP,
                toIP: currentIP,
                mine: true,
                isSuccess: file.isSuccess
            }
            let fileList = this.files.get(currentIP) ?? new Array<FileInfo>();
            fileList.push(fileInfo);
            this.files.set(currentIP, fileList)
        },
        getFiles(ip:string) {
            return this.files.get(ip)
        },
        sendDir() {
            // 调用node的文件对话框进行传输并获得文件名, 获得一个Promise
            let promiseResult = myAPI.sendDir(deviceStore.getCurrentIP(), 9999)
            // promiseResult.then((result:any)=> {
            //     console.log('promiseResult', result)
            //     let filePaths = result.filePaths
            //     filePaths.forEach((filePath:any) => {
            //         this.addFile(filePath)
            //     });
            //     // this.addFile('c:zzk/zzk.txt')
            // })
            // promiseResult.catch((error: any) =>{
            //     console.log(error)
            // })
        }
    }
})