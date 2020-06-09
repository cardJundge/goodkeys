// 排班
import dateTimePicker from '../../../../dist/dateTimePicker.js'
Page({
  data: {
    spinShow: true,
    tableList: [{ date: '01', taskList: ['张鹏', '王佳', '毛不易', '宋佳'] }, { date: '02', taskList: ['张鹏', '王佳', '毛不易', '宋佳'] }, { date: '03', taskList: [] }, { date: '04', taskList: [] }, { date: '05', taskList: [] }, { date: '06', taskList: [] }, { date: '07', taskList: [] }, { date: '08', taskList: ['张鹏', '王佳', '毛不易', '宋佳'] }, { date: '09', taskList: ['毛不易', '宋佳'] }, { date: '10', taskList: [] }, { date: '11', taskList: [] }, { date: '12', taskList: [] }, { date: '13', taskList: [] }, { date: '14', taskList: ['张鹏', '王佳', '毛不易', '宋佳'] }, { date: '15', taskList: ['张鹏', '王佳'] }, { date: '16', taskList: [] }, { date: '17', taskList: [] }, { date: '18', taskList: [] }, { date: '19', taskList: [] }, { date: '20', taskList: [] }, { date: '21', taskList: [] }, { date: '22', taskList: [] }, { date: '23', taskList: [] }, { date: '24', taskList: [] }, { date: '25', taskList: [] }, { date: '26', taskList: [] }, { date: '27', taskList: [] }, { date: '28', taskList: [] }, { date: '29', taskList: [] } , { date: '30', taskList: [] }, { date: '31', taskList: [] }],
    weekList: ['日', '一', '二', '三', '四', '五', '六'],
  },

  onLoad(options) {
    this.data.weekObj = dateTimePicker.getDates(1, '2020-05-1')[0].week
    console.log(dateTimePicker,'654874545',dateTimePicker.getDates(1, '2020-05-1')[0],this.data.weekObj)
    this.judgeWeek()
  },

  // 去到上一个月份
  toPre() {

  },

  // 去到下一个月份
  toNext() {},

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
  taskSelect() {
    wx.navigateTo({
      url: '../task-select/task-select',
    })
  }
})