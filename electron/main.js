'use strict'

const { app, BrowserWindow, protocol, screen, ipcMain, shell, dialog, ipcRenderer } = require('electron')

const { Worker } = require('worker_threads')
const { fs } = require('fs')
const path = require('path')
const dgram = require('dgram')

const { sendFileByNetwork, getSettingContent, writeSettingContent, sendByNetwork } = require('./transUtils')

const { DESIGN_WIDTH, DESIGN_HEIGHT, BASE_WIN_WIDTH, BASE_WIN_HEIGHT } = require('./constant')

const NODE_ENV = process.env.NODE_ENV
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";
const USER_HOME = process.env.HOME || process.env.USERPROFILE

const settingfilePath = path.join(USER_HOME, 'trans-helper.txt')
let saveDir = getSettingContent(settingfilePath, USER_HOME)
// 注册服务
const registerPort = 6666
const fileServerPort = 9999
// step1：广播自己的上下线消息 
const onlineThread = new Worker(path.join(__dirname, "./worker/registerWorker.js"), { workerData: { registerPort: registerPort, state: 'online' } });
// step2: 监听其他人上下线消息
const registerThread = new Worker(path.join(__dirname, "./worker/stateServer.js"), { workerData: { registerPort: registerPort } });
// step3: 创建接受文件的serverSocket
// 注意： 这种方式是值传递，也就是copy一个副本过去， 不是共享内存
const fileServerThread = new Worker(path.join(__dirname, "./worker/fileServer.js"), { workerData: { fileServerPort: fileServerPort, fileSaveDir: saveDir } });
const createWindow = () => {
  const bounds = screen.getPrimaryDisplay().bounds
  const winW = Math.floor((bounds.width / BASE_WIN_WIDTH) * DESIGN_WIDTH)
  const winH = Math.ceil((bounds.height / BASE_WIN_HEIGHT) * DESIGN_HEIGHT)
  const win = new BrowserWindow({
    width: winW,
    height: winH,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      // todo 这里调用失败
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegrationInWorker: true
    }
  });
  win.loadURL(
    NODE_ENV === "development" ?
      "http://localhost:5173" :
      `file://${path.join(__dirname, "../dist/index.html")}`
  );
  //  打开开发工具
  if (NODE_ENV == "development") {
    win.webContents.openDevTools();
  };

  registerThread.on("message", result => {
    // result 可以保持传递过来的类型
    // console.log(`registerThread in main.js, Result: ${Array.from(result)}`);
    // 每5秒，更新到deviceStore中
    win.webContents.send("updateIPList", result)
  });
  // 注册监听改变保存路径的事件
  ipcMain.handle('changeSaveDir', (e, _saveDir) => {
    fileServerThread.postMessage(_saveDir)
    writeSettingContent(settingfilePath, _saveDir)
    saveDir = _saveDir
  })

  ipcMain.handle("showOpenFileDialog", async (e, filters, ip, port) => {
    let result = []
    let content = await dialog.showOpenDialog(win, filters)
    console.log("main ", content, ip, port)
    let filePaths = content.filePaths
    filePaths.forEach((filePath) => {
      // 返回一个promise
      var promiseRes = sendFileByNetwork(ip, port, filePath)
      promiseRes.then((res) => {
        // 发送成功
        console.log('sendFileByNetwork res', res)
        win.webContents.send("sendFileResult", { filename: res.filename, isSuccess: true })
        result.push({ filename: res.filename, isSuccess: true })
      }).catch((err) => {
        // 发送失败
        console.log('sendFileByNetwork err', err)
        win.webContents.send("sendFileResult", { filename: err.filename, isSuccess: false })
        result.push({ filename: err.filename, isSuccess: false })
      })

    })
  })
  ipcMain.handle("showOpenDirDialog", async (e, filters, ip, port) => {
    let result = []
    let content = await dialog.showOpenDialog(win, filters)
    console.log("main ", content, ip, port)
    let filePaths = content.filePaths
    filePaths.forEach((filePath) => {
      // 返回一个promise数组
      var promiseArray = sendByNetwork(ip, port, filePath)
      promiseArray.forEach((promiseRes) => {
        promiseRes.then((res) => {
          // 发送成功
          console.log('sendFileByNetwork res', res)
          win.webContents.send("sendFileResult", { filename: res.filename, isSuccess: true })
          result.push({ filename: res.filename, isSuccess: true })
        }).catch((err) => {
          // 发送失败
          console.log('sendFileByNetwork err', err)
          win.webContents.send("sendFileResult", { filename: err.filename, isSuccess: false })
          result.push({ filename: err.filename, isSuccess: false })
        })
      })
    })
  })
  ipcMain.handle("showSettingDialog", async (e, filters) => {
    let result = []
    let content = await dialog.showOpenDialog(win, filters)
    // todo 需要处理没有选中的情况
    let filePaths = content.filePaths
    win.webContents.send("sendChangeDir", filePaths[0])
  });
  ipcMain.handle('getMainThreadSaveDir', (e) => {
    win.webContents.send("getSaveDir", saveDir)
  })

  ipcMain.handle('offline', (e) => {
    onlineThread.postMessage("offline")
  })
};


app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})


app.on('window-all-closed',() => {
  if (process.platform !== 'darwin') {
    // 发送下线通知
    const message = Buffer.from(`zzk&abigail:offline`);
    var socket = dgram.createSocket("udp4");
    socket.bind(function () {
        socket.setBroadcast(true);
    });
    console.log("发送离线消息:"+"zzk&abigail:offline")
    socket.send(message, registerPort, '255.255.255.255', function (err, bytes) {
        socket.close();
    });
    setTimeout(() => console.log("休眠一会"), 500)
    app.quit()
  }
});

