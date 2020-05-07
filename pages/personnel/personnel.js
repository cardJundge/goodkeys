// 人员管理

import {
  py
} from '../../dist/pinyin.js'
import {
  PersonnelModel
} from './models/personnel.js'
var app = getApp()

var personnelModel = new PersonnelModel()
let storeData = new Array(26)
const words = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
Page({
  data: {
    someone: true,
    personnelData: {},
    personnel: [],
    spinShow: true,
  },

  onLoad(options) {
    this.setData({
      imgUrl: app.globalData.imgUrl
    })
    
  },

  onShow() {
    this.getTaskList('')
  },

  rendering() { 
    words.forEach((item, index) => {
      storeData[index] = {
        key: item,
        list: []
      }
    }) 
  
    this.data.personnelData.forEach((item) => {
      let firstName = item.pinyin.substring(0, 1)
      let index = words.indexOf(firstName)
      storeData[index].list.push({
        id: item.id,
        name: item.nickname,
        module: item.module,
        face: item.face,
        key: firstName,
        mobile: item.mobile
      })
    })
    this.data.personnel = storeData
    this.setData({
      personnel: this.data.personnel
    })
  },

  // 获取作业员列表
  getTaskList(flag) {
    let params = {
      keywords: flag
    }
    personnelModel.getTaskList(params, (res) => {
      this.setData({
        spinShow: false
      })
      if (res.data.status == 1) {
        if(res.data.data.length > 0) {
          this.setData({
            personnelCount: res.data.count,
            personnelData: res.data.data,
            someone: true
          })
          this.data.personnelData.forEach((item, index) => {
            item.pinyin = py.getPinyin(item.nickname).toUpperCase()
          })
          this.rendering()
        } else {
          this.setData({
            personnelData: [],
            someone: false
          })
        }    
      }
    })
  },

  onChange(event) {
    console.log(event.detail, 'click right menu callback data')
  },

  // 添加人员
  addStaff() {
    wx.navigateTo({
      url: './add-personnel/add-personnel',
    })
  },

  // 添加分组
  addGroup() {
    wx.showActionSheet({
      itemList: ['添加分组', '编辑分组'],
      success: res => {
        if (res.tapIndex == 0) {
          wx.navigateTo({
            url: './add-group/add-group?isEdit=' + 1,
          })
        } else if (res.tapIndex == 1) {
          wx.navigateTo({
            url: './add-group/add-group?isEdit=' + 2,
          })
        }
      }
    })
  },

  // 增加名额
  addQuota() {
    wx.navigateTo({
      url: './add-quota/add-quota',
    })
  },

  // 编辑
  toEditTask(e) {
    this.data.personnelData.forEach((item, index)=> {
      if (item.id == e.currentTarget.dataset.id) {
        let data = JSON.stringify(item)
        wx.navigateTo({
          url: './add-personnel/add-personnel?data=' + data,
        })
      }
    })
    
  },

  // 删除作业员
  toDelTask(e) {
    wx.showModal({
      title: '提示',
      content: '是否删除该作业员？',
      success: (res)=> {
        if (res.cancel) {
        } else {
          personnelModel.delTask(e.currentTarget.dataset.id, res => {
            if (res.data.status == 1) {
              wx.showToast({
                title: '删除成功',
              })
              this.getTaskList('')
            } else {
              if (res.data.msg.match('Token已过期或失效')) {
              } else {
                wx.showToast({
                  title: res.data.msg ? res.data.msg : '请求超时',
                  icon: 'none'
                })
              }
            }
          })
        }
      }
    })
    
  },

  // 电话拨打
  phoneCall(e) {
    wx.getSystemInfo({
      success: res=> {
        if(res.platform == 'ios') {
          wx.makePhoneCall({
            phoneNumber: e.currentTarget.dataset.phone,
            success: res => {

            }
          })
        } else if (res.platform == 'android') {
          wx.showModal({
            title: '提示',
            content: '作业员手机号码 ' + e.currentTarget.dataset.phone,
            confirmText: "呼叫",
            success: res=> {
              if(res.confirm) {
                wx.makePhoneCall({
                  phoneNumber: e.currentTarget.dataset.phone,
                  success: res => {

                  }
                })
              }
            }
          })
        }
      }
    }) 
  },

  search(e) {
    this.getTaskList(e.detail.value)
  }
})