// pages/activity/index.js
const citySelector = requirePlugin('citySelector');
import { getCurrentLocation } from '../../utils/location'

import { formatDate } from '../../utils/time.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 0,
    currentCity: '',
    recommendActivities: false,
    loading: false,
    count: 0,
    limit: 5,
    total: 0,
    noMore: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '活动',
    });
    const { city } = getCurrentLocation()
    this.setData({
      currentCity: city
    })
    this.db = wx.cloud.database()
  },
  _loadCurrentCityLatestActivities() {
    if (this.data.count !== 0 && this.data.count === this.data.total) {
      this.setData({
          noMore: true
      })
        return;
    }
    this.setData({
        loading: true
    })
    this.db.collection('activity').orderBy('_createTime', 'desc').where({ city: this.data.currentCity }).get().then(res => {
        let activities = []
        res.data.forEach((item) => {
          // item.status = this._getActivityStatus(item)
          item['formated_start_time'] = formatDate(item['start_time'])
          item['formated_end_time'] = formatDate(item['end_time'])
          activities.push(item)
        })
        const count = activities.length
        this.setData({
          activities, loading: false, count
        })
        this._updateActivityStatus()
      })
  },
  _updateActivityStatus() {
    let activities =[]
    this.data.activities.forEach((item, index) => {
      this._setActivityStatus(item, index)
      
    })
  },

  _setActivityStatus(item, index) {
    const now = new Date()
    let status = (item['end_time'] >= now  && item['start_time'] <= now)? 'signing-up' : 'signing-end'
    this.db.collection('activity_apply_list').where({
        activity_id: item._id 
    }).get().then(res=>{
        if(res.data.length !== 0) {
            status = 'signed'
        }
        const currentKey = `activities[${index}].status`
        this.setData({
            [currentKey]: status
        })
    })
  },

  formatDate (data) { 
    return `${data.getMonth()+1}月${data.getDate()}日 ${data.getHours()}:${data.getMinutes()}`
  },        

  _loadCurrentCityActivitiesCount() {
    this.db.collection('activity').where({city: this.data.currentCity}).count().then(res=>{
        this.setData({
            total: res.total
        })
    })
  },
  _loadCurrentCityRecommandActivities() {
    this.db.collection('activity').orderBy('_createTime', 'desc').where({ city: this.data.currentCity, recommend: true }).get().then(res => {
      this.setData({
        recommendActivities: res.data
      })
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
    const selectedCity = citySelector.getCity(); // 选择城市后返回城市信息对象，若未选择返回null
    
    if (selectedCity) {
      this.setData({
        currentCity: selectedCity.fullname
      })
    }
    this._loadCurrentCityActivitiesCount()
    this._loadCurrentCityRecommandActivities()
    this._loadCurrentCityLatestActivities()
  },
  goToDetail(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/activity/detail?id=${id}`,
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  onTapSwitchLocation() {
    const key = '5ABBZ-AOMW5-PK5I2-QYQUS-WBDWH-ELFR4'; // 使用在腾讯位置服务申请的key
    const referer = '羽柔'; // 调用插件的app的名称
    const hotCitys = '广州,深圳,佛山,梅州,北京,上海,成都,昆明';
    wx.navigateTo({
      url: `plugin://citySelector/index?key=${key}&referer=${referer}&hotCitys=${hotCitys}`,
    })
    
  },
  onSwiperChange(e) {
    const current = e.detail.current
    this.setData({
      current
    })
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
    this._loadCurrentCityLatestActivities()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})