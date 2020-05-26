// 考勤弹框
Component({
  properties: {
    isShow: {
      type: Boolean
    },
    flag: {
      type: String
    }
  },

  data: {
    isActive: 0,
    typeList: [{ name: '固定时间上下班', intro: '说明:所有人按照相同的时间打卡', id: 1 }, { name: '按排班时间上下班', intro: '说明:不同人员根据各自排班打卡', id: 2 }],
    weekList: [{ name: '一', checked: true }, { name: '二', checked: true }, { name: '三', checked: true }, { name: '四', checked: true }, { name: '五', checked: true }, { name: '六', checked: true }, { name: '日', checked: true }]
  },

  methods: {
    typeChange(e) {
      let index = e.currentTarget.dataset.index,
        id = e.currentTarget.dataset.id,
        name = e.currentTarget.dataset.name
      this.setData({
        isActive: index,
        isShow: false
      })
      this.triggerEvent('typeChangeEvent', { typeId: id, typeName: name })
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
    },

    weekSelect(e) {
      let name = e.currentTarget.dataset.name
      this.data.weekList.forEach((item, index)=> {
        if (item.name == name) {
          item.checked = !item.checked
        }
      })
      this.setData({
        weekList: this.data.weekList
      })
    }
  }
})
