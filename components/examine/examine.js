// 审核弹框
Component({
  properties: {
    isShow: {
      type: Boolean
    },
    prompt: {
      type: Boolean
    },
    reason: {
      type: String
    }
  },

  data: {
    isPass: false,
    height: 702
  },

  methods: {
    stateChange(e) {
      let data = e.detail.value
      if (data == 'pass') {
        this.setData({
          isPass: true,
          height: 342
        })
      } else {
        this.setData({
          isPass: false,
          height: 702
        })
      }
    },

    toCloseModule() {
      this.setData({
        isShow: false
      })
    },

    toConfirm() {
      this.setData({
        isShow: false
      })
      if (this.data.isPass == true) {
        this.triggerEvent('confirmEvent', {
          reason: ''
        })
      } else if (this.data.isPass == false){
        this.triggerEvent('rejectEvent', {
          reason: this.data.reason
        })
      }
    },

    toCancel() {
      this.setData({
        isShow: false
      })
    },

    getNoPassReason(e) {
      this.data.reason = e.detail.value
    },

    toClosePrompt() {
      this.setData({
        isShow: false
      })
    }
  }
})