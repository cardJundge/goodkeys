// 打卡统计
import dateTimePicker from '../../dist/dateTimePicker.js'
Page({
  data: {
    tabList: ['打卡', '请假'],
    switchActive: 0,
    leaveShow: false
  },

  onLoad(options) {
    this.setData({
      dateObj: dateTimePicker.getNowDate()
    })
  },

  // 切换顶部switch
  switchTab(e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      switchActive: index
    })
    if (index == 0) {
      wx.setNavigationBarTitle({
        title: '打卡统计'
      })
    } else {
      wx.setNavigationBarTitle({
        title: '请假审批'
      })
    }
  },

  // 拒绝请假
  toRejectLeave() {
    this.setData({
      leaveShow: true
    })
  },

  // 选择日期
  dateChange(e) {
    this.setData({
      dateObj: e.detail.value
    })
  },

  // 查看人员位置
  toPlace() {
    wx.navigateTo({
      url: './place/place',
    })
  },

  toPersonnel() {
    wx.navigateTo({
      url: './personnel/personnel',
    })
  }
})