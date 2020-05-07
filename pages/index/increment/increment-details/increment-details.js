// 增值服务-详情
import {
  IndexModel
} from '../../models/index.js'

var indexModel = new IndexModel()
Page({
  data: {
    tabList: ['增值服务包'],
    isActive: 0,
    hasPackage: false
  },

  onLoad(options) {
    console.log(options)
    this.data.listId = options.listId
    this.data.listStatus = options.status
    // 获取增值服务详情
    this.getIncrementDetails()
    if (this.data.listStatus == '1') {
      this.setData({
        hasPackage: true
      })
    } else {
      this.setData({
        hasPackage: false
      })
    }
  },

  getIncrementDetails() {
    let params = {
      id: this.data.listId
    }
    indexModel.getAddedInfo(params, res => {
      if (res.data.status == 1) {
        this.setData({
          incrementDetails: res.data.data
        })
        if (this.data.incrementDetails.project) {
          indexModel.getAllAddedList(res1 => {
            if (res.data.status == 1) {
              this.data.classifyList = res1.data.data
              let tempVal = [], tempKey = []
              tempKey = Object.keys(this.data.incrementDetails.project)
              tempVal = Object.values(this.data.incrementDetails.project)
              tempVal.forEach((item, index) => {
                item.id = tempKey[index]
                this.data.classifyList.forEach((item1, index1) => {
                  if (item.id == item1.id) {
                    item.name = item1.name
                  }
                })
              })
              this.setData({
                projectList: tempVal
              })
            }
          })
        }
      }
    })
  },

  // 增值服务包使用详情
  toPackDetails(e) {
    let userId = e.currentTarget.dataset.user,
      classifyId = e.currentTarget.dataset.classify,
      policyId = e.currentTarget.dataset.policy,
      classifyName = e.currentTarget.dataset.name
    wx.navigateTo({
      url: './pack-details/pack-details?userId=' + userId + '&classifyId=' + classifyId + '&policyId=' + policyId + '&classifyName=' + classifyName,
    })
  }
})