const QQMapWX = require('../libs/qqmap-wx-jssdk.min.js');
export const qqmapsdk = new QQMapWX({
  key: '5ABBZ-AOMW5-PK5I2-QYQUS-WBDWH-ELFR4'
});

export const key = '5ABBZ-AOMW5-PK5I2-QYQUS-WBDWH-ELFR4'

export const initCurrentLocation = () => {
  qqmapsdk.reverseGeocoder({
    success(res){
      console.log("打印" + res)
      wx.setStorageSync('userCurrentLocation',res.result['ad_info'])
    }
  })
}
export const getCurrentLocation = () => {
  if (wx.getStorageSync('userCurrentLocation')) {
    initCurrentLocation();
  }
  return wx.getStorageSync('userCurrentLocation')
}

export const initProvincesAndCities = () => {
  qqmapsdk.getCityList({
    success: function(res) {//成功后的回调
      wx.setStorageSync('provinces',res.result[0])
      wx.setStorageSync('cities',res.result[1])
    }
  })
}
export const getProvincesAndCitiesTree = () => {
  let allCities = wx.getStorageSync('cities')
  let allCitiesGroupByProvince = []
  let index = 0;
  let prevItem;
  allCities.forEach(item => {
    if(allCitiesGroupByProvince.length === 0) {
      allCitiesGroupByProvince.push([item])
    } else {
      if(item.id.slice(0,2) === prevItem.id.slice(0,2)) {
        allCitiesGroupByProvince[index].push(item);
      } else {
        allCitiesGroupByProvince.push([item])
        index++;
      }
    }
    prevItem = item
  });
  let provinces = wx.getStorageSync('provinces')
  let tree = [];
  provinces.forEach((item, index)=>{
    item['children'] = allCitiesGroupByProvince[index]
    tree.push(item)
  })
  return tree;
}
