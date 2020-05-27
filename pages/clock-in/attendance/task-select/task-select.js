// 作业员选择
var app = getApp()
import {
  PersonnelModel
} from '../../../personnel/models/personnel.js'

var personnelModel = new PersonnelModel()
Page({
  data: {

  },

  onLoad(options) {
    this.setData({
      imgUrl: app.globalData.imgUrl
    })
    this.getTaskList()
  },

  getTaskList() {
    let params = {
    }
    personnelModel.getTaskList(params, res=> {
      if(res.data.status == 1) {
        this.setData({
          taskList: res.data.data
        })
      } else {
        
      }
    })
  }
})