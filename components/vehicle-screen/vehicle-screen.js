// 车务调查列表筛选
import {
  PersonnelModel
} from '../../pages/personnel/models/personnel.js'
var personnelModel = new PersonnelModel()
Component({
  properties: {
    isShow: {
      type: Boolean
    },
    flag: {
      type: String,
      value: {},
      observer(newVal, oldVal) {
        if (!this.data.personnelList && newVal == 'more') {
          this.getTaskList()
        }
      }
    }
  },

  data: {
    statusList: [{
      name: '全部案件',
      id: 0
    },
    {
      name: '已分配',
      id: 1
    },
    {
      name: '进行中',
      id: 2
    },
    {
      name: '预结案',
      id: 3
    },
    {
      name: '已结案',
      id: 4
    },
    {
      name: '转单',
      id: 5
    }
    ],
    statusId: 0,
    isDisabled: true,
    opinionList: [
      { name: '正常赔付', checked: false },
      { name: '拒赔处理', checked: false },
      { name: '减损处理', checked: false },
    ],
  },

  methods: {
    changeStatus(e) {
      this.setData({
        statusId: e.currentTarget.dataset.id,
        statusName: e.currentTarget.dataset.name,
        isShow: false
      })
      this.triggerEvent('changeStatusEvent', { statusId: this.data.statusId, statusName: this.data.statusName })
    },

    // 选择赔付意见
    changeOpinion(e) {
      this.data.opinionData = []
      this.data.opinionList.forEach((item, index) => {
        if (item.name == e.currentTarget.dataset.name) {
          item.checked = !item.checked
        }
      })
      this.data.opinionList.forEach((item, index) => {
        if (item.checked == true) {
          this.data.opinionData.push(item.name)
        }
      })
      this.setData({
        opinionList: this.data.opinionList
      })
      console.log(this.data.opinionList)
    },

    // 选择人员
    changePersonnel(e) {
      this.data.personnelData = []
      this.data.personnelList.forEach((item, index) => {
        if (item.id == e.currentTarget.dataset.id) {
          item.checked = !item.checked
        }
      })
      this.data.personnelList.forEach((item, index) => {
        if (item.checked == true) {
          this.data.personnelData.push(item.id)
        }
      })

      this.setData({
        personnelList: this.data.personnelList
      })
    },

    // 开始日期选择
    startDateChange(e) {
      this.setData({
        startDate: e.detail.value
      })
      this.judgeBtn()
    },

    // 结束日期选择
    endDateChange(e) {
      this.setData({
        endDate: e.detail.value
      })
      this.judgeBtn()
    },

    // 日期确定
    toTimeConfirm() {
      this.setData({
        isShow: false
      })
      this.triggerEvent('changeTimeEvent', { startDate: this.data.startDate, endDate: this.data.endDate })
    },

    // 判断完成按钮是否可以点击（时间）
    judgeBtn() {
      if (this.data.startDate && this.data.endDate) {
        this.setData({
          isDisabled: false
        })
      } else {
        this.setData({
          isDisabled: true
        })
      }
    },

    getTaskList() {
      let params = {
        module_id: 8,
        keywords: ''
      }
      personnelModel.getTaskList(params, res => {
        if (res.data.status == 1) {
          res.data.data.forEach((item, index) => {
            item.checked = false
          })
          this.setData({
            personnelList: res.data.data
          })
        }
      })
    },

    // 筛选（更多）确定
    toMoreConfirm() {
      console.log(this.data.personnelData, this.data.opinionData)
      this.setData({
        isShow: false
      })
      this.triggerEvent('changemoreEvent', { personnelData: this.data.personnelData, opinionData: this.data.opinionData })
    },

    // 更多筛选重置
    toMoreReset() {
      this.data.personnelList.forEach((item, index) => {
        item.checked = false
      })
      this.data.opinionList.forEach((item, index) => {
        item.checked = false
      })
      this.setData({
        personnelList: this.data.personnelList,
        opinionList: this.data.opinionList
      })
      this.data.personnelData = []
      this.data.opinionData = []
      this.triggerEvent('changemoreEvent', { personnelData: this.data.personnelData, opinionData: this.data.opinionData })
    },

    // 时间筛选重置
    toTimeReset() {
      this.setData({
        isShow: false,
        startDate: '',
        endDate: ''
      })
      this.judgeBtn()
      this.triggerEvent('changeTimeEvent', { startDate: this.data.startDate, endDate: this.data.endDate })
    }
  }
})
