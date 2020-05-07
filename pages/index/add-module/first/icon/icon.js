// 图标选择
var app = getApp()
Page({
  data: {
    iconList: []
  },

  onLoad(options) {
    this.setData({
      imgUrl: app.globalData.hostName + '/images/icon/',
      selected: options.selected
    })
    this.getAllIcon()
  },

  // 获取全部图标
  getAllIcon() {
    for (var i = 1; i < 51; i++) {
      this.data.iconList.push({
        src: this.data.imgUrl + i + '@2x.png',
        id: i
      })
    }
    this.setData({
      iconList: this.data.iconList
    })
  },

  // 选择图标
  selectIcon(e) {
    let src = e.currentTarget.dataset.src
    this.setData({
      selected: src
    })
  },

  onConfirm() {
    var pages = getCurrentPages()
    var currPage = pages[pages.length - 1] //当前页面
    var prevPage = pages[pages.length - 2] //上一个页面

    prevPage.setData({
      moduleIcon: this.data.selected
    })

    wx.navigateBack({
      delta: 1
    })
  }
})