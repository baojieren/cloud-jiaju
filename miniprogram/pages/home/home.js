// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scenesList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
    this.getScenesList()
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
		this.getScenesList()
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

  },

  /**
   * 获取所有有效的系列列表
   */
  getScenesList() {
    const scenesDB = wx.cloud.database().collection('t_scenes');
    scenesDB.where({
      valid: 1
    }).get().then(res => {
      this.setData({
        scenesList: res.data
      })
    })
  },

  /**
   * 导航到系列详情页
   */
  doScenesInfo(event) {
    wx.navigateTo({
      url: '/pages/info/info?id=' + event.currentTarget.dataset.id,
    })
  }
})