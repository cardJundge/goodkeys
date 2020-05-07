// 调查任务详情
const myAudio = wx.createInnerAudioContext()
myAudio.obeyMuteSwitch = false // 是否遵循系统静音开关,当此参数为 false 时，即使用户打开了静音开关，也能继续发出声音
import {
  IndexModel
} from '../../models/index.js'
var indexModel = new IndexModel()
var app = getApp()
Page({
  data: {
    name: 'name1',
    // 记录
    taskRecord: [],
    tabList: ['调查详情', '调查要求'],
    isActive: 0
    //第二类样式成员变量
  },

  onLoad: function (options) {
    // console.log(options)
    this.setData({
      stId: options.stId,
      sicknessTaskId: options.sicknessTaskId,
      imgUrl: app.globalData.imgUrl
    })
    wx.setNavigationBarTitle({
      title: options.stName
    })
    let sicknessId = this.data.sicknessTaskId
    if (sicknessId >= 1 && sicknessId < 3) {
      this.setData({
        style: 'firstStyle'
      })
    } else if (sicknessId > 2 && sicknessId < 9) {
      this.setData({
        style: 'secondStyle'
      })
    } else if (sicknessId > 8 && sicknessId < 17) {
      this.setData({
        style: 'thirdStyle'
      })
    } else if (sicknessId == 17) {
      this.setData({
        style: 'fourthStyle'
      })
    } else if (sicknessId == 18) {
      this.setData({
        style: 'fifthStyle'
      })
    } else if (sicknessId == 19) {
      this.setData({
        style: 'sixthStyle'
      })
    } else if (sicknessId == 20) {
      this.setData({
        style: 'seventhStyle'
      })
    } else if (sicknessId == 21) {
      this.setData({
        style: 'eighthStyle'
      })
    }
    this.getTaskRecord()
  },

  changeTab(e) {
    console.log(e)
    this.setData({
      isActive: e.currentTarget.dataset.index
    })
  },

  // 获取任务记录
  getTaskRecord() {
    let params = {
      id: this.data.stId
    }
    indexModel.getSickRecordList(params, res => {

      if (res.data.status == 1) {
        res.data.data.forEach((item, index) => {
          // this.data.taskRecord.push(JSON.parse(item.data))
          this.data.taskRecord.push(item.data)
          this.data.taskRecord[index].tId = item.id
        })

        this.setData({
          taskRecord: this.data.taskRecord,
          taskReject: res.data.reject
        })
        console.log(this.data.taskRecord)
      }
    })
  },

  // 图片预览
  previewImage(e) {
    let imgArr = []
    let tIds = e.currentTarget.dataset.id
    let imageIndex = e.currentTarget.dataset.index
    this.data.taskRecord.forEach((item, index) => {
      if (tIds == item.tId) {
        item.image.forEach((it, indx) => {
          imgArr.push(this.data.imgUrl + it)
        })
        wx.previewImage({
          urls: imgArr,
          current: imgArr[imageIndex]
        })
        // console.log(imgArr, imgArr[imageIndex])
      }
    })
  },

  // 播放录音
  playAudio(e) {
    myAudio.src = this.data.imgUrl + e.currentTarget.dataset.src
    console.log(myAudio.src)
    myAudio.play()
  }

})