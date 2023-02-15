const px2rem = require('postcss-px2rem')
module.exports = {
  lintOnSave:false,
  css:{
    loaderOptions: {
      scss: {
        additionalData: '@import "~@/assets/styles/variables.scss";'
      }
    }
  },
}