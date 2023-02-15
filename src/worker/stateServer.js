const dgram = require('dgram');
const { parentPort, workerData, isMainThread } = require("worker_threads");
const { getIPAddress } = require('./util')
let server = dgram.createSocket("udp4");

// 本机IP
let localIP = getIPAddress()
let ipList = new Set()
let delay = 3000

server.on("error", function (err) {

    console.log("监听服务器发生错误，error:\n" + err.stack);

    server.close();

});

server.on("message", function (msg, rinfo) {
    //过滤掉本机IP
    if (rinfo.address !== localIP) {

        // 上线消息， 目前为固定格式
        if (msg.toString() === 'zzk&abigail:online') {
            console.log('新上线ip', rinfo.address)
            ipList.add(rinfo.address)
        // 下线消息
        } else if (msg.toString() === 'zzk&abigail:offline') {
            // 下线
            if (ipList.has(rinfo.address))
                ipList.delete(rinfo.address)
        }
    }


});

server.on("listening", function () {

    var address = server.address();

    console.log("监听注册服务器，" +

        address.address + ":" + address.port);

});
// 监听广播端口
server.bind(workerData.registerPort);

// 需要定时将ipList上报给主线程
function listenIP() {
    // 打印看一下
    console.log('stateServer.js:', Array.from(ipList));
    // 将ipList上报给主线程
    parentPort.postMessage(ipList)
    setTimeout(listenIP, delay)

}
// 每隔delay秒将ipList上报给主线程
setTimeout(listenIP, delay);

