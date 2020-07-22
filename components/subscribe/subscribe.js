// 订阅消息弹框组件
Component({
  properties: {
    animationData: Object,
    show: Boolean,
    subscribeList:Array
  },
  data: {

  },
  methods: {
    hideModal(e) {
      var animation = wx.createAnimation({
        duration: 500, //动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
        timingFunction: 'ease', //动画的效果 默认值是linear
      })
      this.animation = animation
      this.fadeDown() //调用隐藏动画
      setTimeout(() => {
        this.setData({
          show: false
        })
      }, 500)
    },

    fadeDown() {
      this.animation.translateY(300).step()
      this.setData({
        animationData: this.animation.export(),
      })
    },

    formSubmit(e){
      this.triggerEvent('confirm',{checkbox: e.detail.value.checkbox})
      this.hideModal()
    }
  }
})