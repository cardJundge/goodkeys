// 数据统计
import * as echarts from '../../../components/ec-canvas/echarts.min.js'
const color = ['#1a65ff', '#508EF9', '#5DC7FE', '#42D8B0', '#9BD23C', '#EBD322', '#F98D50', '#B2EB22', '#428BD8', '#F8824F', '#821AFF', '#F950EA', '#D05DFE', '#FF5790', '#FF5E5E']
import {
  IndexModel
} from '../models/index.js'
import {
  PersonnelModel
} from '../../personnel/models/personnel.js'

var indexModel = new IndexModel()
var personnelModel = new PersonnelModel()
var app = getApp()

Page({
  data: {
    currentPage: 'service',
    moduleList: [],
    topActive: 0,
    navScrollLeft: 0,
    dateList: ['7', '15', '30', '60', '90'],
    date: 7,
    flag: 'all',
    ageingActive: 0,
    selectActive: 0,
    laterateActive: 0,
    latenumActive: 0,
    allActive: 0,
    noData: false,
    ec1: {
      onInit: initChart01
    },
    ec2: {
      onInit: initChart02
    },
    ec3: {
      onInit: initChart03
    },
    ec4: {
      onInit: initChart04
    },
    // pieList: [{ name: '数据1', data: [{ name: '时间', value: '0' }, { name: '地点', value: '20' }] }, { name: '数据2', data: [{ name: '时间', value: '50' }, { name: '地点', value: '50' }] }],
    pieColor: color,
    ageingData: [],
    laterateData: [{ key: [], value: [] }],
    latenumData: [{ key: [], value: [] }],
    tableData: []
  },

  onLoad(options) {
    this.getModule()
  },

  // 获取服务商下的所有模块
  getModule() {
    personnelModel.getModule(res => {
      if (res.data.status == 1) {
        this.setData({
          moduleList: res.data.data
        })
        this.getAllStatisticsData()
      }
    })
  },

  // 获取所有统计数据
  getAllStatisticsData() {
    wx.showLoading({
      title: '数据加载中...',
    })
    let params = {
      date: this.data.date
    }
    if (this.data.currentPage == 'task') {
      params.task_id = this.data.taskId
    } else if (this.data.currentPage == 'service') (
      params.service_id = app.globalData.userInfo.id
    )
    this.data.moduleList.forEach((item, index) => {
      if (item.id == this.data.moduleId) {
        if (item.key) {
          params['key'] = item.key
          this.setData({
            moduleFlag: 'system'
          })
        } else {
          params['module_id'] = item.id
          this.setData({
            moduleFlag: 'define'
          })
        }
      } else if (!this.data.moduleId) {
        if (this.data.moduleList[0].key) {
          params['key'] = this.data.moduleList[0].key
          this.setData({
            moduleFlag: 'system'
          })
        } else {
          params['module_id'] = this.data.moduleList[0].id
          this.setData({
            moduleFlag: 'define'
          })
        }
      }
    })
    indexModel.getAllStatistics(params, res => {
      if (res.data.status == 1) {
        wx.hideLoading()
        this.setData({
          noData: false
        })
        // 拆分超期数键和值
        let tempLatenum = [], tempLaterate = [], laternumVal = [], laterateVal = [], overdueKey, overdueVal, ageingVal = [], selectData = [], checkData = [], tableData = [], pieMoreData = []

        // 超期数
        if (res.data.data.overdue) {
          overdueKey = Object.keys(res.data.data.overdue)
          overdueVal = Object.values(res.data.data.overdue)
          let tempOverdueKey = []
          overdueKey.forEach((item,index) => {
            if (this.data.date == 7 || this.data.date == 15) {
              tempOverdueKey.push(item)
            } else if (this.data.date == 30) {
              if (index % 2 == 0) {
                console.log(index)
                tempOverdueKey.push(item)
              }
            } else if (this.data.date == 60) {
              if (index % 4 == 0) {
                tempOverdueKey.push(item)
              }
            } else if (this.data.date == 90) {
              if (index % 6 == 0) {
                tempOverdueKey.push(item)
              }
            }
          })
          overdueVal.forEach((item, index) => {
            if (this.data.date == 7 || this.data.date == 15) {
              laternumVal.push(item.over)
              laterateVal.push(item.over_rate)
            } else if (this.data.date == 30) {
              if (index % 2 == 0) {
                laternumVal.push(item.over)
                laterateVal.push(item.over_rate)
              }
            } else if (this.data.date == 60) {
              if (index % 4 == 0) {
                laternumVal.push(item.over)
                laterateVal.push(item.over_rate)
              }
            } else if (this.data.date == 90) {
              if (index % 6 == 0) {
                laternumVal.push(item.over)
                laterateVal.push(item.over_rate)
              }
            }
          })
          tempLatenum.push({
            key: tempOverdueKey,
            value: laternumVal
          })
          tempLaterate.push({
            key: tempOverdueKey,
            value: laterateVal
          })
        }

        if (res.data.data.select) {
          let selectKey, selectVal, tempData = []
          selectKey = Object.keys(res.data.data.select)
          selectVal = Object.values(res.data.data.select)
          selectVal.forEach((item, index) => {
            tempData.push({
              key: [],
              value: []
            })
            item.forEach((item1, index1) => {
              item1.value = Number(item1.chose.split("%")[0])
              item1.name = item1.option
              tempData[index].key.push(item1.option)
              tempData[index].value.push(item1.value)
            })
            selectData.push({
              name: selectKey[index],
              data: item
            })
            let tempData01 = []
            tempData01.push(tempData[index])
            pieMoreData.push({
              name: selectKey[index],
              data: tempData01
            })
          })
        }

        if (res.data.data.check) {
          let checkKey, checkVal, tempData = []
          checkKey = Object.keys(res.data.data.check)
          checkVal = Object.values(res.data.data.check)
          checkVal.forEach((item, index) => {
            tempData.push({
              key: [],
              value: []
            })
            item.forEach((item1, index1) => {
              item1.value = Number(item1.chose.split("%")[0])
              item1.name = item1.option,
                tempData[index].key.push(item1.option)
              tempData[index].value.push(item1.value)
            })
            checkData.push({
              name: checkKey[index],
              data: item
            })
            let tempData01 = []
            tempData01.push(tempData[index])
            pieMoreData.push({
              name: checkKey[index],
              data: tempData01
            })
          })
        }

        if (res.data.data.norm) {
          ageingVal = Object.values(res.data.data.norm)
        }

        if (res.data.data.operator) {
          res.data.data.operator.forEach((item, index) => {
            item.aging = Math.floor(item.aging * 100) / 100
            item.over = Math.floor(item.over * 100) / 100
            item.over_rate = Math.floor(item.over_rate * 100) / 100
          })
          tableData = res.data.data.operator
        }

        // 全部
        if (this.data.flag == 'all') {
          if (this.data.moduleFlag == 'define') {
            this.setData({
              allStatistics: res.data.data,
              selectData: res.data.data.select,
              tableData: tableData,
              latenumData: tempLatenum,
              laterateData: tempLaterate,
              ageingData: ageingVal,
              pieList: selectData.concat(checkData),
              pieMoreList: pieMoreData
            })
            console.log(this.data.pieMoreList)
          } else {
            this.setData({
              allStatistics: res.data.data
            })
          }

        } else if (this.data.flag == 'table') {
          // 综合表格
          this.setData({
            tableData: tableData
          })
        } else if (this.data.flag == 'latenum') {
          // 超期数
          this.setData({
            latenumData: tempLatenum
          })
        } else if (this.data.flag == 'laterate') {
          // 逾期率
          this.setData({
            laterateData: tempLaterate
          })
        } else if (this.data.flag == 'ageing') {
          // 时效统计
          this.setData({
            ageingData: ageingVal
          })
        } else if (this.data.flag == 'option') {
          // 下拉选择
          this.setData({
            pieList: selectData.concat(checkData)
          })
        }
      } else if (res.data.status == 0) {
        this.setData({
          noData: true
        })
        wx.hideLoading()
      }
    })
  },

  // 数据统计顶部切换
  changeTopTab(e) {
    let index = e.currentTarget.dataset.index,
      id = e.currentTarget.dataset.id
    this.setData({
      topActive: index,
      moduleId: id,
      date: 7,
      flag: 'all',
      ageingActive: 0,
      selectActive: 0,
      laterateActive: 0,
      latenumActive: 0,
      allActive: 0
    })
    this.getAllStatisticsData()
    // 给每一个data装一个color
    // this.setColor()
  },

  // 进入作业员页面
  enterTaskPage(e) {
    this.setData({
      taskId: e.currentTarget.dataset.id,
      taskName: e.currentTarget.dataset.name,
      currentPage: 'task',
      date: 7,
      flag: 'all',
      ageingActive: 0,
      selectActive: 0,
      laterateActive: 0,
      latenumActive: 0,
      allActive: 0
    })
    this.getAllStatisticsData()
  },

  // 返回服务商
  toBackService() {
    this.setData({
      currentPage: 'service',
      date: 7,
      flag: 'all',
      ageingActive: 0,
      selectActive: 0,
      laterateActive: 0,
      latenumActive: 0,
      allActive: 0
    })
    this.getAllStatisticsData()
  },

  // 时效统计时间切换
  changeAgeingTab(e) {
    let index = e.currentTarget.dataset.index,
      date = e.currentTarget.dataset.date
    this.setData({
      ageingActive: index,
      date: date,
      flag: 'ageing'
    })
    this.getAllStatisticsData()
  },

  // 下拉选择框时间切换
  changeSelectTab(e) {
    let index = e.currentTarget.dataset.index,
      date = e.currentTarget.dataset.date
    this.setData({
      selectActive: index,
      date: date,
      flag: 'option'
    })
    this.getAllStatisticsData()
  },

  // 逾期率时间切换
  changeLaterateTab(e) {
    let index = e.currentTarget.dataset.index,
      date = e.currentTarget.dataset.date
    this.setData({
      laterateActive: index,
      date: date,
      flag: 'laterate'
    })
    this.getAllStatisticsData()
  },

  // 超期数时间切换
  changeLatenumTab(e) {
    let index = e.currentTarget.dataset.index,
      date = e.currentTarget.dataset.date
    console.log(index)
    this.setData({
      latenumActive: index,
      date: date,
      flag: 'latenum'
    })
    this.getAllStatisticsData()
  },

  // 综合时间切换（表格）
  changeAllTab(e) {
    let index = e.currentTarget.dataset.index,
      date = e.currentTarget.dataset.date
    this.setData({
      allActive: index,
      date: date,
      flag: 'table'
    })
    this.getAllStatisticsData()
  },

  // 设置color
  setColor() {
    this.data.pieList.forEach((item, index) => {
      item.data.forEach((item1, index1) => {
        color.forEach((item2, index2) => {
          if (index1 == index2) {
            item1.color = item2
          }
        })
      })
    })
    this.setData({
      pieList: this.data.pieList
    })
  }
})

