// 新增考勤组
Page({
  data: {
    noTask: false,
    taskFaceList: ['http://test-api.feecgo.com/images/icon/1@2x.png', 'http://test-api.feecgo.com/images/icon/2@2x.png', 'http://test-api.feecgo.com/images/icon/3@2x.png', 'http://test-api.feecgo.com/images/icon/4@2x.png'],
    attendanceType: 1
  },

  onLoad(options) {

  },

  // 选择考勤类型
  attendanceSelect() {
    this.setData({
      showAttendanceModal: true,
      attendanceFlag: 'type'
    })
  },

  // 固定时间选择
  fixedTimeSelect() {
    this.setData({
      showAttendanceModal: true,
      attendanceFlag: 'time'
    })
  },

  typeChangeEvent(e) {
    this.setData({
      attendanceTypeName: e.detail.typeName,
      attendanceType: e.detail.typeId
    })
  },

  // 上班时间选择
  startTimeChange(e) {
    this.setData({
      startTime: e.detail.value
    })
  },

  // 下班时间选择
  endTimeChange(e) {
    this.setData({
      endTime: e.detail.value
    })
  }
})