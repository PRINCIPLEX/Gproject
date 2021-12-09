<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>监管模块</el-breadcrumb-item>
      <el-breadcrumb-item>特殊用户</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索 添加 -->
      <el-row :gutter="100">
        <el-col :span="11">
          <el-input placeholder="输入客户编号搜索" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>

      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userlist" border>
        <!-- stripe: 斑马条纹
              border：边框-->

        <el-table-column align="center" type="index" label="#"></el-table-column>
        <el-table-column align="center" sortable prop="account" label="客户编号"></el-table-column>
        <el-table-column align="center" sortable prop="shopName" label="商铺名称"></el-table-column>
        <el-table-column  align="center" sortable prop="wcount" label="总预警数">
          <template slot-scope="scope">
            <p style="color:red; font-size: larger;">{{scope.row.wcount}}</p>
          </template>


        </el-table-column>

        <el-table-column align="center" sortable prop="zcxb" label="周存销比(<8)">
          <template slot-scope="scope">
            <el-button v-if="scope.row.zwarning==1" type="text" style="color: orangered;"
              @click="showZcxbCard(scope.row.account,scope.row.zcxb)">{{scope.row.zcxb}}
            </el-button>

            <el-button v-else type="text" style="color: black;" @click="showZcxbCard(scope.row.account,scope.row.zcxb)">
              {{scope.row.zcxb}}
            </el-button>
          </template>
        </el-table-column>

        <el-table-column align="center" sortable prop="dayScan" label="日均扫码笔数 (大于参考值)">
          <template slot-scope="scope">
            <el-button v-if="scope.row.dwarning==1" type="text" style="color: orangered;"
              @click="showDayScanCard(scope.row.account,scope.row.dayScan)">{{scope.row.dayScan}}
            </el-button>

            <el-button v-else type="text" style="color: black;" @click="showDayScanCard(scope.row.account,scope.row.dayScan)">
              {{scope.row.dayScan}}
            </el-button>
          </template>
        </el-table-column>

        <el-table-column align="center" sortable prop="gjRate" :label="'购进消化率\n(  [0.7-1.5]  )'">
          <template slot-scope="scope">
            <el-button v-if="scope.row.gwarning==1" type="text" style="color: orangered;"
              @click="showGjRateCard(scope.row.account,scope.row.gjRate)">{{scope.row.gjRate}}
            </el-button>

            <el-button v-else type="text" style="color: black;" @click="showGjRateCard(scope.row.account,scope.row.gjRate)">
              {{scope.row.gjRate}}
            </el-button>
          </template>
        </el-table-column>


        <el-table-column align="center" sortable prop="timeConcRate" :label="'时段集中度\n(  <60%  )'">
          <template slot-scope="scope">
            <el-button v-if="scope.row.twarning==1" type="text" style="color: orangered;"
              @click="showTimeConcRateCard(scope.row.account,scope.row.timeConcRate)">{{scope.row.timeConcRate}}%
            </el-button>

            <el-button v-else type="text" style="color: black;" @click="showTimeConcRateCard(scope.row.account,scope.row.timeConcRate)">
              {{scope.row.timeConcRate}}%
            </el-button>
          </template>
        </el-table-column>

        <el-table-column align="center" sortable prop="dayScanTime" :label="'日均扫码时段\n(>=6)'">
          <template slot-scope="scope">
            <el-button v-if="scope.row.dsWarning==1" type="text" style="color: orangered;"
              @click="showDayScanTimeCard(scope.row.account,scope.row.dayScanTime)">{{scope.row.dayScanTime}}
            </el-button>

            <el-button v-else type="text" style="color: black;" @click="showDayScanTimeCard(scope.row.account,scope.row.dayScanTime)">
              {{scope.row.dayScanTime}}
            </el-button>
          </template>
        </el-table-column>

        <el-table-column align="center" sortable prop="onlineRate" :label="'销售天数占比\n(>0.9)'">
          <template slot-scope="scope">
            <el-button v-if="scope.row.owarning==1" type="text" style="color: orangered;"
              @click="showOnlineRateCard(scope.row.account,scope.row.onlineRate)">{{scope.row.onlineRate}}
            </el-button>

            <el-button v-else type="text" style="color: black;" @click="showOnlineRateCard(scope.row.account,scope.row.onlineRate)">
              {{scope.row.onlineRate}}
            </el-button>
          </template>
        </el-table-column>

        <el-table-column align="center" sortable prop="sellAvg" :label="'日单均销售额\n(<180)'">
          <template slot-scope="scope">
            <el-button v-if="scope.row.swarning==1" type="text" style="color: orangered;"
              @click="showSellAvgCard(scope.row.account,scope.row.sellAvg)">{{scope.row.sellAvg}}
            </el-button>

            <el-button v-else type="text" style="color: black;" @click="showSellAvgCard(scope.row.account,scope.row.sellAvg)">
              {{scope.row.sellAvg}}
            </el-button>
          </template>
        </el-table-column>


        <el-table-column width="110px" align="center" sortable prop="negDayRate" :label="'负库存天数占比\n(<0.1)'">
          <template slot-scope="scope">
            <el-button v-if="scope.row.nwarning==1" type="text" style="color: orangered;"
              @click="showNegDayRateCard(scope.row.account,scope.row.negDayRate)">{{scope.row.negDayRate}}
            </el-button>

            <el-button v-else type="text" style="color: black;" @click="showNegDayRateCard(scope.row.account,scope.row.negDayRate)">
              {{scope.row.negDayRate}}
            </el-button>
          </template>
        </el-table-column>

      </el-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNum" :page-sizes="[5, 10, 15]" :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>


      <!-- 周存销比卡 -->
      <el-dialog title="周存销比(小于8)" :visible.sync="zcxbCard" width="50%">
        <el-descriptions title="周存销比 = (库存合计*销售天数)/(扫描总条数 *7)" direction="vertical" :column="1" border>

          <el-descriptions-item label="周存销比">{{this.zcxb}}
          </el-descriptions-item>
          <el-descriptions-item label="库存合计">{{UserDetailForm.totalKc}}条
          </el-descriptions-item>
          <el-descriptions-item label="销售天数">{{UserDetailForm.sellFate}}天
          </el-descriptions-item>
          <el-descriptions-item label="扫描总条数">{{UserDetailForm.totalSm}}条
          </el-descriptions-item>
        </el-descriptions>
        <span style="text-align: center;display:block" slot="footer" class="dialog-footer">
          <el-button @click="zcxbCard = false">取 消</el-button>
        </span>
      </el-dialog>

      <!-- 日均扫码笔数-->
      <el-dialog title="日均扫码笔数" :visible.sync="dayScanCard" width="50%">
        <el-descriptions title="日均扫码笔数(大于参考值)" direction="vertical" :column="1" border>
          <el-descriptions-item label="档位">{{UserDetailForm.degree}}档
          </el-descriptions-item>
          <el-descriptions-item label="日均扫码笔数">{{UserDetailForm.dayScan}}笔
          </el-descriptions-item>
          <el-descriptions-item label="参考笔数">{{this.refer}}笔
          </el-descriptions-item>
        </el-descriptions>
        <span style="text-align: center;display:block" slot="footer" class="dialog-footer">
          <el-button @click="dayScanCard = false">取 消</el-button>
        </span>
      </el-dialog>

      <!-- 购进消化率-->
      <el-dialog title="购进消化率[0.7-1.5]" :visible.sync="gjRateCard" width="50%">
        <el-descriptions title="购进消化率 = 扫描总条数/购进条数" direction="vertical" :column="1" border>
          <el-descriptions-item label="购进消化率">{{this.gjRate}}
          </el-descriptions-item>
          <el-descriptions-item label="扫描总条数">{{UserDetailForm.smNum}}条
          </el-descriptions-item>
          <el-descriptions-item label="购进条数">{{UserDetailForm.gjNum}}条
          </el-descriptions-item>
        </el-descriptions>
        <span style="text-align: center;display:block" slot="footer" class="dialog-footer">
          <el-button @click="gjRateCard = false">取 消</el-button>
        </span>
      </el-dialog>


      <!-- 时段集中度-->
      <el-dialog title="时段集中度" :visible.sync="timeConcRateCard" width="50%">
        <el-descriptions title="时段集中度(<60%)" direction="vertical" :column="1" border>
          <el-descriptions-item label="时段集中度">{{this.timeConcRate}}%
          </el-descriptions-item>
        </el-descriptions>
        <span style="text-align: center;display:block" slot="footer" class="dialog-footer">
          <el-button @click="timeConcRateCard = false">取 消</el-button>
        </span>
      </el-dialog>


      <!-- 日均扫码时段-->
      <el-dialog title="日均扫码时段" :visible.sync="dayScanTimeCard" width="50%">
        <el-descriptions title="日均扫码时段(>=6)" direction="vertical" :column="1" border>
          <el-descriptions-item label="日均扫码时段">{{this.dayScanTime}}小时
          </el-descriptions-item>
        </el-descriptions>
        <span style="text-align: center;display:block" slot="footer" class="dialog-footer">
          <el-button @click="dayScanTimeCard = false">取 消</el-button>
        </span>
      </el-dialog>

      <!-- 销售天数占比-->
      <el-dialog title="销售天数占比" :visible.sync="onlineRateCard" width="50%">
        <el-descriptions title="销售天数占比(>0.9)" direction="vertical" :column="1" border>
          <el-descriptions-item label="销售天数占比">{{this.onlineRate}}
          </el-descriptions-item>

          <el-descriptions-item label="销售天数">{{UserDetailForm.onlineTime}}
          </el-descriptions-item>

          <el-descriptions-item label="销售天数占比">{{UserDetailForm.sonlineTime}}
          </el-descriptions-item>

        </el-descriptions>
        <span style="text-align: center;display:block" slot="footer" class="dialog-footer">
          <el-button @click="onlineRateCard = false">取 消</el-button>
        </span>
      </el-dialog>

      <!-- 日单均销售额-->
      <el-dialog title="日单均销售额(<180)" :visible.sync="sellAvgCard" width="50%">
        <el-descriptions title="日单均销售额 = 日均销售额/日均扫码笔数" direction="vertical" :column="1" border>
          <el-descriptions-item label="日单均销售额">{{this.sellAvg}}
          </el-descriptions-item>

          <el-descriptions-item label="日均销售额">{{UserDetailForm.sellMoney}}
          </el-descriptions-item>

          <el-descriptions-item label="日均扫码笔数">{{UserDetailForm.sellNum}}
          </el-descriptions-item>

        </el-descriptions>
        <span style="text-align: center;display:block" slot="footer" class="dialog-footer">
          <el-button @click="sellAvgCard = false">取 消</el-button>
        </span>
      </el-dialog>



      <!-- 负库存天数占比-->
      <el-dialog title="负库存天数占比(<180)" :visible.sync="negDayRateCard" width="50%">
        <el-descriptions title="负库存天数占比 = 负库存天数/销售天数" direction="vertical" :column="1" border>
          <el-descriptions-item label="负库存天数占比">{{this.negDayRate}}
          </el-descriptions-item>

          <el-descriptions-item label="负库存天数">{{UserDetailForm.negDayNum}}天
          </el-descriptions-item>

          <el-descriptions-item label="销售天数">{{UserDetailForm.sellDayNum}}天
          </el-descriptions-item>

        </el-descriptions>
        <span style="text-align: center;display:block" slot="footer" class="dialog-footer">
          <el-button @click="negDayRateCard = false">取 消</el-button>
        </span>
      </el-dialog>





    </el-card>
  </div>
