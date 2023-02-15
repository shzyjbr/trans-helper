const ChatUtils = {
    //信息的类型 MSG_PING 心跳 、MSG_READY 链接就绪  MSG_MESSAGE 消息
    MessageInfoType: {
        MSG_PING: "0",
        MSG_READY: "1",
        MSG_MESSAGE: "2",
        //读取消息
        MSG_READ: "3",
    },

    ErrorType: {
        TIMEOUT_ERROR: 9, //超时
        TOKEN_ERROR: 401, //token 失效错误
        PARAM_ERROR: 400, //参数错误
        FLUSH_TOKEN_ERROR: 7, //刷新token错误
        SERVER_ERROR: 500, //服务器错误
        NET_ERROR: "TypeError: Failed to fetch", //网络链接不通
    },

    /**
     * 图片加载完成，聊天对话框scroll拉到最下
     * @param id 容器id
     */
    imageLoad(id) {
        this.scrollBottom(id);
    },

    /**
     * 加载图片
     * @param arr 图片路径[]
     */
    preloadImages(arr) {
        let loadedImage = 0;
        return new Promise((resolve) => {
            for (let i = 0; i < arr.length; i++) {
                const image = new Image();
                image.src = arr[i];
                image.onload = () => {
                    loadedImage++;
                    if (loadedImage === arr.length) {
                        resolve("");
                    }
                };
                image.onerror = () => {
                    loadedImage++;
                    if (loadedImage === arr.length) {
                        resolve("");
                    }
                };
            }
        });
    },
    /**
     * 滚动条到最下方
     * @param id 容器id
     */
    scrollBottom(id) {
        const div = document.getElementById(id);
        if (div) {
            div.scrollTop = div.scrollHeight;
        }
    },
    /**
     * 消息内容转换
     * @param content 要转换的内容
     */
    transform: (content) => {
        if (content) {
            content = content

                .replace(/img\[([^\s]+?)]/g, function (img) {
                    // 转义图片
                    const href = img.replace(/(^img\[)|(]$)/g, "");
                    return (
                        '<img class="message-img" src="' +
                        href +
                        '" alt="消息图片不能加载">'
                    );
                })
                .replace(/file\([\s\S]+?\)\[[\s\S]*?]/g, function (str) {
                    // 转义文件
                    const href = (str.match(/file\(([\s\S]+?)\)\[/) || [])[1];
                    const text = (str.match(/\)\[([\s\S]*?)]/) || [])[1];
                    if (!href) return str;
                    return (
                        '<a class="message-file" href="' +
                        href +
                        '"><i class="el-icon"><svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-029747aa=""><path fill="currentColor" d="M160 832h704a32 32 0 1 1 0 64H160a32 32 0 1 1 0-64zm384-253.696 236.288-236.352 45.248 45.248L508.8 704 192 387.2l45.248-45.248L480 584.704V128h64v450.304z"></path></svg></i>' +
                        (text || href) +
                        "</a>"
                    );
                })

        }
        return content;
    },
};
export default ChatUtils;
