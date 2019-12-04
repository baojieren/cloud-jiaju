// pages/edit/edit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    remark: '',
    imgs: [],
    cloudFileIds: [],
    deleteImgs: [], //编辑时删除的图片文件
    enableDel: false,
    enableUpdate: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.id) {
      let imgArr = options.imgs.split(',');
      this.setData({
        id: options.id,
        title: options.title,
        remark: options.remark,
        imgs: imgArr,
        cloudFileIds: imgArr,
        valid: options.valid,
        enableDel: true,
        enableUpdate: true
      })
    }

		console.log(this.data.cloudFileIds)
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
					if(this.data.enableUpdate){
						this.data.deleteImgs.push(this.data.imgs[e.currentTarget.dataset.index])
						this.data.cloudFileIds.splice(e.currentTarget.dataset.index, 1);	
					}
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
            console.log(err)
            reject(err)
          },
          complete: () => {

          }
        })
      })
    }

    async function upLoadAll() {
      // 把已经上传过的图片过滤掉
      let uploadImgs = [];
      that.data.imgs.forEach(img => {
        if (!img.startsWith('cloud')) {
          uploadImgs.push(img)
        }
      })

      for (var img of uploadImgs) {
        let fileId = await uploadImg(img);
        that.setData({
          cloudFileIds: that.data.cloudFileIds.concat(fileId)
        })
      }

      // 上面 同步 完成后,保存系列信息
      let scenesDB = wx.cloud.database().collection('t_scenes');

      // 添加
      if (that.data.enableUpdate) {
        scenesDB.doc(that.data.id).update({
          data: {
            title: that.data.title,
            remark: that.data.remark,
            imgs: that.data.cloudFileIds,
            valid: parseInt(that.data.valid)
          },
          success: () => {
            wx.hideLoading();
          }
        })
      } else {
        // 更新
        scenesDB.add({
          data: {
            title: that.data.title,
            remark: that.data.remark,
            imgs: that.data.cloudFileIds,
            valid: 1
          },
          success: () => {
            wx.hideLoading();
          }
        })
      }

      // 删除图片
      if (that.data.deleteImgs.length > 0) {
        wx.cloud.deleteFile({
          fileList: that.data.deleteImgs
        }).then(res => {
          console.log('有图片被删除')
        })
      }

      wx.switchTab({
        url: '/pages/home/home',
      })
    }
    // 调用方法
    upLoadAll();
  },

  /**
   * 删除
   */
  DoDelete(event) {
    wx.showModal({
      title: '确定删除吗?',
      content: '',
      cancelText: '不删除',
      confirmText: '删除',
      success: res => {
        if (res.confirm) {
          let scenesDB = wx.cloud.database().collection('t_scenes');
          scenesDB.doc(this.data.id).remove({
              success: (res) => {

              }
            }),

            // 删除图片
            wx.cloud.deleteFile({
              fileList: this.data.imgs
            }).then(res => {
              wx.switchTab({
                url: '/pages/home/home',
              })
            })
        }
      }
    })
  }
})