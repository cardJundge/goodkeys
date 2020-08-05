// 数据统计-改版
import { StatisticsModel } from "./models/statisticsmode.js"
import {
   PersonnelModel
} from '../../personnel/models/personnel.js'
import {
   IndexModel
 } from '../models/index.js'

var personnelModel = new PersonnelModel()
var statisticsModel = new StatisticsModel()
var indexModel = new IndexModel()
var app = getApp()

Page({
   data: {
      moduleList: [], // 所有服务商模块
      isActive: 0,
      date: 7
   },

   onLoad(options) {
      this.setData({
         windowHeight: wx.getSystemInfoSync().windowHeight,
         statisticsAuthority: app.globalData.auth.statistics,
         authority: app.globalData.userInfo.parent_id
      })
      //  获取服务商下的所有模块
      this.getModule()
   },

   onShow() { },

   // 获取服务商下的所有模块
   getModule() {
      personnelModel.getModule(res => {
         if (res.data.status == 1) {
            this.setData({
               moduleList: res.data.data
            })
            // 综合案件
            this.getAllStatisticsData()
         }
      })
   },

   // 综合案件
   getAllStatisticsData() {
      wx.showLoading({
        title: '数据加载中...',
      })
      let params = {}
      this.data.moduleList.forEach((item, index) => {
        if (item.id == this.data.moduleId) {
          if (item.key) {
            params['key'] = item.key
          } else {
            params['module_id'] = item.id
          }
        } else if (!this.data.moduleId) {
          if (this.data.moduleList[0].key) {
            params['key'] = this.data.moduleList[0].key
          } else {
            params['module_id'] = this.data.moduleList[0].id
          }
        }
      })
      statisticsModel.getAllStatistics(params, res => {
        if (res.data.status == 1) {
          wx.hideLoading()
          this.setData({
            noData: false,
            allStatistics: res.data.data
          })
        } else if (res.data.status == 0) {
          this.setData({
            noData: true
          })
          wx.hideLoading()
        }
      })
    },

   changeTopTab(e) {
      this.setData({
         moduleId: e.currentTarget.dataset.id,
         isActive: e.currentTarget.dataset.index
      })
      this.getAllStatisticsData()
   },

   creatTable() {
      // this.setData({
      //   frameshow:true,
      //   type:"table",
      //   name:"报表名称",
      //   title:"创建新报表",
      // })

      wx.showModal({
         title: '提示',
         content: '数据统计正在维护中...',
      })

   },

   addContent(e) {
      // let name = e.detail.content
      // wx.redirectTo({
      //   url: '../table/table?name='+name,
      // })
   }
})