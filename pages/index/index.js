// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectShow : false,
    figure: [],
    username: '',
    magazine: [],
    swiperItems: [
      {
        cover: 'http://gqgwr.cn/img/071.jpg',
        title: 'WR and 270',
        config: [
          {title: "温润而泽", subtitle: "空前绝后"},
          {title: "沉鱼落雁", subtitle: "闭月羞花"},
          {title: "绝无仅有", subtitle: "机不可失"}
        ],
        productId: 1,
        message: "即使是满面疲倦和仆仆风尘，依然能看出她娇小的脸型和精致的五官，象混血儿一样奇特而夺目的美丽；细腻白皙的象羊奶凝乳一样的皮肤，仿佛透明的水晶色的新疆马奶提子一样，晶莹剔透的让人不忍多看，生怕目光落实了，把她的脸蛋刺出两个洞来。",
        figure: [
          {id: 1, username: "温柔",userimg: "http://gqgwr.cn/img/200.jpg"},
          {id: 2, username: "270",userimg: "http://gqgwr.cn/img/new1.jpg"}
        ]
      },
      {
        cover: 'http://gqgwr.cn/img/001.jpg',
        title: 'WR or HYT',
        config: [
          {title: "唯美", subtitle: "善良"},
          {title: "楚楚动人", subtitle: "善解人意"},
          {title: "天赐良机", subtitle: "独一无二"}
        ],
        productId: 2,
        message: "像一枝傲雪的寒梅，伫立在幽静的山谷中，恬静优雅的径自绽放，无论身周左右有多少人注视着她，她都象独自置身在空无一人的原野中一样，眼角眉梢，无不洋溢着自由浪漫的气息。",
        figure: [
          {id: 1, username: "温柔",userimg: "http://gqgwr.cn/img/201.jpg"},
          {id: 4, username: "黄愉婷",userimg: "http://gqgwr.cn/img/ttt.jpg"}       
        ]
      },
      {
        cover: 'http://gqgwr.cn/img/1002.jpg',
        title: 'WR,270,姐儿',
        config: [
          {title: "群芳争艳", subtitle: "羡煞旁人"},
          {title: "还在想什么", subtitle: "仅此一次"},
          {title: "肤白貌美", subtitle: "家财万贯"}
        ],
        productId: 3,
        message: "美女妖且闲，采桑岐路间。柔条纷冉冉，落叶何翩翩，攘袖见素手，皎腕约金环。头上金爵钗，腰佩翠琅玕。明珠交玉体，珊瑚间木难。罗衣何飘飘，轻裾随风远。顾盼遗光彩，长啸气若兰 手如柔荑，肤如凝脂，领如蝤蛴，齿如瓠犀，螓首蛾眉，巧笑倩兮，美目盼兮。",
        figure: [
          {id: 1, username: "温柔",userimg: "http://gqgwr.cn/img/200.jpg"},
          {id: 2, username: "270",userimg: "http://gqgwr.cn/img/new1.jpg"},
          {id: 3, username: "姐儿",userimg: "http://gqgwr.cn/img/new5.jpg"}
        ]
      }
    ],
    currentSwiperIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  gotoCleanEnergy() {
    wx.navigateTo({
      url: '/pages/article/detail?id=54ad1eea620677680eee5e8677dd756e',
    })
  },
  onSwiperChage(e) {
    const {current} = e.detail
    this.setData({
      currentSwiperIndex: current
    })
  },
  onBtnClick(e) {
    this.setData({
      selectShow:true
    })
      if (this.data.swiperItems[0].productId == e.currentTarget.dataset.productId) {
        this.setData({
          figure: this.data.swiperItems[0].figure,
          username: this.data.swiperItems[0].figure.username
        })
      }
      if (this.data.swiperItems[1].productId == e.currentTarget.dataset.productId) {
        this.setData({
          figure: this.data.swiperItems[1].figure,
          username: this.data.swiperItems[1].figure.username
        })
      }
      if (this.data.swiperItems[2].productId == e.currentTarget.dataset.productId) {
        this.setData({
          figure: this.data.swiperItems[2].figure,
          username: this.data.swiperItems[2].figure.username
        })
      }
  },
  onLoad: function (options) {
    const db = wx.cloud.database()
    // db.collection('swiper').get().then(res => {
    //   const swiperItems = res.data
    //   this.setData({ swiperItems })
    // })
    db.collection('magazine').get().then(res => {
      const magazine = res.data
      this.setData({ magazine })
    })
  },
  gotoLendersToolbox() {
    wx.navigateTo({
      url: '/pages/lenders-toolbox/index',
    })
  },
  gotoVideo() {
    wx.navigateTo({
      url: '/pages/video/index',
    })
  },
  gotoProduct(e) {
    if(e.currentTarget.dataset === null) {
      return;
    }
    const {productId} = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/product/index?id=${productId}`,
    })
  },
  clickProduct(e) {
    if(e.currentTarget.dataset === null) {
      return;
    }
    if(e.currentTarget.dataset.id == this.data.figure[0].id) {
      let Id = this.data.figure[0].username
      wx.navigateTo({
        url: `/pages/selectPeople/index?id=${Id}`,
      })
    } else {
      if(e.currentTarget.dataset.id == this.data.figure[1].id) {
        let Id = this.data.figure[1].username
        wx.navigateTo({
          url: `/pages/selectPeople/index?id=${Id}`,
        })
      } else {
        let Id = this.data.figure[2].username
        wx.navigateTo({
          url: `/pages/selectPeople/index?id=${Id}`,
        })
      }
    }
    this.setData({selectShow: false})
  },
  clickMagazine (e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/magazine/index?id=${id}`,
    })
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
  close () {
    this.setData({
      selectShow:false
    })
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