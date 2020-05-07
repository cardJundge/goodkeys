// 管理者审批弹框
Component({
  properties: {
    isShow: {
      type: Boolean
    },
    approvalBoxName: {
      type: String
    },
    approvalType: {
      type: String
    },
    optionData: {
      type: Array
    }
  },

  data: {
    tempOption: []
  },

  methods: {
    toCloseModule() {
      this.setData({
        isShow: false
      })
    },

    getTextInput(e) {
      this.setData({
        textValue: e.detail.value
      })
    },

    getIntInput(e) {
      this.setData({
        intValue: e.detail.value
      })
    },

    toSelectOption(e) {
      this.data.tempOption = e.detail.value
    },

    // 确定
    toConfirm() {
      this.setData({
        isShow: false
      })
      if (this.data.approvalType == 'text') {
        this.triggerEvent('boxConfirm', { approvalBoxName: this.data.approvalBoxName, approvalBoxVal: this.data.textValue })
      } else if (this.data.approvalType == 'int') {
        this.triggerEvent('boxConfirm', { approvalBoxName: this.data.approvalBoxName, approvalBoxVal: this.data.intValue })
      } else if (this.data.approvalType == 'check') {
        this.data.optionData.forEach((item, index) => {
          this.data.optionData[index].checked = false
          this.data.tempOption.forEach((item1, index1) => {
            if (item.name == item1) {
              this.data.optionData[index].checked = true
            }
          })
        })
        this.setData({
          optionData: this.data.optionData
        })
        this.triggerEvent('boxConfirm', { approvalBoxName: this.data.approvalBoxName, approvalBoxList: this.data.optionData, approvalType: this.data.approvalType})
      }
    }
  }
})
