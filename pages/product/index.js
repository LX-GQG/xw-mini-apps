// pages/product/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    product: null,
    lineItem: [],
    productItems: [
      // {
      //   imageUrl: 'http://gqgwr.cn/img/071.jpg',
      //   title: 'WR and 270',
      //   productId: 1,
      //   message: "即使是满面疲倦和仆仆风尘，依然能看出她娇小的脸型和精致的五官，象混血儿一样奇特而夺目的美丽；细腻白皙的象羊奶凝乳一样的皮肤，仿佛透明的水晶色的新疆马奶提子一样，晶莹剔透的让人不忍多看，生怕目光落实了，把她的脸蛋刺出两个洞来。",
      //   productLines: [
      //     {
      //       name: "温柔(WR)",
      //       price: 9999999999,
      //       address: "广东省梅州市",
      //       trait: "古灵精怪"
      //     },
      //     {
      //       name: "张霖(270)",
      //       price: 888888888,
      //       address: "广东省汕头市",
      //       trait: "平易近人"
      //     }
      //   ]
      // },{
      //   imageUrl: 'http://gqgwr.cn/img/001.jpg',
      //   title: 'WR or HYT',
      //   productId: 2,
      //   message: "像一枝傲雪的寒梅，伫立在幽静的山谷中，恬静优雅的径自绽放，无论身周左右有多少人注视着她，她都象独自置身在空无一人的原野中一样，眼角眉梢，无不洋溢着自由浪漫的气息。",
      //   productLines: [
      //     {
      //       name: "温柔(WR)",
      //       price: 9999999999,
      //       address: "广东省梅州市",
      //       trait: "古灵精怪"
      //     },
      //     {
      //       name: "黄愉婷(HYT)",
      //       price: 988888888,
      //       address: "广东省梅州市",
      //       trait: "亭亭玉立"
      //     }
      //   ]
      // },{
      //   imageUrl: 'http://gqgwr.cn/img/1002.jpg',
      //   title: 'WR,270,姐儿',
      //   productId: 3,
      //   message: "美女妖且闲，采桑岐路间。柔条纷冉冉，落叶何翩翩，攘袖见素手，皎腕约金环。头上金爵钗，腰佩翠琅玕。明珠交玉体，珊瑚间木难。罗衣何飘飘，轻裾随风远。顾盼遗光彩，长啸气若兰 手如柔荑，肤如凝脂，领如蝤蛴，齿如瓠犀，螓首蛾眉，巧笑倩兮，美目盼兮。",
      //   productLines: [
      //     {
      //       name: "温柔(WR)",
      //       price: 9999999999,
      //       address: "广东省梅州市",
      //       trait: "古灵精怪"
      //     },
      //     {
      //       name: "张霖(270)",
      //       price: 888888888,
      //       address: "广东省汕头市",
      //       trait: "平易近人"
      //     },
      //     {
      //       name: "I don't know(姐儿)",
      //       price: 989898989,
      //       address: "广东省普宁市",
      //       trait: "百媚千娇"
      //     }
      //   ]
      // }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const db = wx.cloud.database()
    db.collection('product').get().then(res => {
      const productItems = res.data
      for(let index in productItems ) {
        if (productItems[index]._id == options.id) {
          const productLineId = productItems[index].productLines
          db.collection('product_line').where({
            _id: db.command.in(productLineId)
          }).get().then(res => {
            const lineItem = res.data
            this.setData({
              lineItem: lineItem
            })
          })
          this.setData({
            product: productItems[index],
            productItems: productItems
          })
        }
      }
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