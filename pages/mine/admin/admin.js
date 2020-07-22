// 管理员
import {
  MineModel
} from './../models/mine.js'
var app = getApp()
var mineModel = new MineModel()
Page({
  data: {
    noData: false,
    adminList: []
  },

  onLoad(options) {
    this.setData({
      imgUrl: app.globalData.imgUrl,
      windowHeight: wx.getSystemInfoSync().windowHeight
    })
  },

  onShow() {
    this.getAdminList()
  },

  getAdminList() {
    mineModel.getAdminList(res => {
      if (res.data.status == 1) {
        if (res.data.data && res.data.data.length != 0) {
          this.setData({
            adminList: res.data.data,
            noData: false
          })
        } else {
          this.setData({
            noData: true
          })
        }
        
      }
    })
  },

  // 设置管理员(添加)
  toAddAdmin() {
    wx.navigateTo({
      url: './add-admin/add-admin',
    })
  },

  // 编辑管理员
  toEditAdmin(e) {
    console.log(e)
    let adminId = e.currentTarget.dataset.id,data
    this.data.adminList.forEach((item, index) => {
      if (item.id == adminId) {
        data = JSON.stringify(item)
      }
    }) 
    wx.navigateTo({
      url: './add-admin/add-admin?data=' + data,
    })
  },

  // 删除管理员
  toDelAdmin(e) {
    wx.showModal({
      title: '提示',
      content: '确定删除该管理员吗？',
      success: res=> {
        if (res.confirm) {
          let params = {
            id: e.currentTarget.dataset.id
          }
          mineModel.delAdmin(params, res=> {
            if (res.data.status == 1) {
              wx.showToast({
                title: '删除成功',
              })
              this.getAdminList()
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
  }
})