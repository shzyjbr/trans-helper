const { parentPort, workerData, isMainThread } = require("worker_threads");
const { receiveFile } = require('../transUtils')
const net = require('net');

const server = net.createServer();
let saveDir = workerData.fileSaveDir
server.on('connection', socket => {
    // 暂时将接受的文件放在当前文件夹下
    receiveFile(socket, saveDir)
});
server.on('listening', () => {
    console.log('fileServer: begin to listen, port:', workerData.fileServerPort)
})
server.on('error', (err) => {
    // todo 发生错误的时候继续让这个监听进行下去
    console.log('fileServer error :', err.message)
})
server.listen(workerData.fileServerPort);

// 用于改变保存路径
parentPort.on('message', (fileSaveDir) => {
    console.log('fileSaveDir change:', fileSaveDir);
    saveDir = fileSaveDir
});

