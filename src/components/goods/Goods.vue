<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品信息</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <!-- 卡片视图 -->
    <el-card>

      <!-- 搜索 添加 -->

      <el-row :gutter="50">
        <el-col :span="5">
          <el-input placeholder="输入商品名" v-model="queryInfo.query" clearable @clear="getGoodsList">
          </el-input>
        </el-col>

        <el-col :span="15">
          <el-select v-model="queryInfo.categoryValue" clearable @clear="getGoodsList" placeholder="请选择">
            <el-option v-for="item in this.categorylist" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-col>

        <el-col :span="4" :pull="9">
          <el-button type="primary" @click="getGoodsList">搜索</el-button>
        </el-col>
      </el-row>


      <!-- 商品列表区域 -->
      <el-table :data="goodslist" border stripe>
        <!-- stripe: 斑马条纹
              border：边框-->
        <el-table-column align="center" type="index" label="#"></el-table-column>
        <el-table-column label="商品图片" width="120" align="center">
          <template slot-scope="scope">
            <img style="height: 80px;width: 90px" :src="'data:image/jpg;base64,'+scope.row.img" :fit="fit">
          </template>
        </el-table-column>
        <el-table-column align="center" sortable prop="gname" label="商品名称"></el-table-column>
        <el-table-column sortable prop="price" label="商品价格" align="center"></el-table-column>
        <el-table-column sortable prop="sales" label="商品销量" align="center"></el-table-column>
        <el-table-column sortable prop="name" label="商品类别" align="center"></el-table-column>
        <el-table-column label="是否上架" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.issale" active-text="是"
  inactive-text="否" @change="goodStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" sortable label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="editGoods(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="removeById(scope.row.id)"></el-button>
          </template>
        </el-table-column>

      </el-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pageNum"
        :page-sizes="[3, 5, 10,100]" :page-size="queryInfo.pageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>



  </div>
</template>

<script>
  export default {
    data() {
      return {
        fit: 'contain',
        queryInfo: {
          categoryValue: '',
          query: '',
          // 当前页数
          pageNum: 1,
          // 每页显示多少数据
          pageSize: 5
        },
        categorylist: [],
        goodslist: [],
        total: 0,
      }

    },
    created() {

      this.getGoodsList(),
        this.getCategoryList()
    },
    methods: {

      async goodStateChanged(good) {
        const {
          data: res
        } = await this.$http.post('editgood',good);

        if (res!== 201) {
          return this.$message.error('商品上架状态失败！')
        }
        else
        {
          return this.$message.error('商品上架状态修改成功！')
        }
      },

      async removeById(id) {
        var pagenum = this.queryInfo.pageNum;
        var pagesize = this.queryInfo.pageSize;
        var total = this.total;
        if (((pagenum - 1) * pagesize == this.total - 1)&&this.total!=1) {
          this.queryInfo.pageNum = pagenum - 1;
        }
        const confirmResult = await this.$confirm(
          '此操作将永久删除该商品且相关订单内商品将重置, 是否继续?',
          '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).catch(err => err)
        // 点击确定 返回值为：confirm
        // 点击取消 返回值为： cancel
        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消删除')
        }
        const {
          data: res
        } = await this.$http.delete('delete/' + id)
        if (res !== 200) return this.$message.error('删除信息失败！')
        this.$message.success('删除信息成功！')
        this.getGoodsList();
      },


      editGoods(id) {
        this.$router.push({
          path:'/editgoods',
          query:{
            goodId:id,
          }
        })
      },



      async getGoodsList() {
        const {
          data: res
        } = await this.$http.get('goods', {
          params: this.queryInfo
        })

        if (res.status !== 200) {
          return this.$message.error('获取商品失败！')
        }
        this.goodslist = res.goodsEntity;
        this.total = res.total;
      },

      async getCategoryList() {
        const {
          data: res
        } = await this.$http.get('getcategory', {

        })
        this.categorylist = res;
      },



      // 监听 pagesize改变的事件
      handleSizeChange(newSize) {
        this.queryInfo.pageSize = newSize
        this.getGoodsList()
      },
      // 监听 页码值 改变事件
      handleCurrentChange(newSize) {
        this.queryInfo.pageNum = newSize
        this.getGoodsList()
      },

    }
  }
</script>

<style>
</style>
