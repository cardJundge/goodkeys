// 自定义模块-选择人员
import {
  PersonnelModel
} from '../../pages/personnel/models/personnel.js'
import {
  MineModel
} from '../../pages/mine/models/mine.js'
var app = getApp()

var personnelModel = new PersonnelModel()
var mineModel = new MineModel()
Component({
  properties: {
    isShow: {
      type: Boolean
    },
    userList: {
      type: Array
    },
    taskList: {
      type: Array
    },
    peopleFlag: {
      type: String
    },
    taskIdData: {
      type: Array,
      value: [],
      observer(newVal, oldVal) {
        this.judgeTaskList()
      }
    },
    userIdData: {
      type: Array,
      value: [],
      observer(newVal, oldVal) {
        this.judgeUserList()
      }
    }
  },

  data: {
    imgUrl: app.globalData.imgUrl,
    windowHeight: wx.getSystemInfoSync().screenHeight
  },

  methods: {
    // 判断作业员列表（被选中的）
    judgeTaskList() {
      this.data.taskList.forEach((item, index) => {
        item.checked = false
        this.data.taskIdData.forEach((item1, index1) => {
          if (item.id == item1) {
            item.checked = true
          }
        })
      })
      this.setData({
        taskList: this.data.taskList
      })
    },

    // 作业员选择
    taskChange(e) {
      this.data.taskIdData = e.detail.value
    },

    // 判断管理员列表（被选中的）
    judgeUserList() {
      this.data.userList.forEach((item, index) => {
        item.checked = false
        this.data.userIdData.forEach((item1, index1) => {
          if (item.id == item1) {
            item.checked = true
          }
        })
      })
      this.setData({
        userList: this.data.userList
      })
    },

    // 管理员选择
    userChange(e) {
      this.data.userIdData = e.detail.value
    },

    onConfirm() {
      this.setData({
        isShow: false
      })
      if (this.data.peopleFlag == 'taskinput') {
        this.triggerEvent('selPeopleConfirmEvent', { taskIdData: this.data.taskIdData })
      } else if (this.data.peopleFlag == 'approval') {
        this.triggerEvent('selPeopleConfirmEvent', { userIdData: this.data.userIdData })
      }
    },

    onCancel() {
      this.setData({
        isShow: false
      })
    }
  }
})
