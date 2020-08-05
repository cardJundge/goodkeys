//首页
var app = getApp()
import {
  PersonnelModel
} from '../personnel/models/personnel.js'
import {
  IndexModel
} from './models/index.js'
import {
  MineModel
} from '../mine/models/mine.js'

var personnelModel = new PersonnelModel()
var indexModel = new IndexModel()
var mineModel = new MineModel()
Page({
  data: {
    dataStatisticsArray: [],
    work_status: '',
    status: '',
    page: 1,
    moduleArray: [],
    businessArray: [],
    // spinShow: true,
    applyEditIconshow: false,
    noApplyAuth: true
  },
  onLoad() {
      if (app.globalData.pathType == 'leave') {
        wx.navigateTo({
          url: '../clock-in/clock-in',
        })
      } else if (app.globalData.pathType == 'work') {
        if (app.globalData.pathModuleInfo.key) {
          if (app.globalData.pathModuleInfo.key == 'traffic') {
            wx.navigateTo({
              url: './vehicle/vehicle-details/vehicle-details?listId=' + app.globalData.pathModuleInfo.caseId,
            })
          } else if (app.globalData.pathModuleInfo.key == 'survey') {
            wx.navigateTo({
              url: './survey/survey-details/survey-details?listId=' + app.globalData.pathModuleInfo.caseId
            })
          } else if (app.globalData.pathModuleInfo.key == 'sickness') {
            wx.navigateTo({
              url: './sickness/sickness-details/sickness-details?listId=' + app.globalData.pathModuleInfo.caseId,
            })
          }
        } else {
          wx.navigateTo({
            url: './taskflow/taskflow-details/taskflow-details?listId=' + app.globalData.pathModuleInfo.caseId + '&moduleName=' + app.globalData.pathModuleInfo.name,
          })
        }
      }
    this.setData({
      serviceType: app.globalData.userInfo.type,
      authority: app.globalData.userInfo.parent_id
    })
  },
  onShow() {
    this.getDataStatics()
    this.getModule()
    // 获取服务商应用权限
    this.getSerApply()
    this.setData({
      moduleEditIconshow: false
    })
  },

  // 获取服务商应用
  getSerApply() {
    mineModel.getSerApplyList(res => {
      if (res.data.status == 1) {
        if (res.data.data.length == 0) {
          let params = {
            apply: [1, 5, 6, 7]
          }
          mineModel.editApply(params, res1 => {
            if (res1.data.status == 1) {
              this.getSerApply()
            }
          })
        } else {
          this.setData({
            serApplyList: res.data.data
          })
          this.data.applyIdList = []
          res.data.data.forEach((item, index) => {
            this.data.applyIdList.push(item.id)
            if (item.id == 1 || item.id == 2 || item.id == 3 || item.id == 4 || item.id == 7) {
              this.setData({
                noApplyAuth: false
              })
            }
            // 统计分析
            if (item.id == 5) {
              app.globalData.auth.statistics = true
            }
            // 人员管理
            if (item.id == 6) {
              app.globalData.auth.task = true
            }
          })
        }
      }
    })
  },

  // 应用中心各应用跳转
  toApply(e) {
    let applyId = e.currentTarget.dataset.id
    if (applyId == 1) {
      wx.navigateTo({
        url: '../clock-in/clock-in',
      })
    } else if (applyId == 2) {
      wx.navigateTo({
        url: './order/order',
      })
    } else if (applyId == 3) {
      wx.navigateTo({
        url: '../mine/shops/shops',
      })
    } else if (applyId == 4) {
      wx.navigateTo({
        url: '../union/union',
      })
    } else if (applyId == 7) {
      wx.navigateTo({
        url: '../clock-in/place/place',
      })
    }
  },

  // 添加应用
  toAddApply() {
    let data = JSON.stringify(this.data.serApplyList)
    wx.navigateTo({
      url: './add-module/zero/zero?serApplyList=' + data,
    })
  },

  // 管理(应用)
  manageApply(e) {
    this.setData({
      applyEditIconshow: !this.data.applyEditIconshow
    })
  },

  // 删除应用
  delApply(e) {
    let id = e.currentTarget.dataset.id
    this.setData({
      applyEditIconshow: false
    })
    wx.showActionSheet({
      itemList: ['删除应用'],
      success: res => {
        if (res.tapIndex == 0) {
          wx.showModal({
            title: '提示',
            content: '确定删除该应用吗？',
            success: res => {
              if (res.confirm) {
                this.data.applyIdList.forEach((item, index) => {
                  if (item == id) {
                    this.data.applyIdList.splice(index, 1)
                  }
                })
                let params = {
                  apply: this.data.applyIdList
                }
                mineModel.editApply(params, res => {
                  if (res.data.status == 1) {
                    wx.showToast({
                      title: '删除成功',
                    })
                    this.getSerApply()
                  } else {
                    if (res.data.msg.match('Token')) { } else {
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
      }
    })
  },

  // 首页获取数据统计
  getDataStatics() {
    let params = {
      service_id: app.globalData.userInfo.id
    }
    indexModel.dataStatistics(params, res => {
      if (res.data.status == 1) {
        this.setData({
          dataStatisticsArray: res.data.data
        })
      }
    })
  },

  // 进入数据统计详情
  toDataDetails() {
    wx.navigateTo({
      url: './statistics/statistics',
    })
  },

  // 进入业务列表
  toItemList(e) {
    let key = e.currentTarget.dataset.key,
      id = e.currentTarget.dataset.id
    if (key == 'survey') {
      wx.navigateTo({
        url: './survey/survey',
      })
    } else if (key == 'sickness') {
      wx.navigateTo({
        url: './sickness/sickness',
      })
    } else if (key == 'traffic') {
      wx.navigateTo({
        url: './vehicle/vehicle',
      })
    } else if (key == 'added') {
      wx.navigateTo({
        url: './increment/increment?moduleId=' + id,
      })
    }
  },

  // 进入新添加的模块详情
  toItemListSelf(e) {
    let id = e.currentTarget.dataset.id,
      name = e.currentTarget.dataset.name
    wx.navigateTo({
      url: './taskflow/taskflow?moduleId=' + id + '&moduleName=' + name,
    })
  },

  // 管理(模块)
  manageModule() {
    this.setData({
      moduleEditIconshow: !this.data.moduleEditIconshow
    })
  },

  // 添加模块
  toAddModule() {
    let data = JSON.stringify(this.data.businessArray)
    wx.navigateTo({
      url: './add-module/zero/zero?businessArray=' + data,
    })
  },

  // 获取服务商拥有的模块
  getModule() {
    personnelModel.getModule(res => {
      if (res.data.status == 1) {
        let module = []
        this.data.systemModuleId = []
        res.data.data.forEach((item, index) => {
          item.img = '/images/index/' + item.key + '.png'
          if (item.key) {
            this.data.systemModuleId.push(item.id)
          }
          if (item.icon) {
            item.img = item.icon
          }
          module.push(item.id)
        })
        wx.setStorageSync('module', module)
        let modules = res.data.data

        this.setData({
          businessArray: modules,
          spinShow: false
        })
      }
    })
  },

  // 管理自定义模块
  toEditAllModule(e) {
    let id = e.currentTarget.dataset.id,
      flag = e.currentTarget.dataset.flag,
      itemList = []
    this.setData({
      moduleEditIconshow: false
    })
    if (flag == 'system') {
      itemList = ['删除模块']
    } else {
      itemList = ['删除模块', '编辑模块']
    }
    wx.showActionSheet({
      itemList: itemList,
      success: res => {
        if (res.tapIndex == 1) {
          wx.navigateTo({
            url: './add-module/edit/edit?moduleId=' + id,
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '确定删除该模块吗？',
            success: res => {
              if (res.confirm) {
                if (flag == 'define') {
                  let params = {
                    id: id
                  }
                  indexModel.delModule(params, res => {
                    if (res.data.status == 1) {
                      wx.showToast({
                        title: '删除成功',
                      })
                      this.getModule()
                    } else {
                      if (res.data.msg.match('Token')) { } else {
                        wx.showToast({
                          title: res.data.msg ? res.data.msg : '请求超时',
                          icon: 'none'
                        })
                      }
                    }
                  })
                } else if (flag == 'system') {
                  this.data.systemModuleId.forEach((item, index) => {
                    if (item == id) {
                      this.data.systemModuleId.splice(index, 1)
                    }
                  })
                  let params = {
                    module: this.data.systemModuleId.join(',')
                  }
                  indexModel.setSelfModule(params, res => {
                    if (res.data.status == 1) {
                      this.getModule()
                    } else {
                      wx.showToast({
                        title: res.data.msg ? res.data.msg : '操作超时',
                        icon: 'none'
                      })
                    }
                  })
                }
              }
            }
          })
        }
      }
    })
  }
})