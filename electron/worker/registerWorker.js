//注册线程：接受主线程传过来的消息， 广播消息【上线/下线】
const { parentPort, workerData, isMainThread } = require("worker_threads");
const dgram = require('dgram')

let state = workerData.state

function repeatSend() {
    const message = Buffer.from(`zzk&abigail:${state}`);
    const port = workerData.registerPort
    var socket = dgram.createSocket("udp4");

    socket.bind(function () {

        socket.setBroadcast(true);

    });
    console.log("发送上线消息:"+`zzk&abigail:${state}`)
    socket.send(message, port, '255.255.255.255', function (err, bytes) {

        socket.close();

    });
    // 定时任务， 不然启动晚的用户不知道先启动的用户上线了 这是轮询方式
    // 还有一种思路是每个客户端启一个监听端口， 新上线客户端发送一个广播消息到这个端口， 启动的用户则可以给出一个回应
    setTimeout(() => {
        repeatSend()
    }, 2000)
}

// 用于改变保存路径
parentPort.on('message', (_state) => {
    console.log('state change:', _state);
    state = _state
});

repeatSend()

// state: [online||offline]
