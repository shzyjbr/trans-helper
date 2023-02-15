import path from 'node:path'
import os from 'node:os'
import fs from 'node:fs'
// const fs = window.require('fs')
// const os = window.require('os')

/** 创建目录 */
export function mkdirDirectory (pathUrl) {
  return new Promise(resolve => {
    if (!fs.existsSync(pathUrl)) {
      const res = fs.mkdirSync(pathUrl, { recursive: true })
      if (res) {
        resolve(true)
      }
    } else {
      resolve(true)
    }
  })
}


/** 时间转换 */
export function timestampToTime(timestamp, isMs = false){
  let intPart = Math.floor(timestamp)
  if (isMs) {
    intPart = Math.floor(timestamp / 1000)
  }
  const h =
    Math.floor(intPart / 3600) < 10
      ? '0' + Math.floor(intPart / 3600)
      : Math.floor(intPart / 3600)

  const m =
    Math.floor((intPart / 60) % 60) < 10
      ? '0' + Math.floor((intPart / 60) % 60)
      : Math.floor((intPart / 60) % 60)

  const s =
    Math.floor(intPart % 60) < 10
      ? '0' + Math.floor(intPart % 60)
      : Math.floor(intPart % 60)

  return `${h}:${m}:${s}`
}

export function getIPAddress () {
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

