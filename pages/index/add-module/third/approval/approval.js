// 管理者审批
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
      approvalData: JSON.parse(options.approvalData),
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
        scrollHeight: this.data.approvalData.length * 45
      }
    })
  },

  onShow() {
    if (this.data.tempData) {
      this.data.approvalData[this.data.approvalId] = this.data.tempData
      // console.log(this.data.approvalData)
      this.setData({
        approvalData: this.data.approvalData,
        tempData: ''
      })
    }
  },

  toSelectType(e) {
    let approvalType = e.currentTarget.dataset.type,
    approvalRequired = e.currentTarget.dataset.required,
    approvalName = e.currentTarget.dataset.name
    this.data.approvalId = e.currentTarget.dataset.index
    if (approvalType == 'select' || approvalType == 'check') {
      let approvalOption = JSON.stringify(e.currentTarget.dataset.option)
      wx.navigateTo({
        url: '../../select/select?flag=' + 'approval' + '&name=' + approvalName + '&type=' + approvalType + '&required=' + approvalRequired + '&option=' + approvalOption,
      })
    } else {
      wx.navigateTo({
        url: '../../select/select?flag=' + 'approval' + '&name=' + approvalName + '&type=' + approvalType + '&required=' + approvalRequired,
      })
    }
  },

  // 添加审核字段
  addApprovalField() {
    this.data.approvalData.push({
      name: '',
      required: 1,
      type: 'text'
    })
    this.setData({
      approvalData: this.data.approvalData,
      pageInfo: {
        scrollHeight: this.data.approvalData.length * 45
      }
    })
  },

  // 删除审核**
  delApprovalField(e) {
    let approvalIndex = e.currentTarget.dataset.index
    this.data.approvalData.forEach((item, index) => {
      if (approvalIndex == index) {
        this.data.approvalData.splice(index, 1)
      }
    })
    this.setData({
      approvalData: this.data.approvalData,
      pageInfo: {
        scrollHeight: this.data.approvalData.length * 45
      }
    })
  },

  getApprovalInput(e) {
    let approvalIndex = e.currentTarget.dataset.index
    this.data.approvalData.forEach((item, index) => {
      if (approvalIndex == index) {
        this.data.approvalData[index].name = e.detail.value
      }
    })
    this.setData({
      approvalData: this.data.approvalData
    })
    // console.log(this.data.approvalData)
  },

  // 点击确定按钮
  onConfirm() {
    if (this.data.approvalData.length == 0) {
      return wx.showToast({
        title: '客户评价不能为空',
        icon: 'none'
      })
    } else {
      let arr = []
      this.data.approvalData.forEach((item, index) => {
        arr.push(item.name)
      })
      if (arr.includes("")) {
        return wx.showToast({
          title: '名称不能为空',
          icon: 'none'
        })
      }
    }
    let data = JSON.stringify(this.data.approvalData)
    var pages = getCurrentPages()
    var currPage = pages[pages.length - 1] //当前页面
    var prevPage = pages[pages.length - 2] //上一个页面
    prevPage.setData({
      approvalData: this.data.approvalData
    })
    wx.navigateBack({
      delta: 1
    })
  },

  // -------------------------------------
  dragStart(e) {
    let startIndex = e.target.dataset.index
    // console.log('获取到的元素为', this.data.approvalData[startIndex])
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
    movableViewInfo.data = this.data.approvalData[startIndex]
    movableViewInfo.showClass = "inline"

    this.setData({
      movableViewInfo: movableViewInfo,
      pageInfo: pageInfo
    })
  },

  dragMove(e) {
    // if (this.data.isDrag) {
    var approvalData = this.data.approvalData
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
    } else if (readyPlaceIndex >= approvalData.length) {
      readyPlaceIndex = approvalData.length - 1
    }

    if (readyPlaceIndex != pageInfo.selectedIndex) {
      var selectedData = approvalData[pageInfo.selectedIndex]

      approvalData.splice(pageInfo.selectedIndex, 1)
      approvalData.splice(readyPlaceIndex, 0, selectedData)
      pageInfo.selectedIndex = readyPlaceIndex
    }
    // 移动movableView
    pageInfo.readyPlaceIndex = readyPlaceIndex
    // console.log('移动到了索引', readyPlaceIndex, '选项为', approvalData[readyPlaceIndex])

    this.setData({
      movableViewInfo: movableViewInfo,
      approvalData: approvalData,
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