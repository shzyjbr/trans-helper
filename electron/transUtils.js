var net = require('net');
var fs = require('fs');
var path = require('path')


function readHead(buffer) {
    var first = buffer.indexOf('@@@@@@')
    return first
}


function sendFileByNetwork(ip, port, filepath) {
    var filename = path.basename(filepath)
    return new Promise((resolve, reject) => {
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
                console.log('fileStream open')
                fileStream.pipe(client);
            });
            fileStream.on('end', function () {
                // 文件发送成功处理
                console.log('fileStream end')
                resolve({
                    code: 200,
                    msg: "success",
                    filename:filepath
                })
            });
            fileStream.on('error', function () {
                // 文件发送错误处理
                console.log('fileStream error')
                reject({
                    code: 300,
                    msg: "file send error",
                    filename:filepath
                })
            });
        })
        client.on('error', () => {
            // socket错误处理
            reject({
                code: 400,
                msg: "socket error",
                filename:filepath
            })
        })

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
        var savePosition = path.join(dir, fileName.toString())
        var saveDir = path.dirname(savePosition)
        var exists = fs.existsSync(saveDir)
        if (!exists) {
            fs.mkdirSync(saveDir, { recursive: true })
        }
        var fileToWrite = fs.createWriteStream(savePosition)
        socket.pipe(fileToWrite)
        fileToWrite.on('finish', () => {
            console.log('finish write!')
            // 可以在这里回送给客户端文件传输完成的通知
        })

    });
}

function getSettingContent(filepath, user_home) {
    try {
        let content = fs.readFileSync(filepath)
        return content.toString()
    } catch (e) {
        if (e.errno = -4058) {
            // 文件不存在， 创建文件并使用USER_HOME作为默认存储位置
            fs.writeFileSync(filepath, user_home)
            return user_home
        }
    }
}

function writeSettingContent(filepath, content) {
    try{
        fs.writeFileSync(filepath, content)
    }catch(e) {
        console.log(e)
    }
}


function sendByNetwork(ip, port, item) {
    var promiseArray = new Array()
    var exists = fs.existsSync(item);
    var stats = exists && fs.statSync(item);
    var isDirectory = exists && stats.isDirectory();
    if (isDirectory) {
        // 如果是目录，则递归调用sendDir
        sendDir(item, path.dirname(item), ip, port, promiseArray)
    } else {
        // 组装相对路径后发送
        promiseArray.push(sendSingleFile(path.basename(item), item, ip, port))
    }
    return promiseArray

}

function sendDir(dir, originBaseDir, ip, port, promiseArray) {
    // 对目录中的每一个文件执行下面代码
    fs.readdirSync(dir).forEach(function (subItem) {
        var fullname = path.join(dir, subItem)
        var exists = fs.existsSync(fullname);
        var stats = exists && fs.statSync(fullname);
        var isDirectory = exists && stats.isDirectory();
        if (isDirectory) {
            // 如果是目录，则递归调用sendDir
            sendDir(fullname, originBaseDir, ip, port, promiseArray)
        } else {
            // 组装相对路径
            var relativeFilename = path.relative(originBaseDir, fullname);
            promiseArray.push(sendSingleFile( relativeFilename, fullname, ip, port))
        }
    });


}

function sendSingleFile(relativeFilename, fullname, ip, port) {
    return new Promise((resolve, reject) => {
        const client = net.createConnection({
            host: ip,
            port: port
        })
        client.on('connect', () => {
            //分配256长的buffer relativeFilename是相对路径（基于对话框选中的目录）
            var headBuf = Buffer.from(`${relativeFilename}@@@@@@`)
            var remainHeadLen = 256 - headBuf.byteLength
            var padBuf = Buffer.alloc(remainHeadLen)
            var buf = Buffer.concat([headBuf, padBuf])
            client.write(buf.toString())
            // 发送的时候得使用全路径
            var fileStream = fs.createReadStream(fullname);
            fileStream.on('open', function () {
                console.log('fileStream open')
                fileStream.pipe(client);
            });
            fileStream.on('end', function () {
                // 文件发送成功处理
                console.log('fileStream end')
                resolve({
                    code: 200,
                    msg: "success",
                    filename:fullname
                })
            });
            fileStream.on('error', function () {
                // 文件发送错误处理
                console.log('fileStream error')
                reject({
                    code: 300,
                    msg: "file send error",
                    filename:fullname
                })
            });
    
        })
        client.on('error', () => {
            // socket错误处理
            reject({
                code: 400,
                msg: "socket error",
                filename:fullname
            })
        })
    })
    
}

module.exports = {
    readHead,
    sendFileByNetwork,
    receiveFile,
    getSettingContent,
    writeSettingContent,
    sendByNetwork
}