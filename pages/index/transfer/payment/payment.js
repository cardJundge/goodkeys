// 支付页面
Page({
  data: {
    pay: 0
  },

  onLoad: function (options) {
    this.setData({
      money: options.money
    })
  },

  paymentChange(e) {
    this.setData({
      pay: e.detail.value
    })
  },

  // 去支付
  toPay() {

  }
})