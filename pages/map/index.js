// pages/map/index.js
import {
  getCurrentLocation,
  qqmapsdk
} from '../../utils/location'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude: 0,
    longitude: 0,
    markers: [],
    allmarkers: [],
    markerClassifications: [],
    isSearching: false,
    locationResult: [],
    navigateHeight: null,
    navHeight: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { location } = getCurrentLocation()
    let res = wx.getSystemInfoSync()
    let statusBarHeight = res.statusBarHeight
    let menuinformation = wx.getMenuButtonBoundingClientRect();
    let navigateHeight = menuinformation.top+statusBarHeight
    let navHeight = menuinformation.height
    console.log(location)
    this.setData({
      navigateHeight: navigateHeight,
      navHeight: navHeight
    });
    this.db = wx.cloud.database()
    this.db.collection('marker_classification').get().then(res => {
      const markerClassifications = res.data
      this._buildMarkerClassification(markerClassifications)
    })
    this.setData({
      latitude: location?.lat,
      longitude: location?.lng
    })
  },

  _buildMarkerClassification(originMarkersClassifications) {
    let markerClassifications = []
    originMarkersClassifications.forEach((item, index) => {
      let markerClassification = {
        id: item._id,
        icon: item.icon,
        title: item.title,
        isActive: index === 0 ? true : false
      }
      markerClassifications.push(markerClassification)
    })
    this.setData({
      markerClassifications
    })
    this.db.collection('marker').get().then(res => {
      const markers = res.data
      this._buildMarker(markers)
    })
  },
  onClear() {
    this.setData({
      isSearching: false,
      locationResult: []
    })
    this._clearSearchMarker()
  },
  
  onSearch(e) {
    qqmapsdk.getSuggestion({
      keyword: e.detail,
      success: (res) => {
        this._buildLocationResult(res.data)
      }
    })
    this.setData({
      isSearching: true
    })
  },
  gotoLocation(e) {
    const { latitude,longitude } = e.currentTarget.dataset.location
    let markers = this.data.markers
    markers.push(     {
      id: 99999,
      width: 35,
      height: 35,
      iconPath: '../../images/pin.png',
      latitude,
      longitude
    })
    this.setData({markers})
    // 中心区域跳转到某个经纬度位置
    this.mapCtx.moveToLocation({
      latitude, longitude
    })
    this.setData({
      isSearching: false
    })
  },
  _buildLocationResult(originResult) {
    let locationResult = []
    originResult.forEach(item => {
      locationResult.push({
        name: item.title,
        address: item.address,
        latitude: item.location.lat,
        longitude: item.location.lng
      })
    })
    this.setData({
      locationResult
    })
  },
  _clearSearchMarker() {
    // 清除当前marker节点
    let markers = this.data.markers.filter(item=>{
        return item.id !== 99999
    })
    this.setData({
        markers
    })
    // 跳回到当前用户所在地
    this.mapCtx.moveToLocation()
},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.mapCtx = wx.createMapContext('myMap')
    this.mapCtx.moveToLocation()
  },
  onCurrentLocationClick() {
    this.mapCtx.moveToLocation()
    this._clearSearchMarker()
  },
  /**
   * 生命周期函数--监听页面显示
   */
  _buildMarker(originMarkers) {
    let markers = []
    originMarkers.forEach((item, index) => {
      let marker = {
        id: index,
        _id: item._id,
        latitude: item.latitude,
        longitude: item.longitude,
        width: 40,
        height: 40,
        iconPath: this._getMakerIconPath(item.classificationId),
        title: item.name,
        classificationId: item.classificationId
      }
      markers.push(marker)
    })
    this.setData({
      allmarkers: markers
    })
    this._filterMarkets()
  },

  _filterMarkets() {
    this._findCurrentActiveClassificationIds()
    const markers = this.data.allmarkers.filter(item => {
      return this._findCurrentActiveClassificationIds().includes(item.classificationId)
    })
    this.setData({
      markers
    })
  },

  _findCurrentActiveClassificationIds() {
    let ids = []
    this.data.markerClassifications.forEach(item => {
      item.isActive === false || ids.push(item.id)
    })
    return ids;
  },

  _getMakerIconPath(classificationId) {
    const result = this.data.markerClassifications.filter(item => {
      return item.id === classificationId
    })
    return result[0]['icon']
  },

  onMarkerClassificationTap(e) {
    const {
      id
    } = e.currentTarget.dataset
    let markerClassifications = this.data.markerClassifications
    this.data.markerClassifications.forEach((item, index) => {
      if (item.id === id) {
        markerClassifications[index].isActive = !markerClassifications[index].isActive
      }
    })
    this.setData({
      markerClassifications
    })
    this._filterMarkets()
  },
  onMarkerTap(e) {
    const {
      markerId
    } = e.detail
    wx.navigateTo({
      url: `/pages/map/location?id=${this.data.allmarkers[markerId]['_id']}`,
    })
  },

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