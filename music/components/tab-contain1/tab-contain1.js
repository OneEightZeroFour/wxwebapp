// components/tab-contain1/tab-contain1.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    songlist:[],
    offset:0
  },
  /**
   * 组件的方法列表
   */
  methods: {
    loadMore() {
      var self = this;
      wx.request({
        url: 'http://tingapi.ting.baidu.com/v1/restserver/ting', //仅为示例，并非真实的接口地址
        data: {
          method: 'baidu.ting.billboard.billList',
          type: 1,
          size: 10,
          offset: self.data.offset++
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          console.log(res.data, self.data)
          var songlist = self.data.songlist.concat(res.data.song_list)
          self.setData({
            songlist
          })
        }
      })
    }
  }
})
