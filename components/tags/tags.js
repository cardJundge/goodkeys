// 客户印象标签
import {
  MineModel
} from '../../pages/mine/models/mine.js'
var mineModel = new MineModel()
Component({
  properties: {
    isShow: {
      type: Boolean
    },
    clientData: {
      type: Object
    }
  },

  data: {
    impressNew: ''
  },

  methods: {
    toCloseModule() {
      this.setData({
        isShow: false
      })
    },

    getImpress(e) {
      console.log(e,this.data.clientData)
      this.setData({
        impressNew: e.detail.value
      })
    },

    // 取消
    onCancel() {

    },

    // 确定
    onConfirm() {
      let params = {
        user_id: this.data.clientData.id,
        impress: this.data.impress,
      }
      mineModel.setImpress(params, res=> {
        console.log(res)
      })
    },

    // 删除标签
    toDelTags() {
      wx.showModal({
        title: '提示',
        content: '确定删除该标签吗？',
        success: res=> {
          if(res.confirm) {
            // 调用删除接口
          } else if (res.cancel) {

          }
        }
      })
    }
  }
})
