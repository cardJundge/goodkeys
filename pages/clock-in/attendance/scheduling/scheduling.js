// 排班
import dateTimePicker from '../../../../dist/dateTimePicker.js'
Page({
  data: {
    spinShow: true,
    tableList: [],
    weekList: ['日', '一', '二', '三', '四', '五', '六'],
    currentDate: '',
    currentLength: 0
  },

  onLoad(options) {
    let nowMonth = dateTimePicker.getNowMonth()
    this.setData({
      currentMonth: nowMonth
    })
    this.data.taskData = options.taskData
    if (options.tableData) {
      let dateTemp = []
      this.data.tableData = JSON.parse(options.tableData)
      if (this.data.tableData && this.data.tableData.length != 0) {
        this.data.tableData.forEach(item => {
          dateTemp.push(item.date.substring(0, 7))
        })
        // 获取tableData里面有几个月份
        var dateTemp1 = dateTemp.filter(function (value, index, self) {
          return self.indexOf(value) === index
        })
        // 月份数量
        this.data.currentLength = dateTemp1.length
        dateTemp1.forEach(item => {
          this.getCurMonthEveryDay(item)
        })
      }
    }
    this.getCurMonthEveryDay(this.data.currentMonth)
  },

  onShow() {
    if (this.data.selectTaskData) {
      this.data.tableList.forEach((item, index) => {
        if (item.month == this.data.currentMonth) {
          item.data.forEach((item1, index1) => {
            if (item1.date == this.data.currentDate) {
              item1.taskList = []
              this.data.selectTaskData.forEach((item2, index2) => {
                item1.taskList.push({ nickname: item2.nickname, id: item2.id })
              })
            }
          })
        }
      })
      this.setData({
        tableList: this.data.tableList
      })
    }
    this.sortTableData()
  },

  // 获取currentMonth里面的每一天
  getCurMonthEveryDay(month) {
    let dataTemp = [], everyDay = [], monthFlag = null,
      everyDayTemp = dateTimePicker.getEveryDay1(month)
    everyDayTemp.forEach((item, index) => {
      if (item < 10) {
        everyDay.push(month + '-0' + item)
      } else {
        everyDay.push(month + '-' + item)
      }
    })
    // [01,02,03....]=>[2020-08-01,2020-08-02]
    everyDay.forEach((item, index) => {
      dataTemp.push({ date: item, taskList: [] })
      if (this.data.tableData && this.data.tableData.length != 0) {
        this.data.tableData.forEach((item1, index1) => {
          if (item == item1.date) {
            dataTemp[index] = item1
          }
        })
      }
    })
    // tableList格式[{month: '2020-08-01',data:[{date:'',taskList:[]},...]},...]
    // 如果tableList为空就push这样的格式，如果不为空就用month与当前currentMonth进行对比,如果相等就替换data，不相等push
    this.data.tableList.forEach((item, index) => {
      if (item.month == month) {
        monthFlag = index
      }
    })
    if (monthFlag == null) {
      this.data.tableList.push({
        month: month,
        data: dataTemp
      })
    } else {
      this.data.tableList[monthFlag].data = dataTemp
    }
    // console.log(this.data.tableList)
    this.data.weekObj = dateTimePicker.getDates(1, everyDay[0])[0].week
    this.judgeWeek()
  },

  // 去到上一个月份
  toPre() {
    let year = Number(this.data.currentMonth.split('-')[0]),
      month = Number(this.data.currentMonth.split('-')[1]),
      tempCurrentMonth
    if (month == 1) {
      year--
      month = 12
    } else {
      month--
    }
    if (month < 10) {
      tempCurrentMonth = year + '-0' + month
    } else {
      tempCurrentMonth = year + '-' + month
    }
    this.setData({
      currentMonth: tempCurrentMonth
    })
    this.getCurMonthEveryDay(this.data.currentMonth)
  },

  // 去到下一个月份
  toNext() {
    let year = Number(this.data.currentMonth.split('-')[0]),
      month = Number(this.data.currentMonth.split('-')[1]),
      tempCurrentMonth
    if (month == 12) {
      year++
      month = 1
    } else {
      month++
    }
    if (month < 10) {
      tempCurrentMonth = year + '-0' + month
    } else {
      tempCurrentMonth = year + '-' + month
    }
    this.setData({
      currentMonth: tempCurrentMonth
    })
    this.getCurMonthEveryDay(this.data.currentMonth)
  },

  // 判断星期
  judgeWeek() {
    this.data.tableList.forEach((item, index) => {
      if (item.month == this.data.currentMonth) {
        if (this.data.weekObj == '日') {
        } else {
          if (!item.data[0].date) {
          } else {
            if (this.data.weekObj == '一') {
              item.data.unshift({})
            } else if (this.data.weekObj == '二') {
              item.data.unshift({}, {})
            } else if (this.data.weekObj == '三') {
              item.data.unshift({}, {}, {})
            } else if (this.data.weekObj == '四') {
              item.data.unshift({}, {}, {}, {})
            } else if (this.data.weekObj == '五') {
              item.data.unshift({}, {}, {}, {}, {})
            } else if (this.data.weekObj == '六') {
              item.data.unshift({}, {}, {}, {}, {}, {})
            }
          }
        }
      }
    })
    this.setData({
      tableList: this.data.tableList,
      spinShow: false
    })
    // 
    if (this.data.tableList.length >= this.data.currentLength) {
      this.sortTableData()
    }
  },

  // 整理tabelData
  sortTableData() {
    let tempTableData = []
    this.data.tableList.forEach((item, index) => {
      item.data.forEach((item1, index1) => {
        if (item1.date && item1.taskList.length != 0) {
          tempTableData.push(item1)
        }
      })
    })
    this.setData({
      tableData: tempTableData
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
      tableData: this.data.tableData
    })
    wx.navigateBack({
      delta: 1
    })
  }
})