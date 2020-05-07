// 疾病调查详情
var imgId = 0
const recorderManager = wx.getRecorderManager()
import {
  IndexModel
} from '../../models/index.js'
import {
  PersonnelModel
} from '../../../personnel/models/personnel.js'
var app = getApp()

var personnelModel = new PersonnelModel()
var indexModel = new IndexModel()
const myAudio = wx.createInnerAudioContext()
myAudio.obeyMuteSwitch = false  // 是否遵循系统静音开关,当此参数为 false 时，即使用户打开了静音开关，也能继续发出声音
Page({
  data: {
    first: 0,
    diseaseStep: ['全部任务', '基本信息', '相关资料'],
    diseaseList: [],
    baseTitle: ['患者成员信息', '申请人信息'],
    currentTab: 0,
    voiceDataList: [''],
    giveup: true,
    giveupresult: '',
    voiceIsshow: false,
    voicetext: "长按录音",
    fileNameTemp: '',
    turnOut: false, //是否转出
    turnIn: false, //是否转入的订单
    visible: false,
    actions: [
      {
        name: '退回',
      },
      {
        name: '接单',
        color: '#1a65ff'
      }
    ],
  },


  onLoad(options) {
    console.log(options)
    this.data.listId = options.listId
    this.setData({
      imgUrl: app.globalData.imgUrl,
      serviceId: app.globalData.userInfo.id
    })
  },

  onShow() {
    this.getSickDetailsList()
    this.getModuleUnion()
  },

  // 获取当前模块下是否有联盟
  getModuleUnion() {
    let params = {
      key: 'sickness',
      module: '疾病调查'
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

  getSickDetailsList() {
    let key = 'sickness'
    let id = this.data.listId
    let type = 8
    indexModel.getBusinessDetail(key, id, type, res => {
      if(res.data.status == 1) {
        this.setData({
          diseaseList: res.data.data
        })
        res.data.sickTask.forEach((item, index) => {
          item.area = item.area.split('市')
        })
        // ********************************************************
        // ！=转出 ==转入
        if (this.data.diseaseList.turn_service_id && (this.data.diseaseList.turn_service_id != this.data.serviceId)) {
          this.setData({
            turnOut: true
          })
        }
        if (this.data.diseaseList.turn_service_id && (this.data.diseaseList.turn_service_id == this.data.serviceId) && this.data.diseaseList.status == 100) {
          this.setData({
            visible: true
          })
          this.getTransferOrderDetail()
        }
        if (this.data.diseaseList.turn_service_id && (this.data.diseaseList.turn_service_id == this.data.serviceId)) {
          this.setData({
            turnIn: true
          })
        }
        // ***********************************************************
        // console.log(res.data.sickTask)
        this.data.sickTaskList = res.data.sickTask
        
        // if (this.data.diseaseList.suspects) {
        //   var doubt = JSON.parse(this.data.diseaseList.suspects)
        //   // console.log(doubt)
        //   doubt.forEach((item, index) => {
        //     this.data.doubttext += (',' + item)
        //   })
        //   this.setData({
        //     doubttext: this.data.doubttext.substring(1)
        //   })
        // }
        this.getTaskList()
        this.getSicknessData()
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

  // 转入的单退回
  toSendBack() {
    wx.showLoading({
      title: '退回中...',
    })
    let params = {
      key: 'sickness',
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

  // 获取转单详情
  getTransferOrderDetail() {
    let params = {
      id: this.data.diseaseList.report_no
    }
    indexModel.getTransferOrderDetail(params, res => {
      if (res.data.status == 1) {
        this.setData({
          transferOrderDetail: res.data.data
        })
      }
    })
  },

  // 转入的单是否接单
  toReceipt() {
    wx.showLoading({
      title: '接单中...',
    })
    let key = 'sickness'
    let id = this.data.listId
    indexModel.businessReceipt(id, key, res => {
      if (res.data.status == 1) {
        wx.showToast({
          title: '接单成功',
        })
        this.getSickDetailsList()
        // this.toScene()
      } else {
        if (res.data.msg.match('Token')) {
        } else {
          wx.showToast({
            title: res.data.msg ? res.data.msg : '请求超时',
            icon: 'none'
          })
        }
      }
    })
  },

  modalClick({ detail }) {
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

  // 获取作业员信息
  getTaskList() {
    let params = {}
    personnelModel.getTaskList(params, res=> {
      if(res.data.status == 1) {
        this.data.sickTaskList.forEach((taskitem, taskindex) => {
          res.data.data.forEach((item, index) => {
            if (item.id == taskitem.task_id) {
              taskitem.taskname = item.nickname
              taskitem.taskmobile = item.mobile
            }
          })
        })
        console.log(this.data.sickTaskList)
        this.setData({
          sickTaskList: this.data.sickTaskList
        })
      }
    })
  },

  // 获取疾病调查相关资料
  getSicknessData() {
    let params = {
      listId: this.data.listId,
      type: 0
    }
    indexModel.getRelatedData(params, res=> {
      if(res.data.status == 1) {
        res.data.data.forEach((item, index) => {
            item.picture = item.picture.split(',')
        })
        this.setData({
          sicknessData: res.data.data
        })
        console.log(this.data.sicknessData)
      }
    })
  },

  // 去到任务详情
  toDetail(e) {
    console.log(e)
    let stId = e.currentTarget.dataset.id
    let sicknessTaskId = e.currentTarget.dataset.sickid
    let stName = e.currentTarget.dataset.name
    wx.navigateTo({
      url: '../task-details/task-details?stId=' + stId + '&sicknessTaskId=' + sicknessTaskId + '&stName=' + stName,
    })
  },

  // 转单
  toChangeOrder() {
    wx.navigateTo({
      url: '../../transfer/company/company?moduleType=' + '疾病调查' + '&businessNo=' + this.data.diseaseList.report_no + '&moduleName=' + 'sickness' + '&businessId=' + this.data.listId
    })
  },

  //顶部选项卡
  selectDiseaseStep(e) {
    this.setData({
      first: e.currentTarget.id
    })
  },

  //基本资料选项卡
  switchnav(e) {
    this.setData({
      currentTab: e.currentTarget.dataset.index
    })
  },

  //语音模块显示
  openvoice() {
   this.setData({
      voiceIsshow: true
    })
  },

  // 电话拨打
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

  previewImage(e) {
    let imgArr = []
    let imgIndex = e.currentTarget.dataset.index
    let listId = e.currentTarget.dataset.id
    this.data.sicknessData[listId].picture.forEach((item, index) => {
      imgArr.push(this.data.imgUrl + item)
    })
    wx.previewImage({
      urls: imgArr,
      current: imgArr[imgIndex]
    })
    console.log(imgArr, imgArr[imgIndex])
  }
})