<template>
  <div>
    <router-view></router-view>
    <div id="footer">
      <div class="wrap">
        <div :class="index==1?'active':''" @click="vegetablesclass()" class="wrap-item">
          <img src="./assets/vegetables.png"/>
          <p>蔬享课堂</p>
        </div>
        <div :class="index==2?'active':''" @click="plantingbox()" class="wrap-item">
          <img src="./assets/planting.png"/>
          <p>
            种植箱 </p>
        </div>
        <div :class="index==3?'active':''" @click="shop()" class="wrap-item">
          <a href="http://www.baidu.com">
            <img src="./assets/cart.png"/>
            <p>蔬享商城</p>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data (){
      return {
        index: 3
      }
    },
    created: function () {
      // this.deviceId=this.$route.params.deviceId;
      if ((this.$route.path).indexOf('vegetablesclass') != -1) {
        this.index = 1;
      }
      if ((this.$route.path).indexOf('plantingbox') != -1) {
        this.index = 2;
      }

    },

    methods: {

      vegetablesclass: function () {
        var deviceId = this.$route.params.deviceId;
        window.router.replace("/control/vegetablesclass/" + deviceId)
        if ((this.$route.path).indexOf('vegetablesclass') != -1) {
          this.index = 1;
        }
      },
      plantingbox: function () {
        var deviceId = this.$route.params.deviceId;
        window.router.replace("/control/plantingbox/" + deviceId)

        if ((this.$route.path).indexOf('plantingbox') != -1) {
          this.index = 2;
        }
      },
      shop: function () {
        this.index = 3;
        console.log(this.$route.path);
      }
    }



    // methods:{
    //   devicesReady:function(devices){

    //     console.log('index device ready');
    //     console.log(devices[0]);
    //     //this.deviceList=devices;
    //     var self=this;
    //     devices.forEach(function(device){
    //       self.deviceList.push(device)
    //     })
    //     console.log(devices[0])
    //   },
    //   deviceDetail:function(device){

    //     console.log('deviceDetail');
    //     if(device){
    //       window.router.push("/control/plantingbox/"+device.id)
    //     }else{
    //       window.router.push("/control/plantingbox/0")
    //     }

    //   }
    // }
  }
</script>
<style scoped="">
  #footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 50px;
    background-color: #23ac39;
    z-index: 100;
  }

  #footer .wrap {
    display: flex;
    height: 50px;
  }

  #footer .wrap-item {
    flex: 1;
    text-align: center;
    cursor: pointer;
  }

  #footer .wrap-item a {
    display: block;
  }

  #footer .wrap-item img {
    display: inline-block;
    width: 32px;
    height: 32px;
  }

  #footer .wrap-item p {
    font-size: 12px;
    color: #fff;
    margin-top: -6px;
  }

  /*#footer .wrap-item:hover {
    border-top: 4px solid #23ac39;
    margin-top: -4px;
  }*/

  #footer .active {
    border-top: 4px solid #23ac39;
    margin-top: -4px;
  }
</style>
