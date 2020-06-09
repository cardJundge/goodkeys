// 人员打卡详情
import dateTimePicker from '../../../dist/dateTimePicker.js'
var app = getApp()
import {
  ClockInModel
} from './../models/clock-in.js'
var clockinModel = new ClockInModel()
Page({
  data: {
    timeTab: ['日', '周', '月'],
    timeTabActive: 0,
    verticalCurrent: 2,
    calendarConfig: {
      highlightToday: true,
      defaultDay: true,
      preventSwipe: true
      // multi: true
    },
    clockSteps: [],
  },

  onLoad(options) {
    this.setData({
      imgUrl: app.globalData.imgUrl,
      taskName: options.taskName,
      taskFace: options.taskFace,
      taskStatus: '',
      taskId: options.taskId,
      monthObj: dateTimePicker.getNowMonth(),
      monthObj01: dateTimePicker.getNowMonth(),
      dateObj: dateTimePicker.getNowDate()
    })
    this.getClockDetails()
    this.getDayClockDetails()
    let tempArr = this.data.monthObj.split('-'),
      tempYear = tempArr[0],
      tempMonth = tempArr[1]
    this.setData({
      monthObjWxml: tempYear + '.' + Number(tempMonth)
    })
  },

  // 获取月考勤详情
  getClockDetails() {
    let params = {
      date: this.data.monthObj01,
      task_id: this.data.taskId
    }
    clockinModel.getClockDetails(params, res => {
      if (res.data.status == 1) {
        this.setData({
          allMonthData: res.data.data.status
        })
        setTimeout(res => {
          this.handleAction()
        }, 1000)
      }
    })
  },

  // 获取每日打卡情况
  getDayClockDetails() {
    let params = {
      date: this.data.dateObj,
      task_id: this.data.taskId
    }
    clockinModel.getDayClockDetails(params, res => {
      if (res.data.status == 1) {
        this.setData({
          allDayData: res.data.data
        })
      }
    })
  },

  // 获取周、月考勤统计
  getClockStatistics() {
    let params = {
      task_id: this.data.taskId
    }
    if (this.data.timeTabActive == 2) {
      params.date = this.data.monthObj
    }
    clockinModel.getClockStatistics(params, res => {
      if (res.data.status == 1) {
        this.setData({
          clockNum: res.data.data.clockNum,
          leaveNum: res.data.data.leaveNum
        })
        if (res.data.data.restNum) {
          let weekObjWxmlArr = res.data.data.week.split('-'),
          weekObjWxml = Number(weekObjWxmlArr[0]) + '.' + Number(weekObjWxmlArr[1]) + '.' + Number(weekObjWxmlArr[2]) + '-' + Number(weekObjWxmlArr[3]) + '.' + Number(weekObjWxmlArr[4]) + '.' + Number(weekObjWxmlArr[5])
          this.setData({
            restNum: res.data.data.restNum,
            weekObjWxml: weekObjWxml
          })
        }
      }
    })
  },

  // 月份切换==》去到上一个月
  toPreMonth() {
    let obj = this.data.monthObj.split('-'),
      year = obj[0],
      month = obj[1]
    if (month > 1) {
      month = month - 1
    } else if (month == 1) {
      month = 12
      year = year - 1
    }
    if (month < 10) {
      this.data.monthObj = year + '-0' + month
    } else {
      this.data.monthObj = year + '-' + month
    }

    this.setData({
      monthObjWxml: year + '.' + month,
      monthObj: this.data.monthObj
    })
    this.getClockStatistics()
  },

  // 月份切换==》去到下一个月
  toNextMonth() {
    let obj = this.data.monthObj.split('-'),
      year = obj[0],
      month = obj[1]
    if (month < 12) {
      month = Number(month) + 1
    } else if (month == 12) {
      month = 1
      year = Number(year) + 1
    }
    if (month < 10) {
      this.data.monthObj = year + '-0' + month
    } else {
      this.data.monthObj = year + '-' + month
    }
    this.setData({
      monthObjWxml: year + '.' + month,
      monthObj: this.data.monthObj
    })
    this.getClockStatistics()
  },

  timeTabChange(e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      timeTabActive: index
    })
    if (index == 0) {
      this.getClockDetails()
      // this.handleAction()
    } else {
      this.getClockStatistics()
    }
  },

  onTapDay(e) {
    console.log('onTapDay', e.detail)
  },

  afterTapDay(e) {
    if (e.detail.month < 10 && e.detail.day < 10) {
      this.data.dateObj = e.detail.year + '-0' + e.detail.month + '-0' + e.detail.day
    } else if (e.detail.month < 10 && e.detail.day > 9) {
      this.data.dateObj = e.detail.year + '-0' + e.detail.month + '-' + e.detail.day
    } else if (e.detail.month > 9 && e.detail.day < 10) {
      this.data.dateObj = e.detail.year + '-' + e.detail.month + '-0' + e.detail.day
    } else {
      this.data.dateObj = e.detail.year + '-' + e.detail.month + '-' + e.detail.day
    }
    this.getDayClockDetails()
  },

  //当改变月份时触发
  whenChangeMonth(e) {
    console.log('whenChangeMonth', e.detail)
    if (e.detail.next.month < 10) {
      this.data.monthObj01 = e.detail.next.year + '-' + '0' + e.detail.next.month
    } else {
      this.data.monthObj01 = e.detail.next.year + '-' + e.detail.next.month
    }

    this.setData({
      monthObj01: this.data.monthObj01
    })
    this.getClockDetails()
  },

  // 图片预览
  previewImage(e) {
    let imgArr = []
    imgArr.push(this.data.imgUrl + e.currentTarget.dataset.src)
    wx.previewImage({
      urls: imgArr,
      current: imgArr[0]
    })
  },

  handleAction() {
    const calendar = this.calendar
    const days = [], ymd = [], state = []

    this.data.allMonthData.forEach((item, index) => {
      for (var objitem in item) {
        ymd.push(objitem)
        state.push(item[objitem])
      }
    })

    ymd.forEach((item, index) => {
      days.push({
        year: item.split("-")[0],
        month: item.split("-")[1],
        day: item.split("-")[2],
        todoLabelColor: (((state[index] == '缺卡') || (state[index] == '迟到') || (state[index] == '早退')) ? '#FF9831' : (state[index] == '上班' ? '#1a65ff' : (state[index] == '请假' ? '#F21AFF' : (state[index] == '旷工' ? '#e4393c' : '#15da56'))))
      })
    })

    calendar['setTodoLabels']({
      showLabelAlways: true,
      days
    })
    console.log('set todo labels: ', days)

  }
})
