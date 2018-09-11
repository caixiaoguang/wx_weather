// pages/cityList/citylist.js
let staticData = require('../../data/staticData.js')
let util = require('../../utils/utils.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    alternative: null,
    cities: [],
    //需要显示的城市
    showItems: '',
    inputText: ''
  },

  //取消搜索
  cancel() {
    this.setData({
      inputText: '',
      showItems: this.data.cities,
    })
  },

  //进行搜索
  inputFilter(e) {
    let alternative = {}
    let cities = this.data.cities
    let value = e.detail.value.replace(/\s+/g, '')

    if (value.length) {
      for (let i in cities) {
        let items = cities[i]
        for (let j = 0, len = items.length; j < len; j++) {
          let item = items[j]
          if (item.name.indexOf(value) !== -1) {
            if (util.isEmptyObject(alternative[i])) {
              alternative[i] = []
            }
            alternative[i].push(item)
          }
        }
      }
      //如果没有搜索结果
      if (util.isEmptyObject(alternative)) {
        alternative = null
      }
      this.setData({
        alternative,
        showItems: alternative
      })
    } else {
      this.setData({
        alternative: null,
        showItems: cities,
      })
    }
  },


  //对城市列表按字母归类
  getSortedObj(areas) {
    //定义排序函数
    areas = areas.sort((a, b) => {
      if (a.letter > b.letter) {
        return 1
      }
      if (a.letter < b.letter) {
        return -1
      }
      return 0
    })
    let obj = {}
    for (let i = 0, len = areas.length; i < len; i++) {
      let item = areas[i]
      delete item.districts
      let letter = item.letter
      if (!obj[letter]) {
        obj[letter] = []
      }
      obj[letter].push(item)
    }
    return obj
  },


  choose(e) {
    let item = e.currentTarget.dataset.item
    let name = item.name
    let pages = getCurrentPages()
    // let len = pages.length
    let indexPage = pages[0]
    indexPage.setData({
      cityChanged: true,
      searchCity: name
    })
    //点击搜索后返回主页
    wx.navigateBack({})
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let cities = this.getSortedObj(staticData.cities || [])
    this.setData({
      cities,
      showItems: cities
    })
  },
})