// 转单
import dateTimePicker from '../../../dist/dateTimePicker.js'
var app = getApp()
import {
  IndexModel
} from '../models/index.js'

var indexModel = new IndexModel()
Page({
  data: {
    paymentList: ['线下',''],
    payment: '',
    isSuccess: false,
    countDown: 3
  },

  onLoad: function (options) {
    console.log(JSON.parse(options.data))
    let data = JSON.parse(options.data)
    this.data.companyId = data.companyId
    this.data.moduleName = data.moduleName
    this.data.businessId = data.businessId
    this.setData({
      date: dateTimePicker.getNow(),
      companyName: data.companyName,
      moduleType: data.moduleType,
      businessNo: data.businessNo
    })
  },

  getMoneyInput(e) {
    this.data.money = e.detail.value
  },

  getRemarkInput(e) {
    this.data.remark = e.detail.value
  },

  paymentChange(e) {
    this.data.paymentIndex = e.detail.value
    this.setData({
      payment: this.data.paymentList[this.data.paymentIndex]
    })
  },

  // 转单提交
  formSubmit(e) {
    if (!this.data.money) {
      return wx.showToast({
        title: '请输入转单金额',
        icon: 'none'
      })
    }

    if (!this.data.payment) {
      return wx.showToast({
        title: '请选择支付方式',
        icon: 'none'
      })
    }
    let params = {
      report_no: this.data.businessNo,
      type: this.data.moduleType,
      turn_service: this.data.companyId,
      remark: this.data.remark ? this.data.remark : '',
      money: this.data.money,
      pay: this.data.payment,
      key: this.data.moduleName,
      work_id: this.data.businessId,
      // service_id: this.data.companyId
    }
    if(this.data.payment == '线下') {
      indexModel.toTransferOrder(params, res=> {
        if(res.data.status == 1) {
          this.setData({
            isSuccess: true
          })
          let timer = setInterval(() => {
            this.setData({
              countDown: this.data.countDown - 1
            })
            if (this.data.countDown < 1) {
              clearInterval(timer)
              wx.navigateBack({
                delta: 2
              })
            }
          }, 1000)
          
        } else {
          wx.showToast({
            title: res.data.msg ? res.data.msg : '操作超时',
            icon: 'none'
          })
        }
      })
    } else if (this.data.payment == '线上支付') {
      wx.navigateTo({
        url: './payment/payment?money=' + this.data.money,
      })
    }
  }
})