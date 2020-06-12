// 车物调查
import {
  IndexModel
} from '../models/index.js'

var indexModel = new IndexModel()
var app = getApp()
Page({
  data: {
    vehicleList: [],
    statusList: [{
        name: '全部案件',
        id: 0
      },
      {
        name: '已分配',
        id: 1
      },
      {
        name: '进行中',
        id: 2
      },
      {
        name: '预结案',
        id: 3
      },
      {
        name: '已结案',
        id: 4
      },
      {
        name: '转单',
        id: 5
      }
    ],
    statusId: 0, // 车物调查初始状态
    page: 1,
    pageSize: 15,
    hasNoData: false,
    navScrollLeft: 0,
    marginTop: 136,
    // vehStatus: 0, 

    screenShow: false,
    statusName: '全部案件'
  },

  onLoad(options) {
    this.setData({
      serviceId: app.globalData.userInfo.id
    })
  },

  onShow() {
    this.setData({
      vehicleList: [],
      page: 1,
      spinShow: true,
      statusId: 0
    })
    this.getVehicleList()
  },

  // 获取车物调查列表
  getVehicleList() {
    let params = {
      key: 'traffic',
      page: this.data.page,
      keywords: this.data.keywords ? this.data.keywords : ''
    }
    if (this.data.statusId == 0 || this.data.statusId == 5) {} else {
      params.status = this.data.statusId
    }
    indexModel.getWorkList(params, res => {
      wx.stopPullDownRefresh()
      this.setData({
        isRefresh: false,
        marginTop: 136
      })
      let vehicleList = this.data.vehicleList
      let vehicleInfo = res.data.data.data
      if (res.data.status == 1) {
        if (this.data.page == 1 && vehicleInfo.length == 0) {
          return this.setData({
            hasNoData: true,
            spinShow: false
          })
        }
        this.setData({
          hasNoData: false,
          spinShow: false
        })
        if (vehicleInfo.length < this.data.pageSize) {
          this.setData({
            vehicleInfo: vehicleInfo,
            vehicleList: vehicleList.concat(vehicleInfo),
            hasMoreData: false
          })
        } else {
          this.setData({
            vehicleInfo: vehicleInfo,
            vehicleList: vehicleList.concat(vehicleInfo),
            hasMoreData: true
          })
        }
        // this.data.vehicleTempList = this.data.vehicleList

        if (this.data.statusId == 5) {
          let tempList = []
          this.data.vehicleList.forEach((item, index) => {
            if (item.turn_service_id) {
              tempList.push(item)
            }
          })
          if(tempList.length == 0) {
            this.setData({
              hasNoData: true
            })
          } else {
            this.setData({
              vehicleList: tempList,
              hasMoreData: false
            })
          }
        }
      } else {
        this.setData({
          hasNoData: true
        })
        if (res.data.msg.match('Token')) {} else {
          wx.showToast({
            title: res.data.msg ? res.data.msg : '请求超时',
            icon: 'none'
          })
        }
      }
    })
  },

  // ----------------------
  // changeStatus(e) {
  //   this.setData({
  //     statusId: e.currentTarget.dataset.id,
  //     keywords: ''
  //   })

  //   if (this.data.statusId == 0 || this.data.statusId == 1 || this.data.statusId == 2) {
  //     this.setData({
  //       navScrollLeft: 0
  //     })
  //   } else if (this.data.statusId == 3 || this.data.statusId == 4 || this.data.statusId == 5) {
  //     this.setData({
  //       navScrollLeft: 800
  //     })
  //   }
  //   this.data.page = 1
  //   this.data.vehicleList = []
  //   this.getVehicleList()
  // },
  // ----------------------

  // 打开位置选择框
  bindRegionChange(e) {
    this.setData({
      regionData: e.detail.value
    })
  },

  // 弹出状态框
  showScreenBox(e) {
    let screenFlag = e.currentTarget.dataset.flag
    this.setData({
      screenFlag: screenFlag,
      screenShow: !this.data.screenShow
    })
    if (screenFlag == 'status') {
      this.setData({
        statusShow: this.data.screenShow
      })
    } else if (screenFlag == 'time') {
      this.setData({
        timeShow: this.data.screenShow
      })
    } else if (screenFlag == 'more') {
      this.setData({
        moreShow: this.data.screenShow
      })
    } else if (screenFlag == 'address') {
      this.setData({

      })
    }
  },

  changeStatusEvent(e) {
    this.setData({
      statusId: e.detail.statusId,
      statusName: e.detail.statusName,
      screenShow: false,
      statusShow: false,
      keywords: ''
    })
    this.data.page = 1
    this.data.vehicleList = []
    this.getVehicleList()
  },

  // 时间筛选确定
  changeTimeEvent() {
    this.setData({
      screenShow: false,
      timeShow: false
    })
  },

  // 更多筛选确定
  changemoreEvent() {
    this.setData({
      screenShow: false,
      moreShow: false
    })
  },

  toVehicleDetails(e) {
    if (this.data.endTime - this.data.startTime < 350) {
      wx.navigateTo({
        url: './vehicle-details/vehicle-details?listId=' + e.currentTarget.dataset.id,
      })
    }

  },

  // 添加车物调查案件
  addVehicle() {
    wx.navigateTo({
      url: './add-vehicle/add-vehicle',
    })
  },

  // 搜索
  search(e) {
    wx.showLoading({
      title: '加载中...'
    })
    this.setData({
      statusId: 0
    })
    this.data.page = 1
    this.data.keywords = e.detail.value
    this.data.vehicleList = []
    this.getVehicleList()
  },

  // 删除业务列表
  toDelVehicleItem(e) {
    let caseStatus = e.currentTarget.dataset.status
    wx.showModal({
      title: '提示',
      content: '是否删除该案件？',
      success: res => {
        if (res.confirm) {
          if (caseStatus == 1) {
            wx.showToast({
              title: '已分配状态下不可以删除案件',
              icon: 'none'
            })
          } else if (caseStatus == 2) {
            wx.showToast({
              title: '进行中状态下不可以删除案件',
              icon: 'none'
            })
          } else {
            let params = {
              key: 'traffic',
              id: e.currentTarget.dataset.id
            }
            indexModel.delBusiness(params, res => {
              if (res.data.status == 1) {
                this.data.vehicleList = []
                this.getVehicleList()
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
  },

  bindTouchStart(e) {
    this.data.startTime = e.timeStamp
  },

  bindTouchEnd(e) {
    this.data.endTime = e.timeStamp
  },

  // 上拉加载
  onReachBottom() {
    if (this.data.hasMoreData) {
      this.data.page = this.data.page + 1
      this.getVehicleList()
    }
  },

  // 下拉刷新方法
  onPullDownRefresh() {
    this.setData({
      isRefresh: true,
      marginTop: 0
    })
    this.data.vehicleList = []
    this.data.page = 1
    this.getVehicleList()
  }
})