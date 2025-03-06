// utils/request.js

// 获取 token 和用户信息的函数，假设在 app.js 中有全局方法获取
const app = getApp();
const getToken = () => app.globalData.token;
const clearUserInfo = () => {
  app.globalData.token = '';
  app.globalData.userInfo = null;
  wx.removeStorageSync('userinfo');
  wx.removeStorageSync('token');
};

/** 创建请求函数 */
export function request(config) {
  return new Promise((resolve, reject) => {
    const token = getToken();
    const configDefault = {
      url: '',
      method: 'GET',
      data: {},
      header: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      timeout: 8000,
      success(res) {
        const apiData = res.data;
        const code = apiData.code;

        if (code === undefined) {
          wx.showToast({ title: '非本系统的接口', icon: 'error' });
          reject(new Error('非本系统的接口'));
        } else {
          switch (code) {
            case 200:
              resolve(apiData);
              break;
            case 401:
              clearUserInfo();
              wx.redirectTo({ url: '/pages/login/login' });
              reject(new Error('登录过期'));
              break;
            default:
              wx.showToast({ title: apiData.msg || 'Error', icon: 'error' });
              reject(new Error(apiData.msg || 'Error'));
              break;
          }
        }
      },
      fail(error) {
        let errorMessage = error.errMsg || '请求失败';

        switch (error.statusCode) {
          case 400:
            errorMessage = '请求错误';
            break;
          case 401:
            clearUserInfo();
            wx.redirectTo({ url: '/pages/login/login' });
            break;
          case 403:
            errorMessage = '拒绝访问';
            break;
          case 404:
            errorMessage = '请求地址出错';
            break;
          case 408:
            errorMessage = '请求超时';
            break;
          case 500:
            errorMessage = '服务器内部错误';
            break;
          case 502:
            errorMessage = '网关错误';
            break;
          case 503:
            errorMessage = '服务不可用';
            break;
          case 504:
            errorMessage = '网关超时';
            break;
          default:
            break;
        }

        wx.showToast({ title: errorMessage, icon: 'error' });
        reject(error);
      }
    };

    wx.request(Object.assign(configDefault, config));
  });
}