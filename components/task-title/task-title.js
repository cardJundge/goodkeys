//添加任务标题的模板
Component({
  properties: {
    isShow: Boolean
  },
  data: {
    region: ['', '', '']
  },
  methods: {
    closeMode() {
      this.setData({
        isShow: false
      })
    },

    bindRegionChange(e) {
      this.setData({
        region: e.detail.value
      })
    },

    inputTitle(e) {
      this.data.title = e.detail.value
    },

    sure() {
      var that = this;
      if (!that.data.title) {
        wx.showToast({
          title: '标题不能为空!',
        })
        return
      }

      if (!that.data.region[0]) {
        wx.showToast({
          title: '地点不能为空!',
        })
        return
      }

      this.triggerEvent('addTitle', {
        title: that.data.title,
        address: that.data.region[0] + "-" + that.data.region[1]
      })

      this.setData({
        isShow: false,
        region: ['', '', '']
      })
    }
  }
})