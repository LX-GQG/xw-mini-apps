// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperItems: [
      {
        imageUrl: 'http://gqgwr.cn/img/071.jpg',
        title: 'WR AMD 270',
        config: [
          {title: "单身", subtitle: "18"},
          {title: "沉鱼落雁", subtitle: "闭月羞花"},
          {title: "绝无仅有", subtitle: "机不可失"}
        ]
      },
      {
        imageUrl: 'http://gqgwr.cn/img/777.jpg',
        title: 'WR',
        config: [
          {title: "傻妞", subtitle: "天真"},
          {title: "楚楚动人", subtitle: "善解人意"},
          {title: "天赐良机", subtitle: "独一无二"}
        ]
      },
      {
        imageUrl: 'http://gqgwr.cn/img/1002.jpg',
        title: 'WR,270,姐儿',
        config: [
          {title: "群芳争艳", subtitle: "羡煞旁人"},
          {title: "还在想什么", subtitle: "仅此一次"},
          {title: "肤白貌美", subtitle: "家财万贯"}
        ]
      }
    ],
    currentSwiperIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onSwiperChage(e) {
    const {current} = e.detail
    this.setData({
      currentSwiperIndex: current
    })
    console.log(e)
  },
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})