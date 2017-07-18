<template>
  <div id="containter">
    <div class="list1">
      <a href="http://www.xinshipu.com/zuofa/623722">
        <img src="../assets/menu3.jpg" alt="">
        <img src="../assets/test.jpg" alt="">
        <span>芦笋沙拉</span>
        <img id="button" src="../assets/button.jpg" alt="">
      </a>
    </div>
    <div class="list2">
      <a href="http://www.xinshipu.com/zuofa/661646">
        <img src="../assets/menu4.jpg" alt="">
        <img src="../assets/test.jpg" alt="">
        <span>果实之美</span>
        <img id="button" src="../assets/button.jpg" alt="">
      </a>
    </div>
  </div>
</template>

<script>
  export default{}
</script>

<style scoped>
  #containter {
    width: 100%;
    background-color: #f6f7f7;
    padding-top: 5%;
    padding-bottom: 10%;

  }

  .list1, .list2 {
    width: 84%;
    height: 30%;
    background-color: #fff;
    margin-left: 5%;
    margin-bottom: 5%;
    border-radius: 10px;
    box-shadow: 0 0 10px #ddddde;
    position: relative;
    padding: 3%;

  }

  #containter img {
    display: inline-block;
    height: auto;
    width: 100%;
    /*border-radius: 10px;*/
  }

  #containter span {
    position: absolute;
    bottom: 41%;
    left: 6%;
    color: #fff;
    /*font-size: 14px;*/
    font-size: 1.4rem; /*1.4 × 10px = 14px */
    letter-spacing: 2px;
  }

  #containter #button {
    display: inline-block;
    /*height: 40px;*/
    /*width: 44px;*/
    height: 13%;
    width: 11%;
    position: absolute;
    /*border-radius: 10px;*/
    bottom: -7%;
    right: 10%;
  }

</style>
