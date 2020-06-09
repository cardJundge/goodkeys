// 打卡统计
import dateTimePicker from '../../dist/dateTimePicker.js'
var app = getApp()
import {
  ClockInModel
} from './models/clock-in.js'
import {
  PersonnelModel
} from '../personnel/models/personnel.js'

var clockinModel = new ClockInModel()
var personnelModel = new PersonnelModel()
Page({
  data: {
    tabList: ['打卡', '请假'],
    switchActive: 0,
    leaveShow: false,
    leaveList: [],
    page: 1,
    pageSize: 20,
    noData: false,
  },

  onLoad(options) {
    this.setData({
      imgUrl: app.globalData.imgUrl,
      todayObj: dateTimePicker.getNowDate(),
      dateObj: dateTimePicker.getNowDate(),
      windowHeight: wx.getSystemInfoSync().windowHeight
    })
    // 判断之前是否有设置考勤
    // this.getTaskList()
  },

  onShow() {
    this.judgeAttendance()
  },

  judgeAttendance() {
    clockinModel.judgeTempAttendance(res => {
      if (res.data.status == 1) {
        if (!res.data.data || res.data.data.length == 0) {
          this.setData({
            attendanceNull: true
          })
        } else {
          this.setData({
            attendanceNull: false
          })
          this.getClockList()
        }
      }
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
      this.judgeAttendance()
    } else {
      wx.setNavigationBarTitle({
        title: '请假审批'
      })
      this.setData({
        leaveList: [],
        page: 1,
      })
      // 获取请假审批列表
      this.getLeaveList()
    }
  },

  // 获取打卡列表
  getClockList() {
    let params = {
      date: this.data.dateObj
    }
    clockinModel.getClockList(params, res => {
      if (res.data.status == 1) {
        this.setData({
          clockData: res.data.data.clock,
          taskStatusList: res.data.data.tasks
        })
      }
    })
  },

  // 获取作业员列表
  // getTaskList() {
  //   let params = {}
  //   personnelModel.getTaskList(params, res => {
  //     if (res.data.status == 1) {
  //       this.setData({
  //         taskList: res.data.data
  //       })
  //     }
  //   })
  // },

  // 请假审批列表
  getLeaveList() {
    let params = {
      page: this.data.page
    }
    clockinModel.getLeaveList(params, res => {
      if (res.data.status == 1) {
        // res.data.data.data.forEach((item, index) => {
        //   this.data.taskList.forEach((item1, index1) => {
        //     if (item.task_id == item1.id) {
        //       item.task_name = item1.nickname
        //     }
        //   })
        // })
        let leaveList = this.data.leaveList,
          leaveInfo = res.data.data.data
        if (this.data.page == 1 && res.data.data.data.length == 0) {
          this.setData({
            noData: true
          })
        } else {
          this.setData({
            noData: false
          })
          if (leaveInfo.length < this.data.pageSize) {
            this.setData({
              leaveInfo: leaveInfo,
              leaveList: leaveList.concat(leaveInfo),
              hasMoreData: false
            })
          } else {
            this.setData({
              leaveInfo: leaveInfo,
              leaveList: leaveList.concat(leaveInfo),
              hasMoreData: true
            })
          }
        }
      }
    })
  },

  // 同意请假
  toAgreeLeave(e) {
    let params = {
      id: e.currentTarget.dataset.id
    }
    clockinModel.leaveAgree(params, res => {
      if (res.data.status == 1) {
        this.setData({
          leaveList: [],
          page: 1,
        })
        this.getLeaveList()
      }
    })
  },

  // 拒绝请假
  toRefuseLeave(e) {
    this.data.currentId = e.currentTarget.dataset.id
    this.setData({
      leaveShow: true
    })
  },

  refuseEvent(e) {
    let params = {
      id: this.data.currentId,
      reason: e.detail.leaveRefuseReason
    }
    clockinModel.leaveRefuse(params, res => {
      if (res.data.status == 1) {
        this.setData({
          leaveList: [],
          page: 1,
        })
        this.getLeaveList()
      }
    })
  },

  // 选择日期
  dateChange(e) {
    this.setData({
      dateObj: e.detail.value
    })
    this.getClockList()
  },

  // 查看人员位置
  toPlace() {
    wx.navigateTo({
      url: './place/place',
    })
  },

  toPersonnel(e) {
    let taskId = e.currentTarget.dataset.id,
      taskName = e.currentTarget.dataset.name,
      taskFace = e.currentTarget.dataset.face
    wx.navigateTo({
      url: './personnel/personnel?taskId=' + taskId + '&taskName=' + taskName + '&taskFace=' + taskFace,
    })
  },

  // 进入考勤设置
  toAttendance() {
    // wx.navigateTo({
    //   url: './attendance/attendance',
    // })
    wx.navigateTo({
      url: './temp-attendance/temp-attendance',
    })
  },

  // 上拉加载
  onReachBottom() {
    if (this.data.hasMoreData) {
      this.data.page = this.data.page + 1
      this.getLeaveList()
    }
  },
})