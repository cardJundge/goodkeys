// 考勤
Page({
  data: {

  },

  onLoad(options) {

  },

  // 添加考勤组
  toAddAttendance() {
    wx.navigateTo({
      url: './add-attendance/add-attendance',
    })
  },

  // 查看考勤组详情（编辑考勤组）
  toEditAttendance() {
    wx.navigateTo({
      url: './add-attendance/add-attendance',
    })
  }
})