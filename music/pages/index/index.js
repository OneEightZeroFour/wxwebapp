var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
var base64 = require("../../images/base64");
Page({
  data: {
    // swiper
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    // navbar
    tabs: ["新歌榜", "热歌榜", "摇滚榜"],
    activeIndex: 1,
    sliderOffset: 0,
    sliderLeft: 0,
    //list
    offset: 0,
    songType: 1, //0,1,2
    songlist: [],
    songTypeDetail: [{
      name: "新歌榜",
      type: 1,
    },
    {
      name: "热歌榜",
      type: 2,
    },
    {
      name: "摇滚榜",
      type: 11,
    }
    ]
  },
  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  },
  playMusic(e) {
    console.log(e.currentTarget.dataset.songid);
    var songid = e.currentTarget.dataset.songid;
    wx.request({
      url: 'http://tingapi.ting.baidu.com/v1/restserver/ting', //仅为示例，并非真实的接口地址
      data: {
        method: 'baidu.ting.song.play',
        songid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data);
        var mp3 = res.data.bitrate.file_link;
        const backgroundAudioManager = wx.getBackgroundAudioManager()
        backgroundAudioManager.title = res.data.songinfo.album_title
        backgroundAudioManager.epname = res.data.songinfo.title
        backgroundAudioManager.singer = res.data.songinfo.author
        backgroundAudioManager.coverImgUrl = 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000'
        // 设置了 src 之后会自动播放
        backgroundAudioManager.src = mp3
      }
    })


  },
  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    this.setData({
      icon20: base64.icon20,
      icon60: base64.icon60
    });
    this.loadMore();
  },
  tabClick: function (e) {
    console.log(e.currentTarget.id);
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id,
      songType: e.currentTarget.id,
      offset: 0
    });
    this.loadMore();
  },
  loadMore() {
    var self = this;
    console.log('songType', self.data.songType, self.data.songTypeDetail[self.data.songType].type);

    wx.request({
      url: 'http://tingapi.ting.baidu.com/v1/restserver/ting', //仅为示例，并非真实的接口地址
      data: {
        method: 'baidu.ting.billboard.billList',
        type: self.data.songTypeDetail[self.data.songType].type,
        size: 10,
        offset: self.data.offset
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data, self.data)
        var songlist;

        if (self.data.offset > 0) {
          songlist = self.data.songlist.concat(res.data.song_list)
        } else {
          songlist = res.data.song_list
        }
        self.data.offset++
        self.setData({
          songlist
        })
      }
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.loadMore();
  },
})