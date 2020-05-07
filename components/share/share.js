var app = getApp()
Component({
  properties: {
    isShow: {
      type: Boolean
    },
    photoLimit: {
      type: Boolean
    },
    serviceName: {
      type: String
    },
    serviceFace: {
      type: String
    },
    data: {
      type: Object,
      value: {},
      observer(newVal, oldVal) {
        this.getImgObj()
      }
    }
  },

  data: {
    bgImg: ''
  },

  methods: {
    getImgObj() {
      wx.getImageInfo({
        src: 'https://6f6d-omo-service-b6dza-1301029807.tcb.qcloud.la/images/share.png?sign=7317e7e7bc85a89238bd15ad6af81a6a&t=1584090259',
        success: res => {
          this.data.bgImg = res.path

          // console.log('测试一下', this.data.bgImg, this.data.isShow)
          wx.getImageInfo({
            src: this.data.serviceFace,
            success: res => {
              this.data.serviceFace = res.path
              wx.request({
                url: app.globalData.hostName + '/api/ser/store/promoteQRCode',
                method: 'GET',
                header: {
                  'Accept': 'application/json',
                  'Authorization': 'Bearer ' + app.globalData.userInfo.api_token
                },
                responseType: 'arraybuffer',
                success: (res) => {
                  this.data.qrImg = wx.arrayBufferToBase64(res.data)
                  this.paintImg()
                }
              })
            }
          })
        }
      })
    },

    toCloseModule() {
      this.setData({
        isShow: false
      })
    },

    rpx2px(rpx) {
      const info = wx.getSystemInfoSync()
      return rpx * info.windowWidth / 750
    },

    paintImg() {
      const ctx = wx.createCanvasContext('shareCanvas', this)
      ctx.drawImage(this.data.bgImg, 0, 0, this.rpx2px(476), this.rpx2px(846))

      // 作者名称
      const logoImgSize = this.rpx2px(64)
      const qrImgSize = this.rpx2px(120)
      // const qrImgSize = this.rpx2px(144)
      const txt = this.data.serviceName

      ctx.setTextAlign('left') // 文字居中
      ctx.setFillStyle('#1a65ff') // 文字颜色：黑色
      ctx.setFontSize(this.rpx2px(24)) // 文字字号
      ctx.fillText(txt, this.rpx2px(24), (logoImgSize + this.rpx2px(54)))

      // 小程序码
      // ctx.drawImage(this.data.qrImg, (this.rpx2px(476) / 2) - (qrImgSize / 2), this.rpx2px(608), qrImgSize, qrImgSize)
      ctx.drawImage('/images/qr_code.png', (this.rpx2px(476) / 2) - (qrImgSize / 2), this.rpx2px(620), qrImgSize, qrImgSize)
      ctx.stroke()

      // 用户头像
      this.roundRect(ctx, this.rpx2px(24), this.rpx2px(24), logoImgSize, logoImgSize, this.rpx2px(10))
      // ctx.drawImage('/images/logo.png', (ctx.measureText(txt).width / 2 + this.rpx2px(24) - (logoImgSize / 2)), this.rpx2px(24), logoImgSize, logoImgSize)
      ctx.drawImage(this.data.serviceFace, this.rpx2px(24), this.rpx2px(24), logoImgSize, logoImgSize)
      ctx.stroke()
      ctx.draw()
    },

    // 画四个小矩形
    roundRect(ctx, x, y, w, h, r) {
      if (w < 2 * r) r = w / 2
      if (h < 2 * r) r = h / 2
      ctx.beginPath()
      ctx.fillStyle = "#fff"
      ctx.strokeStyle = "#fff"
      ctx.moveTo(x + r, y)
      ctx.arcTo(x + w, y, x + w, y + h, r)
      ctx.arcTo(x + w, y + h, x, y + h, r)
      ctx.arcTo(x, y + h, x, y, r)
      ctx.arcTo(x, y, x + w, y, r)
      ctx.closePath()
      ctx.clip()
    },

    // 保存图片到相册
    toSaveImg() {
      wx.canvasToTempFilePath({
        canvasId: 'shareCanvas',
        success: res => {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: res => {
              wx.showToast({
                title: '已保存到相册'
              })
            }
          })
        },
        fail: err => {
          console.log(err)
        }
      }, this)
    },

    // 判断是否授权
    judgePhotoLimits() {
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.writePhotosAlbum']) {
            this.setData({
              photoLimit: true
            })
          } else {
            this.setData({
              photoLimit: false
            })
            this.getPhotoLimits()
          }

        }
      })

    },

    // 获取用户保存到相册权限
    getPhotoLimits() {
      wx.authorize({
        scope: 'scope.writePhotosAlbum',
        //第一次成功授权
        success: res => {
          this.setData({
            photoLimit: true
          })
        },
        // 授权失败
        fail: err => {
          this.setData({
            photoLimit: false
          })
          // 让用户自己打开设置页面
          wx.showModal({
            title: '提示',
            content: '您未授权保存到相册，功能将无法使用，是否前往设置页面授权保存到相册',
            success: res1 => {
              if (res1.confirm) {
                wx.openSetting({
                  success: res2 => {
                    // 打开设置页面进行判断
                    console.log('res2', res2)
                    if (res2.authSetting['scope.writePhotosAlbum']) {
                      //打开设置后设置了保存到相册授权
                      console.log("设置保存到相册授权成功")
                      this.setData({
                        photoLimit: true
                      })
                    }
                  },
                  fail: err2 => {
                    wx.showToast({
                      title: '请前往设置页面设置保存相册授权',
                      icon: 'none'
                    })
                    this.setData({
                      photoLimit: false
                    })
                  }
                })
              }
            }
          })
        }
      })
    }
  }
})