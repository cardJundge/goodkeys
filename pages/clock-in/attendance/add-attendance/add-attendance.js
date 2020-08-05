// 新增考勤组
var app = getApp()
import {
  ClockInModel
} from '../../models/clock-in.js'

var clockinModel = new ClockInModel()
Page({
  data: {
    isEdit: false,
    isDisabled: false,
    attendanceTypeId: 0,
    selectTaskData: [], // 已选择的作业员
  },

  onLoad(options) {
    this.setData({
      imgUrl: app.globalData.imgUrl
    })
    wx.setNavigationBarTitle({
      title: '新增考勤组',
    })
    if (options.data) {
      wx.setNavigationBarTitle({
        title: '编辑考勤组',
      })
      let data = JSON.parse(options.data)
      this.setData({
        isEdit: true,
        startTime: data.start_time,
        endTime: data.end_time,
        attendanceName: data.name,
        attendanceTypeId: data.type,
        selectTaskData: data.tasks,
        tableData: data.table,
        attendanceId: data.id
      })
      if (data.week) {
        this.data.cycleData = data.week
        let tempWeekArr = []
        data.week.forEach((item, index) => {
          tempWeekArr.push(item.substring(2, 3))
        })
        this.setData({
          weekData: tempWeekArr,
          fixedTime: tempWeekArr.join('、')
        })
      }
    }
  },

  onShow() {
    console.log(this.data.tableData)
  },

  // 考勤人员选择
  taskSelect() {
    let data = JSON.stringify(this.data.selectTaskData)
    wx.navigateTo({
      url: '../task-select/task-select?data=' + data,
    })
  },

  // 考勤组名称
  getAttendanceName(e) {
    this.setData({
      attendanceName: e.detail.value
    })
  },

  // 考勤类型选择（弹框）
  attendanceSelect() {
    this.setData({
      showAttendanceModal: true,
      attendanceFlag: 'type',
    })
  },

  // 考勤类型选择（弹框返回）
  typeChangeEvent(e) {
    this.setData({
      attendanceTypeId: e.detail.typeId,
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
      weekData: e.detail.weekChecked,
      fixedTime: e.detail.weekChecked.join('、')
    })
    this.data.cycleData = []
    e.detail.weekChecked.forEach((item, index) => {
      this.data.cycleData.push('星期' + item)
    })
  },

  // 判断考勤人员与排班表是否对应
  judgeTask(sCallback) {
    let tempArr = []
    this.data.tableData.forEach((item, index) => {
      tempArr[index] = []
      item.taskList.forEach((item1, index1) => {
        this.data.selectTaskData.forEach((item2, index2) => {
          if (item1.id == item2.id) {
            tempArr[index].push(item1)
          }
        })
      })
    })
    this.data.tableData.forEach((item, index) => {
      item.taskList = tempArr[index]
      if (index === (this.data.tableData.length - 1)) {
        sCallback(true)
      }
    })
  },

  // 进入排班页面
  toScheduling() {
    console.log(this.data.tableData)
    let taskData = JSON.stringify(this.data.selectTaskData)
    if (this.data.tableData) {
      this.judgeTask(res => {
        let tableData = JSON.stringify(this.data.tableData)
        wx.navigateTo({
          url: '../scheduling/scheduling?taskData=' + taskData + '&tableData=' + tableData,
        })
      })
    } else {
      wx.navigateTo({
        url: '../scheduling/scheduling?taskData=' + taskData,
      })
    }

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
    this.data.taskIdList = []

    if (this.data.selectTaskData.length == 0) {
      return wx.showToast({
        title: '参与考勤人员不能为空',
        icon: 'none'
      })
    }

    if (!this.data.attendanceName) {
      return wx.showToast({
        title: '考勤组名称不能为空',
        icon: 'none'
      })
    }

    if (this.data.attendanceTypeId == 0 && !this.data.cycleData) {
      return wx.showToast({
        title: '考勤时间不能为空',
        icon: 'none'
      })
    }

    if (this.data.attendanceTypeId == 1 && this.data.tableData.length == 0) {
      return wx.showToast({
        title: '请设置排班表',
        icon: 'none'
      })
    }

    if (!this.data.startTime) {
      return wx.showToast({
        title: '上班时间不能为空',
        icon: 'none'
      })
    }

    if (!this.data.endTime) {
      return wx.showToast({
        title: '下班时间不能为空',
        icon: 'none'
      })
    }

    this.data.selectTaskData.forEach((item, index) => {
      this.data.taskIdList.push(item.id)
    })

    let params = {
      task_id: this.data.taskIdList,
      name: this.data.attendanceName,
      type: this.data.attendanceTypeId,
      start_time: this.data.startTime,
      end_time: this.data.endTime
    }
    if (this.data.attendanceTypeId == 0) {
      params.week = this.data.cycleData
    } else if (this.data.attendanceTypeId == 1) {
      this.judgeTask(res => {
        params.table = this.data.tableData
      })
    }

    console.log(params)
    // 编辑
    if (this.data.isEdit == true) {
      params.group_id = this.data.attendanceId
      this.setData({
        isDisabled: true
      })
      clockinModel.toEditAttendance(params, res => {
        this.setData({
          isDisabled: false
        })
        if (res.data.status == 1) {
          wx.showToast({
            title: '编辑成功',
          })
          wx.navigateBack({
            delta: 1
          })
        } else {
          if (res.data.msg.match('Token已过期或失效')) {
          } else {
            wx.showToast({
              title: res.data.msg ? res.data.msg : '请求超时',
              icon: 'none'
            })
          }
        }
      })
    } else {
      this.setData({
        isDisabled: true
      })
      clockinModel.toAddAttendance(params, res => {
        this.setData({
          isDisabled: false
        })
        if (res.data.status == 1) {
          wx.showToast({
            title: '添加成功',
          })
          wx.navigateBack({
            delta: 1
          })
        } else {
          if (res.data.msg.match('Token已过期或失效')) {
          } else {
            wx.showToast({
              title: res.data.msg ? res.data.msg : '请求超时',
              icon: 'none'
            })
          }
        }
      })
    }
  },

  // 删除考勤组
  toDelAttendance() {
    wx.showModal({
      title: '提示',
      content: '确定删除该考勤组？',
      success: res => {
        if (res.confirm) {
          let params = {
            group_id: this.data.attendanceId
          }
          clockinModel.toDelAttendance(params, res => {
            if (res.data.status == 1) {
              wx.showToast({
                title: '删除成功',
              })
              wx.navigateBack({
                delta: 1
              })
            }
          })
        }
      }
    })
  }
})