// 饼图
function initChart01(canvas, width, height, data) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  })
  canvas.setChart(chart)
  var option = {
    series: [
      {
        name: '',
        type: 'pie',
        radius: ['65%', '90%'],
        animationType: 'scale',
        silent: true,
        label: {
          show: false
        },
        labelLine: {
          show: false
        },
        data: data,
        color: color
      }
    ]
  }
  chart.setOption(option)
  return chart
}

// 折线图
function initChart02(canvas, width, height, data) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  })
  canvas.setChart(chart)
  var option = {
    color: ["#1a65ff"],
    //当你选中数据时的提示框
    tooltip: {
      show: true,
      trigger: 'axis'
    },
    grid: {
      show: false,
      left: 40,
      right: 20,
      top: 24,
      bottom: 60
    },
    //	x轴
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data[0].key, //x轴数据 
      // x轴的字体样式
      axisLabel: {
        show: true,
        rotate: 45,
        textStyle: {
          color: '#9C9C9C',
          fontSize: '10',
        }
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: false,
      },
      // 是否显示坐标轴轴线
      axisLine: {
        show: true,
        lineStyle: {
          color: '#ECECEC'
        }
      }
    },
    yAxis: {
      x: 'center',
      type: 'value',
      show: true,
      min: 0,
      max: 100,
      // y轴的字体样式
      axisLabel: {
        show: true,
        textStyle: {
          color: '#9C9C9C',
          fontSize: '12',
        },
        formatter: '{value}%'
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dotted',
          color: '#ECECEC'
        }
      },
      axisLine: {
        show: false
      }
    },
    series: [{
      type: 'line',
      smooth: true,
      data: data[0].value,
      areaStyle: {},
      itemStyle: {
        normal: { //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: '#1a65ff' // 0% 处的颜色
          }, {
            offset: 0.5,
            color: '#4b7be4' // 100% 处的颜色
          }, {
            offset: 1,
            color: '#fff' // 100% 处的颜色
          }])
        }

      }
    }]
  }
  chart.setOption(option)
  return chart
}

