<template>
  <el-container>
    <div>
      <audio ref="audio" src="../../public/newOrder.mp3"></audio>
    </div>

    <!-- 头部 -->
    <el-header>
      <div>
        <span>石油大学咖啡馆管理系统</span>
      </div>
      <el-button type="success" @click="logout">退出</el-button>
    </el-header>
    <!-- 主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="'200px'">
        <el-menu :default-active="$route.path" router background-color="#d1d1d0" text-color=" #000000"
          active-text-color="#ff0000">


          <el-menu-item index="/Welcome">
            <i class="el-icon-bell" color="#fff"></i>
            <span slot="title">首页</span>
          </el-menu-item>

          <el-menu-item index="/order">
            <i class="el-icon-bell" color="#fff"></i>
            <span slot="title">未处理订单</span>
          </el-menu-item>

          <el-menu-item index="/dealorder">
            <i class="el-icon-document"></i>
            <span slot="title">已处理订单</span>
          </el-menu-item>

          <el-submenu index="/3">
            <template slot="title">
              <i class="el-icon-user"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item index="/business">
              <template slot="title">
                <span>商家</span>
              </template>
            </el-menu-item>
            <el-menu-item index="/customer">
              <template slot="title">
                <span>顾客</span>
              </template>
            </el-menu-item>
          </el-submenu>

          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-goods"></i>
              <span>商品管理</span>
            </template>
            <el-menu-item index="/category">
              <template slot="title">
                <span>分类管理</span>
              </template>
            </el-menu-item>
            <el-menu-item index="/goods">
              <template slot="title">
                <span>商品信息</span>
              </template>
            </el-menu-item>
            <el-menu-item index="/addgoods">
              <template slot="title">
                <span>上传商品</span>
              </template>
            </el-menu-item>
          </el-submenu>

        </el-menu>
      </el-aside>
      <!-- 内容主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>



</template>

<script>
	import globalData from '../../public/Global.vue';
  export default {
    data() {
      return {
        webSocketPath: globalData.webSocketSrc+'business',
        socket: '',
      }
    },
    created() {},

    mounted() { // 渲染后执行
      // 初始化
      this.initWebsocket();
    },

    methods: {

      playVoice() {
        this.$refs.audio.play();
      },
      // 语音播报的函数

      logout() {
        this.socket.close();
        // 清空token
        window.sessionStorage.clear()
        this.$router.push('/login')
      },

      ////////////////////////WebSocket
      initWebsocket: function() {
        if (typeof(WebSocket) === "undefined") {
          alert("您的浏览器不支持socket")
        } else {
          // 实例化socket
          this.socket = new WebSocket(this.webSocketPath)
          // 监听socket连接
          this.socket.onopen = this.open
          // 监听socket错误信息
          this.socket.onerror = this.error

          // 监听socket消息
          this.socket.onmessage = this.getMessage
        }
      },
      open: function() {
        console.log("socket连接成功")
      },
      error: function() {
        console.log("连接错误")
      },
      getMessage: function(msg) {
        if (msg.data === 'audio') {
          this.playVoice();
          this.$notify({
            title: '新的订单',
            message: '您有一条新的订单',
            duration: 0
          });
        }
      },
      send: function() {
        this.socket.send(params)
      },
      close: function() {
        console.log("socket已经关闭")
      },

    }
  }
</script>

<style lang="less" scoped>
  .el-container {
    height: 100%;
  }

  .el-header {
    background-color: #A70a0e;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;

    >div {
      display: flex;
      align-items: center;

      img {
        height: 40px;
      }

      span {
        margin-left: 15px;
      }
    }
  }

  .el-aside {
    background-color: #bab9b8;

    .el-menu {
      border: none;
    }
  }
</style>
