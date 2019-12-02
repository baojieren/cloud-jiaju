// pages/info/info.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scenesInfo: {},
    fileType: ['mp4', 'mov', 'm4v', '3gp', 'avi', 'webm']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getScenesById(options.id)
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
   * 根据id查询系列属所有图片
   */
  getScenesById(id) {
    const scenesDB = wx.cloud.database().collection('t_scenes');
    scenesDB.doc(id).get().then(res => {
      let scenes = res.data.imgs.map(item => {
        let extName = item.substring(item.lastIndexOf('.') + 1);
        let isVideo = this.data.fileType.indexOf(extName.toLowerCase()) > -1;
        return {
          url: item,
          isVideo: isVideo
        }
      });
      this.setData({
        scenesInfo: scenes
      })
    })
  }
})