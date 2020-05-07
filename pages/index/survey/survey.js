// 查勘定损
import {
  IndexModel
} from '../models/index.js'

var indexModel = new IndexModel()
var app = getApp()
Page({
  data: {
    // key: 'survey',
    selected: 1,
    page: 1,
    pageSize: 15,
    hasNoData: false,
    statusList: [{
        name: '全部案件',
        id: 1
      },
      {
        name: '查勘',
        id: 2
      },
      {
        name: '定损',
        id: 3
      },
      {
        name: '转单',
        id: 4
      }
    ],
  },
  onLoad(options) {
    this.setData({
      serviceId: app.globalData.userInfo.id
    })
  },
  onShow() {
    this.setData({
      businessList: [],
      page: 1,
      spinShow: true,
      selected: 1
    })
    this.getBusinessList()
    // this.selectComponent("#businessListId").getBusinessList()
  },

  changeStatus(e) {
    this.setData({
      selected: e.target.dataset.index
    })
    let tempList = []
    if (this.data.selected === 1) {
      tempList = this.data.businessTempList
      if (this.data.businessInfo.length >= this.data.pageSize) {
        this.setData({
          hasMoreData: true
        })
      } else {
        this.setData({
          hasMoreData: false
        })
      }
    } else {
      this.setData({
        hasMoreData: false
      })
      if (this.data.selected === 2) {
        this.data.businessTempList.forEach((item, index) => {
          if (item.type == 0) {
            tempList.push(item)
          }
        })
      } else if (this.data.selected === 3) {
        this.data.businessTempList.forEach((item, index) => {
          if (item.type == 1 || item.type == 2) {
            tempList.push(item)
          }
        })
      } else if (this.data.selected === 4) {
        this.data.businessTempList.forEach((item, index) => {
          if (item.turn_service_id) {
            tempList.push(item)
          }
        })
      }
    }

    this.setData({
      businessList: tempList
    })
  },
  getBusinessList() {
    this.data.businessList = []
    let params = {
      key: 'survey',
      page: this.data.page,
      keywords: this.data.keywords ? this.data.keywords : ''
    }
    indexModel.getWorkList(params, res => {
      if (res.data.status == 1) {
        let businessList = this.data.businessList
        let businessInfo = res.data.data.data
        if (this.data.page == 1 && businessInfo.length == 0) {
          return this.setData({
            hasNoData: true,
            spinShow: false,
          })
        }
        this.setData({
          hasNoData: false,
          spinShow: false,
        })

        if (businessInfo.length < this.data.pageSize) {
          this.setData({
            businessInfo: businessInfo,
            businessList: businessList.concat(businessInfo),
            hasMoreData: false
          })
        } else {
          this.setData({
            businessInfo: businessInfo,
            businessList: businessList.concat(businessInfo),
            hasMoreData: true
          })
        }
        this.data.businessTempList = this.data.businessList
        console.log(this.data.businessTempList)
      } else {
        this.setData({
          hasNoData: true
        })
        if (res.data.msg.match('Token已过期或失效')) {} else {
          wx.showToast({
            title: res.data.msg ? res.data.msg : '请求超时',
            icon: 'none'
          })
        }
      }
    })
  },

  toBusinessDetail(e) {
    wx.navigateTo({
      url: './survey-details/survey-details?listId=' + e.currentTarget.dataset.listid
    })
  },

  addBusiness() {
    wx.navigateTo({
      url: './add-survey/add-survey'
    })
  },

  getMoreData() {
    this.setData({
      page: this.data.page + 1
    })
    this.getBusinessList()
  },

  // 搜索
  search(e) {
    if (this.data.selected != 1) {
      this.setData({
        selected: 1
      })
    }
    this.data.keywords = e.detail.value
    this.getBusinessList()
  }

})