Component({
  properties: {
    proportion: {
      type: Number
    }
  },

  data: {
  },

  methods: {
    rpx2px(rpx) {
      const info = wx.getSystemInfoSync()
      return rpx * info.windowWidth / 750
    },

    drawProgressbg() {
      // 使用 wx.createContext 获取绘图上下文 context
      var ctx = wx.createCanvasContext('canvasProgressbg', this)
      ctx.setLineWidth(this.rpx2px(8))// 设置圆环的宽度
      ctx.setStrokeStyle('#E7EFFF') // 设置圆环的颜色
      ctx.setLineCap('round') // 设置圆环端点的形状
      ctx.beginPath()//开始一个新的路径
      ctx.arc(this.rpx2px(52), this.rpx2px(52), this.rpx2px(44), 0, 2 * Math.PI, false)
      //设置一个原点(110,110)，半径为100的圆的路径到当前路径
      ctx.stroke()//对当前路径进行描边
      ctx.draw()
    },

    drawCircle(step) {
      var context = wx.createCanvasContext('canvasProgress', this)
      
      const proportion = this.data.proportion + '%'
      context.setTextAlign('left') // 文字居中
      context.setFillStyle('#1a65ff') // 文字颜色：黑色
      context.setFontSize(this.rpx2px(24)) // 文字字号
      context.fillText(proportion, this.rpx2px(52) - this.rpx2px(context.measureText(proportion).width), this.rpx2px(60))
      
      // 设置渐变
      var gradient = context.createLinearGradient(200, 100, 100, 200)
      gradient.addColorStop("0", "#1a65ff")
      gradient.addColorStop("0.5", "#1a65ff")
      gradient.addColorStop("1.0", "#1a65ff")

      context.setLineWidth(this.rpx2px(8))
      context.setStrokeStyle(gradient)
      context.setLineCap('round')
      context.beginPath()
      // 参数step 为绘制的圆环周长，从0到2为一周 。 -Math.PI / 2 将起始角设在12点钟位置 ，结束角 通过改变 step 的值确定
      context.arc(this.rpx2px(52), this.rpx2px(52), this.rpx2px(44), -Math.PI / 2, step / 50 * Math.PI - Math.PI / 2, false)
      context.stroke()
      context.draw()
    },
  },
  
  attached() {
    // 第二种方式通过组件的生命周期函数执行代码
    this.drawProgressbg()
    this.drawCircle(this.data.proportion) 
  }
})
