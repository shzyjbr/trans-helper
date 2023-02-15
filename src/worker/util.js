const net = require('net');
const fs = require('fs');
const path = require('path')
const os = require('os')


function readHead(buffer) {
    var first = buffer.indexOf('@@@@@@')
    return first
}


function sendFileByNetwork(ip, port, filepath) {
    var filename = path.basename(filepath)

    const client = net.createConnection({
        host: ip,
        port: port
    })
    client.on('connect', () => {

        //分配256长的buffer
        var headBuf = Buffer.from(`${filename}@@@@@@`)
        var remainHeadLen = 256 - headBuf.byteLength
        var padBuf = Buffer.alloc(remainHeadLen)
        var buf = Buffer.concat([headBuf, padBuf])
        client.write(buf.toString())
        var fileStream = fs.createReadStream(filepath);
        fileStream.on('open', function () {
            console.log('open call')
            fileStream.pipe(client);
        });
    })
}


function receiveFile(socket, dir) {
    // Subscribe to the readable event once so we can start calling .read()
    socket.once('readable', function () {
        // Set up a buffer to hold the incoming data
        let reqBuffer = Buffer.from('')
        // Set up a temporary buffer to read in chunks
        let buf

        let fileName

        while (true) {
            // Read data from the socket
            buf = socket.read();
            // Stop if there's no more data
            if (buf === null) break;

            // Concatenate existing request buffer with new data
            reqBuffer = Buffer.concat([reqBuffer, buf]);

            // 我自己的标记
            //前256个字节是文件信息
            if (reqBuffer.byteLength < 256)
                continue
            // 协议如下：文件名@@@@@@（256字节）
            let headInfo = readHead(reqBuffer)
            if (headInfo === -1) {
                console.log('error formation')
                break;
            }
            fileName = reqBuffer.subarray(0, headInfo);
            let remaining = reqBuffer.subarray(256);
            // 从256字节位置处，将剩余的数据推回流中
            socket.unshift(remaining);
            console.log(`fileName:${fileName}\n`);
            break;

        }
        var savePosition = path.join(dir,fileName.toString())
        var fileToWrite = fs.createWriteStream(savePosition)
        socket.pipe(fileToWrite)
        fileToWrite.on('finish', () => {
            console.log('finish write!')
        })

    });
}
function getIPAddress () {
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
}
module.exports = {
    readHead,
    sendFileByNetwork,
    receiveFile,
    getIPAddress
}