<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>顾客</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索 添加 -->
      <el-row :gutter="100">
        <el-col :span="12">
          <el-input placeholder="输入用户手机搜索" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userlist" border stripe>
        <!-- stripe: 斑马条纹
              border：边框-->
        <el-table-column align="center" type="index" label="#"></el-table-column>



        <el-table-column align="center" sortable prop="username" label="用户名" width="150"></el-table-column>
        <el-table-column align="center" sortable prop="phone" label="手机"></el-table-column>



      </el-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pageNum"
        :page-sizes="[5, 10, 15]" :page-size="queryInfo.pageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>


    </el-card>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        queryInfo: {
          query: '',
          // 当前页数
          pageNum: 1,
          // 每页显示多少数据
          pageSize: 5
        },
        userlist: [],
        total: 0,
      }
    },

    created() {
      this.getUserList()
    },

    methods: {
      async getUserList() {
        const {
          data: res
        } = await this.$http.get('customer', {
          params: this.queryInfo
        })

        if (res.status !== 200) {
          return this.$message.error('获取顾客列表失败！')
        }
        this.userlist = res.customerEntity;
        this.total = res.total;
      },
      // 监听 pagesize改变的事件
      handleSizeChange(newSize) {
        this.queryInfo.pageSize = newSize
        this.getUserList()
      },
      // 监听 页码值 改变事件
      handleCurrentChange(newSize) {
        this.queryInfo.pageNum = newSize
        this.getUserList()
      },


    },
  }
</script>

<style lang="less" scoped>
</style>
