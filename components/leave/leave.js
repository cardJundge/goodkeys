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
    // 同意请假
    toConfirm() {
      this.setData({
        isShow: false
      })
    },

    // 拒绝请假
    toCloseModule() {
      console.log('eeeee')
      this.setData({
        isShow: false
      })
    }
  }
})
