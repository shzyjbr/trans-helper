const { contextBridge, ipcRenderer } = require('electron')
const fs = require('fs')
const path = require('path')
const os = require('os')

contextBridge.exposeInMainWorld('myAPI', {
  handleUpdateRegister: (callback) => ipcRenderer.on('update-register', callback),
  getLocalIP: () => {
    var interfaces = os.networkInterfaces();
    for (var devName in interfaces) {
      var iface = interfaces[devName];
      for (var i = 0; i < iface.length; i++) {
        var alias = iface[i];
        if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
          return alias.address;
        }
      }
    }
  },
  sendFile: (ip, port) => {
    // var content = dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] })

    return ipcRenderer.invoke("showOpenFileDialog", { properties: ['openFile','multiSelections'] }, ip, port)

  },
  sendDir: (ip, port) => {
    // var content = dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] })

    return ipcRenderer.invoke("showOpenDirDialog", { properties: ['openDirectory','multiSelections'] }, ip, port)

  },
  handleFileResult: (callback) => {
    ipcRenderer.on('sendFileResult', callback)
  },
  handleUpdateIP: (callback) => {
    ipcRenderer.on('updateIPList', callback)
  },
  handleGetSaveDir:(callback) => {
    ipcRenderer.on('getSaveDir', callback)
  },
  handleShowSettingDialog:()=>{
    return ipcRenderer.invoke("showSettingDialog", { properties: ['openDirectory'] })
  },
  handleSelectSaveDirResult: (callback) => {
    ipcRenderer.on('sendChangeDir', callback)
  },
  changeSaveDir: (saveDir)=> {
    ipcRenderer.invoke('changeSaveDir', saveDir)
  },
  getSaveDir:()=> {
    ipcRenderer.invoke("getMainThreadSaveDir") 
  }

})