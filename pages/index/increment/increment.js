// 增值服务
import {
  IndexModel
} from '../models/index.js'

var indexModel = new IndexModel()
Page({
  data: {
    incrementList: [],
    page: 1,
    pageSize: 15,
    noData: false,
  },

  onLoad(options) {
    this.data.moduleId = options.moduleId
    // 获取增值服务列表
    this.getIncrementList()
  },

  onShow() {
    // this.setData({
    //   page: 1,
    //   incrementList: []
    // })
    // this.getIncrementList()
  },

  getIncrementList() {
    let params = {
      key: 'added',
      page: this.data.page
    }
    indexModel.getWorkList(params, res => {
      let incrementList = this.data.incrementList
      let incrementInfo = res.data.data.data
      if (res.data.status == 1) {
        if (this.data.page == 1 && res.data.data.data.length == 0) {
          this.setData({
            noData: true
          })
        } else {
          if (incrementInfo.length < this.data.pageSize) {
            this.setData({
              incrementInfo: incrementInfo,
              incrementList: incrementList.concat(incrementInfo),
              hasMoreData: false
            })
          } else {
            this.setData({
              incrementInfo: incrementInfo,
              incrementList: incrementList.concat(incrementInfo),
              hasMoreData: true
            })
          }
          this.setData({
            noData: false
          })
        }
      }
    })
  },

  // 上拉加载
  onReachBottom() {
    if (this.data.hasMoreData) {
      this.data.page = this.data.page + 1
      this.getIncrementList()
    }
  },

  toIncrementDetails(e) {
    if (this.data.endTime - this.data.startTime < 350) {
      let id = e.currentTarget.dataset.id,
        status = e.currentTarget.dataset.status
      wx.navigateTo({
        url: './increment-details/increment-details?listId=' + id + '&status=' + status,
      })
    }
  },

  // 删除增值服务
  toDelIncrement(e) {
    let listId = e.currentTarget.dataset.id
    wx.showModal({
      title: '提示',
      content: '是否删除该案件?',
      success: res => {
        if (res.confirm) {
          let params = {
            id: listId
          }
          indexModel.delIncrement(params, res => {
            if (res.data.status == 1) {
              wx.showToast({
                title: '删除成功',
              })
              this.setData({
                incrementList: [],
                page: 1,
              })
              this.getIncrementList()
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
  },

  bindTouchStart(e) {
    this.data.startTime = e.timeStamp
  },

  bindTouchEnd(e) {
    this.data.endTime = e.timeStamp
  },

  // 搜索业务
  search() {

  }
})