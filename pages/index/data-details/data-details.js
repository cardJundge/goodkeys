// 数据统计详情
import * as echarts from '../../../components/ec-canvas/echarts.min.js'
import {
  IndexModel
} from '../models/index.js'

var indexModel = new IndexModel()

var app = getApp()
var xData = []
var yData = []
var chart = null

Page({
  data: {
    ec: {
      lazyLoad: true // 延迟加载
    },
    chartDate: ['今日', '昨日', '本周', '本月'],
    dataIndex: 0,
  },

  onLoad() {
    this.echartsComponnet = this.selectComponent('#mychart-dom-line')
    this.initChart()
    this.getDetailsData()
  },

  getDetailsData() {
    wx.showLoading({
      title: '加载中...',
    })
    let params = {
      dateType: this.data.dataIndex
    }
    indexModel.dataStatisticsDetail(params, res=> {
      xData = []
      yData = []
      if(res.data.status == 1) {
        let arrTemp = []
        // console.log(res.data.data)
        for (let i in res.data.data.count) {
          let arrObj = {}
          arrObj.name = i
          arrObj.num = res.data.data.count[i]
          arrTemp.push(arrObj)
        }
        for (let i in res.data.data.detail) {
          if (this.data.dataIndex == 2 || this.data.dataIndex == 3) {
            xData.push(i.slice(5))
          } else {
            xData.push(i)
          }
          yData.push(res.data.data.detail[i])
        }
        this.setData({
          allCounts: res.data.data.counts,
          allData: arrTemp
        })
        this.setOption(chart)
      }
    })
  },

   // 初始化图表
  initChart() {
    this.echartsComponnet.init((canvas, width, height) => {
      chart = echarts.init(canvas, null, {
        width: width,
        height: height
      })
      // this.setOption(chart)
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return chart
    })
  },

  setOption(chart) {
    chart.clear()  // 清除
    chart.setOption(this.getOption())  //获取新数据
  },

  getOption() {
    var option = {
      color: ["#1a65ff"],
      //定义你图标的线的类型种类
      legend: {},
      grid: {
        containLabel: true,
        left: 0,
        right: 20,
      },
      //当你选中数据时的提示框
      tooltip: {
        show: true,
        trigger: 'axis'
      },
      //	x轴
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xData, //x轴数据
        // x轴的字体样式
        axisLabel: {
          show: true,
          textStyle: {
            color: '#303335',
            fontSize: '14',
          }
        },
        axisLabel: {
          rotate: 45
        },
        axisTick: {
          show: false
        },
        // 控制网格线是否显示
        splitLine: {
          show: false,
        },
        // x轴的颜色和宽度
        axisLine: {
          show: false
        }
      },
      yAxis: {
        x: 'center',
        type: 'value',
        show: false,
        // axisTick: {
        //   show: false
        // },
        // splitLine: {
        //   show: false,
        // },
        // axisLine: {
        //   show: false
        // }
      },
      series: [{
        // name: 'A',
        type: 'line',
        smooth: true,
        data: yData,
        areaStyle: {},
        itemStyle: {
          normal: { //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: '#92b5ff' // 0% 处的颜色
            }, {
              offset: 0.5,
              color: '#b5cdff' // 100% 处的颜色
            }, {
              offset: 1,
              color: '#fff' // 100% 处的颜色
            }])
          }

        }
      }]
    }
    return option
  },

  selectDate: function(e) {
    this.setData({
      dataIndex: e.currentTarget.dataset.index
    })
    console.log(this.data.dataIndex)
    this.getDetailsData()
  }
})