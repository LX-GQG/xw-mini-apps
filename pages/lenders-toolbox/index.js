// pages/lenders-toolbox/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    product: '',
    products: [],
    productLine: '',
    productLines: [],
    price: 0,
    priceList: [],
    financePlan: '合作贷款机构',
    financePlans: ['合作贷款机构'],
    financeProduct: '标准贷款',
    financeProducts: ['标准贷款'],
    periodsOption: ['12期', '24期'],
    periods: '12期',
    rate: 15,
    annualizedRateList: [],
    annualizedRate: '4.00',
    isCollapse: false,
    originProductData: [],
    downPayment: 0,
    loan: 0,
    allProvinces: [],
    allCities: [],
    allFinanceOrgs: [],
    financeOrgs: [],
    province: [],
    cities: [],
    currentProvince: '',
    currentCity: ''
  },

  onRateInput(e) {
    this.setData({
      rate: e.detail.value
    })
    this._compute()
  },

  _compute() {
    let downPayment = this.data.price * (this.data.rate / 100)
    let loan = this.data.price - downPayment
    let mountlyPayment = (Number.parseFloat(loan) * (1 + this.data.annualizedRate / 100)) / Number.parseFloat(this.data.periods)

    mountlyPayment = Number.parseInt(mountlyPayment * 100) / 100
    this.setData({
      downPayment: downPayment.toLocaleString(),
      loan: loan.toLocaleString(),
      mountlyPayment: mountlyPayment.toLocaleString()
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.db = wx.cloud.database()
    this._loadProducts()
    this._loadProvinces()
    this._loadFinanceOrgs()
  },
  _loadProducts() {
    this.db.collection('product').get().then(res => {
      let products = []
      const index = 0
      res.data.forEach(item => {
        products.push(item.title)
      })
      this.setData({
        originProductData: res.data,
        products,
        product: products[index],
      })
      this.changeProduct(index)
    })
  },
  onProductSelect(e) {
    this.changeProduct(e.detail.index)
  },
  onProductLineSelect(e) {
    this.changeProductLine(e.detail.index)
  },
  onProvinceChange(e) {
    this._changeProvince(e.detail.index)
  },
  _changeProvince(index = 0) {
    const currentProvince = this.data.allProvinces[index]
    this.setData({
      currentProvince: currentProvince.name
    })
    this._changeCites(currentProvince.cities)
  },
  _changeCites(cities) {
    const result = this.data.allCities.filter(item => {
      return cities.includes(item._id)
    })
    const currentCity = result[0]
    const financeOrgs = this.data.allFinanceOrgs.filter(item => {
      return currentCity['finance_orgs'].includes(item._id)
    })
    this.setData({
      cities: result,
      currentCity: result[0].name,
      financeOrgs
    })
  },
  onPeriodsChange(e) {
    const { index } = e.detail
    this._changePeriods(index)
  },
  onCityChange(e) {
    const { index, value } = e.detail
    this.setData({
      currentCity: value
    })
    const currentCity = this.data.allCities[index]
    const result = this.data.allFinanceOrgs.filter(item => {
      return currentCity['finance_orgs'].includes(item._id)
    })
    this.setData({
      financeOrgs: result
    })
  },
  onFinanceProductChange(e) {
    const { index } = e.detail
    this._changeFinanceProduct(index)
  },
  changeProductLine(index) {
    this.setData({
      productLine: this.data.productLines[index],
      price: this.data.priceList[index]
    })
  },
  changeProduct(index) {
    let currentProduct = this.data.originProductData[index]
    let productLines = []
    let priceList = []
    currentProduct.productLine.forEach(item => {
      productLines.push(item.name)
      priceList.push(item.price)
    })
    this.setData({
      productLines,
      productLine: productLines[0],
      priceList,
      price: priceList[0],
      currentProductImage: currentProduct.cover,
      product: this.data.originProductData[index].title
    })
  },
  _loadFinancePlans() {
    this.db.collection('finance_plan')
      .get().then(res => {
        this._processFinancePlanOriginData(res.data)
      })
  },
  _loadCities() {
    return this.db.collection('city').get()
  },
  _loadFinanceOrgs() {
    return this.db.collection('finance_org').get()
  },
  _loadProvinces() {
    this.db.collection('province')
      .get().then(res => {
        const allProvinces = res.data
        this._loadCities().then(res1 => {
          const allCities = res1.data
          this._loadFinanceOrgs().then(res2 => {
            const allFinanceOrgs = res2.data
            this.setData({ allProvinces, allCities, allFinanceOrgs })
            this._changeProvince()
          })

        })
      })

  },
  _processFinancePlanOriginData(originData) {
    let financePlans = []
    originData.forEach(item => {
      financePlans.push(item.name)
    })
    this.setData({
      financePlans,
      originData
    })
    this._changeFinancePlan()
  },
  _changeFinancePlan(index = 0) {
    let financeProducts = []
    this.data.originData[index].product.forEach(item => {
      financeProducts.push(item.name)
    })
    const currentProducts = this.data.originData[index].product

    this.setData({
      financeProducts,
      currentProducts
    })
    this._changeFinanceProduct()
  },
  _changeFinanceProduct(index = 0) {
    const financeProduct = this.data.currentProducts[index].name
    let periodsOptions = this.data.currentProducts[index].periodsOptions
    let annualizedRateList = this.data.currentProducts[index].rate
    this.setData({
      periodsOptions,
      financeProduct,
      annualizedRateList
    })
    this._changePeriods()
  },
  _changePeriods(index = 0) {
    let periods = this.data.periodsOptions[index]
    let annualizedRate = this.data.annualizedRateList[index]
    this.setData({
      periods,
      annualizedRate
    })
    this._compute()

  },

  toggleCollapse() {
    this.setData({
      isCollapse: !this.data.isCollapse
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  onChange(e) {
    let form = this.data.form
    form = e.detail.value
    this.setData({
      form
    })
  },

  onSelectionChange() {

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