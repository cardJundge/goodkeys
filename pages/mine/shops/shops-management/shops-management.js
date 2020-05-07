// 商铺管理
import WxValidate from '../../../../dist/WxValidate.js'
import {
  MineModel
} from './../../models/mine.js'

var app = getApp()
var mineModel = new MineModel()
Page({

  data: {
    formData: {
      shopsName: '',
      shopsShortName: '',
      phoneNumber: '',
      shopsAddress: ''
    },
    imageList: [],
    isEdit: false
  },

  onLoad: function(options) {
    this.initValidate() // 验证规则函数
    this.setData({
      imgUrl: app.globalData.imgUrl
    })
    if (options.data) {
      let data = JSON.parse(options.data)
      console.log(data)
      let banner = data.banner.split(',')
      this.setData({
        isEdit: true,
        shopsId: data.id,
        imageList: banner,
        formData: {
          shopsName: data.name,
          shopsShortName: data.short_name,
          phoneNumber: data.mobile,
          shopsAddress: data.address
        }
      })
    }
  },

  initValidate() {
    const rules = {
      shopsName: {
        required: true
      },
      shopsShortName: {
        required: true
      },
      phoneNumber: {
        required: true,
        tel: true
      },
      shopsAddress: {
        required: true
      }
    }
    const messages = {
      shopsName: {
        required: '请输入商铺名称'
      },
      shopsShortName: {
        required: '请输入商铺简称'
      },
      phoneNumber: {
        required: '请输入服务电话',
        tel: '请输入正确的服务电话'
      },
      shopsAddress: {
        required: '请输入商铺地址'
      }
    }
    this.WxValidate = new WxValidate(rules, messages)
  },

  // 上传店铺照片
  uploadImg() {
    wx.chooseImage({
      count: 9,
      // 可以指定是原图还是压缩图
      sizeType: ['compressed'],
      // 可以指定来源是相册还是相机
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePaths = res.tempFilePaths
        // let imageList = []
        for (let i = 0; i < res.tempFilePaths.length; i++) {
          wx.uploadFile({
            url: app.globalData.hostName + '/api/auth/upload',
            filePath: res.tempFilePaths[i],
            name: 'file',
            success: (res) => {
              let data = JSON.parse(res.data)
              console.log(data)
              if (data.status == 1) {
                this.data.imageList.push(data.data.filename)
                this.setData({
                  imageList: this.data.imageList
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
      }
    })

  },

  formSubmit(e) {
    let data = e.detail.value
    console.log(data)
    if (!this.WxValidate.checkForm(data)) {
      const error = this.WxValidate.errorList[0]
      return wx.showToast({
        title: error.msg,
        icon: 'none'
      })
    } else if (this.data.imageList.length == 0) {
      return wx.showToast({
        title: '请上传商铺照片',
        icon: 'none'
      })
    } else {

      let params = {
        name: data.shopsName,
        mobile: data.phoneNumber,
        address: data.shopsAddress,
        short_name: data.shopsShortName
      }
      // 修改商铺
      if (this.data.isEdit) {
        params.id = this.data.shopsId
        this.data.imageList.forEach((item, index) => {
          if (item.match('banner')) {
            this.data.imageList.splice(index, 1)
          }
        })
        console.log(this.data.imageList)
        params.banner = this.data.imageList.toString()
        mineModel.operationShops(params, res => {
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
        params.banner = this.data.imageList.toString()
        mineModel.operationShops(params, res => {
          if (res.data.status == 1) {
            wx.showToast({
              title: '添加成功'
            })
            wx.navigateBack({
              delta: 1
            })
          }
        })
      }
    }
  },

  // 预览大图
  previewImage(e) {
    let imgArr = []
    let imgIndex = e.currentTarget.dataset.index
    this.data.imageList.forEach((item, index) => {
      imgArr.push(this.data.imgUrl + item)
    })
    wx.previewImage({
      urls: imgArr,
      current: imgArr[imgIndex]
    })
    console.log(imgArr, imgArr[imgIndex])
  },

  // 删除图片
  delImg(e) {
    console.log(e, imageList)
    let imageList = this.data.imageList
    let imgIndex = e.currentTarget.dataset.index
    imageList.splice(imgIndex, 1)
    console.log(imageList)
    this.setData({
      imageList: imageList
    })
  },

  // 删除数组中某一个元素的函数
  remove(val) {
    var index = this.indexOf(val)
    if (index > -1) {
      this.splice(index, 1)
    }
  }
})