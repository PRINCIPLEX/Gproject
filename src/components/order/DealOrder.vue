<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>未处理订单</el-breadcrumb-item>
    </el-breadcrumb>


    <!-- 卡片视图 -->
    <el-card>

      <!-- 搜索 添加 -->
      <el-row :gutter="100">
        <el-col :span="8">
          <el-input placeholder="输入订单编号搜索" v-model="orderId" clearable @clear="getOrderList">
            <el-button slot="append" icon="el-icon-search" @click="getOrderWithId"></el-button>
          </el-input>
        </el-col>

        <el-col :span="8">
          <el-input placeholder="输入手机号码搜索" v-model="phone" clearable @clear="getOrderList">
            <el-button slot="append" icon="el-icon-search" @click="getOrderWithPhone"></el-button>
          </el-input>
        </el-col>
      </el-row>




      <!-- 用户列表区域 -->
      <el-table :data="orderlist" border stripe>
        <!-- stripe: 斑马条纹
              border：边框-->
        <el-table-column align="center" type="index" label="#"></el-table-column>
        <el-table-column align="center" sortable prop="orderid" label="订单编号"></el-table-column>
        <el-table-column align="center" sortable prop="totalprice" label="总价"></el-table-column>
        <el-table-column align="center" sortable prop="cphone" label="手机"></el-table-column>
        <el-table-column width="90px" align="center" sortable prop="time" label="时间"></el-table-column>
        <el-table-column align="center" sortable prop="payway" label="支付方式"></el-table-column>
        <el-table-column align="center" prop="eatway" label="打包"></el-table-column>
        <el-table-column align="center" prop="remark" label="备注"></el-table-column>
        <el-table-column align="center" label="详情">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="showEditDialog(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pageNum"
        :page-sizes="[5, 10, 15]" :page-size="queryInfo.pageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>

      <!-- 修改用户的对话框 -->
      <el-dialog center title="订单详情" :visible.sync="editDialogVisible" width="70%" @close="editDialogClosed">
        <!-- 内容主体 -->
        <el-form :model="showOrderForm" ref="editCategoryFormRef" label-width="80px">

          <el-table :data="goodlist" border>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column sortable prop="gname" label="所订商品" align="center"></el-table-column>
            <el-table-column sortable prop="price" label="价格" align="center"></el-table-column>
            <el-table-column sortable prop="count" label="数量" align="center"></el-table-column>
          </el-table>

          <el-card shadow="always">
            <el-form-item label="是否打包: ">
              <span>
                {{showOrderForm.eatway}}
              </span>
            </el-form-item>
            <el-divider></el-divider>

            <el-form-item label="备注: ">
              <span>
                {{showOrderForm.remark}}
              </span>
            </el-form-item>
            <el-divider></el-divider>

            <el-form-item label="总价: ">
              <span>
                {{showOrderForm.totalprice}}
              </span>
            </el-form-item>

            <el-divider></el-divider>

            <el-form-item label="顾客名: ">
              <span>
                {{showOrderForm.cname}}
              </span>
            </el-form-item>
            <el-divider></el-divider>

            <el-form-item label="手机: ">
              <span>
                {{showOrderForm.cphone}}
              </span>
            </el-form-item>
            <el-divider></el-divider>

            <el-form-item label="订单编号: ">
              <span>
                {{showOrderForm.orderid}}
              </span>
            </el-form-item>
            <el-divider></el-divider>

            <el-form-item label="下单时间: ">
              <span>
                {{showOrderForm.time}}
              </span>
            </el-form-item>

            <el-divider></el-divider>

            <el-form-item label="支付方式: ">
              <span>
                {{showOrderForm.payway}}
              </span>
            </el-form-item>
          </el-card>
        </el-form>
        <div style="text-align:center">
          <el-button type="primary" @click="editDialogVisible = false">确认</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        phone:'',
        orderId:'',
        queryInfo: {
          flag:'',
          query: '',
          // 当前页数
          queryPhone:'',
          pageNum: 1,
          // 每页显示多少数据
          pageSize: 5
        },
        orderlist: [],
        total: 0,
        // 修改用户
        editDialogVisible: false,
        showOrderForm: [],
        goodlist: []
        // 编辑用户表单验证
      }
    },

    created() {
      this.getOrderList()
    },

    methods: {

      async getOrderWithPhone() {
        this.queryInfo.flag ='phone';
        this.queryInfo.query = this.phone;
        const {
          data: res
        } = await this.$http.get('dealorder', {
          params: this.queryInfo
        })

        if (res.status !== 200) {
          return this.$message.error('获取订单列表失败！')
        }
        this.orderlist = res.orderEntity;
        this.total = res.total;
        this.flag='';
      },




      async getOrderWithId() {
        this.queryInfo.flag ='id';
        this.queryInfo.query = this.orderId;
        const {
          data: res
        } = await this.$http.get('dealorder', {
          params: this.queryInfo
        })

        if (res.status !== 200) {
          return this.$message.error('获取订单列表失败！')
        }
        this.orderlist = res.orderEntity;
        this.total = res.total;
        this.flag='';
      },

      async getOrderList() {
        this.queryInfo.query = '';
        const {
          data: res
        } = await this.$http.get('dealorder', {
          params: this.queryInfo
        })

        if (res.status !== 200) {
          return this.$message.error('获取订单列表失败！')
        }
        this.orderlist = res.orderEntity;
        this.total = res.total;

      },
      // 监听 pagesize改变的事件
      handleSizeChange(newSize) {
        this.queryInfo.pageSize = newSize
        this.getOrderList()
      },
      // 监听 页码值 改变事件
      handleCurrentChange(newSize) {
        this.queryInfo.pageNum = newSize
        this.getOrderList()
      },
      // 编辑用户信息
      async showEditDialog(good) {
        this.showOrderForm = good;
        const {
          data: res
        } = await this.$http.get('getOrderGood/' + good.orderid)
        this.goodlist = res
        this.editDialogVisible = true
      },
      // 监听修改用户对话框的关闭事件
      editDialogClosed() {
        this.$refs.editCategoryFormRef.resetFields()
      },
    },
  }
</script>

<style lang="less" scoped>



</style>
