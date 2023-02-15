interface FileInfo {
    // 文件名，包括路径
    filename: string;
    //发送方IP
    fromIP: string;
    //接收方IP
    toIP: string;
    //是否是本方发出
    mine: boolean;
    isSuccess: boolean;
  }
  export default FileInfo;
  