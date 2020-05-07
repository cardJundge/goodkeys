// 增加车物调查案件
import dateTimePicker from '../../../../dist/dateTimePicker.js'
import {
  IndexModel
} from '../../models/index.js'

var app = getApp()
var indexModel = new IndexModel()

Page({
  data: {
    dateTime: null, //委派
    dateTimeArray: null, //委派
    weipaiShow: false, //委派

    dateTime1: null, //报案
    dateTimeArray1: null, //报案
    baoanShow: false, //报案

    dateTime2: null, //出险
    dateTimeArray2: null, //出险
    chuxianShow: false, //出险
    region: ["", ""]
  },

  onLoad: function(options) {
    var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear)
    this.setData({
      dateTime: obj.dateTime,
      dateTimeArray: obj.dateTimeArray,
      dateTime1: obj.dateTime,
      dateTimeArray1: obj.dateTimeArray,
      dateTime2: obj.dateTime,
      dateTimeArray2: obj.dateTimeArray
    })
  },

  //改变列
  changeDateTimeColumn(e) {
    if (e.currentTarget.dataset.type == "weipai") {

      var arr = this.data.dateTime,
        dateArr = this.data.dateTimeArray

      arr[e.detail.column] = e.detail.value
      dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]])

      this.setData({
        dateTimeArray: dateArr,
        dateTime: arr
      })

    } else if (e.currentTarget.dataset.type == "baoan"){
      var arr = this.data.dateTime1,
        dateArr = this.data.dateTimeArray1

      arr[e.detail.column] = e.detail.value
      dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]])

      this.setData({
        dateTimeArray1: dateArr,
        dateTime1: arr
      })

    } else if (e.currentTarget.dataset.type == "出险") {
      var arr = this.data.dateTime2,
        dateArr = this.data.dateTimeArray2

      arr[e.detail.column] = e.detail.value
      dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]])

      this.setData({
        dateTimeArray2: dateArr,
        dateTime2: arr
      })
    }

  },

  //时间选择器
  changedateTime(e) {
    console.log(e)
    if (e.currentTarget.dataset.type == 'weipai') {
      this.setData({
        dateTime: e.detail.value,
        weipaiShow: true
      })

    } else if (e.currentTarget.dataset.type == 'baoan'){
      this.setData({
        dateTime1: e.detail.value,
        baoanShow: true
      })
    } else if (e.currentTarget.dataset.type == 'chuxian'){
      this.setData({
        dateTime2: e.detail.value,
        chuxianShow: true
      })
    }
  },

  //取消时间
  cancelTime(e) {
    if (e.currentTarget.dataset.type == 'weipai') {
      this.setData({
        weipaiShow: false
      })
    } else if (e.currentTarget.dataset.type == 'baoan'){
      this.setData({
        baoanShow: false
      })
    } else if (e.currentTarget.dataset.type == 'chuxian') {
      this.setData({
        chuxianShow: false
      })
    }
  },

  bindRegionChange(e) {
    this.setData({
      region: e.detail.value
    })
  },

  // 添加车物调查案件
  addVehicle(e) {
    let data = e.detail.value
    if (!data.reportNo) {
      return wx.showToast({
        title: '报案号不能为空！',
        icon: "none"
      })
    }
    if (!data.company) {
      return wx.showToast({
        title: '委派公司不能为空！',
        icon: "none"
      })
    }
    if (!this.data.weipaiShow) {
      return wx.showToast({
        title: '请选择委派时间！',
        icon: "none"
      })
    }
    if (!data.insuredPerson) {
      return wx.showToast({
        title: '被保险人姓名不能为空！',
        icon: "none"
      })
    }
    if (!data.driverName) {
      return wx.showToast({
        title: '驾驶员姓名不能为空！',
        icon: "none"
      })
    }
    if (!data.driverTel) {
      return wx.showToast({
        title: '驾驶员电话不能为空！',
        icon: "none"
      })
    }
    if (!data.carNo) {
      return wx.showToast({
        title: '出险车牌号不能为空！',
        icon: "none"
      })
    }
    if (!this.data.chuxianShow) {
      return wx.showToast({
        title: '请选择出险时间！',
        icon: "none"
      })
    }
    if (!data.brandNo) {
      return wx.showToast({
        title: '厂牌型号不能为空！',
        icon: "none"
      })
    }
    if (!this.data.region[0]) {
      return wx.showToast({
        title: '请选择出险地址！',
        icon: "none"
      })
    }
    if (!data.detailAddress) {
      return wx.showToast({
        title: '详细地址不能为空！',
        icon: "none"
      })
    }

    if (!data.verify) {
      return wx.showToast({
        title: '核实内容不能为空！',
        icon: "none"
      })
    }

    if (!data.investigation) {
      return wx.showToast({
        title: '调查内容不能为空！',
        icon: "none"
      })
    }

    let params = {
      key: "traffic",
      report_no: data.reportNo,
      entrust_company: data.company,
      entrust_at: this.data.dateTimeArray[0][this.data.dateTime[0]] + "-" + this.data.dateTimeArray[1][this.data.dateTime[1]] + '-' + this.data.dateTimeArray[2][this.data.dateTime[2]] + " " + this.data.dateTimeArray[3][this.data.dateTime[3]] + ":" + this.data.dateTimeArray[4][this.data.dateTime[4]],
      recognizee: data.insuredPerson,
      driver: data.driverName,
      mobile: data.driverTel,
      car_no: data.carNo,
      factory_no: data.brandNo,
      survey_address: this.data.region[0] + "-" + this.data.region[1] + " " + data.detailAddress,
      report_date: this.data.dateTimeArray1[0][this.data.dateTime1[0]] + "-" + this.data.dateTimeArray1[1][this.data.dateTime1[1]] + '-' + this.data.dateTimeArray1[2][this.data.dateTime1[2]] + " " + this.data.dateTimeArray1[3][this.data.dateTime1[3]] + ":" + this.data.dateTimeArray1[4][this.data.dateTime1[4]],
      verify_content: data.verify,
      survey_content: data.investigation,
      survey_date: this.data.dateTimeArray2[0][this.data.dateTime2[0]] + "-" + this.data.dateTimeArray2[1][this.data.dateTime2[1]] + '-' + this.data.dateTimeArray2[2][this.data.dateTime2[2]] + " " + this.data.dateTimeArray2[3][this.data.dateTime2[3]] + ":" + this.data.dateTimeArray2[4][this.data.dateTime2[4]]
    }

    indexModel.addBusiness(params, res => {
      if (res.data.status == 1) {
        wx.showToast({
          title: '案件添加成功！'
        })
        wx.redirectTo({
          url: '../add-information/add-information?vehicleId=' + res.data.data.id,
        })

      } else {
        wx.showToast({
          title: res.data.msg ? res.data.msg : '操作超时',
          icon: "none"
        })
      }
    })
  }
})