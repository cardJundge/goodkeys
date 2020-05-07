// 车物调查详情
import {
  PersonnelModel
} from '../../../personnel/models/personnel.js'
import {
  IndexModel
} from '../../models/index.js'
var app = getApp()

var personnelModel = new PersonnelModel()
var indexModel = new IndexModel()
Page({
  data: {
    isShowExamine: false,
    diseaseStep: ['全部任务', '基本信息', '相关资料', '调查结论'],
    first: 0,
    currentTab: 0,
    taskList: [], //任务列表
    titleShow: false,
    compensationshow: false,
    compensationList: ['正常赔付', '拒绝处理', '减损处理', '其他'],
    compensationName: '',
    reportList: ['是', '否'],
    reportName: '',
    turnIn: false,
    turnOut: false,
    turnInFirst: false,
    visible: false,
    actions: [{
        name: '退回',
      },
      {
        name: '接单',
        color: '#1a65ff'
      }
    ],
  },

  onLoad: function(options) {
    this.data.listId = options.listId
    this.setData({
      imgUrl: app.globalData.imgUrl,
      serviceId: app.globalData.userInfo.id
    })
    this.getVehicleDetails(res => {
      if (res) {
        if (this.data.vehicleList.reject && this.data.vehicleList.status == 2) {
          let str = this.data.vehicleList.reject.reason.replace(/↵/g, "\n")
          this.setData({
            isShowExamine: true,
            prompt: true,
            caseRejectReason: str
          })
          
        }
      }
    })
  },

  onShow: function() {
    this.setData({
      isToComplete: false
    })
    this.getVehicleDetails(res => {})
    this.getModuleUnion()
  },


  // 获取当前模块下是否有联盟
  getModuleUnion() {
    let params = {
      key: 'traffic',
      module: '车物调查'
    }
    indexModel.getModuleUnion(params, res => {
      console.log(res)
      if (res.data.status == 1) {
        if (res.data.data.length == 0) {
          this.setData({
            isShowTransfer: false
          })
        } else if (res.data.data.length == 1) {
          if (res.data.data[0].service.length < 2) {
            this.setData({
              isShowTransfer: false
            })
          } else {
            this.setData({
              isShowTransfer: true
            })
          }
        } else {
          this.setData({
            isShowTransfer: true
          })
        }
      }
    })
  },

  // 获取作业员信息
  getPersonnelList() {
    let params = {}
    personnelModel.getTaskList(params, res => {
      if (res.data.status == 1) {
        res.data.data.forEach((item, index) => {
          if (item.id == this.data.vehicleList.task_id) {
            this.setData({
              personName: item.nickname,
              personMobile: item.mobile
            })
          }
        })
      }
    })
  },

  // 获取车物调查详情
  getVehicleDetails(callback) {
    let key = 'traffic'
    let id = this.data.listId
    let type = 9
    indexModel.getBusinessDetail(key, id, type, res => {
      if (res.data.status == 1) {
        this.setData({
          vehicleList: res.data.data,
          taskList: res.data.trafficTask,
          spinShow: false
        })
        this.data.taskList.forEach((item, index) => {
          if (item.status == 0) {
            this.setData({
              isToComplete: true
            })
          }
        })
        // ********************************************************
        // ！=转出 ==转入
        if (this.data.vehicleList.turn_service_id && (this.data.vehicleList.turn_service_id != this.data.serviceId)) {
          this.setData({
            turnOut: true
          })
        }
        if (this.data.vehicleList.turn_service_id && (this.data.vehicleList.turn_service_id == this.data.serviceId) && this.data.vehicleList.status == 100) {
          this.setData({
            turnInFirst: true,
            visible: true
          })
          this.getTransferOrderDetail()
        }
        if (this.data.vehicleList.turn_service_id && (this.data.vehicleList.turn_service_id == this.data.serviceId)) {
          this.setData({
            turnIn: true
          })
        }
        // ***********************************************************
        this.getPersonnelList()
        this.getVehicleData()
        callback(true)
      }
    })
  },

  // 获取转单详情
  getTransferOrderDetail() {
    let params = {
      id: this.data.vehicleList.report_no
    }
    indexModel.getTransferOrderDetail(params, res => {
      if (res.data.status == 1) {
        this.setData({
          transferOrderDetail: res.data.data
        })
      }
    })
  },

  // 转入的单退回
  toSendBack() {
    wx.showLoading({
      title: '退回中...',
    })
    let params = {
      key: 'traffic',
      id: this.data.listId
    }
    indexModel.backOrder(params, res => {
      if (res.data.status == 1) {
        wx.showToast({
          title: '退回成功',
        })
        wx.navigateBack({
          delta: 1
        })
      }
    })
  },

  // 转入的单接单
  toReceipt() {
    wx.showLoading({
      title: '接单中...',
    })
    let key = 'traffic'
    let id = this.data.listId
    indexModel.businessReceipt(id, key, res => {
      if (res.data.status == 1) {
        wx.showToast({
          title: '接单成功',
        })
        this.getVehicleDetails(res => {})
        this.setData({
          turnInFirst: false
        })
        // this.toScene()
      } else {
        if (res.data.msg.match('Token')) {} else {
          wx.showToast({
            title: res.data.msg ? res.data.msg : '请求超时',
            icon: 'none'
          })
        }
      }
    })
  },


  modalClick({
    detail
  }) {
    const index = detail.index

    if (index === 0) {
      this.toSendBack()
    } else if (index === 1) {
      this.toReceipt()
    }

    this.setData({
      visible: false
    })
  },

  modalCancel() {
    this.setData({
      visible: false
    })
  },

  // 获取疾病调查相关资料
  getVehicleData() {
    let params = {
      listId: this.data.listId,
      type: 1
    }
    indexModel.getRelatedData(params, res => {
      if (res.data.status == 1) {
        if (res.data.data.length != 0) {
          res.data.data.forEach((item, index) => {
            if (item.picture) {
              item.picture = item.picture.split(',')
            }
          })
        }
        this.setData({
          vehicleData: res.data.data
        })
      }
    })
  },

  //头部选择
  selectDiseaseStep(e) {
    this.setData({
      first: e.currentTarget.id
    })
  },

  //添加任务
  toAddTask() {
    this.setData({
      titleShow: true
    })
  },

  //组件返回的添加任务内容
  getTasksList(e) {
    let params = {
      title: e.detail.title,
      address: e.detail.address,
      traffic_id: this.data.listId
    }
    indexModel.addTask(params, res => {
      if (res.data.status == 1) {
        this.getVehicleDetails(res => {})
      }
    })
  },

  //任务详情
  toTaskDetail(e) {
    let vehId = this.data.listId
    let vehTaskId = e.currentTarget.dataset.vehtaskid
    let vehTaskStatus = e.currentTarget.dataset.status
    let vehCaseStatus = e.currentTarget.dataset.casestatus
    let vehName = e.currentTarget.dataset.name
    wx.navigateTo({
      url: '../task-details/task-details?vehId=' + vehId + '&vehTaskId=' + vehTaskId + '&vehName=' + vehName + '&personName=' + this.data.personName + '&vehTaskStatus=' + vehTaskStatus + '&vehCaseStatus=' + vehCaseStatus,
    })
  },

  //选择赔付意见
  compensationChange(e) {
    this.setData({
      compensationName: this.data.compensationList[e.detail.value]
    })
  },

  // 选择是否举报
  reportChange(e) {
    this.setData({
      reportName: this.data.reportList[e.detail.value]
    })
  },

  // 转单
  toChangeOrder() {
    wx.navigateTo({
      url: '../../transfer/company/company?moduleType=' + '车物调查' + '&businessNo=' + this.data.vehicleList.report_no + '&moduleName=' + 'traffic' + '&businessId=' + this.data.listId
    })
  },

  // get公司调查费用
  getFeeInput(e) {
    this.data.conclusionFee = e.detail.value
  },

  // get备注
  getRemarkInput(e) {
    this.data.conclusionRemark = e.detail.value
  },

  // 提交调查结论
  submitConclusion() {
    if (this.data.isToComplete) {
      return wx.showToast({
        title: '案件中有未完成的任务',
        icon: 'none'
      })
    }
    if (!this.data.compensationName) {
      return wx.showToast({
        title: '请选择赔付意见',
        icon: 'none'
      })
    }
    if (!this.data.reportName) {
      return wx.showToast({
        title: '请选择是否举报/协助案件',
        icon: 'none'
      })
    }
    if (!this.data.conclusionFee) {
      return wx.showToast({
        title: '请输入公司调查费用',
        icon: 'none'
      })
    }
    let params = {
      pay_opinion: this.data.compensationName,
      assist_case: this.data.reportName,
      survey_fee: this.data.conclusionFee,
      remark: this.data.conclusionRemark,
      id: this.data.listId
    }
    indexModel.submitConclusion(params, res => {
      if (res.data.status == 1) {
        wx.showToast({
          title: '提交成功',
        })
        this.getVehicleDetails(res => {})
      }
    })
  },

  // 分配作业员
  toAssignment() {
    wx.navigateTo({
      url: '../../../personnel/assignment/assignment?listId=' + this.data.listId + '&keyName=' + 'traffic',
    })
  },

  //打电话
  phoneCall(e) {
    wx.getSystemInfo({
      success: res => {
        console.log(res)
        if (res.platform == 'ios') {
          wx.makePhoneCall({
            phoneNumber: e.currentTarget.dataset.phone,
            success: res => {

            }
          })
        } else if (res.platform == 'android') {
          wx.showModal({
            title: '提示',
            content: e.currentTarget.dataset.phone,
            confirmText: "呼叫",
            success: res => {
              if (res.confirm) {
                wx.makePhoneCall({
                  phoneNumber: e.currentTarget.dataset.phone,
                  success: res => {

                  }
                })
              }
            }
          })
        }
      }
    })
  },

  // 添加相关资料
  toAddInformation() {
    wx.navigateTo({
      url: '../add-information/add-information?vehicleId=' + this.data.listId,
    })
  },

  // 相关资料预览
  previewImage(e) {
    let imgArr = []
    let imgIndex = e.currentTarget.dataset.index
    let listId = e.currentTarget.dataset.id
    this.data.vehicleData[listId].picture.forEach((item, index) => {
      imgArr.push(this.data.imgUrl + item)
    })
    wx.previewImage({
      urls: imgArr,
      current: imgArr[imgIndex]
    })
    // console.log(imgArr, imgArr[imgIndex])
  },

  openfile(e) {   
    let  filesrc  =  e.currentTarget.dataset.src    
    wx.downloadFile({
      url: this.data.imgUrl + filesrc,
      success: res =>  {
        const  filePath  =  res.tempFilePath
        wx.openDocument({          
          filePath: filePath,
          success: res1 =>  {
            // console.log('打开成功')    
          }        
        })      
      }    
    })  
  },

  // 审核被拒绝
  rejectEvent(e) {
    let params = {
      case_id: this.data.vehicleList.id,
      key: 'traffic',
      reason: e.detail.reason,
      status: 2
    }
    this.caseExamine(params)
  },

  // 审核被通过
  confirmEvent(e) {
    let params = {
      case_id: this.data.vehicleList.id,
      key: 'traffic',
      reason: e.detail.reason,
      status: 4
    }
    this.caseExamine(params)
  },

  // 审核
  toExamine() {
    this.setData({
      isShowExamine: true,
      prompt: false
    })
  },

  // 审核接口
  caseExamine(params) {
    indexModel.taskCaseReturn(params, res => {
      this.getVehicleDetails(res => {})
    })
  }

})