// 添加案件相关资料
var imgId = 0
var relatedId = 0
import {
  IndexModel
} from '../../models/index.js'

var app = getApp()
var indexModel = new IndexModel()
// import {
//   Personalcenter
// } from "../../../mine/personalcenter/personalcentermode.js"
// var personalcenter = new Personalcenter()
// import {
//   Investigationmode
// } from '../investigationmode.js'
// var investigation = new Investigationmode()


Page({
  data: {
    relatedInfoList: [{
      id: relatedId++,
      title: '',
      picture: []
    }],
    imagecell: [],
    fileNameTemp: '',
    picture: [], //最终上传的图片地址
    // itempic: [], //每一项的图片
    title: [],
    // itemtitle:[],
    type: 1
  },

  onLoad: function(options) {
    this.data.vehicleId = options.vehicleId
  },

  //添加相关资料
  addRelated() {
    this.data.relatedInfoList.push({
      id: relatedId++,
      title: '',
      picture: []
    })

    this.setData({
      relatedInfoList: this.data.relatedInfoList,
    })
  },

  //选择照片
  chooseImg(e) {
    this.data.imagecell = []
    var index = e.currentTarget.dataset.index
    wx.chooseImage({
      count: 9,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        var tempPicLength = res.tempFilePaths.length
        if (tempPicLength + this.data.imagecell.length > 9) {
          res.tempFilePaths = res.tempFilePaths.slice(0, 9 - this.data.imagecell.length)
        }

        for (let i in res.tempFilePaths) {
          this.data.imagecell.push({
            id: imgId++,
            path: res.tempFilePaths[i]
          })
        }

        this.data.relatedInfoList[index].picture = this.data.relatedInfoList[index].picture.concat(this.data.imagecell)
        this.setData({
          relatedInfoList: this.data.relatedInfoList,
        })
        // console.log("ddd", this.data.relatedInfoList)
      }
    })
  },

  //确定按钮 提交相关资料
  addRelatedInfo() {
    var  that  =  this
    for (let  i = that.data.relatedInfoList.length - 1;  i >= 0; i--) {
      if (!that.data.relatedInfoList[i].title) {
        if (that.data.relatedInfoList[i].picture.length > 0) {
          wx.showToast({
            title: '没有上传标题!',
            icon: 'none'
          })
          return
        } else {
          that.data.addflag  = true
          that.data.relatedInfoList.splice(i, 1)
        }
      } else {
        if (that.data.relatedInfoList[i].picture.length  == 0) {
          wx.showToast({
            title: '没有上传图片!',
            icon: 'none'
          })
          return
        } else {
          that.data.addflag  = true
        }
      }
    }
    console.log("qqq", that.data.relatedInfoList.length)
    if (that.data.addflag) {
      if (that.data.relatedInfoList.length > 0) {
        wx.showLoading({
          title: '稍等片刻!'
        })
        that.uploadimg(0, 0, that)
      } else {
        wx.showToast({
          title: '请上传相关资料!',
          icon: 'none'
        })
        that.data.relatedInfoList.push({
          id: relatedId++,
          title: '',
          picture: []
        })
      }
    }
  },

  //上传图片递归
  uploadimg(i, j) {
    wx.showLoading({
      title: '添加中..',
    })
    if (i < this.data.relatedInfoList.length) {
      if (j < this.data.relatedInfoList[i].picture.length) {
        this.upp(i, j, res => {
          this.uploadimg(i, j + 1)
        })
      } else {
        this.data.picture.push(this.data.fileNameTemp)
        this.data.fileNameTemp = ''
        this.uploadimg(i + 1, 0)
      }
    } else {
      for (var item in this.data.picture) {
        this.data.picture[item] = (this.data.picture[item]).substr(1)
      }

      this.data.title = []
      this.data.relatedInfoList.forEach((item, index) => {
        this.data.title.push(item.title)
      })

      let params = {
        case_id: this.data.vehicleId,
        title: this.data.title,
        picture: this.data.picture,
        type: this.data.type
      }
      indexModel.addRelatedInfo(params, res => {
        this.data.picture = []
        if (res.data.status == 1) {
          wx.showToast({
            title: '资料添加成功！',
          })
          wx.hideLoading()
          wx.navigateBack({
            delta: 1
          })
        }
      })
    }
  },

  //上传照片
  upp(i, j, callback) {
    this.data.mediaSrc = this.data.relatedInfoList[i].picture[j].path
    wx.uploadFile({
      url: app.globalData.hostName + '/api/auth/upload',
      filePath: this.data.mediaSrc,
      name: 'file',
      success: (res) => {
        let data = JSON.parse(res.data)
        if (data.status == 1) {
          this.data.fileName = data.data.filename
          this.data.fileNameTemp = this.data.fileNameTemp + ',' + this.data.fileName
          // console.log(data, this.data.fileNameTemp)
          callback(this.data.fileNameTemp)
        } else {

        }
      }
    })
  },

  getInputTitle(e) {
    var index = e.currentTarget.dataset.titleindex
    this.data.relatedInfoList[index].title = e.detail.value
  },

  // 删除
  delImg(e) {
    var that = this
    var picindex = e.currentTarget.dataset.index
    that.data.relatedInfoList.forEach((item, index) => {
      item.picture.splice(picindex, 1)
      that.setData({
        relatedInfoList: that.data.relatedInfoList
      })
    })
  },

  // 预览
  previewImage(e) {
    var that = this
    var imgArr = []
    var picindex = e.currentTarget.dataset.index
    var relatedindex = e.currentTarget.dataset.relatedindex
    that.data.relatedInfoList[relatedindex].picture.forEach((item, index) => {      
      imgArr.push(item.path)    
    })
    wx.previewImage({
      urls: imgArr,
      current: imgArr[picindex]    
    })
  }

})