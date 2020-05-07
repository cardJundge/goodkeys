// 评价二维码
import {
  IndexModel
} from '../../pages/index/models/index.js'
var indexModel = new IndexModel()

Component({
  properties: {
    isShow: {
      type: Boolean
    },
    qrImg: {
      type: String
    }
  },
  data: {

  },
  methods: {
    closeModal() {
      this.setData({
        isShow: false
      })
    }
  }
})
