let app = getApp();

let messages = require('../../data/messages.js')
let bMap = require('../../libs/bmap-wx.js')
let util = require('../../utils/utils.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    message: '',
    cityDatas: {},
    icons: [''],
    //用来清空input内容
    // searchText: '',
    pos: {},
    showOpenSettingBtn: false,
    icons: ['/img/clothing.png', '/img/carwashing.png', '/img/pill.png', '/img/running.png', '/img/sun.png'],

  },

  //相关函数
  //计算pm的值
  calcPM(value) {
    if (value > 0 && value <= 50) {
      return {
        val: value,
        desc: '优',
        detail: '',
      }
    } else if (value > 50 && value <= 100) {
      return {
        val: value,
        desc: '良',
        detail: '',
      }
    } else if (value > 100 && value <= 150) {
      return {
        val: value,
        desc: '轻度污染',
        detail: '对敏感人群不健康',
      }
    } else if (value > 150 && value <= 200) {
      return {
        val: value,
        desc: '中度污染',
        detail: '不健康',
      }
    } else if (value > 200 && value <= 300) {
      return {
        val: value,
        desc: '重度污染',
        detail: '非常不健康',
      }
    } else if (value > 300 && value <= 500) {
      return {
        val: value,
        desc: '严重污染',
        detail: '有毒物',
      }
    } else if (value > 500) {
      return {
        val: value,
        desc: '爆表',
        detail: '能出来的都是条汉子',
      }
    }
  },

  //根据位置请求天气数据
  init(params) {
    let Bmap = new bMap.BMapWX({
      ak: app.globalData.ak
    })
    Bmap.weather({
      location: params.location,
      success: this.success,
      fail: this.fail,
    })
  },

  //天气获取成功回调
  success(data) {
    console.log(data)
    wx.stopPullDownRefresh()
    //获取当前时间
    let now = new Date()
    data.updateTime = now.getTime();
    data.updateTimeFormat = util.formatDate(now, "MM-dd hh:mm")
    let results = data.originalData.results[0] || {}
    data.pm = this.calcPM(results['pm25'])
    //当天温度范围
    data.temperature = data.currentWeather[0].temperature
    //实时温度
    data.currentTemp = `${results.weather_data[0].date.match(/\d+/g)[2]}`
    //该城市天气信息存储到本地
    wx.setStorage({
      key: 'cityDatas',
      data: data,
    })
    this.setData({
      cityDatas: data
    })
  },

  //天气获取失败回调
  fail(res) {
    console.log(res)
    wx.stopPullDownRefresh()
    let errMsg = res.errMsg || ''
    //如果用户拒绝地理位置权限
    if (errMsg.indexOf('deny') !== -1 || errMsg.indexOf('denied') !== -1) {
      wx.showToast({
        title: '需要开启地理位置权限',
        duration: 2500,
        success: res => {
          this.setData({
            showOpenSettingBtn: true
          })
        }
      })
    } else {
      wx.showToast({
        title: '网络不给力，请稍后再试',
        icon: 'none'
      })
    }
  },

  //地理位置编码
  geocoder(address,succcessCall) {
    wx.request({
      url: app.setGeocoderUrl(address),
      // 请求成功
      success: res => {
        let data = res.data || {};
        if (!data.status) {
          let location = (data.result || {}).location || {}
          succcessCall && succcessCall(location)
        }
      },
      //请求失败
      fail: res => {
        wx.showToast({
          title: res.errMsg || '网络不给力，请稍后再试',
          icon:'none'
        })
      }
    })
  },

  //获取本地缓存中的天气信息
  getCityDatas() {
    wx.getStorage({
      key: 'cityDatas',
      success: function(res) {
        this.setData({
          cityDatas: res.cityDatas
        })
      },
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.init({})
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getCityDatas()
    this.setData({
      message: messages.messages()
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.init({})
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: '咸鱼天气，快乐咸鱼每一天',
      success() {},
      fail(e) {
        let errMsg = e.errMsg || '';
        //对不是用户取消转发导致的失败进行提示
        let msg = '分享失败，请重新分享'
        if (errMsg.indexOf('cancel') !== -1) {
          msg = '取消分享'
        }
        wx.showToast({
          title: msg,
          icon: 'none'
        })
      }
    }
  }
})