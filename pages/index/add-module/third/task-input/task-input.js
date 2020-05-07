// 作业员录入
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
    // isDrag: false,
    // listHeight: 0
  },

  onLoad(options) {
    this.setData({
      taskInputData: JSON.parse(options.taskInputData),
    })
    wx.getSystemInfo({
      success: res => {
        this.setData({
          allHeight: res.windowHeight * 2 - 380
        })
      }
    })
    this.setData({
      pageInfo: {
        scrollHeight: this.data.taskInputData.length * 45
      }
    })
  },

  onShow() {
    if (this.data.tempData) {
      this.data.taskInputData[this.data.taskInputId] = this.data.tempData
      // console.log(this.data.taskInputData)
      this.setData({
        taskInputData: this.data.taskInputData,
        tempData: ''
      })
    }
  },

  toSelectType(e) {
    let taskInputName = e.currentTarget.dataset.name,
      taskInputType = e.currentTarget.dataset.type,
      taskInputWeight = e.currentTarget.dataset.weight
    this.data.taskInputId = e.currentTarget.dataset.index
    if (taskInputType == 'select' || taskInputType == 'check') {
      let taskInputOption = JSON.stringify(e.currentTarget.dataset.option)
      wx.navigateTo({
        url: '../../select/select?flag=' + 'task' + '&name=' + taskInputName + '&type=' + taskInputType + '&weight=' + taskInputWeight + '&option=' + taskInputOption,
      })
    } else {
      wx.navigateTo({
        url: '../../select/select?flag=' + 'task' + '&name=' + taskInputName + '&type=' + taskInputType + '&weight=' + taskInputWeight,
      })
    }

  },

  // 添加作业员录入字段
  addTaskInputField() {
    this.data.taskInputData.push({
      name: '',
      weight: 5,
      type: 'text'
    })
    this.setData({
      taskInputData: this.data.taskInputData,
      pageInfo: {
        scrollHeight: this.data.taskInputData.length * 45
      }
    })
    // console.log(this.data.pageInfo.scrollHeight, this.data.taskInputData)
  },

  // 删除作业员录入字段
  delTaskInputField(e) {
    let taskInputIndex = e.currentTarget.dataset.index
    this.data.taskInputData.forEach((item, index) => {
      if (taskInputIndex == index) {
        this.data.taskInputData.splice(index, 1)
      }
    })
    this.setData({
      taskInputData: this.data.taskInputData,
      pageInfo: {
        scrollHeight: this.data.taskInputData.length * 45
      }
    })
  },

  gettaskInput(e) {
    let taskInputIndex = e.currentTarget.dataset.index
    this.data.taskInputData.forEach((item, index) => {
      if (taskInputIndex == index) {
        this.data.taskInputData[index].name = e.detail.value
      }
    })
    this.setData({
      taskInputData: this.data.taskInputData
    })
    // console.log(this.data.taskInputData)
  },

  onConfirm() {
    this.data.taskInputData.forEach((item, index) => {
      item.weight = parseInt(item.weight)
    })
    if (this.data.taskInputData.length == 0) {
      return wx.showToast({
        title: '作业员录入不能为空',
        icon: 'none'
      })
    } else {
      let arr = []
      this.data.taskInputData.forEach((item, index) => {
        arr.push(item.name)
      })
      if (arr.includes("")) {
        return wx.showToast({
          title: '名称不能为空',
          icon: 'none'
        })
      }
    }
    let data = JSON.stringify(this.data.taskInputData)
    var pages = getCurrentPages()
    var currPage = pages[pages.length - 1] //当前页面
    var prevPage = pages[pages.length - 2] //上一个页面
    prevPage.setData({
      taskInputData: this.data.taskInputData
    })
    wx.navigateBack({
      delta: 1
    })
  },

  // -------------------------------------
  dragStart(e) {
    // this.setData({
    //   isDrag: true
    // })
    let startIndex = e.target.dataset.index
    // console.log('获取到的元素为', this.data.taskInputData[startIndex])
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
    movableViewInfo.data = this.data.taskInputData[startIndex]
    movableViewInfo.showClass = "inline"

    this.setData({
      movableViewInfo: movableViewInfo,
      pageInfo: pageInfo
    })
  },

  dragMove(e) {
    // if (this.data.isDrag) {
    var taskInputData = this.data.taskInputData
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
    } else if (readyPlaceIndex >= taskInputData.length) {
      readyPlaceIndex = taskInputData.length - 1
    }

    if (readyPlaceIndex != pageInfo.selectedIndex) {
      var selectedData = taskInputData[pageInfo.selectedIndex]

      taskInputData.splice(pageInfo.selectedIndex, 1)
      taskInputData.splice(readyPlaceIndex, 0, selectedData)
      pageInfo.selectedIndex = readyPlaceIndex
    }
    // 移动movableView
    pageInfo.readyPlaceIndex = readyPlaceIndex
    // console.log('移动到了索引', readyPlaceIndex, '选项为', taskInputData[readyPlaceIndex])

    this.setData({
      movableViewInfo: movableViewInfo,
      taskInputData: taskInputData,
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
  // }
})