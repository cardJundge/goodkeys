// 调查任务详情
const myAudio = wx.createInnerAudioContext()
myAudio.obeyMuteSwitch = false
// 是否遵循系统静音开关,当此参数为 false 时，即使用户打开了静音开关，也能继续发出声音
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
    isShowBack: false
    //第二类样式成员变量
  },

  onLoad: function(options) {
    console.log(options)
    this.setData({
      vehId: options.vehId,
      vehTaskId: options.vehTaskId,
      vehName: options.vehName,
      imgUrl: app.globalData.imgUrl,
      personName: options.personName,
      vehTaskStatus: options.vehTaskStatus,
      vehCaseStatus: options.vehCaseStatus
    })
    this.getTaskRecord()
  },

  // 获取任务记录
  getTaskRecord() {
    let params = {
      id: this.data.vehTaskId
    }
    indexModel.getVehicleRecordList(params, res => {

      if (res.data.status == 1) {
        res.data.data.forEach((item, index) => {
          // this.data.taskRecord.push(JSON.parse(item.data))
          if(item.image) {
            item.image = item.image.split(',')
          }
          if(item.audio) {
            item.audio = item.audio.split(',')
          }
         if(item.video) {
           item.video = item.video.split(',')
         }
          this.data.taskRecord.push(item)
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
        console.log(imgArr, imgArr[imageIndex])
      }
    })
  },

  // 播放录音
  playAudio(e) {
    myAudio.src = this.data.imgUrl + e.currentTarget.dataset.src
    console.log(myAudio.src)
    myAudio.play()
  },

  //播放视频
  playvideo(e) {
    var that = this
    var videoId = e.currentTarget.id
    that.data.myVideo = wx.createVideoContext(videoId, that)
    that.data.myVideo.requestFullScreen({
      direction: 0
    })

    that.setData({
      isShowTextarea: false
    })
  },

  //视频全屏与退出
  bindfullscreenchange(e) {
    var that = this
    if (e.detail.fullScreen) {
      that.setData({
        isShowTextarea: false
      })
    } else {
      if (that.data.myVideo) {
        that.data.myVideo.stop()
      }
      that.setData({
        isShowTextarea: true
      })
    }
  },

  toBackTask() {
    this.setData({
      isShowBack: true
    })
  },

  // 确定退回
  confirmEvent(e) {
    let params =  {
      key: 'traffic',
      tasks_id: this.data.vehTaskId,
      reason: e.detail.reason,
      case_id: this.data.vehId,
    }
    indexModel.taskCaseReturn(params, res=> {
      if(res.data.status == 1) {
        wx.navigateBack({
          delta: 1
        })
      } else {
        wx.showToast({
          title: res.data.msg ? res.data.msg : '操作超时',
          icon: 'none'
        })
      }
    })
  }

})