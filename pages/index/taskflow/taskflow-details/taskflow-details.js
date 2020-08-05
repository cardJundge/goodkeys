// 自定义模块详情
var QQMapWX = require('../../../../dist/qqmap-wx-jssdk.min.js');
var address = new QQMapWX({
  key: 'OEIBZ-MF2HD-B6U4J-HRVAP-AASNO-CMBEQ'
})
import util from '../../../../utils/util.js'
import {
  IndexModel
} from '../../models/index.js'

var indexModel = new IndexModel()
var app = getApp()
Page({
  data: {
    tabList: [],
    isActive: 0,
    approvalBoxShow: false,
    unfold: false,
    optionChecked: [],
    tempOption: [],
    isDisabled: false
  },

  onLoad(options) {
    this.setData({
      imgUrl: app.globalData.imgUrl
    })
    this.data.listId = options.listId
    this.getTaskflowDetail()
    wx.setNavigationBarTitle({
      title: options.moduleName
    })
  },

  onShow() {
    this.changeTime()
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        address.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: res => {
            this.setData({
              address: res.result.address
            })
          }
        })
      }
    })
  },

  // 进入相册
  toAlbum(e) {
    let data = JSON.stringify(e.currentTarget.dataset.imgdata),
    name = e.currentTarget.dataset.name
    wx.navigateTo({
      url: './album/album?data=' + data + '&name=' + name,
    })
  },

  // 更新时间
  changeTime() {
    var time = util.formatTime(new Date())
    this.setData({
      dateTime: time
    })
  },

  // 展开
  toUnfold() {
    this.setData({
      unfold: true
    })
  },

  // 收起来
  toPackup() {
    this.setData({
      unfold: false
    })
  },

  // 获取详情
  getTaskflowDetail() {
    let params = {
      id: this.data.listId
    }
    this.data.tabList = []
    indexModel.getTaskflowDetail(params, res => {
      if (res.data.status == 1) {
        res.data.data.field.forEach((item, index) => {
          if (item.type == 'check') {
            item.value = item.value.checked.join(',')
          }
        })

        this.setData({
          fieldInfo: res.data.data.field,
          startTime: res.data.data.start_date,
          endTime: res.data.data.end_date,
          taskName: res.data.data.task_id.nickname
        })
        if (res.data.data.norm) {
          res.data.data.norm.forEach((item, index) => {
            if (item.type == 'check' && item.record) {
              item.record.forEach((item1, index1) => {
                item1.content = item1.content.checked.join(',')
              })
            }
          })
          this.data.tabList.push('员工操作项')
          this.data.norm = res.data.data.norm
        }
        if (res.data.data.approval) {
          res.data.data.approval.forEach((item, index) => {
            if (item.type == 'check' && item.record) {
              item.record.forEach((item1, index1) => {
                item1.contentCheck = item1.content.checked.join(',')
              })
            }
          })
          this.data.tabList.push('管理操作项')
          this.data.approval = res.data.data.approval
        }
        if (res.data.data.comment) {
          this.data.tabList.push('评价操作项')
          this.data.evaluate = res.data.data.comment
        }
        this.setData({
          tabList: this.data.tabList,
          evaluate: this.data.evaluate,
          approval: this.data.approval,
          norm: this.data.norm
        })
      }
    })
  },

  // 预览大图(记录图片预览)
  previewImage(e) {
    let name = e.currentTarget.dataset.name,
      imgArr = [],
      imgIndex = e.currentTarget.dataset.index,
      imgFlag = e.currentTarget.dataset.flag,
      recordIndex = e.currentTarget.dataset.record,
      tempData
    if (imgFlag == 'field') {
      this.data.fieldInfo.forEach((item, index) => {
        if (item.name == name) {
          item.value.forEach((item1, index1) => {
            imgArr.push(this.data.imgUrl + item1)
          })
          wx.previewImage({
            urls: imgArr,
            current: imgArr[imgIndex]
          })
          // console.log(imgArr, imgArr[imgIndex])
        }
      })
    } else {
      if (imgFlag == 'task')
        tempData = this.data.norm
      if (imgFlag == 'approval')
        tempData = this.data.approval
      tempData.forEach((item, index) => {
        if (item.name == name) {
          item.record.forEach((item1, index1) => {
            if (recordIndex == index1) {
              item1.content.forEach((item2, index2) => {
                imgArr.push(this.data.imgUrl + item2)
              })
            }
          })
          wx.previewImage({
            urls: imgArr,
            current: imgArr[imgIndex]
          })
        }
      })
    }
  },

  // 预览大图(临时图片预览)
  previewImage01(e) {
    let imgIndex = e.currentTarget.dataset.index,
    imgArr = []
    this.data.imageList.forEach((item, index) => {
      imgArr.push(this.data.imgUrl + item)
    })
    wx.previewImage({
      urls: imgArr,
      current: imgArr[imgIndex]
    })
  },

  // 删除图片
  delImage(e) {
    let imgIndex = e.currentTarget.dataset.index
    this.data.imageList.forEach((item, index) => {
      if (index == imgIndex) {
        this.data.imageList.splice(index, 1)
      }
    })
    this.setData({
      imageList: this.data.imageList
    })
  },

  // 去完成任务
  toComplete(e) {
    let name = e.currentTarget.dataset.name,
    type = e.currentTarget.dataset.type,
    isTempImg = e.currentTarget.dataset.temp
    if (type == 'image') {
      this.setData({
        currentImgName: name
      })
      wx.showActionSheet({
        itemList: ['拍照', '从手机相册选择'],
        success: (res1) => {
          if (isTempImg == 'true') {
            // console.log(this.data.imageList)
          } else {
            this.data.imageList = []
          }
          wx.chooseImage({
            count: 9,
            // 可以指定是原图还是压缩图
            sizeType: ['compressed'],
            // 可以指定来源是相册还是相机
            sourceType: res1.tapIndex === 0 ? ['camera'] : ['album'],
            success: (res2) => {
              this.data.tempFilePaths = res2.tempFilePaths
              this.handle(0, name)
              // for (let i = 0; i < res2.tempFilePaths.length; i++) {

              // }
              // 调用完成审核
              // this.toCompleteApproval(name)
            }
          })
        }
      })
    } else if (type == 'text' || type == 'int') {
      this.setData({
        approvalBoxShow: true,
        approvalBoxName: name,
        approvalType: type
      })
    }
  },

  // 下拉框-单选
  optionSelect(e) {
    let name = e.currentTarget.dataset.name
    this.data.approval.forEach((item, index) => {
      if (item.name == name) {
        item.value = item.option[e.detail.value]
      }
    })
    this.toCompleteApproval(name)
  },

  // 下拉框-多选
  optionCheck(e) {
    let name = e.currentTarget.dataset.name,
      type = e.currentTarget.dataset.type,
      option = e.currentTarget.dataset.option,
      tempOption = []
    option.forEach((item, index) => {
      tempOption.push({
        name: '',
        checked: false
      })
      if (this.data.optionChecked.length == 0) {
        tempOption[index].name = item
      } else {
        this.data.optionChecked.forEach((item1, index1) => {
          if (item == item1) {
            tempOption[index].name = item
            tempOption[index].checked = true
          } else {
            tempOption[index].name = item
          }
        })
      }
    })
    this.setData({
      optionData: option,
      tempOption: tempOption,
      approvalBoxShow: true,
      approvalBoxName: name,
      approvalType: type
    })
  },

  // 弹框确定
  boxConfirm(e) {
    let selectedOption = [],
      name = e.detail.approvalBoxName,
      value = e.detail.approvalBoxVal,
      type = e.detail.approvalType
    if (type == 'check') {
      e.detail.approvalBoxList.forEach((item, index) => {
        if (item.checked == true) {
          selectedOption.push(item.name)
        }
      })
      this.data.approval.forEach((item, index) => {
        if (item.name == name) {
          item.value['option'] = this.data.optionData
          item.value['checked'] = selectedOption
        }
      })
    } else {
      this.data.approval.forEach((item, index) => {
        if (item.name == name) {
          item.value = value
        }
      })
    }

    this.toCompleteApproval(name)
  },

  handle(i, name) {
    if (i < this.data.tempFilePaths.length) {
      this.uploadimage(i, name, res => {
        this.handle(i + 1, name)
      })
    } else {
      wx.hideLoading()
      // console.log("全部上传完成")
      // this.toCompleteApproval(name)
    }
  },

  // 上传
  uploadimage(i, name, callback) {
    wx.uploadFile({
      url: app.globalData.hostName + '/api/auth/upload',
      filePath: this.data.tempFilePaths[i],
      name: 'file',
      success: res => {
        let data = JSON.parse(res.data)
        console.log(data)
        if (data.status == 1) {
          wx.showLoading({
            title: i + 1 + '/' + this.data.tempFilePaths.length,
          })
          this.data.imageList.push(data.data.filename)
          this.data.approval.forEach((item, index) => {
            if (item.name == name) {
              item.value = this.data.imageList
            }
          })
          this.setData({
            approval: this.data.approval,
            imageList: this.data.imageList
          })
          callback(true)
        } else {
          wx.showToast({
            title: data.msg ? data.msg : '操作超时',
            icon: 'none'
          })
        }
      },
      fail: (err) => { }
    })
  },

  toCompleteApprovalTemp(e) {
    let name = e.currentTarget.dataset.name
    if (this.data.isDisabled == false) {
      this.data.isDisabled = true
      this.toCompleteApproval(name)
    }
  },

  // 完成审核
  toCompleteApproval(name) {
    this.changeTime()
    let params = {}, tempRecord = {}
    params.record = []
    this.data.approval.forEach((item, index) => {
      if (item.name == name) {
        if (item.record) {
          params.record = item.record
        }
        tempRecord['content'] = item.value
        params.approval_id = index
        params.title = item.name
      }
    })
    tempRecord['place'] = this.data.address
    tempRecord['date'] = this.data.dateTime
    params.case_id = this.data.listId
    params.record.push(tempRecord)
    indexModel.toApproval(params, res => {
      if (res.data.status == 1) {
        this.getTaskflowDetail()
        this.setData({
          imageList: []
        })
        this.data.isDisabled = false
      }
    })
  },

  changeTab(e) {
    this.setData({
      isActive: e.currentTarget.dataset.index
    })
  }
})