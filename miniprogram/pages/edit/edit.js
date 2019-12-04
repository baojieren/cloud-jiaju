// pages/edit/edit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    remark: '',
    imgs: [],
    cloudFileIds: []
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
   * 选择图片
   */
  ChooseImage() {
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        if (this.data.imgs.length != 0) {
          this.setData({
            imgs: this.data.imgs.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgs: res.tempFilePaths
          })
        }
      }
    });
  },

  /**
   * 查看大图
   */
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgs,
      current: e.currentTarget.dataset.url
    });
  },

  /**
   * 删除图片
   */
  DelImg(e) {
    wx.showModal({
      title: '确定删除吗?',
      content: '',
      cancelText: '不删除',
      confirmText: '删除',
      success: res => {
        if (res.confirm) {
          this.data.imgs.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgs: this.data.imgs
          })
        }
      }
    })
  },

  /**
   * 绑定input事件
   */
  DoInput(e) {
    let value = e.detail.value;

    if (e.currentTarget.id === 'title') {
      this.setData({
        title: value
      });
    }
    if (e.currentTarget.id === 'remark') {
      this.setData({
        remark: value
      });
    }
  },

  /**
   * 保存
   */
  DoSave() {
		wx.showLoading({
			title: '保存中',
		});

    let that = this;

    function uploadImg(filePath) {
      return new Promise((resolve, reject) => {
        let cloudPath = new Date().getTime() + Math.floor(Math.random() * 10) + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            resolve(res.fileID)
          },
          fail: err => {
            reject(err)
          },
          complete: () => {

          }
        })
      })
    }

    async function upLoadAll() {
      for (var img of that.data.imgs) {
        let fileId = await uploadImg(img);
        that.setData({
          cloudFileIds: that.data.cloudFileIds.concat(fileId)
        })
      }

      // 上面 同步 完成后,保存系列信息
      let scenesDB = wx.cloud.database().collection('t_scenes');
      scenesDB.add({
        data: {
          title: that.data.title,
          remark: that.data.remark,
          imgs: that.data.cloudFileIds,
          valid: 1
        },
        success: () => {
          wx.hideLoading();
					wx.navigateTo({
						url: '/pages/home/home',
					})
        }
      })
    }
    // 调用方法
    upLoadAll();
  }

})