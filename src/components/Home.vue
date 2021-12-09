<template>
  <el-container>

    <!-- 头部 -->
    <el-header>
      <div>
        <span>现代终端选点与预警系统</span>
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
            <i class="el-icon-setting" color="#fff"></i>
            <span slot="title">首页</span>
          </el-menu-item>

          <el-submenu index="/3">
            <template slot="title">
              <i class="el-icon-view"></i>
              <span>选点模块</span>
            </template>

            <el-menu-item index="/UnBusiness">
              <template slot="title">
                <span>所有用户</span>
              </template>
            </el-menu-item>

            <el-menu-item index="/RecommendUser">
              <template slot="title">
                <span>推荐用户</span>
              </template>
            </el-menu-item>

            <el-menu-item index="/NormalUser">
              <template slot="title">
                <span>普通用户</span>
              </template>
            </el-menu-item>
          </el-submenu>

          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-user"></i>
              <span>数据质量监管模块</span>
            </template>

            <el-menu-item index="/warningUser">
              <template slot="title">
                <span>预警用户</span>
              </template>
            </el-menu-item>

            <el-menu-item index="/iNormalUser">
              <template slot="title">
                <span>普通用户</span>
              </template>
            </el-menu-item>
          </el-submenu>

          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-data-analysis"></i>
              <span>数据分析模块</span>
            </template>

            <el-menu-item index="/scoreEchart">
              <template slot="title">
                <span>分数图</span>
              </template>
            </el-menu-item>

            <el-menu-item index="/resultEchart">
              <template slot="title">
                <span>效果图</span>
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

      }
    },
    created() {},

    mounted() { // 渲染后执行
      // 初始化
    },

    methods: {
      logout() {
        window.sessionStorage.clear()
        this.$router.push('/login')
      },

    }
  }
</script>

<style lang="less" scoped>
  .el-container {
    height: 100%;
  }

  .el-header {
    //红色
    //background-color: #A70a0e;
    //绿色
    background-color: #1F8C52;
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
