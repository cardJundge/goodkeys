//首页
var app = getApp()
import {
  PersonnelModel
} from '../personnel/models/personnel.js'
import {
  IndexModel
} from './models/index.js'

var personnelModel = new PersonnelModel()
var indexModel = new IndexModel()
Page({
  data: {
    dataStatisticsArray: [],
    work_status: '',
    status: '',
    page: 1,
    moduleArray: [],
    businessArray: [],
    spinShow: true,
  },
  onLoad() {
    this.setData({
      serviceType: app.globalData.userInfo.type
    })
  },
  onShow() {
    this.getDataStatics()
    this.getModule()
    this.setData({
      editIconshow: false
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

  // 管理
  toManage() {
    this.setData({
      editIconshow: !this.data.editIconshow
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
      editIconshow: false
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
                  indexModel.delModule(params, res=> {
                    if (res.data.status == 1) {
                      wx.showToast({
                        title: '删除成功',
                      })
                      this.getModule()
                    } else {
                      if (res.data.msg.match('Token')) {} else {
                        wx.showToast({
                          title: res.data.msg ? res.data.msg : '请求超时',
                          icon: 'none'
                        })
                      }
                    }
                  })
                } else if (flag == 'system')  {
                  this.data.systemModuleId.forEach((item, index) => {
                    if (item == id) {
                      this.data.systemModuleId.splice(index, 1)
                    }
                  })
                  let params = {
                    module: this.data.systemModuleId.join(',')
                  }
                  indexModel.setSelfModule(params, res=> {
                    if (res.data.status == 1) {
                      this.getModule()
                    }
                  })
                }
              }
            }
          })
        }
      }
    })
  },

  // 进入打卡页面
  toClockIn() {
    wx.navigateTo({
      url: '../clock-in/clock-in',
    })
  },

  // 进入联盟页面
  toUnion() {
    wx.navigateTo({
      url: '../union/union',
    })
  }
})