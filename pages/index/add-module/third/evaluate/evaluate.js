// 客户评价
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
  },

  onLoad(options) {
    this.setData({
      evaluateData: JSON.parse(options.evaluateData),
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
        scrollHeight: this.data.evaluateData.length * 45
      }
    })
  },

  onShow() {
    if (this.data.tempData) {
      this.data.evaluateData[this.data.evaluateId] = this.data.tempData
      this.setData({
        evaluateData: this.data.evaluateData,
        tempData: ''
      })
    }
  },

  toSelectType(e) {
    let evaluateType = e.currentTarget.dataset.type,
    evaluateRequired = e.currentTarget.dataset.required,
    evaluateName = e.currentTarget.dataset.name
    this.data.evaluateId = e.currentTarget.dataset.index
    if (evaluateType == 'select' || evaluateType == 'check') {
      let evaluateOption = JSON.stringify(e.currentTarget.dataset.option)
      wx.navigateTo({
        url: '../../select/select?flag=' + 'evaluate' + '&name=' + evaluateName + '&type=' + evaluateType + '&required=' + evaluateRequired + '&option=' + evaluateOption,
      })
    } else {
      wx.navigateTo({
        url: '../../select/select?flag=' + 'evaluate' + '&name=' + evaluateName + '&type=' + evaluateType + '&required=' + evaluateRequired,
      })
    }  
  },

  // 添加评价字段
  addEvaluateField() {
    this.data.evaluateData.push({
      name: '',
      required: 1,
      type: 'text'
    })
    this.setData({
      evaluateData: this.data.evaluateData,
      pageInfo: {
        scrollHeight: this.data.evaluateData.length * 45
      }
    })
  },

  // 删除评价**
  delEvaluateField(e) {
    let evaluateIndex = e.currentTarget.dataset.index
    this.data.evaluateData.forEach((item, index) => {
      if (evaluateIndex == index) {
        this.data.evaluateData.splice(index, 1)
      }
    })
    this.setData({
      evaluateData: this.data.evaluateData,
      pageInfo: {
        scrollHeight: this.data.evaluateData.length * 45
      }
    })
  },

  getEvaluateInput(e) {
    let evaluateIndex = e.currentTarget.dataset.index
    this.data.evaluateData.forEach((item, index) => {
      if (evaluateIndex == index) {
        this.data.evaluateData[index].name = e.detail.value
      }
    })
    this.setData({
      evaluateData: this.data.evaluateData
    })
    // console.log(this.data.evaluateData)
  },

  // 点击确定按钮
  onConfirm() {
    if (this.data.evaluateData.length == 0) {
      return wx.showToast({
        title: '客户评价不能为空',
        icon: 'none'
      })
    } else {
      let arr = []
      this.data.evaluateData.forEach((item, index) => {
        arr.push(item.name)
      })
      if (arr.includes("")) {
        return wx.showToast({
          title: '名称不能为空',
          icon: 'none'
        })
      }
    }
    let data = JSON.stringify(this.data.evaluateData)
    var pages = getCurrentPages()
    var currPage = pages[pages.length - 1] //当前页面
    var prevPage = pages[pages.length - 2] //上一个页面
    prevPage.setData({
      evaluateData: this.data.evaluateData
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
    // console.log('获取到的元素为', this.data.evaluateData[startIndex])
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
    movableViewInfo.data = this.data.evaluateData[startIndex]
    movableViewInfo.showClass = "inline"

    this.setData({
      movableViewInfo: movableViewInfo,
      pageInfo: pageInfo
    })
  },

  dragMove(e) {
    // if (this.data.isDrag) {
    var evaluateData = this.data.evaluateData
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
    } else if (readyPlaceIndex >= evaluateData.length) {
      readyPlaceIndex = evaluateData.length - 1
    }

    if (readyPlaceIndex != pageInfo.selectedIndex) {
      var selectedData = evaluateData[pageInfo.selectedIndex]

      evaluateData.splice(pageInfo.selectedIndex, 1)
      evaluateData.splice(readyPlaceIndex, 0, selectedData)
      pageInfo.selectedIndex = readyPlaceIndex
    }
    // 移动movableView
    pageInfo.readyPlaceIndex = readyPlaceIndex
    // console.log('移动到了索引', readyPlaceIndex, '选项为', evaluateData[readyPlaceIndex])

    this.setData({
      movableViewInfo: movableViewInfo,
      evaluateData: evaluateData,
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