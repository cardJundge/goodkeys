// 添加管理员
import {
  MineModel
} from './../../models/mine.js'

import {
  PersonnelModel
} from '../../../personnel/models/personnel.js'
var app = getApp()
var mineModel = new MineModel()
var personnelModel = new PersonnelModel()

Page({
  data: {
    isEdit: false,
    moduleList: [],
    applicationList: [],
    moduleShow: false,
    applicationShow: false,
    moduleNum: 0,
    moduleData: {system: [],define: []}, // 模块选中
    applicationData: [], // 应用选中
    applicationNum: 0,
    adminName: '',
    adminPhone: '',
    adminPwd: '',
    isDisabled: false  //防止确定按钮重复提交
  },

  onLoad(options) {
    this.setData({
      imgUrl: app.globalData.imgUrl
    })
    wx.setNavigationBarTitle({
      title: '添加管理员',
    })
    if (options.data) {
      wx.setNavigationBarTitle({
        title: '编辑管理员',
      })
      let data = JSON.parse(options.data)
      if (data.module && data.module.length != 0) {
        data.module.forEach((item, index) => {
          if (item.key) {
            this.data.moduleData.system.push(item.id)
          } else {
            this.data.moduleData.define.push(item.id)
          }
        })
      }
      if (data.apply && data.apply.length != 0) {
        data.apply.forEach((item, index) => {
          this.data.applicationData.push(item.id)
        })
      }
      this.setData({
        isEdit: true,
        adminName: data.name,
        adminPhone: data.mobile,
        adminId: data.id
      })
    }
    // 获取服务商应用列表
    this.getSerApplyList()
    // 获取模块列表
    this.getModuleList()
  },

  // 获取模块列表
  getModuleList() {
    personnelModel.getModule(res => {
      if (res.data.status == 1) {
        res.data.data.forEach((item, index) => {
          item.checked = false
          if (item.key) {
            this.data.moduleData.system.forEach((item1, index1) => {
              if (item.id == item1) {
                item.checked = true
              }
            })
          }  else {
            this.data.moduleData.define.forEach((item1, index1) => {
              if (item.id == item1) {
                item.checked = true
              }
            })
          }
        })
        this.setData({
          moduleList: res.data.data,
          moduleNum: this.data.moduleData.system.length + this.data.moduleData.define.length
        })
      }
    })
  },

  // 获取应用列表
  getSerApplyList() {
    mineModel.getSerApplyList(res => {
      if (res.data.status == 1) {
        res.data.data.forEach((item, index) => {
          item.checked = false
          this.data.applicationData.forEach((item1, index1) => {
            if (item.id == item1) {
              item.checked = true
            }
          })
        })
        this.setData({
          applicationList: res.data.data,
          applicationNum: this.data.applicationData.length
        })
      }
    })
  },

  toSelectModule(e) {
    let tempArr = [],tempArr1 = []
    this.data.moduleList.forEach((item, index) => {
      item.checked = false
      if (item.key) { 
        e.detail.value.forEach((item1, index1) => {
          if (item.id == item1) {
            item.checked = true
            tempArr.push(item1)
          }
        })
        this.data.moduleData.system = tempArr
      } else {
        e.detail.value.forEach((item1, index1) => {
          if (item.id == item1) {
            item.checked = true
            tempArr1.push(item1)
          }
        })
        this.data.moduleData.define = tempArr1
      }
      
    })
    this.setData({
      moduleNum: e.detail.value.length,
      moduleList: this.data.moduleList
    })
    // console.log(this.data.moduleList)
  },

  toSelectApplication(e) {
    console.log(e)
    this.setData({
      applicationNum: e.detail.value.length,
      applicationData: e.detail.value
    })
  },

  // 展开
  foldModule() {
    this.setData({
      moduleShow: true
    })
  },

  foldApplication() {
    this.setData({
      applicationShow: true
    })
  },

  // 收起来
  unfoldModule() {
    this.setData({
      moduleShow: false
    })
  },

  unfoldApplication() {
    this.setData({
      applicationShow: false
    })
  },

  // --------------------------

  getAdminNameInput(e) {
    this.setData({
      adminName: e.detail.value
    })
  },

  getAdminPhoneInut(e) {
    this.setData({
      adminPhone: e.detail.value
    })
  },

  getAdminPwdInut(e) {
    this.setData({
      adminPwd: e.detail.value
    })
  },

  // 删除管理员
  delAdmin() {
    wx.showModal({
      title: '提示',
      content: '是否删除该管理员？',
      success: res => {
        if (res.confirm) {
          let params = {
            id: this.data.adminId
          }
          mineModel.delAdmin(params, res=> {
            if (res.data.status == 1) {
              wx.showToast({
                title: '删除成功',
              })
              wx.navigateBack({
                delta: 1
              })
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

  onConfirm() {
    console.log(this.data.moduleData)
    if (!this.data.adminName) {
      return wx.showToast({
        title: '管理员姓名不能为空',
        icon: 'none'
      })
    }

    if (!this.data.adminPhone) {
      return wx.showToast({
        title: '管理员电话不能为空',
        icon: 'none'
      })
    }

    let reg = /^1\d{10}$/
    if (!reg.test(this.data.adminPhone)) {
      return wx.showToast({
        title: '管理员电话格式错误',
        icon: 'none'
      })
    }

    let params = {
      name: this.data.adminName,
      mobile: this.data.adminPhone,
      module: this.data.moduleData,
      apply: this.data.applicationData
    }

    this.setData({
      isDisabled: true
    })
    if (this.data.isEdit == true) {
      params.id = this.data.adminId
      // 编辑
      mineModel.editAdmin(params, res => {
        this.setData({
          isDisabled: false
        })
        if (res.data.status == 1) {
          wx.showToast({
            title: '编辑成功',
          })
          wx.navigateBack({
            delta: 1
          })
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
    } else {
      // 添加
      params.password = this.data.adminPwd ? this.data.adminPwd : ''
      mineModel.addAdmin(params, res => {
        this.setData({
          isDisabled: false
        })
        if (res.data.status == 1) {
          wx.showToast({
            title: '添加成功',
          })
          wx.navigateBack({
            delta: 1
          })
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