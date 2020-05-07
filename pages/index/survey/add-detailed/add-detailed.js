// 添加明细
var app = getApp()
var hostName = getApp().globalData.hostName
import {
  IndexModel
} from '../../models/index.js'

var indexModel = new IndexModel()
Page({
  data: {
    addList: [
      { id: 1, name: '人车合一', imageList: [], title: '人车合一', key: 'ckzp' },
      { id: 2, name: '车架号', imageList: [], title: '车架号', key: 'ckzp' },
      { id: 3, name: '环境照片', imageList: [], title: '环境照片：事故现场大环境照片，以确认事故成因', key: 'ckzp' },
      { id: 4, name: '验车照片', imageList: [], title: '验车照片：整车斜45°角四个角拍摄', key: 'ckzp' },
      { id: 5, name: '车损照片', imageList: [], title: '车损照片：本次事故造成损伤部位照片', key: 'ckzp' },
      { id: 6, name: '旧伤照片', imageList: [], title: '旧伤确认', key: 'ckzp' },
      { id: 7, name: '事故证明', imageList: [], title: '事故证明', key: 'gydz' },
      { id: 8, name: '索赔申请书', imageList: [], title: '索赔申请书', key: 'gydz' },
      { id: 9, name: '行驶证', imageList: [], title: '行驶证', key: 'gydz' },
      { id: 10, name: '驾驶证', imageList: [], title: '驾驶证', key: 'gydz' },
      { id: 11, name: '查勘报告', imageList: [], title: '查勘报告', key: 'gydz' },
      { id: 12, name: '个案签报', imageList: [], title: '个案签报', key: 'gydz' },
      { id: 13, name: '拒赔材料', imageList: [], title: '拒赔材料', key: 'gydz' },
      { id: 14, name: '从业资格证', imageList: [], title: '从业资格证', key: 'gydz' },
      { id: 15, name: '法院判决书', imageList: [], title: '法院判决书', key: 'gydz' },
      { id: 16, name: '调查单证', imageList: [], title: '调查单证', key: 'gydz' },
      { id: 17, name: '收款方账户信息', imageList: [], title: '收款方账户信息', key: 'zfdz' },
      { id: 18, name: '收款方身份证明', imageList: [], title: '收款方身份证明', key: 'zfdz' },
    ],
    countIndex: 8,
    count: [1, 2, 3, 4, 5, 6, 7, 8, 9]
  },
  onLoad: function(options) {
    console.log(options)
    this.data.id = options.id
    this.setData({
      imgUrl: app.globalData.imgUrl
    })
  },

  selectAdd(e) {
    wx.showActionSheet({
      itemList: ['打开相册','拍照'],
      success: res=> {
        if (res.tapIndex === 0) {
          this.data.selectName = 'album'
        } else if (res.tapIndex === 1) {
          this.data.selectName = 'camera'
        }
        this.addPic(e)
      }
    })
  },

  // 选择图片
  addPic(e) {
    let imageList = [], imageListIndex
    this.data.addList.forEach((item,index) => {
      if (e.currentTarget.dataset.id == item.id) {
        imageList = item.imageList
        imageListIndex = index
      }
    })
   
    if (imageList.length === 9) { return }
    
    wx.chooseImage({
      count: imageList.length + this.data.count[this.data.countIndex] > 9 ? 9 - imageList.length : this.data.count[this.data.countIndex],
      // 可以指定是原图还是压缩图
      sizeType: ['compressed'], 
      // 可以指定来源是相册还是相机
      sourceType: [this.data.selectName], 
      success: (res) => {
        wx.showLoading({
          title: '上传中...',
        })
        for (let i = 0; i < res.tempFilePaths.length; i++) {
          // this.upload()
          wx.uploadFile({
            url: hostName + '/api/auth/upload',
            filePath: res.tempFilePaths[i],
            name: 'file',
            success: (res) => {
              wx.hideLoading()
              let data = JSON.parse(res.data)
              if (data.status == 1) {
                imageList.push(data.data.filename)
                let string = 'addList[' + imageListIndex + '].imageList'
                this.setData({
                  [string]: imageList
                })
              } else {
                wx.showToast({
                  title: data.msg ? data.msg : '操作超时',
                  icon: 'none'
                })
              }
            },
            fail: (err)=> {
              wx.hideLoading()
            }
          })
        }
      },
    })
  },

  // 图片预览
  openImg(e) {
    console.log(e)
    let imageId = e.currentTarget.dataset.id, imageList = [], imageIndex = e.currentTarget.dataset.index
    this.data.addList.forEach((item, index) => {
      if (imageId == item.id) {
        imageList = item.imageList
        wx.previewImage({
          current: this.data.imgUrl + imageList[imageIndex], // 当前显示图片的http链接
          urls: imageList // 需要预览的图片http链接列表
        })
        console.log(this.data.imgUrl + imageList[imageIndex], imageList)
      }
    })
  },

  // 上传
  upload(filePath) {
   
  },

  // 删除列表图片
  delImage(e) {
    let imageList = [], imageListIndex, imageId = e.currentTarget.dataset.id, index = e.currentTarget.dataset.index 
    this.data.addList.forEach((item1, index1) => {
      if (imageId == item1.id) {
        imageList = item1.imageList
        imageListIndex = index1
      }
    })

    imageList.splice(index, 1)
    let string = 'addList[' + imageListIndex + '].imageList'
    this.setData({
      [string]: imageList
    })
  },

  // 添加明细
  toAddDetailed(e) {
     let params,temp,imgs
    this.data.addList.forEach((item, index)=> {
      if (item.imageList.length !== 0) {
        if(item.key == 'ckzp') {
          params = {
            key: 'survey',
            case_id: this.data.id,
            title: item.title,
            content: '',
            picture: '',
            ckzp: JSON.stringify(item.imageList),
            gydz: '',
            zfdz: ''
          }
          this.addDetailedFun(params)
        } else if (item.key == 'gydz') {
          params = {
            key: 'survey',
            case_id: this.data.id,
            title: item.title,
            content: '',
            picture: '',
            ckzp: '',
            gydz: JSON.stringify(item.imageList),
            zfdz: ''
          }
          this.addDetailedFun(params)
        } else {
          params = {
            key: 'survey',
            case_id: this.data.id,
            title: item.title,
            content: '',
            picture: '',
            ckzp: '',
            gydz: '',
            zfdz: JSON.stringify(item.imageList)
          }
          this.addDetailedFun(params)
        }
      }
    })
  },

  addDetailedFun(params) {
     indexModel.addDetailed(params, res=> {
      if(res.data.status == 1) {
        wx.showToast({
          title: '添加成功',
        })
        wx.navigateBack({
          delta: 1
        })
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
  }
})