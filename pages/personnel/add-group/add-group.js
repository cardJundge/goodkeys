// 添加分组
import {
  PersonnelModel
} from './../models/personnel.js'
var app = getApp()

var personnelModel = new PersonnelModel()
Page({
  data: {
    groupName: '',
    groupEditName: '',
    isEdit: 1
  },
  onLoad: function(options) {
    this.setData({
      isEdit: options.isEdit
    })
    this.getGroupList()
  },

  // 获取分组列表
  getGroupList() {
    personnelModel.getGroupList(res => {
      if (res.data.status == 1) {
        this.setData({
          nodata: false,
          groupList: res.data.data
        })
      } else {
        this.setData({
          nodata: true
        })
      }
    })
  },

  addGroup() {
    this.setData({
      isEdit: 1
    })
  },

  groupNameInput(e) {
    this.data.groupName = e.detail.value
  },

  groupEditNameInput(e) {
    this.data.groupEditName = e.detail.value
  },

  toEdit(e) {
    this.setData({
      isEdit: 3,
      groupEditName: e.currentTarget.dataset.itn,
      groupEditId: e.currentTarget.dataset.id
    })
  },

  // 删除分组
  toDel(e) {
    wx.showModal({
      title: '提示',
      content: '确定删除分组吗？',
      success: res=> {
        if(res.confirm) {
          personnelModel.delGroupList(e.currentTarget.dataset.id, res=> {
            if(res.data.status == 1) {
              wx.showToast({
                title: '删除成功',
              })
              this.getGroupList()
            }
          })
        }
      }
    })
  },

  // 增加分组
  onConfirm() {
    wx.showLoading({
      title: '添加中...',
    })
    let params = {
      name: this.data.groupName
    }
    personnelModel.addGroup(params, res => {
      if (res.data.status == 1) {
        wx.showToast({
          title: '添加成功',
          success: res => {
            wx.navigateBack({
              delta: 1
            })
          }
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
  },

  // 编辑
  onEditConfirm() {
    wx.showLoading({
      title: '编辑中...',
    })
    let params = {
      name: this.data.groupEditName,
      id: this.data.groupEditId
    }
    personnelModel.editGroupList(params, res => {
      console.log(res)
      if (res.data.status == 1) {
        wx.showToast({
          title: '编辑成功',
        })
        this.getGroupList()
        this.setData({
          isEdit: 2
        })
      }else {
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
})