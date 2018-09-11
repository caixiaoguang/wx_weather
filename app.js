//app.js
App({
  // onLaunch() {
  //   wx.getSystemInfo({
  //     success: res => {
  //       this.globalData.systemInfo = res
  //     }
  //   })
  // },
  globalData: {
    // systemInfo: {},
    ak: 'GAHrbs2zTOchXP2c3O8SYOP2MqVM7cbk'
  },
  setGeocoderUrl(address) {
    return `https://api.map.baidu.com/geocoder/v2/?address=${address}&output=json&ak=GAHrbs2zTOchXP2c3O8SYOP2MqVM7cbk`
  }
})