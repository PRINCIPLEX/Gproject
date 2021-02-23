<template>

  <div>
    <el-alert :title="alertTitle" type="warning" center show-icon :closable="false"></el-alert>
    <div class="imgDiv" align="center">
      <img :src="require('../assets/' + imgSrc + '.jpg')">

      <div align="center">
        <el-button style="width: 20%;font-size: large;" size="medium" ref='openBtn' type="success" @click="changeStatus"></el-button>
      </div>

    </div>
  </div>

</template>

<script>
  export default {
    data() {
      return {
        alertTitle:'',
        imgSrc: 'evening',
        openStatus:'',

      }
    },

    created() {
      this.getShopStatus();
    },

    methods: {

      async changeStatus() {
        if(this.openStatus==false)
        {
          const {
            data: res
          } = await this.$http.get('open_shop')
          if(res!=201)
          {
            return this.$message.error('开店失败，联系一下运维组哦！')
          }
          else
          {
            this.$message.success('开店啦，今天也要加油！');
          }

        }
        else
        {
          const {
            data: res
          } = await this.$http.get('close_shop')
          if(res!=200)
          {
            return this.$message.error('打烊失败，联系一下运维组哦！')
          }
          else
          {
            this.$message.success('打烊啦，今天好好休息吧！');
          }

        }
        this.getShopStatus();

      },

      async getShopStatus() {
        const {
          data: res
        } = await this.$http.get('get_shop_status')


        if (res.status !== 200) {
          return this.$message.error('获取商店状态失败！')
        }
        else
        {
          this.openStatus = res.shopOpenEntity.status;
          if(this.openStatus==false)
          {
             this.imgSrc = 'evening';
             this.$refs.openBtn.$el.innerText = "开店";
             this.alertTitle='本店打烊中。。。'
          }
          else
          {
            this.imgSrc = 'morning';
            this.$refs.openBtn.$el.innerText = "打烊";
            this.alertTitle='本店营业中。。。'
          }

        }

      },




    }

  }
</script>

<style>
  .imgDiv {
  }
</style>
