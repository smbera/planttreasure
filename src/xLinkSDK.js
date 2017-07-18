import XSDK from 'xlink-jssdk'
import Vue from 'vue'
import config from "./app-config"

var isDebug = true;
var openid = "oVTvT0shR6UT_jdihydtBdJg45rc";
var userid = "";
var authorize = "";

function getSearchCode() { // 获取url上的code参数
  var search = window.location.search
  var searchs = {}
  var strs = []
  if (search.indexOf('?') !== -1) {
    search = search.substr(1)
    strs = search.split('&')
    for (var i = 0; i < strs.length; i++) {
      searchs[strs[i].split('=')[0]] = decodeURIComponent(strs[i].split('=')[1])
    }
  }

  return searchs['code']
}

function getOpenId(code) {

  var url = config.getOpenIdUrl(code)

  console.log("getOpenId:" + url);

  Vue.http.get(url).then(function (res) {
    console.log(res.body);
    var user = res.body;
    openid = user.open_id;
    userid = user.user_id;
    getUserAuthorize(openid);
  }).catch(function (err) {
    console.log("getOpenId err");

    window.parent.location = config.getOauthUrl()

  })

}

function getUserAuthorize(openid) {

  var url = config.getUserAuthorizeUrl(openid)

  console.log("getUserAuthorize:" + url)

  Vue.http.get(url).then(function (res) {
    console.log("getUserAuthorize:")
    console.log(res.body);
    authorize = res.body.authorize;
    userid = res.body.user_id;
    getDevices(openid);
  }).catch(function (err) {
    console.log(err);
  })
}


function getDevices(openid) {

  var url = config.getDevicesUrl(openid)

  Vue.http.get(url).then(function (res) {
    console.log("getDevices:")
    console.log(res)
    var devices = [];
    res.body.devices.forEach(function (item) {

      devices.push({
        device_id: item.device_id,
        device_pid: item.device_pid,
        device_type: item.device_type,

        id: item.device_id,
        mac: item.device_mac,
        pid: item.device_pid,
      });
    });
    initSDK(devices);
  }).catch(function (err) {
    console.log(err)
  })
}

