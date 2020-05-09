// 类型选择
Page({
  data: {
    typeList: [{
      name: '文本型',
      value: 'text',
      checked: 'true'
    },
    {
      name: '数字型',
      value: 'int',
    },
    {
      name: '下拉选择-单选型',
      value: 'select',
    },
    {
      name: '下拉选择-多选型',
      value: 'check',
    },
    {
      name: '日期型',
      value: 'dateFather',
    },
    {
      name: '图片型',
      value: 'image',
    },
    {
      name: '位置型',
      value: 'location',
    },
    {
      name: '打卡型',
      value: 'click',
    }
    ],
    dateTypeData: [{
      name: '时间和日期(例:2020-01-01 00:00)',
      value: 'datetime',
      checked: 'true'
    },
    {
      name: '仅日期(例:2020-01-01)',
      value: 'date'
    },
    {
      name: '仅时间(例:00:00)',
      value: 'time'
    }
    ],
    dateBoxShow: false,
    selectBoxShow: false,
    selectData: [],
    checkData: [],
    gradeList: ['5', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55', '60', '65', '70', '75', '80', '85', '90', '95', '100']
  },

  onLoad(options) {
    console.log(options)
    if (options.flag == 'task') {
      if (options.type == 'select') {
        this.setData({
          flag: options.flag,
          tempData: {
            name: options.name,
            weight: options.weight,
            type: options.type,
            option: JSON.parse(options.option)
          },
          selectData: JSON.parse(options.option)
        })
      } else if (options.type == 'check') {
        this.setData({
          flag: options.flag,
          tempData: {
            name: options.name,
            weight: options.weight,
            type: options.type,
            value: {
              option: JSON.parse(options.option)
            }
          },
          checkData: JSON.parse(options.option)
        })
      } else {
        this.setData({
          flag: options.flag,
          tempData: {
            name: options.name,
            weight: options.weight,
            type: options.type
          }
        })
      }
      this.data.gradeList.forEach((item, index) => {
        if (item == options.weight) {
          this.setData({
            gradeIndex: index
          })
        }
      })
    } else {
      if (options.type == 'select') {
        this.setData({
          flag: options.flag,
          switchChecked: options.required == 1 ? true : false,
          tempData: {
            name: options.name,
            required: options.required,
            type: options.type,
            option: JSON.parse(options.option)
          },
          selectData: JSON.parse(options.option)
        })
      } else if (options.type == 'check') {
        this.setData({
          flag: options.flag,
          switchChecked: options.required == 1 ? true : false,
          tempData: {
            name: options.name,
            required: options.required,
            type: options.type,
            value: {
              option: JSON.parse(options.option)
            }
          },
          checkData: JSON.parse(options.option)
        })
      } else {
        this.setData({
          flag: options.flag,
          tempData: {
            name: options.name,
            required: options.required,
            type: options.type
          },
          switchChecked: options.required == 1 ? true : false
        })
      }
    }

    this.data.typeList.forEach((item, index) => {
      if (options.type != 'select' && options.type != 'check' && (item.value == options.type)) {
        item.checked = true
      } else if (item.value == 'dateFather' && (options.type == 'date' || options.type == 'time' || options.type == 'datetime')) {
        item.checked = true
        this.setData({
          dateBoxShow: true,
          selectBoxShow: false,
          checkBoxShow: false
        })
        this.data.dateTypeData.forEach((item1, index1) => {
          if (options.type == item1.value) {
            item1.checked = true
          }
        })
      } else if (options.type == 'select' && (item.value == options.type)) {
        item.checked = true
        this.setData({
          dateBoxShow: false,
          selectBoxShow: true,
          checkBoxShow: false
        })
      } else if (options.type == 'check' && (item.value == options.type)) {
        item.checked = true
        this.setData({
          dateBoxShow: false,
          selectBoxShow: false,
          checkBoxShow: true
        })
      }
    })
    this.setData({
      typeList: this.data.typeList,
      dateTypeData: this.data.dateTypeData
    })
  },

  // 权重:选择分数
  gradeSelect(e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.data.tempData.weight = this.data.gradeList[e.detail.value]
    this.setData({
      gradeIndex: e.detail.value
    })
  },

  // 选择是否必填(作业员录入)
  switchChange(e) {
    // console.log('switch1 发生 change 事件，携带值为', e.detail.value)
    if (e.detail.value == true) {
      this.data.tempData.required = 1
    } else {
      this.data.tempData.required = 0
    }
    this.setData({
      switchChecked: e.detail.value,
      tempData: this.data.tempData
    })

  },

  // 选择类型
  typeChange(e) {
    if (e.detail.value == 'dateFather') {
      this.data.tempData.type = 'datetime'
      this.setData({
        dateBoxShow: true,
        selectBoxShow: false,
        checkBoxShow: false
      })
    } else if (e.detail.value == 'select') {
      this.data.tempData.type = e.detail.value
      this.data.tempData.option = this.data.selectData ? this.data.selectData : ''
      this.setData({
        dateBoxShow: false,
        selectBoxShow: true,
        checkBoxShow: false
      })
    } else if (e.detail.value == 'check') {
      this.data.tempData.type = e.detail.value
      this.data.tempData.value = {
        option: this.data.checkData ? this.data.checkData : []
      }
      this.setData({
        dateBoxShow: false,
        selectBoxShow: false,
        checkBoxShow: true
      })
    } else {
      this.data.tempData.type = e.detail.value
      this.setData({
        dateBoxShow: false,
        selectBoxShow: false,
        checkBoxShow: false,
        tempData: this.data.tempData
      })
    }
  },

  // 选择时间类型
  dateTypeChange(e) {
    this.data.tempData.type = e.detail.value
  },

  // 添加下拉框备选项
  addDropDownItem(e) {
    let flag = e.currentTarget.dataset.flag
    if (flag == 'select') {
      this.data.selectData.push('')
      this.setData({
        selectData: this.data.selectData
      })
      console.log(this.data.selectData)
    } else {
      this.data.checkData.push('')
      this.setData({
        checkData: this.data.checkData
      })
    }
  },

  // 删除下拉框备选项
  delDropDownItem(e) {
    let dropDownIndex = e.currentTarget.dataset.index,
      flag = e.currentTarget.dataset.flag
    if (flag == 'select') {
      this.data.selectData.forEach((item, index) => {
        if (dropDownIndex == index) {
          this.data.selectData.splice(index, 1)
        }
      })
      this.setData({
        selectData: this.data.selectData
      })
    } else {
      this.data.checkData.forEach((item, index) => {
        if (dropDownIndex == index) {
          this.data.checkData.splice(index, 1)
        }
      })
      this.setData({
        checkData: this.data.checkData
      })
    }
  },

  getDropDownInput(e) {
    let dropDownIndex = e.currentTarget.dataset.index,
      flag = e.currentTarget.dataset.flag
    if (flag == 'select') {
      this.data.selectData.forEach((item, index) => {
        if (dropDownIndex == index) {
          this.data.selectData[index] = e.detail.value
        }
      })
      this.setData({
        selectData: this.data.selectData
      })
      console.log(this.data.tempData, this.data.selectData)
      this.data.tempData.option = this.data.selectData
    } else {
      this.data.checkData.forEach((item, index) => {
        if (dropDownIndex == index) {
          this.data.checkData[index] = e.detail.value
        }
      })
      this.setData({
        checkData: this.data.checkData
      })
      // console.log(this.data.checkData)
      this.data.tempData.value.option = this.data.checkData
    }
  },

  // 确定
  onConfirm() {
    var pages = getCurrentPages()
    var currPage = pages[pages.length - 1] //当前页面
    var prevPage = pages[pages.length - 2] //上一个页面

    prevPage.setData({
      tempData: this.data.tempData
    })
    console.log('ceshi', this.data.tempData)

    if (this.data.tempData.type == 'select') {
      if (this.data.tempData.option.length == 0) {
        return wx.showToast({
          title: '请为下拉选择型添加备选项',
          icon: 'none'
        })
      } else {
        if (this.data.tempData.option.includes("")) {
          return wx.showToast({
            title: '备选项不能为空',
            icon: 'none'
          })
        } else {
          wx.navigateBack({
            delta: 1
          })
        }
      }
    } else if (this.data.tempData.type == 'check') {
      if (this.data.tempData.value.option.length == 0) {
        return wx.showToast({
          title: '请为下拉选择型添加备选项',
          icon: 'none'
        })
      } else {
        if (this.data.tempData.value.option.includes("")) {
          return wx.showToast({
            title: '备选项不能为空',
            icon: 'none'
          })
        } else {
          wx.navigateBack({
            delta: 1
          })
        }
      }
    } else {
      if (this.data.tempData.option) {
        delete this.data.tempData.option
      }
      wx.navigateBack({
        delta: 1
      })
    }
  }
})