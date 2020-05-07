var app = getApp()

class HTTP {
  constructor() {
    this.baseUrl = app.globalData.hostName
  }
  //http请求
  request(params) {
    wx.request({
      url: this.baseUrl + params.url,
      method: params.type,
      header: {
        'Accept': 'application/json',
        // 'Cookie': 'PHPSESSID=' + that.data.sessionId
        'Authorization': params.auth ? 'Bearer ' + app.globalData.userInfo.api_token: ''      
      },
      data: params.data,
      success: res => {
        wx.hideLoading()
        params.sCallback && params.sCallback(res)
        if (res.data.msg) {
          if (res.data.msg.match('Token')) {
            wx.showModal({
              title: '提示',
              content: 'Token过期或已失效，请前往登录页面重新登录',
              success: res => {
                if (res.confirm) {
                  wx.reLaunch({
                    url: '/pages/login/login',
                  })
                }
              }
            })
          }
        }
      },
      fail: err => {
        wx.hideLoading()
        params.sCallback && params.sCallback(err)
        wx.showToast({
          title: '请求超时',
          icon: 'none'
        })
      }
    })
  }
}

export { HTTP }