</template>

<script>
  export default {

    data() {
      return {
        UserDetailForm: {},
        // 八张卡片
        zcxb:0,
        dayScan:0,
        gjRate:0,
        timeConcRate:0,
        dayScanTime:0,
        onlineRate:0,
        sellAvg:0,
        negDayRate:0,
        refer:0,

        zcxbCard: false,
        dayScanCard: false,
        gjRateCard: false,
        timeConcRateCard: false,
        dayScanTimeCard: false,
        onlineRateCard: false,
        sellAvgCard: false,
        negDayRateCard: false,


        queryInfo: {
          flag: 'WarningUser',
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

      showZcxbCard(account,zcxb) {
        this.getUserDetail(account,zcxb);
        this.zcxb = zcxb;
        this.zcxbCard = true;
      },

      showDayScanCard(account,dayScan) {
        this.dayScan = dayScan;
        this.getUserDetailAndRefer(account)
        this.dayScanCard = true;
      },

      showGjRateCard(account,gjRate) {
        this.gjRate = gjRate;
        this.getUserDetail(account)
        this.gjRateCard = true;
      },


      showDayScanTimeCard(account,dayScanTime) {
        this.dayScanTime = dayScanTime;
        this.getUserDetail(account);
        this.dayScanTimeCard = true;
      },

      showOnlineRateCard(account,onlineRate) {
        this.onlineRate = onlineRate;
        this.getUserDetail(account)
        this.onlineRateCard = true;
      },



      showSellAvgCard(account,sellAvg) {
        this.sellAvg = sellAvg;
        this.getUserDetail(account)
        this.sellAvgCard = true;
      },

      showNegDayRateCard(account,negDayRate) {
        this.negDayRate = negDayRate;
        this.getUserDetail(account)
        this.negDayRateCard = true;
      },






      showTimeConcRateCard(account,timeConcRate) {
        this.timeConcRate = timeConcRate;
        this.getUserDetail(account)
        this.timeConcRateCard = true;
      },
      //get User Detail

      async getRefer(degree) {
        const {
          data: res
        } = await this.$http.get('getRefer/' + degree)
        this.refer = res;
      },

      async getUserDetailAndRefer(account) {
        const {
          data: res
        } = await this.$http.get('getWarningDetail/' + account)

        this.UserDetailForm = res;
        this.getRefer(res.degree);
      },

      async getUserDetail(account) {
        const {
          data: res
        } = await this.$http.get('getWarningDetail/' + account)

        this.UserDetailForm = res;
      },


      //获取所有用户
      async getUserList() {
        const {
          data: res
        } = await this.$http.get('getWarningUser', {
          params: this.queryInfo
        })

        if (res.status !== 200) {
          return this.$message.error('获取用户列表失败！')
        }
        this.userlist = res.warningResultEntities;
        this.total = res.total;
      },

      // 监听 pagesize改变的事件
      handleSizeChange(newSize) {
        this.queryInfo.pageSize = newSize;
        this.getUserList();
      },
      // 监听 页码值 改变事件
      handleCurrentChange(newSize) {
        this.queryInfo.pageNum = newSize
        this.getUserList();
      },

      //method{
    },
  }
</script>

<style lang="less" scoped>
  /deep/ .el-table .cell {
    white-space: pre-line; // 度娘的答案全都不好用关键在
  }
</style>
