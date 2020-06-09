// 地点选择
var QQMapWX = require('../../../../dist/qqmap-wx-jssdk.min.js');
var address = new QQMapWX({
  key: 'UVIBZ-MMEW4-3L3UG-DAWD7-PL3LQ-WHF3C'
})
Page({
  data: {
  },
  onLoad(options) {
    this.getLocation()
  },

  onShow() {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userLocation']) {
          this.getLocation()
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

  getLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: res => {
        console.log('发生的风格', res)
        let lat = res.latitude
        let lng = res.longitude
        address.reverseGeocoder({
          location: lat + "," + lng || '',
          get_poi: 1,
          success: res=> {
            let addList = []
            res.result.pois.forEach((item,index)=> {
              addList.push({
                title: item.title,
                id: item.id,
                latitude: item.location.lat,
                longitude: item.location.lng,
                iconPath: '/images/index/position.png', //图标路径
                width: 20,
                height: 20
              })
            })

            this.setData({
              markers: addList,
              imageId: 0,
              poi: {
                latitude: res.result.location.lat,
                longitude: res.result.location.lng
              },
            })
          }
        })
      },
    })
  },

  // 选择地址
  selectlocation(e) {
    let locationid = e.target.dataset.licationid
    this.data.markers.forEach((item, index) => {
      if (locationid == index) {
        console.log(item.title)
        this.setData({
          imageId: locationid,
          imageTitle: item.title
        })
      }
    })
  },

  onConfirm() {
    let pages = getCurrentPages()
    let prevPage = pages[pages.length - 2]
    prevPage.setData({
      fixedLossAdd: this.data.markers[this.data.imageId].title
    })
    wx.navigateBack({
      delta: 1
    })   
  }
})