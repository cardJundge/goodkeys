// 添加服务项目
import dateTimePicker from '../../../../dist/dateTimePicker.js'
import {
  MineModel
} from './../../models/mine.js'

var mineModel = new MineModel()
var hostName = getApp().globalData.hostName
var app = getApp()
Page({
  data: {
    projectList: [],
    marketPrice: '',
    truePrice: ''
  },
  onLoad: function(options) {
    this.getprojectList()
    var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear)
    this.setData({
      dateTimeArray: obj.dateTimeArray,
      dateTime: obj.dateTime,
      imgUrl: app.globalData.imgUrl
    })
  },

  // 获取服务项目列表
  getprojectList() {
    mineModel.getprojectList(res => {
      if (res.data.status == 1) {
        let array = []
        res.data.data.forEach((item, index) => {
          array.push(item.name)
        })
        this.data.projectList = res.data.data
        this.setData({
          projectNameList: array
        })
      }
    })
  },

  changedateTime(e) {
    this.setData({
      dateTime: e.detail.value,
      sendTimeFirst: false
    })
  },

  changeDateTimeColumn(e) {
    console.log(e)
    var arr = this.data.dateTime,
      dateArr = this.data.dateTimeArray
    arr[e.detail.column] = e.detail.value
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]])

    this.setData({
      dateTimeArray: dateArr,
      dateTime: arr
    })
  },


  // 服务项目picker
  projectChange(e) {
    this.setData({
      projectName: this.data.projectNameList[e.detail.value]
    })
  },

  addPic() {
    wx.chooseImage({
      count: 1,
      // 可以指定是原图还是压缩图
      sizeType: ['compressed'],
      // 可以指定来源是相册还是相机
      sourceType: ['album'],
      success: (res) => {
        wx.uploadFile({
          url: hostName + '/api/auth/upload',
          filePath: res.tempFilePaths[0],
          name: 'file',
          success: (res) => {
            let data = JSON.parse(res.data)
            if (data.status == 1) {
              this.setData({
                imgSrc: data.data.filename
              })
              console.log(data, this.data.imgSrc)
            } else {
              wx.showToast({
                title: data.msg ? data.msg : '操作超时',
                icon: 'none'
              })
            }
          }
        })
      }
    })
  },

  marketInput(e) {
    this.data.marketPrice = e.detail.value
  },

  trueInput(e) {
    this.data.truePrice = e.detail.value
  },

  formSubmit(e) {
    if (!this.data.projectName) {
      return wx.showToast({
        title: '请选择分类！',
      })
    }

    if (!this.data.marketPrice) {
      return wx.showToast({
        title: '市场价不能为空！',
      })
    }

    if (!this.data.truePrice) {
      return wx.showToast({
        title: '平台价不能为空！',
      })
    }

    if (!this.data.imgSrc) {
      return wx.showToast({
        title: '请上传图片！',
      })
    }
    let dateTimeArray = this.data.dateTimeArray
    let dateTime = this.data.dateTime
    let time = dateTimeArray[0][dateTime[0]] + '-' + dateTimeArray[1][dateTime[1]] + '-' + dateTimeArray[2][dateTime[2]] + dateTimeArray[3][dateTime[3]] + ':' + dateTimeArray[4][dateTime[4]]

    let params = {

    }

    // 请求
  }

})