// 新增考勤组
var app = getApp()
Page({
  data: {
    isEdit: false,
    isDisabled: false,
    attendanceTypeId: 1,
    attendanceTypeName: '固定时间上下班'
  },

  onLoad(options) {
    this.setData({
      imgUrl: app.globalData.imgUrl
    })
    wx.setNavigationBarTitle({
      title: '新增考勤组',
    })
    if (options.data) {
      this.setData({
        isEdit: true
      })
      wx.setNavigationBarTitle({
        title: '编辑考勤组',
      })
    }
  },

  // 考勤人员选择
  taskSelect() {
    wx.navigateTo({
      url: '../task-select/task-select',
    })
  },

  // 考勤类型选择（弹框）
  attendanceSelect() {
    this.setData({
      showAttendanceModal: true,
      attendanceFlag: 'type'
    })
  },

  // 考勤类型选择（弹框返回）
  typeChangeEvent(e) {
    this.setData({
      attendanceTypeName: e.detail.typeName,
      attendanceTypeId: e.detail.typeId
    })
  },

  // 考勤时间选择（弹框）
  fixedTimeSelect() {
    this.setData({
      showAttendanceModal: true,
      attendanceFlag: 'time'
    })
  },

  // 考勤时间选择（弹框确定返回）
  confirmEvent(e) {
    this.setData({
      fixedTime: e.detail.weekChecked.join('、')
    })
  },

  // 进入排班页面
  toScheduling() {
    wx.navigateTo({
      url: '../scheduling/scheduling',
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
  },

  // 保存-提交考勤分组
  formSubmit() {
    this.setData({
      isDisabled: true
    })
    // 编辑
    if (this.data.isEdit == true) {
      wx.navigateBack({
        delta: 1
      })
    } else {
      wx.navigateBack({
        delta: 1
      })
    }  
  },

  // 删除考勤组
  toDelAttendance() {
    wx.showModal({
      title: '提示',
      content: '确定删除该考勤组？',
      success: res=> {
        if (res.confirm) {
          
        }
      }
    })
  }
})