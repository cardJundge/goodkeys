// 添加人员
import WxValidate from '../../../dist/WxValidate.js'
import {
  PersonnelModel
} from './../models/personnel.js'
var app = getApp()

var personnelModel = new PersonnelModel()
Page({
  data: {
    selectData: [],
    otherSelected: [],
    module: { system: [], define: []},
    moduleSelect: [],
    number: null,
    groupData: [],
    isLeader: 0,
    isEdit: false,
    formData: {
      nickName: '',
      mobile: '',
      jobNo: '',
      org: '',
      password: '',
    }
  },
  onLoad: function(options) {
    this.setData({
      isEdit: false
    })
    this.getGroup()
    this.initValidate() // 验证规则函数
    this.getModule()
    if(options.data) {
      this.setData({
        isEdit: true
      })
      let data = JSON.parse(options.data)
      this.setData({
        formData: {
          nickName: data.nickname,
          mobile: data.mobile,
          jobNo: data.job_no,
          org: data.org
        },
        groupId:data.group_id,
        taskId: data.id,
        isLeader: data.type,
        moduleSelect: data.module
      })
    }
   
  },

  initValidate() {
    const rules = {
      nickName: {
        required: true
      },
      mobile: {
        required: true,
        tel: true
      }
    }
    const messages = {
      nickName: {
        required: '请输入作业员姓名'
      },
      mobile: {
        required: '请输入作业员电话',
        tel: '请输入正确的作业员电话'
      }
    }
    this.WxValidate = new WxValidate(rules, messages)
  },

  // 获取服务商拥有的模块！！
  getModule() {
    personnelModel.getModule(res => {
      if (res.data.status == 1) {
        res.data.data.forEach((item, index) => {
          if(item.key) {
            this.data.selectData.push(item)
          } else  {
            this.data.otherSelected.push(item)
          }
        })
        this.data.selectData.forEach((item, index) => {
          this.data.moduleSelect.forEach((its, ins) => {
            if (its.id == item.id) {
              item.selected = true
            }
          })
        })
        this.data.otherSelected.forEach((item, index) => {
          this.data.moduleSelect.forEach((its, ins) => {
            if (its.id == item.id) {
              item.selected = true
            }
          })
        })
        this.setData({
          selectData: this.data.selectData,
          otherSelected: this.data.otherSelected
        })
        this.changeStyleType()
        this.changeOtherStyleType()
      }
    })
  },

  // 获取分组
  getGroup() {
    personnelModel.getGroupList(res => {
      if (res.data.status == 1) {
        this.setData({
          groupData: res.data.data
        })
        let groupDataName = []
        this.data.groupData.forEach((item, index) => {
          groupDataName.push(item.name)
          if(item.id == this.data.groupId) {
            this.setData({
              number: index
            })
          }
        })
        this.setData({
          groupDataName: groupDataName
        })
      }
    })
  },

  // 是否为组长
  leaderChange(e) {
    this.setData({
      isLeader: e.detail.value ? '1' : '0',
    })
  },

  // 分组
  bindGroupChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      number: e.detail.value
    })
  },

  // 选择人员类型
  changeStyle(e) {
    let string = "selectData[" + e.target.dataset.index + "].selected"
    this.setData({
      [string]: !this.data.selectData[e.target.dataset.index].selected
    })
    this.changeStyleType()
  },

  // 自定义模块选择
  changeOtherStyle(e) {
    let string = "otherSelected[" + e.target.dataset.index + "].selected"
    this.setData({
      [string]: !this.data.otherSelected[e.target.dataset.index].selected
    })
    this.changeOtherStyleType()
  },

  changeStyleType() {
    let detailValue = this.data.selectData.filter(it => it.selected).map(it => it.id)
    console.log('所有选中的值为：', detailValue)
    this.data.module.system = []
    detailValue.map((item, index) => {
      this.data.module.system.push(item)
    })
  },

  changeOtherStyleType() {
    let detailValue = this.data.otherSelected.filter(it => it.selected).map(it => it.id)
    console.log('所有选中的值为：', detailValue)
    this.data.module.define = []
    detailValue.map((item, index) => {
      this.data.module.define.push(item)
    })
  },

  // 提交添加人员表单
  formSubmit(e) {
    let params = e.detail.value
    if (!this.WxValidate.checkForm(params)) {
      const error = this.WxValidate.errorList[0]
      wx.showToast({
        title: error.msg,
        icon: 'none'
      })
      return false
    } else if (this.data.module.system.length == 0 && this.data.module.define.length == 0) {
      return wx.showToast({
        title: '请选择人员类型',
        icon: 'none'
      })
    } else {
      params.module = this.data.module
      params.type = this.data.isLeader
      params.groupId = this.data.number ? this.data.groupData[this.data.number].id : 0
      params.serviceId = app.globalData.userInfo.id
      if(this.data.isEdit) {
        params.id = this.data.taskId
        personnelModel.editTask(params, res=> {
          if (res.data.status == 1) {
            wx.showToast({
              title: '修改成功',
              success: res => {
                wx.navigateBack({
                  delta: 1
                })
              }
            })
          } else {
            if (res.data.msg.match('Token已过期或失效')) {
            } else {
              wx.showToast({
                title: res.data.msg ? res.data.msg : '请求超时',
                icon: 'none'
              })
            }
          }
        })
      } else {
        personnelModel.addTask(params, res => {
          if (res.data.status == 1) {
            wx.showToast({
              title: '添加成功',
              success: res => {
                wx.navigateBack({
                  delta: 1
                })
              }
            })
          } else {
            if (res.data.msg.match('Token已过期或失效')) {
            } else {
              wx.showToast({
                title: res.data.msg ? res.data.msg : '请求超时',
                icon: 'none'
              })
            }
          }
        })
      }
     
    }

  }
})