<template>

  <div>
    <div class="imgDivCenter" align="center" >
       <p style="color:lightgreen;font-size:72px;">欢迎登录</p>
       <p style="color:lightgreen;font-size:72px;">现代终端选点与预警系统</p>

    </div>
  </div>

</template>

<script>
  export default {
    data() {
      return {
        alertTitle: '',
        imgSrc: 'logo',
        openStatus: '',

      }
    },

    created() {},

    methods: {




    },

  }
</script>

<style>
  .imgDivCenter{
    transform: translateX(50%);
    transform: translateY(50%);
  }
</style>
