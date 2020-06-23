// 考勤
var app = getApp()
import {
  ClockInModel
} from '../models/clock-in.js'

var clockinModel = new ClockInModel()
Page({
  data: {

  },

  onLoad(options) {
  },

  onShow() {
    // 获取考勤组列表
    this.getAttendanceList()
  },

  // 获取考勤组列表
  getAttendanceList() {
    clockinModel.getAttendanceList(res => {
      if (res.data.status == 1) {
        this.setData({
          attendanceList: res.data.data
        })
      }
    })
  },

  // 添加考勤组
  toAddAttendance() {
    wx.navigateTo({
      url: './add-attendance/add-attendance',
    })
  },

  // 查看考勤组详情（编辑考勤组）
  toEditAttendance(e) {
    let attendanceId = e.currentTarget.dataset.id,
    data
    this.data.attendanceList.forEach((item, index) => {
      if (item.id == attendanceId) {
        data = JSON.stringify(item)
      }
    })
    wx.navigateTo({
      url: './add-attendance/add-attendance?data=' + data,
    })
  }
})