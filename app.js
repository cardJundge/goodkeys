//app.js
App({
  onLaunch: function () {
    console.log('onLaunch')
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息

    // 小程序版本更新
    if (wx.canIUse("getUpdateManager")) {
      const updateManager = wx.getUpdateManager()

      //监听向微信后台请求检查更新结果事件
      updateManager.onCheckForUpdate(function (res) {

        console.log(res)
        // 请求完新版本信息的回调
        if (res.hasUpdate) {

          //监听小程序有版本更新事件。客户端主动触发下载（无需开发者触发），下载成功后回调
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                console.log('success====', res)

                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                }
              }
            })
          })

          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
            })
          })

        }
      })
    } else {

      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
   
  },
  globalData: {
    userInfo: null,
    hostName: 'http://test-api.feecgo.com', 
    // hostName: 'https://api.feecgo.com',
    imgUrl: 'http://test-api.feecgo.com/storage/',
    // imgUrl: 'https://api.feecgo.com/storage/',
    clound: "https://6f6d-omo-service-b6dza-1301029807/images/"
  }
})