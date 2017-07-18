<template>
  <div>
    <div id="header"><img src="../assets/logo.png" alt=""></div>
    <div id="switch">
      <div class="wrap">
        <div class="wrap-item">
          <i class="first"><img src="../assets/temperature.png"></i>
          <p>温度</p><span>{{device.data.temperature}}</span>
        </div>
        <div class="wrap-item"><i><img :src="device.data.waterAlarn?onoff.warnon:onoff.warnoff"></i>
          <p>水位警戒</p></div>
        <div class="wrap-item"><i><img :src="device.data.fanPower?onoff.fanon:onoff.fanoff" @click="togglefan()"></i>
          <p>风扇{{device.data.fanPower == true ? '开' : '关'}}</p></div>
        <div class="wrap-item"><i><img :src="device.data.viewModePower?onoff.viewon:onoff.viewoff"
                                       @click="toggleview()"></i>
          <p>观赏模式</p></div>
      </div>
    </div>

    <div class="tab">
      <div class="tab-item" v-for="(item, index) in items">
        <a href="javascript:;" :class="{ active: level==(index+1) }" @click="whichlevel(index)">{{item.lev}}</a>
      </div>
    </div>

    <div class="bg">
      <img class="bg-img" :src="background[device.data.plantType-1].bg">
      <p class="hours" @click.stop="showPicker1">{{exposureTime}}小时</p>
      <p class="time" @click.stop="showPicker">{{timeShow}}</p>
      <img class="sun" src="../assets/sun.png">
      <div class="species" @click.stop="showPicker2">
        <img :src="plant_icon[device.data.plantType-1].pi">
        <p>{{plantType}}</p>
      </div>
    </div>

    <div class="picker-bg" v-show="timePickerShow" @click.stop="hidePicker">
      <div class="picker-container" @click.stop="">
        <div class="picker-title">请选择光照开始时间</div>
        <mt-picker ref="startTimePicker" :slots="timeSlots"></mt-picker>
        <div class="picker-btn" @click="timePickerOk">确定</div>
      </div>
    </div>

    <div class="picker-bg" v-show="timePickerShow1" @click.stop="hidePicker1">
      <div class="picker-container" @click.stop="">
        <div class="picker-title">请选择光照时间</div>
        <mt-picker ref="exposureTimePicker" :slots="timeSlots1"></mt-picker>
        <div class="picker-btn" @click="timePickerOk1">确定</div>
      </div>
    </div>

    <div class="picker-bg" v-show="plantPickerShow" @click.stop="hidePicker2">
      <div class="picker-container" @click.stop="">
        <div class="picker-title">请选择植物</div>
        <mt-picker ref="plantPicker" :slots="timeSlots2"></mt-picker>
        <div class="picker-btn" @click="plantPickerOk">确定</div>
      </div>
    </div>

    <div class="content">
      <p class="day">DAY&nbsp;&nbsp;{{device.data.plantInfo[level - 1].growthDay}}</p>
      <p class="growday">生长周期&nbsp;:&nbsp;{{device.data.plantInfo[level - 1].growthCycle}}天</p>
      <div class="growpic">
        <img :src=getpic>
        <p>{{describe}}</p>
      </div>

      <div class="range">
        <mt-range :max="255" v-model="device.data.plantInfo[level-1].redLight" :bar-height="5" @change=redlight();
                  v-if="device.data.plantInfo[level-1].autoLightPower == false && device.data.viewModePower == false">
          <div slot="start" class="sun-small">
            <img src="../assets/sun-small.png">
          </div>
          <div slot="end" class="sun-big">
            <img src="../assets/sun-big.png">
          </div>
        </mt-range>
        <mt-range :max="255" v-model="device.data.plantInfo[level-1].redLight" :bar-height="5" @change=redlight();
                  v-else disabled>
          <div slot="start" class="sun-small">
            <img src="../assets/sun-small.png">
          </div>
          <div slot="end" class="sun-big">
            <img src="../assets/sun-big.png">
          </div>
        </mt-range>
        <mt-range :max="255" v-model="device.data.plantInfo[level-1].blueLight" :bar-height="5" @change=blueLight();
                  v-if="device.data.plantInfo[level-1].autoLightPower == false && device.data.viewModePower == false">
          <div slot="start" class="sun-small">
            <img src="../assets/sun-small.png">
          </div>
          <div slot="end" class="sun-big">
            <img src="../assets/sun-big.png">
          </div>
        </mt-range>
        <mt-range :max="255" v-model="device.data.plantInfo[level-1].blueLight" :bar-height="5" @change=blueLight();
                  v-else disabled>
          <div slot="start" class="sun-small">
            <img src="../assets/sun-small.png">
          </div>
          <div slot="end" class="sun-big">
            <img src="../assets/sun-big.png">
          </div>
        </mt-range>
        <mt-range :max="255" v-model="device.data.plantInfo[level-1].whiteLight" :bar-height="5" @change=whiteLight();
                  v-if="device.data.plantInfo[level-1].autoLightPower == false">
          <div slot="start" class="sun-small">
            <img src="../assets/sun-small.png">
          </div>
          <div slot="end" class="sun-big">
            <img src="../assets/sun-big.png">
          </div>
        </mt-range>
        <mt-range :max="255" v-model="device.data.plantInfo[level-1].whiteLight" :bar-height="5" @change=whiteLight();
                  v-else disabled>
          <div slot="start" class="sun-small">
            <img src="../assets/sun-small.png">
          </div>
          <div slot="end" class="sun-big">
            <img src="../assets/sun-big.png">
          </div>
        </mt-range>
      </div>

      <div class="autolight">
        <span>光照度自动调节:&nbsp;&nbsp;{{device.data.plantInfo[level - 1].autoLightPower ? '开' : '关'}}</span>
        <img :src="device.data.plantInfo[level-1].autoLightPower?onoff.autolighton:onoff.autolightoff"
             @click="toggleautolight()">
      </div>
      <!-- {{ $route.params.deviceId }} -->
    </div>
  </div>
