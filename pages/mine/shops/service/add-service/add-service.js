// 添加商品/服务
import WxValidate from '../../../../../dist/WxValidate.js'
import {
  MineModel
} from './../../../models/mine.js'

var app = getApp()
var mineModel = new MineModel()

Page({

  data: {
    formData: {
      serviceName: '',
      servicePrice: '',
      serviceIntro: '',
    },
    imageList: [],
    serviceType: ["购买", "预约"],
    hasCate: false,
    isEdit: false,
    showEditCateData: false
  },

  onLoad: function(options) {
    if (options.data) {
      let data = JSON.parse(options.data)
      this.setData({
        formData: {
          serviceName: data.name,
          servicePrice: data.price,
          serviceIntro: data.intro,
        },
        serviceId: data.id,
        imageItem: data.pic,
        serviceTypeIndex: data.type,
        cateId: data.cate_id,
        isEdit: true
      })
    }
    this.initValidate()
    this.getClassification()
    this.setData({
      imgUrl: app.globalData.imgUrl
    })
  },

  // 获取分类
  getClassification() {
    mineModel.getClassificationList(res => {
      if (res.data.status == 1) {
        var cateList = res.data.data
        var id
        var cateArr = cateList.map((item, index) => {
          if (index == 0) {
            id = item.id
          }
          return item.name
        })

        this.setData({
          multiIndex: [0, 0],
          cateList,
          cateArr
        })
        this.getChild(id)
        if (this.data.isEdit) {
          this.data.cateList.forEach((item, index) => {
            item.child.forEach((item1, index1) => {
              if (item1.id == this.data.cateId) {
                console.log(item1.name, item.name)
                this.setData({
                  hasCate: true,
                  editCateName: item.name,
                  editCateChildName: item1.name,
                  showEditCateData: true
                })
              }
            })
          })
        }
      }
    })
  },

  // 获取分类下的二级分类
  getChild(id) {
    this.data.cateList.forEach((item, index) => {
      if (item.id == id) {
        var childList = item.child
        var childArr = childList.map(item => {
          return item.name
        })
        this.setData({
          multiArray: [this.data.cateArr, childArr],
          childList,
          childArr
        })
      }
    })
  },

  // ---------------->???
  bindMultiPickerChange(e) {
    console.log(e.detail.value)
    this.setData({
      hasCate: true,
      showEditCateData: false,
      multiIndex: e.detail.value
    })
    this.data.childList.forEach((item, index) => {
      if (index == e.detail.value[1]) {
        this.data.cateId = item.id
        console.log(this.data.cateId)
      }
    })
  },

  bindMultiPickerColumnChange(e) {
    let data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    }
    data.multiIndex[e.detail.column] = e.detail.value
    switch (e.detail.column) {
      case 0:
        this.data.cateList.forEach((item, index) => {
          if (index == e.detail.value) {
            this.getChild(item.id)
          }
        })
    }
  },

  // -------------------->???

  serviceTypeChange(e) {
    this.setData({
      serviceTypeIndex: e.detail.value
    })
  },

  initValidate() {
    const rules = {
      serviceName: {
        required: true
      },
      servicePrice: {
        required: true
      },
      serviceIntro: {
        required: true
      }
    }
    const messages = {
      serviceName: {
        required: '请输入商品/服务名称'
      },
      servicePrice: {
        required: '请输入商品/服务价格'
      },
      serviceIntro: {
        required: '请输入商品/服务简介'
      }
    }
    this.WxValidate = new WxValidate(rules, messages)
  },

  // 上传店铺照片
  uploadImg() {
    wx.chooseImage({
      count: 1,
      // 可以指定是原图还是压缩图
      sizeType: ['compressed'],
      // 可以指定来源是相册还是相机
      sourceType: ['album', 'camera'],
      success: (res) => {
        console.log(res)
        const tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: app.globalData.hostName + '/api/auth/upload',
          filePath: res.tempFilePaths[0],
          name: 'file',
          success: (res) => {
            let data = JSON.parse(res.data)
            console.log(data)
            if (data.status == 1) {
              this.setData({
                imageItem: data.data.filename
              })
            } else {
              wx.showToast({
                title: data.msg ? data.msg : '操作超时',
                icon: 'none'
              })
            }
          },
          fail: (err) => {}
        })
      }
    })

  },

  formSubmit(e) {
    let data = e.detail.value
    let serviceTypeIndex = this.data.serviceTypeIndex
    // let cateId = this.data.multiArray[0][this.data.multiIndex[0]] + this.data.multiArray[1][this.data.multiIndex[1]]
    console.log(data, this.data.serviceTypeIndex)
    if (!this.WxValidate.checkForm(data)) {
      const error = this.WxValidate.errorList[0]
      return wx.showToast({
        title: error.msg,
        icon: 'none'
      })
    } else if (!this.data.cateId) {
      return wx.showToast({
        title: '请选择商品/服务分类',
        icon: 'none'
      })
    } else {
      let params = {
        name: data.serviceName,
        price: data.servicePrice,
        intro: data.serviceIntro,
        type: this.data.serviceTypeIndex ? this.data.serviceTypeIndex : 0,
        cate_id: this.data.cateId
      }
      if (this.data.isEdit) {
        params.id = this.data.serviceId
        if (this.data.imageItem.match('goods')) {
          params.pic = ''
        } else {
          params.pic = this.data.imageItem
        }
        console.log(params)
        mineModel.editService(params, res => {
          if (res.data.status == 1) {
            wx.showToast({
              title: '修改成功'
            })
            wx.navigateBack({
              delta: 1
            })
          }
        })
      } else {
        params.pic = this.data.imageItem
        mineModel.addService(params, res => {
          if (res.data.status == 1) {
            wx.showToast({
              title: '添加成功',
            })
            wx.navigateBack({
              delta: 1
            })
          }
        })
      }
    }
  },

  // 大图预览
  previewImage() {
    let imgArr = []
    imgArr.push(this.data.imgUrl + this.data.imageItem)
    wx.previewImage({
      urls: imgArr,
      current: imgArr[0]
    })
  },

  // 删除图片
  delImg() {
    this.setData({
      imageItem: ''
    })
  }
})