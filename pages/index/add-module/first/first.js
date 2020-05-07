// 添加模块---》第一步
var app = getApp()
Page({
  data: {
    moduleName: ''
  },

  onLoad(options) {
    this.setData({
      moduleIcon: app.globalData.hostName + '/images/icon/' + Math.floor(Math.random() * 50 + 1) + '@2x.png'
    })
  },


  // 下一步
  nextStep() {
    if(this.data.moduleName == '') {
      return wx.showToast({
        title: '请输入模块名称',
        icon: 'none'
      })
    } else {
      wx.navigateTo({
        url: '../second/second?moduleName=' + this.data.moduleName + '&moduleIcon=' + this.data.moduleIcon + '&flag=' + 'add',
      })
    }
  },

  getModuleName(e) {
    this.setData({
      moduleName: e.detail.value
    })
  },

  // 选择图标
  toSelectIcon() {
    wx.navigateTo({
      url: './icon/icon?selected=' + this.data.moduleIcon,
    })
  }
})