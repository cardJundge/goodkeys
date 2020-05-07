// 服务项目列表
Page({
  data: {

  },
  onLoad: function (options) {

  },

  toAddProject() {
    wx.navigateTo({
      url: './add-project/add-project',
    })
  },

  // 编辑
  toEdit() {
    wx.navigateTo({
      url: './add-project/add-project',
    })
  },

  // 删除
  toDel() {
    wx.showModal({
      title: '提示',
      content: '确定要删除该服务项目吗？',
      success: res=> {
        if(res.confirm) {

        }
      }
    })
  }
})