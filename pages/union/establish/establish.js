// 创建联盟
import {
  UnionModel
} from '../models/union.js'
import {
  IndexModel
} from '../../index/models/index.js'
import {
  PersonnelModel
} from '../../personnel/models/personnel.js'

var personnelModel = new PersonnelModel()
var indexModel = new IndexModel()
var unionModel = new UnionModel()
var app = getApp()
Page({
  data: {
    moduleArray: [],
    bottomSpin: true,
    isAddModule: false,
    businessArray: [],
    unionName: '',
    addWay: '',
    addWayList: ['无需审核直接加入','需要审核'],
  },
  onLoad: function(options) {
    console.log(options.unionId)
    if (options.unionId) {
      this.data.unionId = options.unionId
      this.data.isEdit = true
      this.getMemberList()
    }
    this.getModule()
    this.data.hostName = app.globalData.hostName
    this.setData({
      imgUrl: app.globalData.imgUrl
    })
  },

  // 获取联盟成员列表
  getMemberList() {
    let params = {
      id: this.data.unionId
    }
    unionModel.getMemberList(params.id, res => {
      if (res.data.status == 1) {
       this.setData({
         imgLogo: res.data.data.logo,
         unionName: res.data.data.name,
         unionIntro: res.data.data.intro,
         addWayIndex: String(res.data.data.audit),
         addWay: this.data.addWayList[res.data.data.audit],
         module: res.data.data.module,
         businessArray: res.data.data.module.split(',')
       })
      } else {

      }
    })
  },

  addWayChange(e) {
    this.data.addWayIndex = e.detail.value
    this.setData({
      addWay: this.data.addWayList[this.data.addWayIndex]
    })
  },

  // 获取服务商拥有的模块
  getModule() {
    let module = []
    this.data.moduleArray.forEach((item, index) => {
      this.data.moduleItem.forEach((its, ins) => {
        if (its == item.id) {
          module.push(item.name)
        }
      })
    })
    this.setData({
      businessArray: module
    })
    this.data.module = module.join(',')
    console.log(this.data.module, this.data.businessArray)
  },

  // 添加模块按钮
  okEvent(e) {
    this.data.moduleItem = e.detail.moduleItem.split(',')
    this.getModule()
    this.setData({
      isAddModule: false
    })
  },

  closeEvent() {
    this.setData({
      isAddModule: false
    })
  },

  addModule() {
    this.setData({
      isAddModule: true
    })
    indexModel.getAllModule(res => {
      if (res.data.status == 1) {
        this.setData({
          bottomSpin: false
        })
        res.data.data.forEach((item, index) => {
          item.selected = false
          item.img = '/images/index/' + item.key + '.png'
          this.data.businessArray.forEach((its, ins) => {
            if (item.id == its.id) {
              item.selected = true
            }
          })
        })
        this.setData({
          moduleArray: res.data.data
        })
      }
    })
  },

  selectImg() {
    wx.chooseImage({
      count: 1,
      // 可以指定是原图还是压缩图
      sizeType: ['compressed'],
      // 可以指定来源是相册还是相机
      sourceType: ['album', 'camera'],
      success: (res) => {
        wx.showLoading({
          title: '上传中...',
        })
        const tempFilePaths = res.tempFilePaths
        // this.upload()
        wx.uploadFile({
          url: this.data.hostName + '/api/auth/upload',
          filePath: tempFilePaths[0],
          name: 'file',
          success: (res) => {
            console.log('联盟logo上传', res)
            wx.hideLoading()
            let data = JSON.parse(res.data)
            if (data.status == 1) {
              this.setData({
                imgLogo: data.data.filename
              })
            } else {
              wx.showToast({
                title: data.msg ? data.msg : '操作超时',
                icon: 'none'
              })
            }
          },
          fail: (err) => {
            wx.hideLoading()
          }
        })
      },
    })
  },

  getUnionName(e) {
    this.setData({
      unionName: e.detail.value
    })
  },

  getUnionIntro(e) {
    this.setData({
      unionIntro: e.detail.value
    })
  },

  onConfirm() {
    if (!this.data.imgLogo) {
      return wx.showToast({
        title: '联盟logo不能为空',
        icon: 'none'
      })
    } else if (!this.data.unionName) {
      return wx.showToast({
        title: '联盟名称不能为空',
        icon: 'none'
      })
    } else if (!this.data.unionIntro) {
      return wx.showToast({
        title: '联盟简介不能为空',
        icon: 'none'
      })
    } else if (!this.data.addWayIndex) {
      return wx.showToast({
        title: '请选择加入方式',
        icon: 'none'
      })
    } else if (!this.data.module) {
      return wx.showToast({
        title: '主导业务不能为空',
        icon: 'none'
      })
    }
    if (this.data.imgLogo.match('league')) {
      this.data.imgLogo = ''
    }
    console.log(this.data.imgLogo)
    let params = {
      name: this.data.unionName,
      logo: this.data.imgLogo,
      intro: this.data.unionIntro,
      audit: this.data.addWayIndex,
      module: this.data.module
    }

    console.log(params)
    if (this.data.isEdit) {
      params.id = this.data.unionId
      unionModel.editUnion(params, res=> {
        if (res.data.status == 1) {
          wx.navigateBack({
            delta: 2
          })
        } else {
          if (res.data.msg.match('Token已过期或失效')) { } else {
            wx.showToast({
              title: res.data.msg ? res.data.msg : '请求超时',
              icon: 'none'
            })
          }
        }
      })
    } else {
      unionModel.createUnion(params, res => {
        if (res.data.status == 1) {
          wx.navigateBack({
            delta: 1
          })
        } else {
          if (res.data.msg.match('Token已过期或失效')) { } else {
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