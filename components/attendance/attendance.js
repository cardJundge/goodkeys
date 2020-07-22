// 考勤弹框
Component({
  properties: {
    isShow: {
      type: Boolean,
      value: {},
      observer(newVal, oldVal) {
        this.getWeekList()
      }
    },
    flag: {
      type: String
    },
    isActive: {
      type: Boolean
    },
    weekData: {
      type: Array
    }
  },

  data: {
    typeList: [{ name: '固定时间上下班', intro: '说明:所有人按照相同的时间打卡', id: 0 }, { name: '按排班时间上下班', intro: '说明:不同人员根据各自排班打卡', id: 1 }],
    weekList: [{ name: '一', checked: false }, { name: '二', checked: false }, { name: '三', checked: false }, { name: '四', checked: false }, { name: '五', checked: false }, { name: '六', checked: false }, { name: '日', checked: false }],
    weekChecked: []
  },

  methods: {
    getWeekList() {
      // console.log(this.data.weekData)
      this.data.weekList.forEach((item, index) => {
        item.checked = false
        this.data.weekData.forEach((item1, index1) => {
          if (item.name == item1) {
            item.checked = true
          }
        })
      })
      this.setData({
        weekList: this.data.weekList
      })
    },

    typeChange(e) {
      let index = e.currentTarget.dataset.index,
        id = e.currentTarget.dataset.id
      this.setData({
        isActive: index,
        isShow: false
      })
      this.triggerEvent('typeChangeEvent', { typeId: id })
    },

    toCancel() {
      this.setData({
        isShow: false
      })
    },

    toConfirm() {
      this.setData({
        isShow: false
      })
      this.triggerEvent('confirmEvent', { weekChecked:  this.data.weekChecked})
    },

    weekSelect(e) {
      this.data.weekChecked = []
      let name = e.currentTarget.dataset.name
      this.data.weekList.forEach((item, index)=> {
        if (item.name == name) {
          item.checked = !item.checked
        }
        if (item.checked == true) {
          this.data.weekChecked.push(item.name)
        }
      })
      this.setData({
        weekList: this.data.weekList
      })
    }
  }
})
