// 自定义模块列表
var app = getApp()
import {
  IndexModel
} from '../models/index.js'

var indexModel = new IndexModel()
Page({
  data: {
    taskflowList: [{}],
    proportion: 80,
    noData: false
  },

  onLoad(options) {
    console.log(options)
    this.setData({
      moduleId: options.moduleId,
      moduleName: options.moduleName
    })
    wx.setNavigationBarTitle({
      title: options.moduleName
    })
  },

  onShow() {
    this.getTaskflowList()
  },

  getTaskflowList() {
    this.setData({
      spinShow: true
    })
    let params = {
      module_id: this.data.moduleId
    }
    indexModel.getTaskflowList(params, res => {
      if (res.data.status == 1) {
        if (res.data.data.data.length == 0) {
          this.setData({
            noData: true
          })
        } else {
          this.setData({
            noData: false
          })
          res.data.data.data.forEach((item, index) => {
            if (item.norm) {
              let tempArr1 = []
              item.norm.forEach((item1, index1) => {
                if (item1.record) {
                  tempArr1.push(item1)
                }
              })
              item.showType = 'norm'
              item.percentage = Math.floor(tempArr1.length / item.norm.length * 100)

              if (item.percentage == 100 && item.approval) {
                item.showType = 'approval'
                let tempArr2 = []
                item.approval.forEach((item2, index2) => {
                  if (item2.record) {
                    tempArr2.push(item2)
                  }
                  if (tempArr2.length < item.approval.length) {
                    item.approvalName = '未审批'
                  } else {
                    item.approvalName = '已审批'

                    if (item.comment) {
                      item.showType = 'comment'
                      let tempArr3 = []
                      item.comment.forEach((item3, index3) => {
                        if (item3.record) {
                          tempArr3.push(item3)
                        }
                        if (tempArr3.length < item.comment.length) {
                          item.commentName = '未评价'
                        } else {
                          item.commentName = '已评价'
                        }
                      })
                    }
                  }
                })
              }

              if (item.percentage == 100 && item.comment && !item.approval) {
                item.showType = 'comment'
                let tempArr2 = []
                item.comment.forEach((item2, index2) => {
                  if (item2.record) {
                    tempArr2.push(item2)
                  }
                  if (tempArr2.length < item.comment.length) {
                    item.commentName = '未评价'
                  } else {
                    item.commentName = '已评价'
                  }
                })
              }
            }

            if (!item.norm && item.approval) {
              let tempArr2 = []
              item.showType = 'approval'
              item.approval.forEach((item2, index2) => {
                if (item2.record) {
                  tempArr2.push(item2)
                }
                if (tempArr2.length < item.approval.length) {
                  item.approvalName = '未审批'
                } else {
                  item.approvalName = '已审批'

                  if (item.comment) {
                    let tempArr3 = []
                    item.showType = 'comment'
                    item.comment.forEach((item3, index3) => {
                      if (item3.record) {
                        tempArr3.push(item3)
                      }
                      if (tempArr3.length < item.comment.length) {
                        item.commentName = '未评价'
                      } else {
                        item.commentName = '已评价'
                      }
                    })
                  }
                }
              })
            }

            if (!item.norm && !item.approval && item.comment) {
              let tempArr3 = []
              item.showType = 'comment'
              item.comment.forEach((item3, index3) => {
                if (item3.record) {
                  tempArr3.push(item3)
                }
                if (tempArr3.length < item.comment.length) {
                  item.commentName = '未评价'
                } else {
                  item.commentName = '已评价'
                }
              })
            }
          })
        }
        this.setData({
          taskflowList: res.data.data.data,
          spinShow: false
        })
        console.log(this.data.taskflowList)
      }
    })
  },

  // 进入任务流详情
  toTaskflowDetail(e) {
    if (this.data.endTime - this.data.startTime < 350) {
      let listId = e.currentTarget.dataset.id,
        taskname = e.currentTarget.dataset.taskname
      wx.navigateTo({
        url: './taskflow-details/taskflow-details?listId=' + listId + '&taskname=' + taskname + '&moduleName=' + this.data.moduleName,
      })
    }

  },

  // 添加任务流
  addTaskflow() {
    wx.navigateTo({
      url: './add-taskflow/add-taskflow?moduleId=' + this.data.moduleId,
    })
  },

  // 删除任务流
  toDelTaskflow(e) {
    let listId = e.currentTarget.dataset.id
    // this.data.caseDelFlag = true
    wx.showModal({
      title: '提示',
      content: '是否删除该案件?',
      success: res => {
        if (res.confirm) {
          let params = {
            id: listId
          }
          // this.data.taskflowList.forEach((item, index) => {
            // if (item.id == listId) {
              // if (item.norm) {
              //   item.norm.forEach((item1, index1) => {
              //     if (item1.record) {
              //       wx.showToast({
              //         title: '案件正在进行中',
              //         icon: 'none'
              //       })
              //       this.data.caseDelFlag = false
              //       return
              //     }
              //   })
              // }
              // if (item.approval) {
              //   item.approval.forEach((item1, index1) => {
              //     if (item1.record) {
              //       wx.showToast({
              //         title: '案件正在进行中',
              //         icon: 'none'
              //       })
              //       this.data.caseDelFlag = false
              //       return
              //     }
              //   })
              // }
              // if (item.comment) {
              //   item.comment.forEach((item1, index1) => {
              //     if (item1.record) {
              //       wx.showToast({
              //         title: '案件正在进行中',
              //         icon: 'none'
              //       })
              //       this.data.caseDelFlag = false
              //       return
              //     }
              //   })
              // }
            // }
          // })

            indexModel.delTaskflow(params, res=> {
              if (res.data.status == 1) {
                wx.showToast({
                  title: '删除成功',
                })
                this.getTaskflowList()
              } else {
                if (res.data.msg.match('Token')) {} else {
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
  }
})