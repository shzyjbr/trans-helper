const { BrowserWindow, WebContents, ipcMain } = require('electron')
const { Worker } = require('worker_threads')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const events = require('events')
const path = require('path')

const NODE_ENV = process.env.NODE_ENV
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

var ipList = new Set()

function updateIPList(webcontent) {
  webcontent.send('update-register', ipList)
  setTimeout(updateIPList, 3000, webcontent)
}
const winConfig = {
  show: false,
  frame: false,
  focusable: true,
  alwaysOnTop: false,
  resizable: false,
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: true,
    // todo 这里调用失败
    preload: path.join(__dirname, 'preload.js'),
    nodeIntegrationInWorker: true
  }
}
let registerThread = null
class Launch extends events {
  constructor(confInfo) {
    super()
    this.confInfo = confInfo
    this.state = Object.assign({}, winConfig, confInfo)
    this.windowInstance = new BrowserWindow(this.state)

    //加载index.html
    //mainWindow.loadFile('dist/index.html')将该行改为下面这一行，
    this.windowInstance.loadURL(
      NODE_ENV === "development" ?
        "http://localhost:5173" :
        `file://${path.join(__dirname, "../dist/index.html")}`
    );
    //  打开开发工具
    if (NODE_ENV == "development") {
      this.windowInstance.webContents.openDevTools();
    };
    this.init()
  }

  init() {
    this.windowInstance.once('ready-to-show', () => {
      console.log('launch.js: ready-to-show')
      this.windowInstance.show()
    })

    this.windowInstance.on('show', () => {
      console.log('launch.js: show')
      this.emit('show')
    })

    this.listenIpc()
  }


  listenIpc() {


    const { width, height } = this.confInfo
    ipcMain.on('move-main', (event, pos) => {
      this.windowInstance && this.windowInstance.setBounds({ width, height })
      this.windowInstance && this.windowInstance.setPosition(pos.baseX, pos.baseY)
    })
    // 上下线通知
    ipcMain.on('register', (event, state) => {
      console.log('in register callback')
      new Worker('./src/worker/registerWorker.js', { workerData: { registerPort: 6666, state: state } })
      registerThread = new Worker('./src/worker/stateServer.js', { workerData: { registerPort: 6666 } })
      registerThread.on("message", result => {
        // result 可以保持传递过来的类型
        ipList = new Set([...ipList, ...result])
        console.log(`stateServer in main.js, Result: ${Array.from(ipList)}`);
      });
    })
    updateIPList(this.windowInstance.webContents)
    // 全屏
    ipcMain.on('mainWin:max', () => {
      this.windowInstance.setFullScreen(true)
    })
    // 还原
    ipcMain.on('mainWin:min', () => {
      this.windowInstance.setFullScreen(false)
    })
    // 隐藏主窗口
    ipcMain.on('mainWin:hide', () => {
      this.windowInstance.hide()
    })
    // 关闭主窗口
    ipcMain.on('mainWin:close', () => {
      app.quit()
      // this.windowInstance.close()
    })
    // 最大化
    ipcMain.on('mainWin:maximize', () => {
      this.windowInstance.maximize()
    })
    // 最大化恢复
    ipcMain.on('mainWin:restore', () => {
      this.windowInstance.restore()
    })
    // 最小化
    ipcMain.on('mainWin:minimize', () => {
      this.windowInstance.minimize()
    })
  }

  getWebContents() {
    return this.windowInstance.webContents
  }

  getWindowInstance() {
    return this.windowInstance
  }

  show() {
    this.windowInstance && this.windowInstance.show()
  }

  min() {
    this.windowInstance && this.windowInstance.minimize()
  }

  close() {
    this.windowInstance && this.windowInstance.close()
  }
}

module.exports = Launch
