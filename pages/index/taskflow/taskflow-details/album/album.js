// 图集
var app = getApp()
Page({
  data: {

  },
  onLoad(options) {
    this.setData({
      imgUrl: app.globalData.imgUrl,
      imgList: JSON.parse(options.data)
    })
    wx.setNavigationBarTitle({
      title: options.name,
    })
  },

  previewImage(e) {
    let imgIndex = e.currentTarget.dataset.index,
    imgArr = []
    this.data.imgList.forEach((item, index) => {
      imgArr.push(this.data.imgUrl + item)
    })
    wx.previewImage({
      urls: imgArr,
      current: imgArr[imgIndex]
    })
  }
})