// pages/weather/weather.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region:["江西省", "南昌市", "青山湖"],
    now:""
  },

  // 点击确定后，显示用户选择的地区
  changeRegion:function(e){
    this.setData({
      region: e.detail.value
    })

    // 更新天气
    this.getWeatherByAddress();
  },

  // 通过获取picker的value，省市区，来获取天气
  getWeatherByAddress: function () {
    var that = this;
    // console.log(this.data.region);
    wx.request({
      url: 'https://free-api.heweather.net/s6/weather/now?',
      data: {
        location: that.data.region[1],
        key: 'ec8a14c1a3534a34ae28237e12c71d83'
      },
      success: function (result) {
        // console.log(result.data);
        that.setData({
          now: result.data.HeWeather6[0].now,
        })
      },
    })
  },

  // 通过经度和纬度来获取天气
  // 两个参数分别为经度和纬度
  getWeatherByLongAndLat: function (longitude, latitude){
    var that = this;
    wx.request({
      url: 'https://free-api.heweather.net/s6/weather/now?',
      data:{
        location: longitude + "," + latitude,
        // that.data.region[1]
        key:'ec8a14c1a3534a34ae28237e12c71d83'
      },
      success:function(result){
        // console.log(result.data);
        let province = result.data.HeWeather6[0].basic.admin_area;
        let city = result.data.HeWeather6[0].basic.parent_city;
        let location = result.data.HeWeather6[0].basic.location;
        var addressArray = [province, city, location];
        wx.setStorage({
          key: 'address',
          data: addressArray,
        });
        that.setData({
          now: result.data.HeWeather6[0].now,
          region: [province, city, location],
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取到本地缓存，缓存用户的位置，避免用户每打开一次就重新获取位置
    var historyAddress = wx.getStorageSync("address") || ["等一下下哦~"];
    this.setData({
      region: historyAddress,
    });
    // console.log(historyAddress);
    
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        const speed = res.speed
        const accuracy = res.accuracy
        // console.log(res); 
        that.getWeatherByLongAndLat(longitude, latitude);
      }
    })
  },
})