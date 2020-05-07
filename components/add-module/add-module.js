// 添加模块
import {
  IndexModel
} from '../../pages/index/models/index.js'
var indexModel = new IndexModel()

Component({
  properties: {
    isShow: {
      type: Boolean
    },
    module: {
      type: Array
    },
    bottomSpin: {
      type: Boolean
    },
    flag: {
      type: Number
    }
  },
  data: {
    moduleItem: ''
  },
  methods: {
    onConfirm() {
      if(this.data.flag == 1) {
        this.triggerEvent('okEvent', { moduleItem: this.data.moduleItem})
        this.setData({
          isShow: false
        })
      } else {
        indexModel.setSelfModule(this.data.moduleItem, res => {
          if (res.data.status == 1) {
            this.triggerEvent('okEvent')
          } else {
            if (res.data.msg.match('Token已过期或失效')) {
            } else {
              wx.showToast({
                title: res.data.msg ? res.data.msg : '请求超时',
                icon: 'none'
              })
            }
          }
          this.setData({
            isShow: false
          })
        })
      }
     
    },

    selectModule(e) {
      let string = "module[" + e.currentTarget.dataset.index + "].selected"
      this.setData({
        [string]: !this.data.module[e.currentTarget.dataset.index].selected
      })
      let detailValue = this.data.module.filter(it => it.selected).map(it => it.id)
      this.data.moduleItem = ''
      detailValue.map((item, index) => {
        if (index == 0) {
          this.data.moduleItem = this.data.moduleItem.concat(item)
        } else {
          this.data.moduleItem = this.data.moduleItem.concat(',' + item)
        }
      })
    },

    toCloseModule() {
      this.triggerEvent('closeEvent')
      this.setData({
        isShow: false
      })
    }
  }
})
