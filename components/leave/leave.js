// 请假审批框
Component({
  properties: {
    isShow: {
      type: Boolean
    }
  },
  data: {

  },
  methods: {
    // 确定
    toConfirm() {
      this.setData({
        isShow: false
      })
      this.triggerEvent('refuseEvent', { leaveRefuseReason: this.data.textValue})
    },

    getTextInput(e) {
      this.setData({
        textValue: e.detail.value
      })
    },

    // 取消
    toCloseModule() {
      this.setData({
        isShow: false
      })
    }
  }
})
