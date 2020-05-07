// 人员打卡详情
Page({
  data: {
    timeTab: ['日', '周', '月'],
    timeTabActive: 0,
    verticalCurrent: 2,
    calendarConfig: {
      defaultDay: true,
      preventSwipe: true
      // multi: true
    },
    clockSteps: []
  },

  onLoad() {
    setTimeout(() => {
      this.handleAction()
    }, 2000)
  },

  timeTabChange(e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      timeTabActive: index
    })
    if (index == 0) {
      this.handleAction()
    }
  },

  onTapDay(e) {
    console.log('onTapDay', e.detail)
  },

  handleAction() {
    const calendar = this.calendar
    const days = [
      {
        year: '2020',
        month: '4',
        day: '4',
        todoText: '',
        todoLabelColor: '#F21AFF'
      },
      {
        year: '2020',
        month: '4',
        day: '5',
        todoText: '',
        todoLabelColor: '#1a65ff'
      }
    ]
    calendar['setTodoLabels']({
      showLabelAlways: true,
      days
    })
    console.log('set todo labels: ', days)

  }
})
