// 临时考勤设置
var app = getApp()
import {
  ClockInModel
} from '../models/clock-in.js'

var clockinModel = new ClockInModel()
Page({
  data: {
    isDisabled: false,
    attendanceFlag: 'time'
  },

  onLoad(options) {
    this.setData({
      imgUrl: app.globalData.imgUrl
    })
    // 判断之前是否有设置
    this.judgeAttendance()
  },

  judgeAttendance() {
    clockinModel.judgeTempAttendance(res => {
      if (res.data.status == 1) {
        if (res.data.data && res.data.data.length != 0) {
          this.setData({
            startTime: res.data.data.up,
            endTime: res.data.data.down,
            cycleData: res.data.data.cycle
          })
          let tempArr = []
          res.data.data.cycle.forEach((item, index)=>{
            tempArr.push(item.substring(2,3))
          })
          this.setData({
            weekData: tempArr,
            fixedTime: tempArr.join('、')
          })
        }
      }
    })
  },

  // 考勤时间选择（弹框）
  fixedTimeSelect() {
    this.setData({
      showAttendanceModal: true
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
    if (!this.data.cycleData || this.data.cycleData.length == 0) {
      this.setData({
        isDisabled: false
      })
      return wx.showToast({
        title: '请设置考勤时间',
        icon: 'none'
      })
    }

    if (!this.data.startTime) {
      this.setData({
        isDisabled: false
      })
      return wx.showToast({
        title: '请设置上班打卡时间',
        icon: 'none'
      })
    }

    if (!this.data.endTime) {
      this.setData({
        isDisabled: false
      })
      return wx.showToast({
        title: '请设置上班打卡时间',
        icon: 'none'
      })
    }

    let params = {
      up: this.data.startTime,
      down: this.data.endTime,
      cycle: this.data.cycleData
    }
    clockinModel.tempAttendance(params, res=> {
      if (res.data.status == 1) {
        wx.showToast({
          title: '设置成功',
        })
        wx.navigateBack({
          delta: 1
        })
      }
    }) 
  }
})