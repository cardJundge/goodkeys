// 任务退回框
Component({
  properties: {
    isShow: {
      type: Boolean
    },
  },
  data: {

  },
  methods: {
    toCloseModule() {
      this.setData({
        isShow: false
      })
    },

    getBackReason(e) {
      this.data.reason = e.detail.value
    },

    toConfirm() {
      this.setData({
        isShow: false
      })
      this.triggerEvent('confirmEvent', { reason: this.data.reason})
    }
  }
})