function addDeviceInfo(device) {


  device.online = false;
  device.data = {

    power: false,//表示设备开关机，可APP设置可设备上报，0x00：关机，0x01：开机
    viewModePower: false,//表示设备观赏模式开关，可APP设置可设备上报，0x00：观赏模式关，0x01：观赏模式开
    fanPower: false,//表示设备风扇开关，可APP设置可设备上报，0x00：风扇关，0x01：风扇开
    waterAlarn: false,//表示设备水位警报有无，只可设备上报，0x00：无警报，0x01：有警报
    temperature: 0,//表示设备环境温度的状态，0x00 ~0x8c：对应0到140；，温度公式为X – 40
    plantType: 1, //表示设备种植植物种类，可APP设置可设备上报，0x01：叶菜类，0x02：香料类，0x03：果菜类，0x04：花卉类，0x05：食用菌
    startTime: 0, //表示设置光照开始时间，可APP设置可设备上报，，采用高字节在前，低字节在后的原则。，如设置5小时=300分钟=0x012C，则字节10为0x01，字节11为0x2C。
    plantInfo: [
      {
        exposureTime: 0,//表示设备一层的光照时间，可APP设置可设备上报，0-0x18：对应0到24小时
        plantId: 1,//表示设备种植植物的ID，可APP设置可设备上报，0x01：芥菜，0x02：菜心，0x03：芥香甜白菜，0x04：意大利生菜，0x05：九芽生菜，0x06：黄叶白菜，0x07：罗马生菜，0x08：紫冠油菜，0x09：芥兰，0x0a：红叶生菜
        growthCycle: 0,//表示一层所种植物的生长周期，可APP设置可设备上报，0-0xff：对应0到255天
        growthDay: 0,//表示一层所种植物的已经生长的时间，可APP设置可设备上报，0-0xff：对应0到255天
        autoLightPower: false,//表示设备一层光照自动调节开关，可APP设置可设备上报，0x00：光照自动调节关，0x01：光照自动调节开
        redLight: 0,//表示设备一层红光的光照度，可APP设置可设备上报，0x00-0x64：0%到100%
        blueLight: 0,//表示设备一层绿光的光照度，可APP设置可设备上报，0x00-0x64：0%到100%
        whiteLight: 0,//表示设备一层蓝光的光照度，可APP设置可设备上报，0x00-0x64：0%到100%
      },
      {
        exposureTime: 0,//表示设备二层的光照时间，可APP设置可设备上报，0-0x18：对应0到24小时
        plantId: 1,//表示设备种植植物的ID，可APP设置可设备上报，0x01：芥菜，0x02：菜心，0x03：芥香甜白菜，0x04：意大利生菜，0x05：九芽生菜，0x06：黄叶白菜，0x07：罗马生菜，0x08：紫冠油菜，0x09：芥兰，0x0a：红叶生菜
        growthCycle: 0,//表示二层所种植物的生长周期，可APP设置可设备上报，0-0xff：对应0到255天
        growthDay: 0,//表示二层所种植物的已经生长的时间，可APP设置可设备上报，0-0xff：对应0到255天
        autoLightPower: false,//表示设备二层光照自动调节开关，可APP设置可设备上报，0x00：光照自动调节关，0x01：光照自动调节开
        redLight: 0,//表示设备二层红光的光照度，可APP设置可设备上报，0x00-0x64：0%到100%
        blueLight: 0,//表示设备二层绿光的光照度，可APP设置可设备上报，0x00-0x64：0%到100%
        whiteLight: 0,//表示设备二层蓝光的光照度，可APP设置可设备上报，0x00-0x64：0%到100%
      },
      {
        exposureTime: 0,//表示设备三层的光照时间，可APP设置可设备上报，0-0x18：对应0到24小时
        plantId: 1,//表示设备种植植物的ID，可APP设置可设备上报，0x01：芥菜，0x02：菜心，0x03：芥香甜白菜，0x04：意大利生菜，0x05：九芽生菜，0x06：黄叶白菜，0x07：罗马生菜，0x08：紫冠油菜，0x09：芥兰，0x0a：红叶生菜
        growthCycle: 0,//表示三层所种植物的生长周期，可APP设置可设备上报，0-0xff：对应0到255天
        growthDay: 0,//表示三层所种植物的已经生长的时间，可APP设置可设备上报，0-0xff：对应0到255天
        autoLightPower: false,//表示设备三层光照自动调节开关，可APP设置可设备上报，0x00：光照自动调节关，0x01：光照自动调节开
        redLight: 0,//表示设备三层红光的光照度，可APP设置可设备上报，0x00-0x64：0%到100%
        blueLight: 0,//表示设备三层绿光的光照度，可APP设置可设备上报，0x00-0x64：0%到100%
        whiteLight: 0,//表示设备三层蓝光的光照度，可APP设置可设备上报，0x00-0x64：0%到100%
      }
    ],

  };
}

function initSDK(devices) {
  console.log('initSDK');


  var ws = new XSDK('websocket', { // xsdk微信应用接口的是基于socket.io实现的。

    host: 'http://cm.xlink.cn:23777',
    userid: userid + "",
    authorize: authorize,
    dp_version: 2,
  });

  ws.on('ready', function () {

    console.log('websocket ready');
    ws.emit('adddevices', devices);

  }).on('devicesready', function (xDevices) {
    console.log('devicesready');
    if (!xDevices || xDevices.length <= 0) {
      return;
    }

    for (var i = 0; i < devices.length; i++) {
      xDevices[i].id = devices[i].device_id;
      xDevices[i].userid = userid;
      xDevices[i].token = userid;
    }

    xDevices.forEach(function (device) {

      addDeviceInfo(device);

      device.on('statuschange', function (data) { // 0表示离线 1表示在线
        console.log('device on statuschange:' + data)
        device.online = data;
      }).on('data', function (data) {
        console.log('device on data')
        updateDeviceDataPoint(device, data)

      }).on("connect", function (data) {
        console.log("connect");
        //device.online=true;
      });

      device.emit("connect")
      device.emit("probe", function (res) {
        if (res.status === 0) { // 获取成功
          updateDeviceDataPoint(device, res)
        } else if (res.status === 10) {
          console.log(res.msg) // 设备离线
        } else {
          console.log(res)
        }
      });

    })

    window.devices = xDevices;
    if (window.devicesReady) {
      window.devicesReady(window.devices);
    }
    console.log('window.devicesReady');
  })
}

