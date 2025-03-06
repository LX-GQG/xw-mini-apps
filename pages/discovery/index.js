// pages/discovery/index.js
import { formatDate,formatDateMonth } from '../../utils/time.js'
import { request } from "../../utils/request.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperIndex: 0,
    swiperList: [],
    recommendPageShow: false,
    pageIndex: 0,
    pages: ['推荐','支持',"内容"],
    articleList: [],
    recommendArticleList: [],
    webList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.db = wx.cloud.database()
    this._loadData()
  },
  _loadData() {
    this.data.pageIndex === 0 ? this._loadArticlePageData() : this.data.pageIndex === 1 ? this._loadChannelPageData() : this._loadWebPageData()
  },
  _loadArticlePageData() {
    this.setData({
      channelList: []
    })
    this.db.collection('article').where({
      status: true
    }).orderBy('_createTime', 'desc').get().then(res => {
      let articleList = res.data
      console.log(articleList)
      articleList.forEach((item,index) => {
        articleList[index]._createTime = formatDateMonth(new Date(item._createTime))
      })
      this.setData({
        articleList
      })
    })
    this.db.collection('article').orderBy('_createTime', 'desc').where({recommend: true, status: true}).get().then(res => {
      this.setData({
        swiperList: res.data
      })
    })
  },
  _loadChannelPageData() {
    this.setData({
      articleList: []
    })
    this.db.collection('channel').orderBy('_createTime', 'desc').get().then(res => {
      this.setData({
        channelList: res.data
      })
    })
    this.db.collection('channel').orderBy('_createTime', 'desc').where({recommend: true}).get().then(res => {
      this.setData({
        swiperList: res.data
      })
    })
  },
  _loadWebPageData() {
    this.setData({
      articleList: [],
      channelList: []
    })
    request({
      url: 'https://api.gqgwr.cn/api/newList',
      method: 'POST'
    })
    .then(response => {
      console.log('请求成功:', response);
      this.setData({
        webList: response.data.rows
      })
    })
    .catch(error => {
      console.error('请求失败:', error);
    });
  },
  navigatePage(e) {
    const {targetId, type} = e.currentTarget.dataset
    type === 'article' ? wx.navigateTo({
      url: `/pages/article/detail?id=${targetId}`,
    }) : wx.navigateTo({
      url: `/pages/article/channel?id=${targetId}`,
    })
  },
  navigatePageWeb(e) {
    const {id} = e.currentTarget.dataset
    console.log(id)
    wx.navigateTo({
      url: `/pages/article/new?id=${id}`,
    })
  },
  onPageChange(e) {
    this.setData({
      pageIndex: e.detail.index
    })
    this._loadData()
  },

  onSwiperChange(e) {
    this.setData({
      swiperIndex: e.detail.current
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