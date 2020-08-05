// 短信验证码
// import {
//    LoginModel
//  } from '../../login/models/login.js'
 
//  var app = getApp()
//  var loginModel = new LoginModel()
Component({
   properties: {
      isShow: {
         type: Boolean
      },
      codeTime: {
         type: Number
      }
   },

   data: {
      smsValue: ''
   },
   methods: {
      toConfirm() {
         if (!this.data.smsValue) {
            return wx.showToast({
              title: '验证码不能为空',
              icon: 'none'
            })
         }
         this.setData({
            isShow: false
         })
         this.triggerEvent('confirmEvent', { smsValue: this.data.smsValue})
      },

      // 重新获取短信验证码
      getSmsVal() {
         this.triggerEvent('getSmsValEvent')
      },

      getSmsInput(e) {
         this.setData({
            smsValue: e.detail.value
         })
      },

      toCloseModule() {
         this.setData({
            isShow: false
         })
         this.triggerEvent('closeEvent')
      }
   }
})