</template>

<script>

  import {Range} from 'mint-ui';
  import {Toast} from 'mint-ui';

  export default{
    data (){
      return {

        device: {
          id: 0,
          online: false,
          data: {
            power: false,//表示设备开关机，可APP设置可设备上报，0x00：关机，0x01：开机
            viewModePower: false,//表示设备观赏模式开关，可APP设置可设备上报，0x00：观赏模式关，0x01：观赏模式开
            fanPower: false,//表示设备风扇开关，可APP设置可设备上报，0x00：风扇关，0x01：风扇开
            waterAlarn: false,//表示设备水位警报有无，只可设备上报，0x00：无警报，0x01：有警报
            temperature: 0,//表示设备环境温度的状态，0x00 ~0x8c：对应0到140；，温度公式为X – 40
            startTime: 0,//表示设备一层设置光照开始时间，可APP设置可设备上报，，采用高字节在前，低字节在后的原则。，如设置5小时=300分钟=0x012C，则字节10为0x01，字节11为0x2C。
            plantInfo: [
              {   //startTime为总分钟数
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
            plantType: 1//表示设备三层种植植物种类，可APP设置可设备上报，0x01：叶菜类，0x02：香料类，0x03：果菜类，0x04：花卉类，0x05：食用菌
          }
        },
        // temperature: 28,
        // fanshitf: '关',
        // fan: false,
        // view: false,
        // hours: "12小时",
        // time: "08:30",
        // day: 8,
        // growday: 30,
        describe: "",
        // rangeValue1: 25,
        // rangeValue2: 25,
        // rangeValue3: 25,
        // lightshitf: '关',
        // lightshitf: [
        //     {ls:'开'},
        //     {ls:'关'},
        //     {ls:'关'},
        // ],
        // autolight: false,
        onoff: {
          fanon: require("../assets/fan-on.png"),
          fanoff: require("../assets/fan-off.png"),
          warnon: require("../assets/warn-on.png"),
          warnoff: require("../assets/warn-off.png"),
          viewon: require("../assets/view-on.png"),
          viewoff: require("../assets/view-off.png"),
          autolighton: require("../assets/auto_on.png"),
          autolightoff: require("../assets/auto_off.png")
        },
        background: [
          {bg: require("../assets/bg1.jpg")},
          {bg: require("../assets/bg2.jpg")},
          {bg: require("../assets/bg3.jpg")},
          {bg: require("../assets/bg4.jpg")},
          {bg: require("../assets/bg5.jpg")}
        ],
        plant_icon: [
          {pi: require("../assets/plant_icon1.png")},
          {pi: require("../assets/plant_icon2.png")},
          {pi: require("../assets/plant_icon3.png")},
          {pi: require("../assets/plant_icon4.png")},
          {pi: require("../assets/plant_icon5.png")}
        ],
        level: 1,
        items: [
          {lev: '1层'},
          {lev: '2层'},
          {lev: '3层'}
        ],
        plant: [
          {type: '芥菜'},
          {type: '菜心'},
          {type: '芥香甜白菜'},
          {type: '意大利生菜'},
          {type: '九芽生菜'},
          {type: '黄叶白菜'},
          {type: '罗马生菜'},
          {type: '紫冠油菜'},
          {type: '芥兰'},
          {type: '红叶生菜'}
        ],
        timePickerShow: false,
        timePickerShow1: false,
        plantPickerShow: false,
      }
    },
    created () {
      this.changeMtRangeStyle();
      if (window.devices) {
        this.devicesReady(devices);
      } else {
        window.devicesReady = this.devicesReady;
      }


    },
    computed: {

      getpic: function () {

        if (this.device.data.plantInfo[this.level - 1].growthDay <= 7) {
          this.describe = "幼苗期";
          return require("../assets/seedling.png");
        } else if (this.device.data.plantInfo[this.level - 1].growthDay <= this.device.data.plantInfo[this.level - 1].growthCycle - 5) {
          this.describe = "生长期";
          return require("../assets/growing.png");
        } else {
          this.describe = "成熟期";
          return require("../assets/mature.png");
        }

      },

      plantType: function () {

        var plantId = this.device.data.plantInfo[this.level - 1].plantId - 1

        var plantType = this.plant[plantId].type

        if (this.$refs.plantPicker) {
          this.$refs.plantPicker.setValues([plantType])
        }

        return plantType
      },
      exposureTime: function () {
        var exposureTime = this.device.data.plantInfo[this.level - 1].exposureTime

        if (this.$refs.exposureTimePicker) {
          this.$refs.exposureTimePicker.setValues([exposureTime])
        }

        return exposureTime
      },

      timeSlots: function () {
        return [
          {
            flex: 1,
            values: this.createDataArray(0, 23, 1),
          }, {
            flex: 1,
            divider: true,
            content: '小时',
          }, {
            flex: 1,
            values: this.createDataArray(0, 59, 1),
          }, {
            flex: 1,
            divider: true,
            content: '分钟',
          },
        ];
      },

      timeShow: function () {
        var h = parseInt(this.device.data.startTime / 256)
        var m = parseInt(this.device.data.startTime % 256)

        if (this.$refs.startTimePicker) {
          this.$refs.startTimePicker.setValues([h,m])
        }

        if (h < 10) {
          h = "0" + h;
        }

        if (m < 10) {
          m = "0" + m;
        }
        return h + ":" + m;

      },
      timeSlots1: function () {
        return [
          {
            flex: 1,
            values: this.createDataArray(0, 24, 1),
          }, {
            flex: 1,
            divider: true,
            content: '小时',
          }
        ];
      },
      timeSlots2: function () {
        return [
          {
            flex: 1,
            values: ['芥菜', '菜心', '芥香甜白菜', '意大利生菜', '九芽生菜', '黄叶白菜', '罗马生菜', '紫冠油菜', '芥兰', '红叶生菜'],
          }
        ];
      }
    },

    methods: {
      //修改红绿蓝进度条的颜色和圆圈大小

      changeMtRangeStyle: function () {
        setTimeout(function () {
          var mtRangeThumb = document.getElementsByClassName('mt-range-thumb')

          var size = 30; //进度条圆圈折大小，不可以超过30
          for (var i = 0; i < mtRangeThumb.length; i++) {
            mtRangeThumb[i].style.width = size + "px";
            mtRangeThumb[i].style.height = size + "px";
            mtRangeThumb[i].style.top = (30 - size) / 2 + "px";
          }

          var mtRangeProgress = document.getElementsByClassName('mt-range-progress')
          mtRangeProgress[0].style.backgroundColor = "#f44";
          mtRangeProgress[1].style.backgroundColor = "#44f";
          mtRangeProgress[2].style.backgroundColor = "#fff";

          var m = 8;

          var sunBig = document.getElementsByClassName('sun-big')

          var b = 4;
          for (var i = 0; i < sunBig.length; i++) {
            sunBig[i].style.marginTop = b + "px";
            sunBig[i].style.marginLeft = m + "px";
          }

          var sunSmall = document.getElementsByClassName('sun-small')

          var s = 2;
          for (var i = 0; i < sunSmall.length; i++) {
            sunSmall[i].style.marginTop = s + "px";
            sunSmall[i].style.marginRight = m + "px";
          }
        }, 100)
      },
      devicesReady: function (devices) {
        var vm = this;
        console.log('Main deviceReady');
        var deviceId = this.$route.params.deviceId;
        devices.forEach(function (item) {
          if (item.id == deviceId) {
            vm.device = item;
            //          console.log(item);
          }
        })

        this.test()

      },

      setDataPoint(index, value){

        console.log("setDataPoint  index=" + index + ",value=" + value)

        var that = this;
        if (this.device.id == 0) {
          return;
        }
        var datapoints = [];
        datapoints.push({
          index: index,
          value: value
        })

        this.device.emit("senddata", {
          type: "datapoint",
          data: datapoints
        }, function (res) {
          if (res.status === 0) {
            console.log('send success')

            // if(index==1){
            //     that.device.data.viewModePower = !that.device.data.viewModePower;
            // }
            // if(index==2){
            //     that.device.data.fanPower = !that.device.data.fanPower;
            //     if (that.device.data.fanPower == true) {
            //         that.fanshitf = '开';
            //     } else {
            //         that.fanshitf = '关';
            //     }
            // }
            // if(index==6||index==15||index==24){
            //     that.device.data.plantInfo[that.level-1].exposureTime= value;
            // }

            // if(index==5||index==14||index==23){
            //     that.device.data.plantInfo[that.level-1].startTime= value;
            // }

            // if(index==10||index==19||index==28){
            //     that.device.data.plantInfo[that.level-1].autoLightPower = !that.device.data.plantInfo[that.level-1].autoLightPower;
            //     if (that.device.data.plantInfo[that.level-1].autoLightPower == true) {
            //         that.lightshitf[that.level-1].ls = '开';
            //     } else {
            //         that.lightshitf[that.level-1].ls = '关';
            //     }
            // }


          } else if (res.status === 10) { // 离线
            console.log(res.msg)
            console.log('设备不在线');
            Toast('设备不在线');
          } else {
            console.log(res)
            console.log('操作失败');
            Toast('操作失败');
          }
        })

      },

      togglefan: function () {
        if (this.device.data.fanPower == true) {
          this.setDataPoint(2, 0);
        } else {
          this.setDataPoint(2, 1);
        }

        // if (this.device.data.fanPower == true) {
        //     this.fanshitf = '开';
        // } else {
        //     this.fanshitf = '关';
        // }
      },
      toggleview: function () {
        if (this.device.data.viewModePower == true) {
          this.setDataPoint(1, 0);
        } else {
          this.setDataPoint(1, 1);
        }
      },
      toggleautolight: function () {
        var le = this.level - 1;

        if (le == 0) {
          if (this.device.data.plantInfo[le].autoLightPower == true) {
            this.setDataPoint(10, 0);
          } else {
            this.setDataPoint(10, 1);
          }
        }
        if (le == 1) {
          if (this.device.data.plantInfo[le].autoLightPower == true) {
            this.setDataPoint(18, 0);
          } else {
            this.setDataPoint(18, 1);
          }
        }
        if (le == 2) {
          if (this.device.data.plantInfo[le].autoLightPower == true) {
            this.setDataPoint(26, 0);
          } else {
            this.setDataPoint(26, 1);
          }
        }

        // if (this.device.data.plantInfo[le].autoLightPower == true) {
        //     this.lightshitf[le].ls = '开';
        // } else {
        //     this.lightshitf[le].ls = '关';
        // }

      },
      whichlevel: function (index) {
        this.level = index + 1;
      },
      createDataArray: function (from, to, divider) {
        var dataArray = [];
        for (var i = from; i <= to; i += divider) {
          dataArray.push(i);
        }
        return dataArray;
      },

      showPicker: function () {
        this.timePickerShow = true;
      },
      hidePicker: function () {
        this.timePickerShow = false;
      },
      timePickerOk: function () {
        this.hidePicker();
        if (this.timePicker) {
          var h = this.timePicker.getValues()[0];
          var m = this.timePicker.getValues()[1];
          if (h == undefined) {
            h = 0;
          }
          // this.device.data.startTime= h1;
          this.setDataPoint(5, h * 256 + m);
        }
      },

      showPicker1: function () {
        this.timePickerShow1 = true;
      },
      hidePicker1: function () {
        this.timePickerShow1 = false;
      },
      timePickerOk1: function () {
        this.hidePicker1();
        if (this.timePicker1) {
          var h1 = this.timePicker1.getValues()[0];
          if (h1 == null) {
            h1 = 0;
          }
          // this.device.data.plantInfo[this.level-1].exposureTime= h1;
          if (this.level - 1 == 0) {
            this.setDataPoint(6, h1);
          } else if (this.level - 1 == 1) {
            this.setDataPoint(14, h1);
          } else if (this.level - 1 == 2) {
            this.setDataPoint(22, h1);
          }

        }
      },

      showPicker2: function () {
        this.plantPickerShow = true;
      },
      hidePicker2: function () {
        this.plantPickerShow = false;
      },
      plantPickerOk: function () {
        this.hidePicker2();
        if (this.plantPicker) {
          var pt = this.plantPicker.getValues()[0];
          for (var i = 0; i < this.plant.length; i++) {
            if (this.plant[i].type == pt) {
              if (this.level - 1 == 0) {
                this.setDataPoint(7, ++i);
              } else if (this.level - 1 == 1) {
                this.setDataPoint(15, ++i);
              } else if (this.level - 1 == 2) {
                this.setDataPoint(23, ++i);
              }
              // this.device.data.plantInfo[this.level-1].plantId=++i;
            }
          }


        }
      },
      redlight: function () {
        var rl = this.device.data.plantInfo[this.level - 1].redLight
        if (this.level - 1 == 0) {
          this.setDataPoint(11, rl);
        } else if (this.level - 1 == 1) {
          this.setDataPoint(19, rl);
        } else if (this.level - 1 == 2) {
          this.setDataPoint(27, rl);
        }
      },
      blueLight: function () {
        var gl = this.device.data.plantInfo[this.level - 1].blueLight
        if (this.level - 1 == 0) {
          this.setDataPoint(12, gl);
        } else if (this.level - 1 == 1) {
          this.setDataPoint(20, gl);
        } else if (this.level - 1 == 2) {
          this.setDataPoint(28, gl);
        }
      },
      whiteLight: function () {
        var bl = this.device.data.plantInfo[this.level - 1].whiteLight
        if (this.level - 1 == 0) {
          this.setDataPoint(13, bl);
        } else if (this.level - 1 == 1) {
          this.setDataPoint(21, bl);
        } else if (this.level - 1 == 2) {
          this.setDataPoint(29, bl);
        }
      },

      test: function () {
        var vm = this
        setTimeout(function () {
          vm.device.data.plantInfo[0].plantId = 4
          vm.device.data.plantInfo[1].plantId = 6
          vm.device.data.plantInfo[0].exposureTime = 10
          vm.device.data.startTime = 3 * 256 + 30
        }, 2000);
      }
    }
  }
</script>

<style scoped>

  #header {
    width: 100%;
    height: 50px;
    background-color: #23ac39;
    overflow: hidden;
  }

  #header img {
    margin-left: 5%;
    margin-top: -10px;
    width: 200px;
    height: 70px;
  }

  #switch {
    width: 100%;
    height: 88px;
    background-color: #f6f7f7;
  }

  #switch .wrap {
    display: flex;
  }

  #switch .wrap-item {
    flex: 1;
    text-align: center;
    position: relative;
  }

  #switch .wrap-item i {
    display: inline-block;
    width: 68px;
    height: 54px;
    overflow: hidden;
    margin-top: 6px;
  }

  #switch .wrap-item i.first {
    /*border: 1px solid red;*/
    margin-left: 10px;
  }

  #switch .wrap-item img {
    width: 68px;
    height: 68px;
    margin-top: -10px;
    /*border: 1px solid red;*/

  }

  #switch .wrap-item:nth-of-type(2n) img {
    width: 54px;
    height: 54px;
    margin-top: -2px;
    /*border: 1px solid red;*/

  }

  #switch .wrap-item p {
    font-size: 12px;
    margin-top: -6px;
  }

  #switch .wrap-item span {
    color: #23ac39;
    position: absolute;
    top: 19px;
    margin-left: -16px;
    font-size: 16px;
    width: 30px;
    text-align: center;
  }

  .tab {
    display: flex;
    width: 100%;
    height: 40px;
    line-height: 37px;
  }

  .tab-item {
    flex: 1;
    background-color: #cfd3ce;
    text-align: center;
  }

  .tab-item a {
    font-size: 16px;
    color: #000;
    display: block;
  }

  .tab-item a.active {
    border-bottom: 4px solid #23ac39;
  }

  .bg {
    width: 100%;
    height: 100px;
    position: relative;
    color: #fff;
  }

  .bg .bg-img {
    width: 100%;
    height: 100px;
  }

  .bg .hours {
    position: absolute;
    top: 26px;
    left: 10%;
    font-size: 16px;
  }

  .bg .time {
    position: absolute;
    bottom: 20px;
    left: 10%;
    font-size: 14px;

  }

  .bg .sun {
    width: 40px;
    height: 40px;
    position: absolute;
    top: 20px;
    left: 25%;
  }

  .bg .species {
    position: absolute;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #fff;
    bottom: -25px;
    right: 10%;
    z-index: 10;
  }

  .bg .species img {
    width: 70px;
    height: 70px;
    position: absolute;
    top: -8px;
    left: -8px;
  }

  .bg .species p {
    white-space: nowrap;
    position: absolute;
    top: 56px;
    left: -15px;
    color: #000;
    font-size: 12px;
    /*border: 1px solid red;*/
    width: 80px;
    text-align: center;
  }

  .content {
    background: #eeeeee;
    position: relative;
    width: 100%;
    min-height: 450px;
    overflow-y: auto;
    max-height: 500px;
  }

  .content .day {
    position: absolute;
    top: 30px;
    left: 14%;
    font-weight: 600;
    font-size: 26px;
  }

  .content .growday {
    position: absolute;
    top: 100px;
    left: 14%;
    font-size: 16px;
    color: #7e7e7e;
  }

  .content .growpic {
    position: absolute;
    top: 40px;
    right: 18%;
    font-size: 12px;
  }

  .content .growpic img {
    width: 52px;
    height: 58px;
  }

  .content .growpic p {
    text-align: center;
  }

  .content .range {
    width: 80%;
    margin-top: 150px;
    margin-left: 10%;
  }

  .content .autolight {
    width: 80%;
    margin-left: 10%;
    display: flex;
  }

  .content .autolight span {
    font-size: 14px;
    flex: 1;
    margin-top: 10px;
  }

  .content .autolight img {
    width: 68px;
    height: 44px;
  }

  .mt-range-thumb {
    width: 20px;
    height: 20px;
  }

  .picker-bg {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.2);
    position: fixed;
    top: 0;
    z-index: 88;
  }

  .picker-container {
    width: 80%;
    margin: 80px 10%;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 5px;
    box-shadow: 0 0 5px #666;
  }

  .picker-title {
    text-align: center;
    padding: 15px;
    color: #111;
    border-bottom: 1px solid #ddd;
  }

  .picker-btn {
    padding: 15px;
    text-align: center;
    border-top: 1px solid #ddd;
    color: #9999ff;
  }

  .mt-range {
    margin-bottom: 5px;
  }

  .sun-small img {
    width: 16px;
    height: 16px;
    margin-top: 5px;
  }

  .sun-big img {
    width: 20px;
    height: 20px;
  }

</style>
