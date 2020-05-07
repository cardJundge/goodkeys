// 人员轨迹
var QQMapWX = require('./../../../dist/qqmap-wx-jssdk.min.js')
var qqmapsdk = new QQMapWX({
  key: 'UVIBZ-MMEW4-3L3UG-DAWD7-PL3LQ-WHF3C'
})

Page({
  data: {
    calendarConfig: {
      defaultDay: true,
      preventSwipe: false,
      hideHeadOnWeekMode: true
    },
    spinShow: true,
    fold: false,
    currentSelect: '',
    trkPoints: [
      {
        longitude: '108.93984',
        latitude: '34.34127'
      },
      {
        longitude: '108.95984',
        latitude: '34.345932'
      },
      {
        longitude: '108.99984',
        latitude: '34.395932'
      },
      {
        longitude: '108.77984',
        latitude: '34.309932'
      },
      {
        longitude: '108.11984',
        latitude: '34.247932'
      },
    ],
    polygons: [{
      fillColor: "#1791fc66",
      points: [
        { latitude: 34.42503613021332, longitude: 108.86077880859375 },
        { latitude: 34.397844946449865, longitude: 109.0557861328125 },
        { latitude: 34.24132422972854, longitude: 109.04205322265625 },
        { latitude: 34.28218385709024, longitude: 108.82232666015625 }
      ],
      strokeWidth: 2,
      strokeColor: '#fff'
    }]
  },

  onLoad() {
    this.getBasicInfo()
  },

  getBasicInfo() {
    setTimeout(() => {
      this.calendar.switchView('week').then(() => { })
      let time
      this.calendar.getCalendarDates().forEach((item, index) => {
        if (item.choosed) {
          time = item.year + '-' + item.month + '-' + item.day
        }
      })
      this.setData({
        spinShow: false,
        currentSelect: time
      })
    }, 2000)

    wx.getSystemInfo({
      success: res => {
        this.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight,
          mapHeight: res.windowHeight * 2 - 234
        })
        console.log(this.data.mapHeight)
      }
    })

    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        console.log(res)
        let lat = res.latitude
        let lng = res.longitude
        this.setData({
          poi: {
            latitude: lat,
            longitude: lng
          },
          polyline: [{
            points: this.data.trkPoints,
            color: "#FF9D1A",
            width: 3,
            zIndex: 9
          }],
          polygons: this.data.polygons
        })
        console.log(this.data.polygons)
        qqmapsdk.reverseGeocoder({
          location: { latitude: this.data.poi.latitude, longitude: this.data.poi.longitude },
          success: (res_city) => {
            //address 城市
            console.log(res_city)
          }
        })
      }
    })
  },

  afterTapDay(e) {
    let time = e.detail.year + '-' + e.detail.month + '-' + e.detail.day
    this.setData({
      currentSelect: time
    })
  },

  // 折叠起来（日期）
  toFold() {
    this.setData({
      fold: true,
      mapHeight: this.data.windowHeight * 2 - 174
    })
  },

  // 展开（日期）
  toUnFold() {
    this.setData({
      fold: false,
      mapHeight: this.data.windowHeight * 2 - 234
    })
  }
})