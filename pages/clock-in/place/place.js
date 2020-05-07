// 人员位置
var QQMapWX = require('./../../../dist/qqmap-wx-jssdk.min.js')
var qqmapsdk = new QQMapWX({
  key: 'UVIBZ-MMEW4-3L3UG-DAWD7-PL3LQ-WHF3C'
})
Page({
  data: {
    taskInfoList: [
      {
        taskId: 1,
        photo: 'https://wx.qlogo.cn/mmopen/vi_32/a3ZcWibYWCy7CAlZmicuflTIygTqcs3icszhooPIh8gRKMev6gFphR5b2q6D3sjItbWVrvEkxMnaIWoicmD8NflS8A/132',
        taskName: '王晓一',
        longitude: '108.93984',
        latitude: '34.34127'
      },
      {
        taskId: 2,
        photo: 'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eoxF7QA6D6JAYXuY8tXNicWz4lExxRukbPBiasw1KSIf5KDzpTFpehzib1L1vtFibxnm9ZzohibrgibvICg/132',
        taskName: '测试',
        longitude: '108.95984',
        latitude: '34.345932'
      },
      {
        taskId: 3,
        photo: 'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eoxF7QA6D6JAYXuY8tXNicWz4lExxRukbPBiasw1KSIf5KDzpTFpehzib1L1vtFibxnm9ZzohibrgibvICg/132',
        taskName: '赵毅个',
        longitude: '108.99984',
        latitude: '34.395932'
      },
      {
        taskId: 4,
        photo: 'https://wx.qlogo.cn/mmopen/vi_32/a3ZcWibYWCy7CAlZmicuflTIygTqcs3icszhooPIh8gRKMev6gFphR5b2q6D3sjItbWVrvEkxMnaIWoicmD8NflS8A/132',
        taskName: '王晓二',
        longitude: '108.77984',
        latitude: '34.309932'
      },
      {
        taskId: 5,
        photo: 'https://wx.qlogo.cn/mmopen/vi_32/a3ZcWibYWCy7CAlZmicuflTIygTqcs3icszhooPIh8gRKMev6gFphR5b2q6D3sjItbWVrvEkxMnaIWoicmD8NflS8A/132',
        taskName: '王晓三',
        longitude: '108.11984',
        latitude: '34.247932'
      },
    ],
    rectangleImg: '/images/clock/rectangle.png'
  },

  onLoad(options) {
    this.data.markers = []
    this.getBasicInfo()
    this.handleImage(0)
  },

  getBasicInfo() {
    wx.getSystemInfo({
      success: res => {
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
      src: item.photo,
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
        ctx.fillText(item.taskName, this.rpx2px(102), this.rpx2px(56))

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
                id: item.taskId,
                iconPath: res_tfpath.tempFilePath,
                width: this.rpx2px(200),
                height:  this.rpx2px(90),
                latitude: item.latitude,
                longitude: item.longitude,
              })
              console.log(this.data.markers)
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
    wx.navigateTo({
      url: '../trail/trail',
    })
  }
})