// 柱状图-竖
function initChart03(canvas, width, height, data) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  })
  canvas.setChart(chart)
  var option = {
    color: ['#1a65ff'],
    tooltip: {
      show: true,
      trigger: 'axis'
    },
    grid: {
      show: false,
      left: 40,
      right: 20,
      top: 24,
      bottom: 60
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data[0].key, //x轴数据
      // x轴的字体样式
      axisLabel: {
        show: true,
        rotate: 45,
        textStyle: {
          color: '#9C9C9C',
          fontSize: '10',
        }
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: false,
      },
      // 是否显示坐标轴轴线
      axisLine: {
        show: true,
        lineStyle: {
          color: '#ECECEC'
        }
      }
    },
    yAxis: {
      x: 'center',
      type: 'value',
      show: true,
      min: 0,
      max: 100,
      // y轴的字体样式
      axisLabel: {
        show: true,
        textStyle: {
          color: '#9C9C9C',
          fontSize: '12',
        }
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dotted',
          color: '#ECECEC'
        }
      },
      axisLine: {
        show: false
      }
    },
    series: [{
      data: data[0].value,
      type: 'bar',
      barWidth: 20
    }]
  }
  chart.setOption(option)
  return chart
}

// 柱状图-横
function initChart04(canvas, width, height, data) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  })
  canvas.setChart(chart)
  var option = {
    color: ['#1a65ff'],
    tooltip: {
      show: true,
      trigger: 'axis'
    },
    grid: {
      show: false,
      left: 70,
      right: 20,
      top: 20,
      bottom: 40
    },
    xAxis: {
      x: 'center',
      type: 'value',
      show: true,
      min: 0,
      max: 100,
      // y轴的字体样式
      axisLabel: {
        formatter: '{value}%',
        show: true,
        textStyle: {
          color: '#9C9C9C',
          fontSize: '12',
        }
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dotted',
          color: '#ECECEC'
        }
      },
      axisLine: {
        show: false
      }
    },
    yAxis: {
      type: 'category',
      boundaryGap: false,
      data: data[0].key, //x轴数据
      // x轴的字体样式
      axisLabel: {
        formatter: function (value) {
          let valueTxt = ''
          if (value.length > 4) {
            valueTxt = value.substring(0, 5) + '...'
          } else {
            valueTxt = value
          }
          return valueTxt
        },
        show: true,
        textStyle: {
          color: '#9C9C9C',
          fontSize: '10',
        }
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: false,
      },
      // 是否显示坐标轴轴线
      axisLine: {
        show: true,
        lineStyle: {
          color: '#ECECEC'
        }
      }
    },
    series: [{
      data: data[0].value,
      type: 'bar',
      barWidth: 8,
      itemStyle: {
        normal: {
          label: {
            show: true,
            position: 'right',
            textStyle: {
              color: '#9C9C9C',
              fontSize: 10
            }
          }
        }
      }
    }]
  }
  chart.setOption(option)
  return chart
}