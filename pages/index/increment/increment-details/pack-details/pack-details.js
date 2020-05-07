// 增值服务包使用详情
import {
  IndexModel
} from '../../../models/index.js'

var indexModel = new IndexModel()
Page({
  data: {
    packDetails: []
  },

  onLoad(options) {
    console.log(options)
    // 获取增值服务包详情
    this.data.userId = options.userId
    this.data.classifyId = options.classifyId
    this.data.policyId = options.policyId
    this.setData({
      classifyName: options.classifyName
    })
    this.getPackDetails()
  },

  getPackDetails() {
    let params = {
      user_id: this.data.userId,
      policy_id: this.data.policyId,
      classify_id: this.data.classifyId,
      // user_id: 47332,
      // policy_id: 24832,
      // classify_id: 17
    }
    indexModel.getPackDetails(params, res => {
      if (res.data.status == 1) {
        this.setData({
          packDetails: res.data.data
        })
        // indexModel.getAllAddedList(res1 => {
        //   if (res1.data.status == 1) {
           
        //     res1.data.data.forEach((item, index) => {
        //       this.data.packDetails((item1, index1) => {
        //         if (item1.classify_id == item.id) {
        //           this.data.packDetails['classify_name'] = item.name
        //           this.setData({
        //             packDetails: this.data.packDetails
        //           })
        //           console.log(this.data.packDetails)
        //         }
        //       })
        //     })
        //   }
        // })
      }
    })
  }
})