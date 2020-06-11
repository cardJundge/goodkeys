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
        if (newVal == 'more') {
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
      { name: '正常赔付', id: 1 },
      { name: '拒赔处理', id: 2 },
      { name: '减损处理', id: 3 },
    ],
    opinionId: 1,
    personnelId: 0,
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
      this.setData({
        opinionId: e.currentTarget.dataset.id
      })
    },

    // 选择人员
    changePersonnel(e) {
      console.log(e)
      this.setData({
        personnelId: e.currentTarget.dataset.id
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
          this.setData({
            personnelList: res.data.data
          })
        }
      })
    },

    // 筛选（更多）确定
    toConfirm() {
      this.setData({
        isShow: false
      })
      this.triggerEvent('changemoreEvent')
    },

    toReset() {
      this.setData({
        personnelId: 0,
        opinionId: 1
      })
    }
  }
})
