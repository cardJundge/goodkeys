// 增加名额
var app = getApp()
Page({
  data: {
    currentTab: 0,
    number: 1,
    total: null,
    pckageData: [{
      id: 0,
      num: 10,
      money: 1980,
      time: 1
    }, {
      id: 1,
      num: 30,
      money: 3500,
      time: 1
    }, {
      id: 2,
      num: 50,
      money: 4900,
      time: 1
    }, {
      id: 3,
      num: 100,
      money: 8980,
      time: 1
    }]
  },
  onLoad: function(options) {
    this.setData({
      total: this.data.pckageData[this.data.currentTab].money,
      basicUserInfo: app.globalData.userInfo,
      avatarUrl: app.globalData.userInfo.face ? app.globalData.imgUrl + app.globalData.userInfo.face : '',
    })
    console.log(this.data.avatarUrl)
  },
  changeTab(e) {
    console.log(e)
    let time = "pckageData[" + this.data.currentTab + "].time"
    this.setData({
      currentTab: e.currentTarget.dataset.id,
      number: 1,
      [time]: 1,
      total: this.data.pckageData[e.currentTarget.dataset.id].money
    })
  },
  addMoney() {
    let time = "pckageData[" + this.data.currentTab + "].time"
    this.setData({
      number: this.data.number + 1,
      [time]: this.data.number + 1
    })
  },
  releaseMoney() {
    let time = "pckageData[" + this.data.currentTab + "].time"
    if (this.data.number > 1) {
      this.setData({
        number: this.data.number - 1,
        [time]: this.data.number - 1
      })
    }
  }
})