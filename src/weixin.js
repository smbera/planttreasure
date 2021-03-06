import Vue from 'vue'
import config from './app-config'


export default {

  init: function () {


    var timeStamp = parseInt(new Date().getTime() / 1000) + ""
    var nonceStr = timeStamp

    var url = config.getJsApiSignUrl(nonceStr, timeStamp)

    Vue.http.get(url).then(function (res) {


      window.wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: config.wxAppId, // 必填，公众号的唯一标识
        timestamp: timeStamp, // 必填，生成签名的时间戳
        nonceStr: nonceStr, // 必填，生成签名的随机串
        signature: res.body.signature,// 必填，签名，见附录1
        jsApiList: [
          "scanQRCode",

          "onMenuShareTimeline",


          "onMenuShareAppMessage",
          "onMenuShareQQ",
          "onMenuShareWeibo",
          "onMenuShareQZone",
          "startRecord",
          "stopRecord",
          "onVoiceRecordEnd",
          "playVoice",
          "pauseVoice",
          "stopVoice",
          "onVoicePlayEnd",
          "uploadVoice",
          "downloadVoice",
          "chooseImage",
          "previewImage",
          "uploadImage",
          "downloadImage",
          "translateVoice",
          "getNetworkType",
          "openLocation",
          "getLocation",
          "hideOptionMenu",
          "showOptionMenu",
          "hideMenuItems",
          "showMenuItems",
          "hideAllNonBaseMenuItem",
          "showAllNonBaseMenuItem",
          "closeWindow",
          "scanQRCode",
          "chooseWXPay",
          "openProductSpecificView",
          "addCard",
          "chooseCard",
          "openCard",

          // 硬件API
          "configWXDeviceWiFi",
          "openWXDeviceLib",
          "getWXDeviceInfos"


        ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      });

    })


  }

}
