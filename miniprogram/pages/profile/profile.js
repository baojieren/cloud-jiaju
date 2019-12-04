// pages/profile/profile.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      logoUrl: '',
      userName: '',
      phone: '',
      addr: '',
      website: ''
    },
    admin: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 查询profile的信息
    this.getProfile();

    // 调用登录云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {}
    }).then(res => {
      app.globalData.openid = res.result.openid

      // 拿openid查询是否是admin
      let userDB = wx.cloud.database().collection('t_user');
      userDB.where({
        oid: res.result.openid
      }).get().then(res => {
        if (res.data.length > 0) {
          this.setData({
						admin: res.data[0].admin
          })
        }
      }).catch(err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      })
    }).catch(err => {
      console.log('调用云登录函数失败:', err)
    })
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
   * 那profile信息
   */
  getProfile() {
    let userDB = wx.cloud.database().collection('t_user');

    userDB.doc('9aac4824-201e-46cf-bd7a-66857d6058d9').get({
      success: res => {
        this.setData({
          userInfo: res.data
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },

  /**
   * 跳转到所有系列列表页
   */
  do2AllScenes() {
    wx.navigateTo({
      url: '/pages/scenes/scenes',
    })
  },

  /**
   * 跳转到编辑页面
   */
  do2EditScenes() {
    wx.navigateTo({
      url: '/pages/edit/edit',
    })
  }
})