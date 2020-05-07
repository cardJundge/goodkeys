// 疾病调查
import {
  IndexModel
} from '../models/index.js'

var indexModel = new IndexModel()
var app = getApp()
Page({
  data: {
   sickList: [],
   statusList: [
     { name: '全部案件', id: 1},
     { name: '待审核', id: 2 },
     { name: '预结案', id: 3 },
     { name: '已结案', id: 4 },
     { name: '转单', id: 5 }
   ],
   selected: 1,
   page: 1,
   pageSize: 15,
   hasNoData: false,
   navScrollLeft: 0
  },
  onLoad: function (options) {
    this.setData({
      serviceId: app.globalData.userInfo.id
    })
  },

  onShow() {
    this.setData({
      sickList: [],
      page: 1,
      spinShow: true,
      selected: 1
    })
    this.getSickList()
  },

  // 获取疾病调查列表
  getSickList() {
  this.data.sickList = []
   let params = {
     key: 'sickness',
     page: this.data.page,
     keywords: this.data.keywords ? this.data.keywords: ''
   }
    indexModel.getWorkList(params, res=> {
      let sickList = this.data.sickList
      let sickInfo = res.data.data.data
      if(res.data.status == 1) {
        res.data.data.data.forEach((item, index) => {
          item.sick_address = item.sick_address?item.sick_address.substring(0, 3): ''
        })
        if (this.data.page == 1 && sickInfo.length == 0) {
          return this.setData({
            hasNoData: true,
            spinShow: false
          })
        }
        this.setData({
          hasNoData: false,
          spinShow: false
        })
        if (sickInfo.length < this.data.pageSize) { 
          this.setData({
            sickInfo: sickInfo,
            sickList: sickList.concat(sickInfo),
            hasMoreData: false
          })
        } else {
          this.setData({
            sickInfo: sickInfo,
            sickList: sickList.concat(sickInfo),
            hasMoreData: true
          })
        }
        this.data.sickTempList = this.data.sickList
        
      } else {
        this.setData({
          hasNoData: true
        })
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

  getMoreData() {
    this.setData({
      page: this.data.page + 1
    })
    this.getSickList()
  },

  changeStatus(e) {
    this.setData({
      selected: e.target.dataset.index
    })
    // console.log(this.data.selected)
    let tempList = []
    if (this.data.selected === 1) {
      this.setData({
        navScrollLeft: 0
      })
      tempList = this.data.sickTempList
      if (this.data.sickInfo.length >= this.data.pageSize) {
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
        this.data.sickTempList.forEach((item, index) => {
          if (item.status == 0) {
            tempList.push(item)
          }
        })    
      } else if (this.data.selected === 3) {
        this.data.sickTempList.forEach((item, index) => {
          if (item.status == 1) {
            tempList.push(item)
          }
        })
      } else if (this.data.selected === 4) {
        this.data.sickTempList.forEach((item, index) => {
          if (item.status == 2) {
            tempList.push(item)
          }
        })
      } else if (this.data.selected === 5) {
        this.setData({
          navScrollLeft: 400
        })
        this.data.sickTempList.forEach((item, index) => {
          if (item.turn_service_id) {
            tempList.push(item)
          }
        })
      }
    }
    this.setData({
      sickList: tempList
    })
  },

  toSicknessDetails(e) {
    // console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: './sickness-details/sickness-details?listId=' + e.currentTarget.dataset.id,
    })
  },

  // 搜索
  search(e) {
    if (this.data.selected != 1) {
      this.setData({
        selected: 1
      })
    }
    this.data.keywords = e.detail.value
    this.getSickList()
  }
})