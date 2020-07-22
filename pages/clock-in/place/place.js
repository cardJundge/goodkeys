// 人员位置
var QQMapWX = require('./../../../dist/qqmap-wx-jssdk.min.js')
var qqmapsdk = new QQMapWX({
  key: 'UVIBZ-MMEW4-3L3UG-DAWD7-PL3LQ-WHF3C'
})
var app = getApp()
import {
  ClockInModel
} from './../models/clock-in.js'
var clockinModel = new ClockInModel()
Page({
  data: {
    taskInfoList: [],
    rectangleImg: '/images/clock/rectangle.png'
  },

  onLoad(options) {
    this.data.imgUrl = app.globalData.imgUrl
    this.data.markers = []
    this.getCurLocation()
    this.getBasicInfo()
  },

  onShow() {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userLocation']) {
          this.getBasicInfo()
        } else {
          wx.showModal({
            title: '提示',
            content: '您未授权位置信息，功能将无法使用，是否前往设置页面授权位置',
            success: res1 => {
              if (res1.confirm) {
                wx.openSetting({
                  success: res2 => {
                    // 打开设置页面进行判断
                  },
                  fail: err2 => {
                    wx.showToast({
                      title: '请前往设置页面设置位置授权',
                      icon: 'none'
                    })
                  }
                })
              }
            },
          })
        }
      }
    })
  },

  getCurLocation() {
    clockinModel.getCurLocation(res=> {
      if (res.data.status == 1) {
        this.data.taskInfoList = res.data.data
        this.data.taskInfoList.forEach((item, index) => {
          if (!item.face || item.face == '') {
            // item.face = 'face/2020-07-09/saGSya8T0q7MrLYRlwoatbuUm3iwCHvOtWnIGvMN.png'
            item.face = 'face/2020-07-16/IYiNr6NQJEye4AyuFIi9V7gkFokGK3o1uMVHpmVK.png'
          }
        })
        this.handleImage(0)
      }
    })
  },

  getBasicInfo() {
    wx.getSystemInfo({
      success: res => {
        console.log(res)
        this.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight
        })
      }
    })
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        let lat = res.latitude
        let lng = res.longitude
        this.setData({    
          poi: {
            latitude: lat,
            longitude: lng
          },
          circles: [{
            latitude: lat,
            longitude: lng,
            color: '#7cb5ec88',
            fillColor: '#7cb5ec88',
            radius: 1000,
            strokeWidth: 0
          }]
        })
      },
    })
  },

  // canvas画出头像递归
  handleImage(i) {
    if (i < this.data.taskInfoList.length) {
      this.drawImage(this.data.taskInfoList[i], res => {
        if(res == true){
          this.handleImage(i + 1)
        }
      })
    } else {
      this.setData({
        markers: this.data.markers
      })
    }
  },

  rpx2px(rpx) {
    return rpx * this.data.windowWidth / 750
  },

  // canvas画头像
  drawImage(item, sCallback) {
    wx.getImageInfo({
      src: this.data.imgUrl + item.face,
      success: res => {
        const ctx = wx.createCanvasContext('avatarCanvas'),
        rectangleImgWidth = 140,
        rectangleImgHeight = 64,
        avatarSize = 90

        // 用户头像旁边的小矩形
        ctx.drawImage(this.data.rectangleImg, this.rpx2px(60), this.rpx2px(13), this.rpx2px(rectangleImgWidth), this.rpx2px(rectangleImgHeight))

        // 用户姓名
        ctx.setFillStyle('#242729')
        ctx.setFontSize(this.rpx2px(28))
        ctx.fillText(item.nickname, this.rpx2px(102), this.rpx2px(56))

        // 用户头像
        ctx.save()
        ctx.beginPath()
        ctx.arc(this.rpx2px(avatarSize/2), this.rpx2px(avatarSize/2), this.rpx2px(avatarSize/2), 0, Math.PI * 2, false)
        ctx.clip()
        ctx.drawImage(res.path, 0, 0, this.rpx2px(avatarSize), this.rpx2px(avatarSize))
        ctx.restore()
        
        ctx.draw(true, res_draw => {
          wx.canvasToTempFilePath({
            canvasId: 'avatarCanvas',
            success: res_tfpath => {
              this.data.markers.push({
                id: item.id,
                iconPath: res_tfpath.tempFilePath,
                width: this.rpx2px(200),
                height:  this.rpx2px(90),
                latitude: item.latitude,
                longitude: item.longitude,
              })
              // console.log(this.data.markers)
              sCallback(true)
            }
          })
        })
      }
    })
  },

  // 进入作业员轨迹
  goMarkersDetails(e) {
    console.log(e, e.markerId)
    // wx.navigateTo({
    //   url: '../trail/trail',
    // })
  }
})