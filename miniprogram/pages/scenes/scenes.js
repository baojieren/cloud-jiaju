// pages/scenes/scenes.js
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
    this.getScenesList();
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
   * 获取所有系列
   */
  getScenesList() {
    const scenesDB = wx.cloud.database().collection('t_scenes');
    scenesDB.where({

    }).get().then(res => {
      this.setData({
        scenesList: res.data
      })
    })
  },

  /**
   * 跳转到edit页面
   */
  doEdit(event) {
    let id = event.currentTarget.dataset.id;
    let title = event.currentTarget.dataset.title;
    let remark = event.currentTarget.dataset.remark;
    let imgs = event.currentTarget.dataset.imgs;
    let valid = event.currentTarget.dataset.valid;
    let url = `/pages/edit/edit?id=${id}&title=${title}&remark=${remark}&imgs=${imgs}&valid=${valid}`
    wx.navigateTo({
      url: url
    })
  }
})