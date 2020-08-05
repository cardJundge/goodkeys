// 添加模块==》第三步-copy
var app = getApp()
import {
  PersonnelModel
} from '../../../personnel/models/personnel.js'
import {
  MineModel
} from '../../../mine/models/mine.js'
import {
  IndexModel
} from '../../models/index.js'

var indexModel = new IndexModel()
var personnelModel = new PersonnelModel()
var mineModel = new MineModel()
Page({
  data: {
    selectPeopleShow: false, // 选择人员模态框
    fieldBoxShow: false, //任务流展开和折叠
    operationDataTemp: [],
    btnDisabled: false // 防止重复提交
  },

  onLoad(options) {
    let fieldDataTemp = {
      data: JSON.parse(options.fieldData),
      bubble: false
    }
    this.setData({
      moduleName: options.moduleName,
      fieldData: JSON.parse(options.fieldData),
      fieldDataTemp: fieldDataTemp,
      imgUrl: app.globalData.imgUrl
    })
    this.data.moduleIcon = options.moduleIcon
    // console.log('1', this.data.fieldData)
    this.getTaskList()
    this.getUserList()
  },

  onShow() {
    this.hideBubble()
    // console.log('2', this.data.taskInputData, '3', this.data.approvalData, '4', this.data.evaluateData)
    if (this.data.taskInputData) {
      this.data.operationDataTemp[this.data.operationFieldIndex].data.column = this.data.taskInputData
    }
    if (this.data.approvalData) {
      this.data.operationDataTemp[this.data.operationFieldIndex].data.column = this.data.approvalData
    }
    if (this.data.evaluateData) {
      this.data.operationDataTemp[this.data.operationFieldIndex].data.column = this.data.evaluateData
    }
    this.setData({
      operationDataTemp: this.data.operationDataTemp
    })
  },

  // 获取作业员列表
  getTaskList() {
    let params = { keywords: '' }
    personnelModel.getTaskList(params, res => {
      if (res.data.status == 1) {
        this.setData({
          taskList: res.data.data
        })
      }
    })
  },

  // 获取管理员列表
  getUserList() {
    mineModel.getAdminList(res => {
      if (res.data.status == 1) {
        this.setData({
          userList: res.data.data
        })
      }
    })
  },

  // 气泡
  showBubble(e) {
    this.hideBubble()
    let sign = e.currentTarget.dataset.sign,
      indexTemp = e.currentTarget.dataset.index
    if (sign) {
      let string = 'fieldDataTemp.bubble'
      this.setData({
        [string]: true
      })
    } else {
      this.data.operationDataTemp.forEach((item, index) => {
        if (indexTemp == index) {
          let string = 'operationDataTemp[' + index + '].bubble'
          this.setData({
            [string]: true
          })
        }
      })
    }
  },

  // 隐藏气泡
  hideBubble() {
    this.data.operationDataTemp.forEach((item, index) => {
      item.bubble = false
    })
    this.setData({
      operationDataTemp: this.data.operationDataTemp
    })
  },

  // 选择人员
  toSelectPeople(e) {
    this.setData({
      peopleFlag: e.currentTarget.dataset.flag,
      selectPeopleShow: true
    })
    this.data.operationPeopleIndex = e.currentTarget.dataset.index
    if (this.data.peopleFlag == 'taskinput') {
      this.setData({
        taskIdData: this.data.operationDataTemp[this.data.operationPeopleIndex].data.user_id
      })
    } else if (this.data.peopleFlag == 'approval') {
      this.setData({
        userIdData: this.data.operationDataTemp[this.data.operationPeopleIndex].data.user_id
      })
    }
  },

  // 填写字段（进入员工、管理、用户操作）
  toWriteColumn(e) {
    this.data.operationFieldIndex = e.currentTarget.dataset.index
    this.data.operationDataTemp.forEach((item, index) => {
      if (this.data.operationFieldIndex == index) {
        let data = JSON.stringify(item.data.column)
        if (item.data.flag == 'taskinput') {
          wx.navigateTo({
            url: './task-input/task-input?taskInputData=' + data,
          })
        } else if (item.data.flag == 'approval') {
          wx.navigateTo({
            url: './approval/approval?approvalData=' + data,
          })
        } else if (item.data.flag == 'evaluate') {
          wx.navigateTo({
            url: './evaluate/evaluate?evaluateData=' + data,
          })
        }
      }
    })
  },

  // (任务流)字段展示（折叠）
  unfoldFieldBox() {
    this.setData({
      fieldBoxShow: !this.data.fieldBoxShow
    })
  },

  // 添加节点标题
  getTitleInput(e) {
    let indexTemp = e.currentTarget.dataset.index
    this.data.operationDataTemp[indexTemp].data.name = e.detail.value
    this.setData({
      operationDataTemp: this.data.operationDataTemp
    })
  },

  // 添加所有操作项的节点
  addOperationItem(e) {
    let flag = e.currentTarget.dataset.flag,
      sign = e.currentTarget.dataset.sign,
      indexTemp = e.currentTarget.dataset.index,
      dataTemp = {
        bubble: false,
        data: {
          name: '',
          user_id: [],
          user_type: 0,
          column: [],
          flag: flag
        }
      }
    this.data.operationDataTemp.splice(indexTemp + 1, 0, dataTemp)
    this.setData({
      operationDataTemp: this.data.operationDataTemp
    })
    if (sign) {
      let string = 'fieldDataTemp.bubble'
      this.setData({
        [string]: false
      })
    } else {
      this.hideBubble()
    }
  },

  // 右侧模态框点击确定返回
  selPeopleConfirmEvent(e) {
    if (e.detail.userIdData) {
      this.data.operationDataTemp[this.data.operationPeopleIndex].data.user_id = e.detail.userIdData
    }
    if (e.detail.taskIdData) {
      this.data.operationDataTemp[this.data.operationPeopleIndex].data.user_id = e.detail.taskIdData
    }
    this.setData({
      operationDataTemp: this.data.operationDataTemp
    })
  },

  // 确定（添加模块）
  onConfirm() {
    this.hideBubble()
    console.log(this.data.operationDataTemp)
    let operation = [], nameNull = [], fieldNull = []
    this.data.operationDataTemp.forEach((item, index) => {
      if (!item.data.name) {
        return nameNull.push(item.data)
      }
      if (!item.data.column || item.data.column.length == 0) {
        return fieldNull.push(item.data)
      }
      operation.push(item.data)
    })

    if (nameNull.length != 0) {
      return wx.showToast({
        title: '节点名称不能为空',
        icon: 'none'
      })
    }
    if (fieldNull.length != 0) {
      return wx.showToast({
        title: '节点字段不能为空',
        icon: 'none'
      })
    }

    let params = {
      name: this.data.moduleName,
      icon: this.data.moduleIcon,
      field: this.data.fieldData,
      operation: this.data.operationDataTemp
    }
    console.log(params)
    if (this.data.btnDisabled == false) {
      this.data.btnDisabled = true
      // indexModel.addModule(params, res => {
      //   if (res.data.status == 1) {
      //     wx.showToast({
      //       title: '模块创建成功',
      //     })
      //     wx.switchTab({
      //       url: '../../index',
      //     })
      //     this.data.btnDisabled = false
      //   } else {
      //     if (res.data.msg.match('Token')) { } else {
      //       wx.showToast({
      //         title: res.data.msg ? res.data.msg : '请求超时',
      //         icon: 'none'
      //       })
      //     }
      //      this.data.btnDisabled = false
      //   }
      // })
    }
  }
})