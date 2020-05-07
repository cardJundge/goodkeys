// 添加模块---》第二步
Page({
  data: {
    movableViewInfo: {
      y: 0,
      showClass: 'none',
      data: {}
    },
    pageInfo: {
      scrollHeight: 85,
      startIndex: null,
      scrollY: true,
      readyPlaceIndex: null,
      startY: 0,
      selectedIndex: null,
    },
    rowHeight: 45,
    fieldData: []
  },

  onLoad(options) {
    if (options.flag == 'add') {
      this.data.moduleName = options.moduleName
      this.data.moduleIcon = options.moduleIcon
    } else if (options.flag == 'edit') {
      this.setData({
        fieldData: JSON.parse(options.fieldData)
      })
    }
    wx.getSystemInfo({
      success: res => {
        this.setData({
          allHeight: res.windowHeight * 2 - 508
        })
      }
    })
    this.setData({
      flag: options.flag,
      pageInfo: {
        scrollHeight: this.data.fieldData.length * 45
      }
    })
  },

  onShow() {
    if (this.data.tempData) {
      this.data.fieldData[this.data.fieldId] = this.data.tempData
      // console.log(this.data.fieldData)
      this.setData({
        fieldData: this.data.fieldData,
        tempData: ''
      })
    }

    console.log(this.data.fieldData)
  },

  // 增加字段
  addField() {
    this.data.fieldData.push({
      name: '',
      required: 1,
      type: 'text'
    })
    this.setData({
      fieldData: this.data.fieldData,
      pageInfo: {
        scrollHeight: this.data.fieldData.length * 45
      }
    })
  },

  // 删除字段
  delField(e) {
    let fieldIndex = e.currentTarget.dataset.index
    this.data.fieldData.forEach((item, index) => {
      if (fieldIndex == index) {
        this.data.fieldData.splice(index, 1)
      }
    })
    this.setData({
      fieldData: this.data.fieldData,
      pageInfo: {
        scrollHeight: this.data.fieldData.length * 45
      }
    })
  },

  getFieldInput(e) {
    let fieldIndex = e.currentTarget.dataset.index
    this.data.fieldData.forEach((item, index) => {
      if (fieldIndex == index) {
        this.data.fieldData[index].name = e.detail.value
      }
    })
    this.setData({
      fieldData: this.data.fieldData
    })
    // console.log(this.data.fieldData)
  },

  // 选择类型
  toSelectType(e) {
    let fieldType = e.currentTarget.dataset.type,
      fieldName = e.currentTarget.dataset.name,
      fieldRequired = e.currentTarget.dataset.required
    this.data.fieldId = e.currentTarget.dataset.index
    if (fieldType == 'select' || fieldType == 'check') {
      let fieldOption = JSON.stringify(e.currentTarget.dataset.option)
      wx.navigateTo({
        url: '../select/select?flag=' + 'info' + '&name=' + fieldName + '&type=' + fieldType + '&required=' + fieldRequired + '&option=' + fieldOption,
      })
    } else {
      wx.navigateTo({
        url: '../select/select?flag=' + 'info' + '&name=' + fieldName + '&type=' + fieldType + '&required=' + fieldRequired,
      })
    }

  },

  nextStep() {
    if (this.data.fieldData.length == 0) {
      return wx.showToast({
        title: '任物流信息不能为空',
        icon: 'none'
      })
    } else {
      let arr = []
      this.data.fieldData.forEach((item, index) => {
        arr.push(item.name)
      })
      if (arr.includes("")) {
        return wx.showToast({
          title: '名称不能为空',
          icon: 'none'
        })
      }
    }

    if (this.data.flag == 'add') {
      // "添加"==>下一步
      let data = JSON.stringify(this.data.fieldData)
      wx.navigateTo({
        url: '../third/third?moduleName=' + this.data.moduleName + '&moduleIcon=' + this.data.moduleIcon + '&fieldData=' + data,
      })
    } else if (this.data.flag == 'edit') {
      // "编辑"==>确定
      var pages = getCurrentPages()
      var currPage = pages[pages.length - 1] //当前页面
      var prevPage = pages[pages.length - 2] //上一个页面

      prevPage.setData({
        fieldData: this.data.fieldData
      })

      wx.navigateBack({
        delta: 1
      })
    }

  },

  // -------------------------------------
  dragStart(e) {
    let startIndex = e.target.dataset.index
    // console.log('获取到的元素为', this.data.fieldData[startIndex])
    // 初始化页面数据
    let pageInfo = this.data.pageInfo
    pageInfo.startY = e.touches[0].pageY
    pageInfo.readyPlaceIndex = startIndex
    pageInfo.selectedIndex = startIndex
    pageInfo.scrollY = false
    pageInfo.startIndex = startIndex

    this.setData({
      'movableViewInfo.y': pageInfo.startY - (this.data.rowHeight / 2)
    })
    // 初始化拖动控件数据
    var movableViewInfo = this.data.movableViewInfo
    movableViewInfo.data = this.data.fieldData[startIndex]
    movableViewInfo.showClass = "inline"

    this.setData({
      movableViewInfo: movableViewInfo,
      pageInfo: pageInfo
    })
  },

  dragMove(e) {
    // if (this.data.isDrag) {
    var fieldData = this.data.fieldData
    var pageInfo = this.data.pageInfo
    // 计算拖拽距离
    var movableViewInfo = this.data.movableViewInfo
    var movedDistance = e.touches[0].pageY - pageInfo.startY
    movableViewInfo.y = pageInfo.startY - (this.data.rowHeight / 2) + movedDistance
    // console.log('移动的距离为', movedDistance)

    // 修改预计放置位置
    var movedIndex = parseInt(movedDistance / this.data.rowHeight)
    var readyPlaceIndex = pageInfo.startIndex + movedIndex
    if (readyPlaceIndex < 0) {
      readyPlaceIndex = 0
    } else if (readyPlaceIndex >= fieldData.length) {
      readyPlaceIndex = fieldData.length - 1
    }

    if (readyPlaceIndex != pageInfo.selectedIndex) {
      var selectedData = fieldData[pageInfo.selectedIndex]

      fieldData.splice(pageInfo.selectedIndex, 1)
      fieldData.splice(readyPlaceIndex, 0, selectedData)
      pageInfo.selectedIndex = readyPlaceIndex
    }
    // 移动movableView
    pageInfo.readyPlaceIndex = readyPlaceIndex
    // console.log('移动到了索引', readyPlaceIndex, '选项为', fieldData[readyPlaceIndex])

    this.setData({
      movableViewInfo: movableViewInfo,
      fieldData: fieldData,
      pageInfo: pageInfo
    })
    // }
  },

  dragEnd(e) {
    // if (this.data.isDrag) {
    // 重置页面数据
    var pageInfo = this.data.pageInfo
    pageInfo.readyPlaceIndex = null
    pageInfo.startY = null
    pageInfo.selectedIndex = null
    pageInfo.startIndex = null
    pageInfo.scrollY = true
    // 隐藏movableView
    var movableViewInfo = this.data.movableViewInfo
    movableViewInfo.showClass = 'none'

    this.setData({
      pageInfo: pageInfo,
      movableViewInfo: movableViewInfo,
      isDrag: false
    })
  }
})