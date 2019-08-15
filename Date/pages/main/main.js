import {
  formatTime
} from "../../dayTool/tool.js"

Page({

  // 页面初始数据
  data: {
    list:[],
    test:"没有填写日期哦~",
    defaultMessage:"2017-11-26",
    text:"纪念日名称"
  },

  // 获取到用户输入，并将用户的输入添加到页面中
  addBtn:function(){
    const defaultToday = formatTime(new Date());
    this.setData({
      defaultMessage: defaultToday,
    })
  },

  // 当input获得焦点时，隐藏默认的提示语
  inputFocus:function(){
    this.setData({
      text:""
    })
  },
  // 当input失去焦点时，显示默认的提示语
  inputBlur: function () {
    this.setData({
      text: "纪念日名称"
    })
  },

  formSubmit: function (e) {
    // console.log('form发生了submit事件，携带数据为：', e.detail.value);
    // console.log(e.detail.value.userInput);
    // console.log(e.detail.value.inputDay == "");

    const today = formatTime(new Date());
    // 今天的日期戳
    // console.log(new Date(today).getTime()); 
    // 输入日期的日期戳
    // console.log(new Date(e.detail.value.inputDay).getTime()); 

    var newTime = new Date(today).getTime();
    var oldTime = new Date(e.detail.value.inputDay).getTime();
    var dayCount = (newTime - oldTime) / 86400000;

    // 利用条件运算符，来判断用户输入的日期是否为未来的日期
    // 如果是未来的日期，则改变dayCount的正负，并改变文字
    var plusDayCount = dayCount>0 ? dayCount : (-dayCount);
    var defaultWord = dayCount>0 ? "已经" : "还有"; 
    
    // console.log(e.detail.value.userInput == "");

    // 判断用户纪念日名称和日期是否为空，为空时，提示用户纪念日名称和日期不能为空
    if (e.detail.value.userInput == "" || e.detail.value.inputDay == ""){
      wx.showModal({
        title: '提示',
        content: '纪念日名称和日期都不能为空哦',
        showCancel: false,
      })
    }else{
      const newSouvenir = {
        id: oldTime,
        name: e.detail.value.userInput,
        day: plusDayCount,
        word: defaultWord
      }
      this.data.list.push(newSouvenir);
    }
    
    // 重新渲染页面，将新加入的纪念日添加到页面中去
    // console.log(this.data.list);
    this.setData({
      list: this.data.list,
      inputContent: "",
    })

    // 进行本地缓存
    wx.setStorage({
      key: 'thingList',
      data: this.data.list,
    })
  },

  // 当用户点击确定时，修改picker的默认提示信息为用户选择的日期
  showTime: function (e) {
    // console.log(e.detail);
    // console.log(this.data);
    this.setData({
      defaultMessage: e.detail.value
    })
  },

  // 删除纪念日
  deleteBtn:function(e){
    // 获取到被点击元素的id，利用for循环进行判断，再删除当前被点击的元素
    const souvenirId = e.currentTarget.dataset.souvenirId;
    // console.log(todoId);
    // console.log(this.data.list);

    // 弹出对话框，提示用户是否要删除该条纪念日
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除这条纪念日嘛？',
      success(res) {
        if (res.confirm) {
          // console.log('用户点击确定')
          for (var i = 0; i < that.data.list.length; i++) {
            // console.log(this.data.list[i].id);
            if (that.data.list[i].id === souvenirId) {
              that.data.list.splice(i, 1)
            }
          }
          that.setData({
            list: that.data.list
          })
          wx.setStorage({
            key: 'thingList',
            data: that.data.list,
          })
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var history = wx.getStorageSync("thingList") || [];

    // 循环用于更新日期，其他日期打开，也会自动更新日期
    for (var i = 0; i < history.length; i++) {
      // console.log(history[i].day);
      // console.log(history[i].id);

      const today = formatTime(new Date());
      // console.log(today);
      var newTime = new Date(today).getTime();
      var resetDay = (newTime - history[i].id) / 86400000;
      var plusResetDay = resetDay>0 ? resetDay : (-resetDay);
      history[i].day = plusResetDay;
    }

    // 每一次加载页面时，都将日期的默认提示信息设置为今天的日期
    const defaultToday = formatTime(new Date());
    this.setData({
      list: history,
      defaultMessage: defaultToday,
    })
  },
})