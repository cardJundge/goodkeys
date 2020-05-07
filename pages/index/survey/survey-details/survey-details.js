// 查勘定损详情
var app = getApp()
import {
  IndexModel
} from '../../models/index.js'

var indexModel = new IndexModel()
Page({
  data: {
    // isJobNo: false,
    isSurveyTime: false, // 查勘日期(平安有)
    isDispatchedWorkers: true, // 派工人(太平、平安没有)
    isDispatchingTime: true, // 派工时间（太平没有)
    isReportTime: false, // 报案时间(太平有)
    isFixedLossAdd: false, //出险/定损地点(太平、平安有)
    isreportType: false, //案件类型（太平有）
    isRegion: true, // 区域（太平没有）
    isTimeSlot: false, // 派工时间段(平安有)
    isPolicyNo: true, // 保单号(平安、太平没有)
    isPolicyMechanism: true, // 承保机构（平安、太平没有）
    // --------------------------------------------------
    surveyList: [],
    showBottomOperation: false,
    showQrCode: false,
    serviceOperation: false,
    steps: [],
    detailed: [], //人车合一
    showDetailed: false,
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
    turnOut: false, //是否转出
    turnIn: false, //是否转入的订单
    turnInFirst: false //是否是第一次转入
  },
  onLoad: function(options) {
    this.setData({
      imgUrl: app.globalData.imgUrl,
      serviceId: app.globalData.userInfo.id
    })
    this.data.listId = options.listId
  },

  onShow() {
    this.getDetails()
    this.getModuleUnion()
  },

  // 获取当前模块下是否有联盟
  getModuleUnion() {
    let params = {
      key: 'survey',
      module: '查勘定损'
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
 
  // 查勘定损详情请求
  getDetails() {
    let key = 'survey'
    let id = 1
    let steps = []
    let ckzp01 = { title: '', picture: [] }, // 人车合一
        ckzp02 = { title: '', picture: [] }, //车架号
        ckzp03 = { title: '', picture: [] }, // 环境照片
        ckzp04 = { title: '', picture: [] }, // 验车照片
        ckzp05 = { title: '', picture: [] }, // 车损照片
        ckzp06 = { title: '', picture: [] }, // 旧伤确认
        gydz01 = { title: '', picture: [] }, // 事故证明
        gydz02 = { title: '', picture: [] }, // 索赔申请书
        gydz03 = { title: '', picture: [] }, // 行驶证
        gydz04 = { title: '', picture: [] }, // 驾驶证
        gydz05 = { title: '', picture: [] }, // 查看报告
        gydz06 = { title: '', picture: [] }, // 个案签报
        gydz07 = { title: '', picture: [] }, // 拒赔材料
        gydz08 = { title: '', picture: [] }, // 从民资格证
        gydz09 = { title: '', picture: [] }, // 法院判决书
        gydz10 = { title: '', picture: [] }, // 调查单证
        zfdz01 = { title: '', picture: [] }, // 收款方账户信息
        zfdz02 = { title: '', picture: [] } // 收款方身份证明
    this.data.detailed = []
    indexModel.getBusinessDetail(key, this.data.listId, id, res => {
      if (res.data.status == 1) {
        this.setData({
          surveyList: res.data.data,
          schedule: res.data.schedule.reverse()
        })
        // ********************************************************
        // ！=转出 ==转入
        if (this.data.surveyList.turn_service_id && (this.data.surveyList.turn_service_id != this.data.serviceId)) {
          this.setData({
            turnOut: true
          })
        } 
        if (this.data.surveyList.turn_service_id && (this.data.surveyList.turn_service_id == this.data.serviceId) && this.data.surveyList.status == 100) {
          this.setData({
            turnInFirst: true,
            visible: true
          })
          this.getTransferOrderDetail()
        }
        if (this.data.surveyList.turn_service_id && (this.data.surveyList.turn_service_id == this.data.serviceId)) {
          this.setData({
            turnIn: true
          })
        }
        // ***********************************************************
        res.data.schedule.forEach((item, index) => {
          if (item.title.match('接单') || item.title.match('到达现场') || item.title.match('分配') || item.title.match('完成')) {
            steps.push(item)
            this.setData({
              steps: steps
            })
          }

          // 明细        
          if (item.title.match('人车合一')) {
            ckzp01.title = item.title
            ckzp01.picture.push(item.picture.ckzp)                  
          } else if (item.title.match('车架号')) {
            ckzp02.title = item.title
            ckzp02.picture.push(item.picture.ckzp)  
          } else if (item.title.match('环境照片')) {
            ckzp03.title = item.title
            ckzp03.picture.push(item.picture.ckzp)
          } else if (item.title.match('验车照片')) {
            ckzp04.title = item.title
            ckzp04.picture.push(item.picture.ckzp)
          } else if (item.title.match('车损照片')) {
            ckzp05.title = item.title
            ckzp05.picture.push(item.picture.ckzp)
          } else if (item.title.match('旧伤确认')) {
            ckzp06.title = item.title
            ckzp06.picture.push(item.picture.ckzp)
          } else if (item.title.match('事故证明')) {
            gydz01.title = item.title
            gydz01.picture.push(item.picture.gydz)
          } else if (item.title.match('索赔申请书')) {
            gydz02.title = item.title
            gydz02.picture.push(item.picture.gydz)
          } else if (item.title.match('行驶证')) {
            gydz03.title = item.title
            gydz03.picture.push(item.picture.gydz)
          } else if (item.title.match('驾驶证')) {
            gydz04.title = item.title
            gydz04.picture.push(item.picture.gydz)
          } else if (item.title.match('查勘报告')) {
            gydz05.title = item.title
            gydz05.picture.push(item.picture.gydz)
          } else if (item.title.match('个案签报')) {
            gydz06.title = item.title
            gydz06.picture.push(item.picture.gydz)
          } else if (item.title.match('拒赔材料')) {
            gydz07.title = item.title
            gydz07.picture.push(item.picture.gydz)
          } else if (item.title.match('从民资格证')) {
            gydz08.title = item.title
            gydz08.picture.push(item.picture.gydz)
          } else if (item.title.match('法院判决书')) {
            gydz09.title = item.title
            gydz09.picture.push(item.picture.gydz)
          } else if (item.title.match('调查单证')) {
            gydz10.title = item.title
            gydz10.picture.push(item.picture.gydz)
          } else if (item.title.match('收款方账户信息')) {
            zfdz01.title = item.title
            zfdz01.picture.push(item.picture.zfdz)
          } else if (item.title.match('收款方身份证明')) {
            zfdz02.title = item.title
            zfdz02.picture.push(item.picture.zfdz)
          }
        })
        this.data.detailed.push(ckzp01, ckzp02, ckzp03, ckzp04, ckzp05, ckzp06, gydz01, gydz02, gydz03, gydz04, gydz05, gydz06, gydz07, gydz08, gydz09, gydz10, zfdz01, zfdz02)
        this.data.detailed.forEach((item, index) => {
          if(item.picture.length !== 0) {
            this.setData({
              showDetailed: true
            })
          }
        })
        this.setData({
          detailed: this.data.detailed
        })
        res.data.schedule.forEach((item, index) => {
          if (this.data.detailed.length != 0 && item.title.match('到达现场')) {
            this.setData({
              serviceOperation: true
            })
          }
        })
      
        this.getInsuranceList()
      }
    })
  },

  // 获取转单详情
  getTransferOrderDetail() {
    let params = {
      id: this.data.surveyList.report_no
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
      key: 'survey',
      id: this.data.listId
    }
    indexModel.backOrder(params, res=> {
      if(res.data.status == 1) {
        wx.showToast({
          title: '退回成功',
        })
        wx.navigateBack({
          delta: 1
        })
      }
    })
  },

  // 接单
  toReceipt() {
    wx.showLoading({
      title: '接单中...',
    })
    let key = 'survey'
    let id = this.data.listId
    indexModel.businessReceipt(id, key, res => {
      if (res.data.status == 1) {
        wx.showToast({
          title: '接单成功',
        })
        this.getDetails()
        this.setData({
          turnInFirst: false
        })
        // this.toScene()
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

  // 添加明细分类
  detailedClassify() {
    
  },

  // 获取保险公司列表
  getInsuranceList() {
    indexModel.getInsurance(res => {
      if (res.data.status == 1) {
        res.data.data.forEach((item, index) => {
          if (this.data.surveyList.insurance_id == item.id) {
            this.data.surveyList.insuranceName = item.name
            this.setData({
              surveyList: this.data.surveyList
            })
            if (item.name == '中国平安') {
              this.setData({
                // isJobNo: true,
                isSurveyTime: true,
                isDispatchedWorkers: false,
                isDispatchingTime: true,
                isReportTime: false,
                isFixedLossAdd: true,
                isreportType: false,
                isRegion: true,
                isTimeSlot: true,
                isPolicyNo: false,
                isPolicyMechanism: false,
              })
            } else if (item.name == '中国太平') {
              this.setData({
                // isJobNo: true,
                isSurveyTime: false,
                isDispatchedWorkers: false,
                isDispatchingTime: false,
                isReportTime: true,
                isFixedLossAdd: true,
                isreportType: true,
                isRegion: false,
                isTimeSlot: false,
                isPolicyNo: false,
                isPolicyMechanism: false,
              })
            } else {
              this.setData({
                // isJobNo: false,
                isSurveyTime: false,
                isDispatchedWorkers: true,
                isDispatchingTime: true,
                isReportTime: false,
                isFixedLossAdd: false,
                isreportType: false,
                isRegion: true,
                isTimeSlot: false,
                isPolicyNo: true,
                isPolicyMechanism: true,
              })
            }
          }
        })
      }
    })
  },

  // 更多操作
  operation() {
    this.setData({
      showBottomOperation: true
    })
  },

  // 出现二维码格式
  showQrCode() {
    this.generateQrCode()
    this.setData({
      showQrCode: true,
    })
  },

  // 生成评价二维码
  generateQrCode() {
    wx.request({
      url: app.globalData.hostName + '/api/auth/QRCode',
      method: 'GET',
      header: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + app.globalData.userInfo.api_token 
      }, // 默认值
      data: {
        id: this.data.listId
      },
      responseType: 'arraybuffer',
      success: (res)=> {      
        this.setData({
          qrImg: wx.arrayBufferToBase64(res.data)
        })
      }
    })
  },

  // 去分配作业员
  toAssignmentTask() {
    wx.navigateTo({
      url: '../../../personnel/assignment/assignment?listId=' + this.data.listId + '&keyName=' + 'survey',
    })
  },

  // 到达现场
  toScene() {
    wx.showLoading({
      title: '加载中...',
    })
    let params = {
      key: 'survey',
      id: this.data.listId
    }
    indexModel.toScene(params, res=> {
      if(res.data.status == 1) {
        this.getDetails()
        this.toAddDetails()
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

  // 结案
  toFinishCase() {
    wx.showLoading({
      title: '结案中...',
    })
    let params = {
      key: 'survey',
      id: this.data.listId
    }
    indexModel.finishCase(params, res=> {
      if(res.data.status == 1) {
        this.getDetails()
      }else {
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

  // 转单
  toChangeOrder() {
    wx.navigateTo({
      url: '../../transfer/company/company?moduleType=' + '查勘定损' + '&businessNo=' + this.data.surveyList.report_no + '&moduleName=' + 'survey' + '&businessId=' + this.data.listId
    })
  },

  // 操作---》编辑案件
  editEvent() {
    this.setData({
      showBottomOperation: false
    })
    let data = JSON.stringify(this.data.surveyList)
    wx.navigateTo({
      url: '../add-survey/add-survey?data=' + data,
    })
  },

  // 操作---->删除案件
  delEvent() {
    wx.showModal({
      title: '提示',
      content: '确定删除该案件吗？',
      success: res=> {
        if(res.confirm) {
          let params = {
            key: 'survey',
            id: this.data.listId
          }
          indexModel.delBusiness(params, res=> {
            if(res.data.status == 1) {
              this.setData({
                showBottomOperation: false
              })
              wx.navigateBack({
                delta: 1
              }) 
            }else {
              if (res.data.msg.match('Token已过期或失效')) {
              } else {
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

  // 添加进度
  toAddDetails() {
    wx.navigateTo({
      url: '../add-detailed/add-detailed?id=' + this.data.listId,
    })
  },

  // 图片预览
  previewImg(e) {
    console.log(e.currentTarget.dataset.srclist)
    let imgArr = []
    let imgIndex = e.currentTarget.dataset.index
    let pictures = e.currentTarget.dataset.srclist
    pictures.forEach((item, index) => {
      imgArr.push(this.data.imgUrl + item)
    })
    wx.previewImage({
      urls: imgArr,
      current: imgArr[imgIndex]
    })
  }

})