// 排班
import dateTimePicker from '../../../../dist/dateTimePicker.js'
Page({
  data: {
    spinShow: true,
    tableList: [],
    weekList: ['日', '一', '二', '三', '四', '五', '六'],
    currentDate: ''
  },

  onLoad(options) {
    // console.log(options)
    let everyDay = [],tempEveryDay,nowMonth,currentMonth

    if (!options.tableData || JSON.parse(options.tableData).length == 0) {
      tempEveryDay = dateTimePicker.getEveryDay()
      nowMonth = dateTimePicker.getNowMonth()
    } else {
      tempEveryDay = dateTimePicker.getEveryDay1(JSON.parse(options.tableData)[0].date)
      nowMonth = dateTimePicker.getNowMonth1(JSON.parse(options.tableData)[0].date)
    }

    this.setData({
      currentMonth: nowMonth.split('-')[0] + '年' + nowMonth.split('-')[1] + '月'
    })
    this.data.taskData = options.taskData

    tempEveryDay.forEach((item, index) => {
      if (item < 10) {
        everyDay.push(nowMonth + '-0' + item)
      } else {
        everyDay.push(nowMonth + '-' + item)
      }
    })

    if (!options.tableData) {
      everyDay.forEach((item, index) => {
        this.data.tableList.push({ date: item, taskList: [] })
      })
    } else {
      let tableData = JSON.parse(options.tableData)
      everyDay.forEach((item, index) => {
        this.data.tableList.push({ date: item, taskList: [] })
        tableData.forEach((item1, index1) => {
          if (item == item1.date) {
            this.data.tableList[index] = item1
          }
        })
      })
    }

    this.data.weekObj = dateTimePicker.getDates(1, everyDay[0])[0].week
    this.judgeWeek()
  },

  onShow() {
    if (this.data.selectTaskData) {
      this.data.tableList.forEach((item, index) => {
        if (item.date == this.data.currentDate) {
          item.taskList = []
          this.data.selectTaskData.forEach((item1, index1) => {
            item.taskList.push({ nickname: item1.nickname, id: item1.id })
          })
        }
      })
      this.setData({
        tableList: this.data.tableList
      })
    }
  },

  // 去到上一个月份
  toPre() { },

  // 去到下一个月份
  toNext() { },

  // 判断星期
  judgeWeek() {
    let tempTable = this.data.tableList
    if (this.data.weekObj == '日') {
    } else if (this.data.weekObj == '一') {
      tempTable.unshift({})
    } else if (this.data.weekObj == '二') {
      tempTable.unshift({}, {})
    } else if (this.data.weekObj == '三') {
      tempTable.unshift({}, {}, {})
    } else if (this.data.weekObj == '四') {
      tempTable.unshift({}, {}, {}, {})
    } else if (this.data.weekObj == '五') {
      tempTable.unshift({}, {}, {}, {}, {})
    } else if (this.data.weekObj == '六') {
      tempTable.unshift({}, {}, {}, {}, {}, {})
    }
    this.setData({
      tableList: tempTable,
      spinShow: false
    })
  },

  // 前往选择添加作业员
  taskSelect(e) {
    this.data.currentDate = e.currentTarget.dataset.date
    let taskDataSelected = JSON.stringify(e.currentTarget.dataset.task)
    let flag = true
    wx.navigateTo({
      url: '../task-select/task-select?taskData=' + this.data.taskData + '&flag=' + flag + '&taskDataSelected=' + taskDataSelected,
    })
  },

  // 确定
  onConfirm() {
    var pages = getCurrentPages()
    var currPage = pages[pages.length - 1] //当前页面
    var prevPage = pages[pages.length - 2] //上一个页面

    prevPage.setData({
      tableList: this.data.tableList
    })
    wx.navigateBack({
      delta: 1
    })
  }
})