function updateDeviceDataPoint(device, data) {

  if (data.type != "datapoint") {
    //return;
  }

  device.online=true;

  for (var i = 0; i < data.data.length; i++) {
    var datapoint = data.data[i];
    console.log(datapoint.index+","+datapoint.value);
    switch (datapoint.index) {
      case 0:
        device.data.power = datapoint.value;
        break;
      case 1:
        device.data.viewModePower = datapoint.value;
        break;
      case 2:
        device.data.fanPower = datapoint.value;
        break;
      case 3:
        device.data.waterAlarn = datapoint.value;
        break;
      case 4:
        device.data.temperature = datapoint.value - 40;
        break;
      case 5:
        device.data.startTime = datapoint.value;
        break;

      case 6:
        device.data.plantInfo[0].exposureTime = datapoint.value;
        break;
      case 7:
        device.data.plantInfo[0].plantId = datapoint.value;
        break;
      case 8:
        device.data.plantInfo[0].growthCycle = datapoint.value;
        break;
      case 9:
        device.data.plantInfo[0].growthDay = datapoint.value;
        break;
      case 10:
        device.data.plantInfo[0].autoLightPower = datapoint.value;
        break;
      case 11:
        device.data.plantInfo[0].redLight = datapoint.value;
        break;
      case 12:
        device.data.plantInfo[0].blueLight = datapoint.value;
        break;
      case 13:
        device.data.plantInfo[0].whiteLight = datapoint.value;
        break;

      case 14:
        device.data.plantInfo[1].exposureTime = datapoint.value;
        break;
      case 15:
        device.data.plantInfo[1].plantId = datapoint.value;
        break;
      case 16:
        device.data.plantInfo[1].growthCycle = datapoint.value;
        break;
      case 17:
        device.data.plantInfo[1].growthDay = datapoint.value;
        break;
      case 18:
        device.data.plantInfo[1].autoLightPower = datapoint.value;
        break;
      case 19:
        device.data.plantInfo[1].redLight = datapoint.value;
        break;
      case 20:
        device.data.plantInfo[1].blueLight = datapoint.value;
        break;
      case 21:
        device.data.plantInfo[1].whiteLight = datapoint.value;
        break;


      case 22:
        device.data.plantInfo[2].exposureTime = datapoint.value;
        break;
      case 23:
        device.data.plantInfo[2].plantId = datapoint.value;
        break;
      case 24:
        device.data.plantInfo[2].growthCycle = datapoint.value;
        break;
      case 25:
        device.data.plantInfo[2].growthDay = datapoint.value;
        break;
      case 26:
        device.data.plantInfo[2].autoLightPower = datapoint.value;
        break;
      case 27:
        device.data.plantInfo[2].redLight = datapoint.value;
        break;
      case 28:
        device.data.plantInfo[2].blueLight = datapoint.value;
        break;
      case 29:
        device.data.plantInfo[2].whiteLight = datapoint.value;
        break;

      case 30:
        device.data.plantType = datapoint.value;
        break;


    }
  }
}

function init() {
  console.log('xLinkSDK init');

  if (isDebug) {
    getUserAuthorize(openid);
    return;
  }
  var code = getSearchCode();
  getOpenId(code);
}

export default init
