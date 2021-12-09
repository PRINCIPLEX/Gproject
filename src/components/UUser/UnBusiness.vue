<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>选点模块</el-breadcrumb-item>
      <el-breadcrumb-item>所有用户</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索 添加 -->
      <el-row :gutter="100">
        <el-col :span="11">
          <el-input placeholder="输入订烟账号搜索" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>

        <!-- 分段查找用户 -->
        <el-col :span="5">
          <el-select clearable v-model="queryInfo.lowScore" placeholder="请选择" @change="getUserByScore"
            @clear="getUserList">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-col>


        <!-- 导入EXCEL按钮 -->
        <!--  <el-col :span="4">
          <el-upload ref="upload" action="" :file-list="fileList" :multiple="false" :limit="1" :auto-upload="false"
            :on-change="handleChange" :on-error="handleError" :on-success="handleSuccess">
            <el-button slot="trigger" type="success">导入EXCEL</el-button>
          </el-upload>
        </el-col> -->


        <el-col :span="4">
          <el-button type="success" @click="uploadExcel">导入EXCEL</el-button>
        </el-col>

        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userlist" border>
        <!-- stripe: 斑马条纹
              border：边框-->

        <el-table-column align="center" type="index" label="#"></el-table-column>
        <el-table-column align="center" sortable prop="account" label="订烟账号"></el-table-column>
        <el-table-column align="center" sortable prop="shopName" label="商铺名称"></el-table-column>
        <el-table-column align="center" sortable prop="totalScore" label="总得分">

          <template scope="scope">
            <p v-if="scope.row.isIllegal=='1'" style="color: red;">否决</p>
            <p v-if="scope.row.totalScore<60" style="color: red;">{{scope.row.totalScore}}</p>
            <p v-else style="color: black;">{{scope.row.totalScore}}</p>
          </template>
        </el-table-column>


        <el-table-column align="center" sortable prop="abilityScore" label="能力得分(40分)">
          <template slot-scope="scope">
            <el-button v-if="scope.row.abilityScore<24" type="text" style="color: orangered;"
              @click="showAbilityCard(scope.row.account)">{{scope.row.abilityScore}}
            </el-button>

            <el-button v-else type="text" style="color: black;" @click="showAbilityCard(scope.row.account)">
              {{scope.row.abilityScore}}
            </el-button>

          </template>
        </el-table-column>


        <el-table-column align="center" sortable prop="breedScore" label="培育得分(30分)">

          <template slot-scope="scope">

            <el-button @click="showBreedCard(scope.row.account)" v-if="scope.row.breedScore<18" type="text"
              style="color: orangered;">{{scope.row.breedScore}}
            </el-button>

            <el-button @click="showBreedCard(scope.row.account)" v-else type="text" style="color: black;">
              {{scope.row.breedScore}}
            </el-button>
          </template>

        </el-table-column>

        <el-table-column align="center" sortable prop="envScore" label="环境得分(30分)">
          <template slot-scope="scope">
            <el-button @click="showEnvCard(scope.row.account)" v-if="scope.row.envScore<18" type="text"
              style="color: orangered;">{{scope.row.envScore}}
            </el-button>

            <el-button @click="showEnvCard(scope.row.account)" v-else type="text" style="color: black;">
              {{scope.row.envScore}}
            </el-button>
          </template>
        </el-table-column>


        <el-table-column align="center" sortable prop="creditScore" label="信用得分">
          <template slot-scope="scope">

            <el-button @click="showCreditCard(scope.row.account)" v-if="scope.row.creditScore<0" type="text"
              style="color: orangered;">{{scope.row.creditScore}}
            </el-button>

            <el-button @click="showCreditCard(scope.row.account)" v-else type="text" style="color: black;">
              {{scope.row.creditScore}}
            </el-button>
          </template>

        </el-table-column>

        <el-table-column align="center" label="安装易零通">
          <template slot-scope="scope">
            <el-button v-if="scope.row.isSetup==0" type="success" @click="setUserSetUp(scope.row.id)">
            安装
            </el-button>
            <el-button v-else type="danger" @click="setUserUnSetUp(scope.row.id)">取消安装
            </el-button>
          </template>
        </el-table-column>


        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="showEditDialog(scope.row.account)">
            </el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="removeUserById(scope.row.account)">
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNum" :page-sizes="[5, 10, 15]" :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>


      <!-- 信用得分对话框 -->
      <el-dialog title="信用得分" :visible.sync="creditCard" width="50%">

        <el-descriptions title="满分30" direction="vertical" :column="1" border>
          <template>
            <el-descriptions-item v-if="UserDetailForm.isCredit==0" label="信用等级 (合格A级 一般失信B级:-5分; 较重失信C级:一票否决)">B级:-5分
            </el-descriptions-item>

            <el-descriptions-item v-else-if="UserDetailForm.isCredit==-1" label="信用等级 (合格A级 一般失信B级:-5分; 较重失信C级:一票否决)">
              C级:一票否决
            </el-descriptions-item>

            <el-descriptions-item v-else label="信用等级 (合格A级 一般失信B级:-5分; 较重失信C级:一票否决)">A级
            </el-descriptions-item>
          </template>


          <el-descriptions-item label="半年内非烟外流条数 (1条扣1分)">{{UserDetailForm.halfOut}}条
          </el-descriptions-item>


          <el-descriptions-item label="半年内销售非烟条数 (1条扣1分)">{{UserDetailForm.halfFake}}条
          </el-descriptions-item>

          <template>
            <el-descriptions-item v-if="UserDetailForm.isIllegal==1" label="因涉烟违法行为,被相关机关行政处罚的/一年内销售假/私烟(一票否决)">一票否决
            </el-descriptions-item>

            <el-descriptions-item v-else label="因涉烟违法行为,被相关机关行政处罚的/一年内销售假/私烟(一票否决)">无该类行为
            </el-descriptions-item>
          </template>

        </el-descriptions>
        <span style="text-align: center;display:block" slot="footer" class="dialog-footer">
          <el-button @click="creditCard = false">取 消</el-button>
        </span>
      </el-dialog>


      <!-- 环境得分对话框 -->
      <el-dialog title="环境得分" :visible.sync="envCard" width="50%">

        <el-descriptions title="满分30" direction="vertical" :column="1" border>
          <template>
            <el-descriptions-item v-if="UserDetailForm.location==5"
              label="经营位置(商业中心:5分; 工业区:4分; 城市居民区:3分; 乡镇生活区:2分; 娱乐旅游区:1分)">{{UserDetailForm.location}} 分
            </el-descriptions-item>
            <el-descriptions-item v-else-if="UserDetailForm.location==4"
              label="店面形象(商业中心:5分; 工业区:4分; 城市居民区:3分; 乡镇生活区:2分; 娱乐旅游区:1分)">{{UserDetailForm.location}} 分
            </el-descriptions-item>
            <el-descriptions-item v-else-if="UserDetailForm.location==3"
              label="经营位置(商业中心:5分; 工业区:4分; 城市居民区:3分; 乡镇生活区:2分; 娱乐旅游区:1分)">{{UserDetailForm.location}} 分
            </el-descriptions-item>
            <el-descriptions-item v-else-if="UserDetailForm.location==2"
              label="经营位置(商业中心:5分; 工业区:4分; 城市居民区:3分; 乡镇生活区:2分; 娱乐旅游区:1分)">{{UserDetailForm.location}} 分
            </el-descriptions-item>
            <el-descriptions-item v-else label="经营位置(商业中心:5分; 工业区:4分; 城市居民区:3分; 乡镇生活区:2分; 娱乐旅游区:1分)">
              {{UserDetailForm.location}} 分
            </el-descriptions-item>
          </template>

          <template>
            <el-descriptions-item v-if="UserDetailForm.isImage==1" label="店面形象 (5分)">5 分
            </el-descriptions-item>
            <el-descriptions-item v-else label="店面形象 (5分)">0 分
            </el-descriptions-item>
          </template>

          <el-descriptions-item label="店面面积 (30平米以上: 5分;其它: 3分)">{{UserDetailForm.square}} 平方米</el-descriptions-item>

          <template>
            <el-descriptions-item v-if="UserDetailForm.isCpu==1" label="收银处有符合要求的移动设备(5分)">5 分
            </el-descriptions-item>
            <el-descriptions-item v-else label="收银处有符合要求的移动设备(5分)">0 分
            </el-descriptions-item>
          </template>


          <template>
            <el-descriptions-item v-if="UserDetailForm.isNet==1" label="网络支持(5分)">5 分
            </el-descriptions-item>
            <el-descriptions-item v-else label="网络支持(5分)">0 分
            </el-descriptions-item>
          </template>

          <el-descriptions-item label="店内评吸/体验环境区域大小 (5平方米及以上:5分)">{{UserDetailForm.exArea}} 平方米</el-descriptions-item>

        </el-descriptions>
        <span style="text-align: center;display:block" slot="footer" class="dialog-footer">
          <el-button @click="envCard = false">取 消</el-button>
        </span>
      </el-dialog>


      <!-- 培育得分对话框 -->
      <el-dialog title="培育得分" :visible.sync="breedCard" width="50%">

        <el-descriptions title="满分30" direction="vertical" :column="1" border>
          <el-descriptions-item label="卷烟陈列柜长 2米及以上(5分)">{{UserDetailForm.lengthCab}} 米</el-descriptions-item>

          <template>
            <el-descriptions-item v-if="UserDetailForm.isDisplay==1"
              label="具有新品陈列/重点品牌陈列/主题陈列,陈列品规数量不少于10个;摆放整齐有序(5分)">5 分
            </el-descriptions-item>
            <el-descriptions-item v-else label="具有新品陈列/重点品牌陈列/主题陈列,陈列品规数量不少于10个;摆放整齐有序(5分)">0 分
            </el-descriptions-item>
          </template>


          <template>
            <el-descriptions-item v-if="UserDetailForm.isPrice==1" label="明码实价(5分)">5 分
            </el-descriptions-item>
            <el-descriptions-item v-else label="明码实价(5分)">0 分
            </el-descriptions-item>
          </template>

          <el-descriptions-item label="一二类卷烟订购量结构占比 (60%以上:10分; 50%-60%:8分; 其它:5分)">占比： {{UserDetailForm.brandStr}}
          </el-descriptions-item>

          <template>
            <el-descriptions-item v-if="UserDetailForm.isAdv==1" label="具有充足的终端资源(5分)">5 分 </el-descriptions-item>
            <el-descriptions-item v-else label="具有充足的终端资源(5分)">0 分
            </el-descriptions-item>
          </template>

        </el-descriptions>
        <span style="text-align: center;display:block" slot="footer" class="dialog-footer">
          <el-button @click="breedCard = false">取 消</el-button>
        </span>
      </el-dialog>



      <!-- 能力得分对话框 -->
      <el-dialog title="能力得分" :visible.sync="abilityCard" width="50%">

        <el-descriptions title="满分40" direction="vertical" :column="1" border>
          <el-descriptions-item label="年龄 (小于50岁:5分;  等于及大于50岁:3分)">{{UserDetailForm.age}}</el-descriptions-item>

          <template>
            <el-descriptions-item v-if="UserDetailForm.education==3" label="学历 (本科及以上:5分;  专科:3分;其它:1分)">本科
            </el-descriptions-item>
            <el-descriptions-item v-if="UserDetailForm.education==2" label="学历 (本科及以上:5分;  专科:3分;其它:1分)">专科
            </el-descriptions-item>
            <el-descriptions-item v-if="UserDetailForm.education==1" label="学历 (本科及以上:5分;  专科:3分;其它:1分)">专科以下
            </el-descriptions-item>
          </template>
          <el-descriptions-item label="档位 (11档以上:10分;  8-10档:3分;  5-7档:6分;  其它:4分)">{{UserDetailForm.degree}} 档
          </el-descriptions-item>
          <el-descriptions-item label="业态类型得分 (烟酒商店:5分;  食杂店:4分;  超市:3分;  其它:1分)">{{UserDetailForm.sort}} 分
          </el-descriptions-item>
          <el-descriptions-item label="经营时间 (12小时及以上:5分;  8-12小时:3分;  低于8小时:1分)">{{UserDetailForm.openTime}} 小时
          </el-descriptions-item>
          <template>
            <el-descriptions-item v-if="UserDetailForm.isSkill==1" label="基本操作移动设备能力 (3分)">具备</el-descriptions-item>
            <el-descriptions-item v-else label="基本操作移动设备能力 (3分)">不具备</el-descriptions-item>
          </template>

          <el-descriptions-item label="卷烟经营年长 (3年以上:2分;  其它:1分)">{{UserDetailForm.duration}} 年</el-descriptions-item>
          <template>
            <el-descriptions-item v-if="UserDetailForm.isCoordinate==1"
              label="具有营销意识,自愿使用扫码销售/网上订货/电子支付功能,配合程度高,具备较强配合能力(5分)">具备</el-descriptions-item>
            <el-descriptions-item v-else label="具有营销意识,自愿使用扫码销售/网上订货/电子支付功能,配合程度高,具备较强配合能力(5分)">不具备
            </el-descriptions-item>
          </template>
        </el-descriptions>
        <span style="text-align: center;display:block" slot="footer" class="dialog-footer">
          <el-button type="primary" @click="abilityCard = false">关闭</el-button>
        </span>
      </el-dialog>


      <!-- 添加用户的对话框 -->
      <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="70%" @close="addDialogClosed">
        <!-- 内容主体 -->
        <el-form :model="addUserForm" ref="addUserFormRef" :rules="addUserFormRules" label-width="245px">
          <el-form-item label="订烟账号" prop="account">
            <el-input v-model="addUserForm.account"></el-input>
          </el-form-item>

          <el-form-item label="商铺名称" prop="shopName">
            <el-input v-model="addUserForm.shopName"></el-input>
          </el-form-item>
          <el-form-item label="经营者年龄" prop="age">
            <el-input v-model="addUserForm.age"></el-input>
          </el-form-item>

          <el-form-item label="经营者学历">
            <template>
              <el-select v-model="addUserForm.education" placeholder="请选择">
                <el-option v-for="item in eduOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-form-item>


          <el-form-item label="档位级别" prop="degree">
            <el-input v-model="addUserForm.degree"></el-input>
          </el-form-item>

          <el-form-item label="业态类型">
            <template>
              <el-select v-model="addUserForm.sort" placeholder="请选择">
                <el-option v-for="item in sortOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-form-item>

          <el-form-item label="一天内经营时间" prop="openTime">
            <el-input v-model="addUserForm.openTime"></el-input>
          </el-form-item>

          <el-form-item label="基本移动设备操作能力">
            <template>
              <el-radio-group v-model="addUserForm.isSkill">
                <el-radio :label="0">不具备</el-radio>
                <el-radio :label="1">具备</el-radio>
              </el-radio-group>
            </template>
          </el-form-item>

          <el-form-item label="卷烟经营年长" prop="duration">
            <el-input v-model="addUserForm.duration"></el-input>
          </el-form-item>

          <el-form-item label="配合能力">
            <template>
              <el-radio-group v-model="addUserForm.isCoordinate">
                <el-radio :label="0">不具备</el-radio>
                <el-radio :label="1">具备</el-radio>
              </el-radio-group>
            </template>
          </el-form-item>

          <el-form-item label="陈列卷烟专柜长度(米)" prop="lengthCab">
            <el-input v-model="addUserForm.lengthCab"></el-input>
          </el-form-item>

          <el-form-item label="新品陈列">
            <template>
              <el-radio-group v-model="addUserForm.isDisplay">
                <el-radio :label="0">不符合标准</el-radio>
                <el-radio :label="1">符合标准</el-radio>
              </el-radio-group>
            </template>
          </el-form-item>

          <el-form-item label="明码实价">
            <template>
              <el-radio-group v-model="addUserForm.isPrice">
                <el-radio :label="0">不符合标准</el-radio>
                <el-radio :label="1">符合标准</el-radio>
              </el-radio-group>
            </template>
          </el-form-item>

          <el-form-item label="月均一二类卷烟订购占比(输入小数)" prop="brandStr">
            <el-input v-model="addUserForm.brandStr"></el-input>
          </el-form-item>


          <el-form-item label="终端资源">
            <template>
              <el-radio-group v-model="addUserForm.isAdv">
                <el-radio :label="0">不符合要求</el-radio>
                <el-radio :label="1">符合要求</el-radio>
              </el-radio-group>
            </template>
          </el-form-item>

          <el-form-item label="经营位置">
            <template>
              <el-select v-model="addUserForm.location" placeholder="请选择">
                <el-option v-for="item in locationOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-form-item>


          <el-form-item label="店面形象">
            <template>
              <el-radio-group v-model="addUserForm.isImage">
                <el-radio :label="0">不符合要求</el-radio>
                <el-radio :label="1">符合要求</el-radio>
              </el-radio-group>
            </template>
          </el-form-item>

          <el-form-item label="店面面积(平方米)" prop="square">
            <el-input v-model="addUserForm.square"></el-input>
          </el-form-item>

          <el-form-item label="具有符合要求的移动设备">
            <template>
              <el-radio-group v-model="addUserForm.isCpu">
                <el-radio :label="0">无</el-radio>
                <el-radio :label="1">有</el-radio>
              </el-radio-group>
            </template>
          </el-form-item>

          <el-form-item label="具有稳定完善的网络支持">
            <template>
              <el-radio-group v-model="addUserForm.isNet">
                <el-radio :label="0">无</el-radio>
                <el-radio :label="1">有</el-radio>
              </el-radio-group>
            </template>
          </el-form-item>

          <el-form-item label="评吸/体验区域面积" prop="exArea">
            <el-input v-model="addUserForm.exArea"></el-input>
          </el-form-item>

          <el-form-item label="信用等级">
            <template>
              <el-select v-model="addUserForm.isCredit" placeholder="请选择">
                <el-option v-for="item in creditOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-form-item>

          <el-form-item label="半年内非烟外流条数" prop="halfOut">
            <el-input v-model="addUserForm.halfOut"></el-input>
          </el-form-item>

          <el-form-item label="半年内非烟销售条数" prop="halfFake">
            <el-input v-model="addUserForm.halfFake"></el-input>
          </el-form-item>

          <el-form-item label="涉烟违法行为或一年内有假/私烟销售">
            <template>
              <el-radio-group v-model="addUserForm.isIllegal">
                <el-radio :label="0">无</el-radio>
                <el-radio :label="1">有</el-radio>
              </el-radio-group>
            </template>
          </el-form-item>
        </el-form>
        <span style="text-align: center;display:block" slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>


      <!-- 修改用户的对话框 -->
      <el-dialog title="修改用户信息" :visible.sync="editDialogVisible" width="70%" @close="editDialogClosed">
        <!-- 内容主体 -->
        <el-form :model="editUserForm" ref="editUserFormRef" :rules="addUserFormRules" label-width="245px">
          <el-form-item label="订烟账号" prop="account">
            <el-input v-model="editUserForm.account"></el-input>
          </el-form-item>

          <el-form-item label="商铺名称" prop="shopName">
            <el-input v-model="editUserForm.shopName"></el-input>
          </el-form-item>
          <el-form-item label="经营者年龄" prop="age">
            <el-input v-model="editUserForm.age"></el-input>
          </el-form-item>

          <el-form-item label="经营者学历">
            <template>
              <el-select v-model="editUserForm.education" placeholder="请选择">
                <el-option v-for="item in eduOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-form-item>


          <el-form-item label="档位级别" prop="degree">
            <el-input v-model="editUserForm.degree"></el-input>
          </el-form-item>

          <el-form-item label="业态类型">
            <template>
              <el-select v-model="editUserForm.sort" placeholder="请选择">
                <el-option v-for="item in sortOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-form-item>

          <el-form-item label="一天内经营时间" prop="openTime">
            <el-input v-model="editUserForm.openTime"></el-input>
          </el-form-item>

          <el-form-item label="基本移动设备操作能力">
            <template>
              <el-radio-group v-model="editUserForm.isSkill">
                <el-radio :label="0">不具备</el-radio>
                <el-radio :label="1">具备</el-radio>
              </el-radio-group>
            </template>
          </el-form-item>

          <el-form-item label="卷烟经营年长" prop="duration">
            <el-input v-model="editUserForm.duration"></el-input>
          </el-form-item>

          <el-form-item label="配合能力">
            <template>
              <el-radio-group v-model="editUserForm.isCoordinate">
                <el-radio :label="0">不具备</el-radio>
                <el-radio :label="1">具备</el-radio>
              </el-radio-group>
            </template>
          </el-form-item>

          <el-form-item label="陈列卷烟专柜长度(米)" prop="lengthCab">
            <el-input v-model="editUserForm.lengthCab"></el-input>
          </el-form-item>

          <el-form-item label="新品陈列">
            <template>
              <el-radio-group v-model="editUserForm.isDisplay">
                <el-radio :label="0">不符合标准</el-radio>
                <el-radio :label="1">符合标准</el-radio>
              </el-radio-group>
            </template>
          </el-form-item>

          <el-form-item label="明码实价">
            <template>
              <el-radio-group v-model="editUserForm.isPrice">
                <el-radio :label="0">不符合标准</el-radio>
                <el-radio :label="1">符合标准</el-radio>
              </el-radio-group>
            </template>
          </el-form-item>

          <el-form-item label="月均一二类卷烟订购占比(输入小数)" prop="brandStr">
            <el-input v-model="editUserForm.brandStr"></el-input>
          </el-form-item>


          <el-form-item label="终端资源">
            <template>
              <el-radio-group v-model="editUserForm.isAdv">
                <el-radio :label="0">不符合要求</el-radio>
                <el-radio :label="1">符合要求</el-radio>
              </el-radio-group>
            </template>
          </el-form-item>

          <el-form-item label="经营位置">
            <template>
              <el-select v-model="editUserForm.location" placeholder="请选择">
                <el-option v-for="item in locationOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-form-item>


          <el-form-item label="店面形象">
            <template>
              <el-radio-group v-model="editUserForm.isImage">
                <el-radio :label="0">不符合要求</el-radio>
                <el-radio :label="1">符合要求</el-radio>
              </el-radio-group>
            </template>
          </el-form-item>

          <el-form-item label="店面面积(平方米)" prop="square">
            <el-input v-model="editUserForm.square"></el-input>
          </el-form-item>

          <el-form-item label="具有符合要求的移动设备">
            <template>
              <el-radio-group v-model="editUserForm.isCpu">
                <el-radio :label="0">无</el-radio>
                <el-radio :label="1">有</el-radio>
              </el-radio-group>
            </template>
          </el-form-item>

          <el-form-item label="具有稳定完善的网络支持">
            <template>
              <el-radio-group v-model="editUserForm.isNet">
                <el-radio :label="0">无</el-radio>
                <el-radio :label="1">有</el-radio>
              </el-radio-group>
            </template>
          </el-form-item>

          <el-form-item label="评吸/体验区域面积" prop="exArea">
            <el-input v-model="editUserForm.exArea"></el-input>
          </el-form-item>

          <el-form-item label="信用等级">
            <template>
              <el-select v-model="editUserForm.isCredit" placeholder="请选择">
                <el-option v-for="item in creditOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-form-item>

          <el-form-item label="半年内非烟外流条数" prop="halfOut">
            <el-input v-model="editUserForm.halfOut"></el-input>
          </el-form-item>

          <el-form-item label="半年内非烟销售条数" prop="halfFake">
            <el-input v-model="editUserForm.halfFake"></el-input>
          </el-form-item>

          <el-form-item label="涉烟违法行为或一年内有假/私烟销售">
            <template>
              <el-radio-group v-model="editUserForm.isIllegal">
                <el-radio :label="0">无</el-radio>
                <el-radio :label="1">有</el-radio>
              </el-radio-group>
            </template>
          </el-form-item>
        </el-form>
        <span style="text-align: center;display:block" slot="footer" class="dialog-footer">

          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUser">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
  import xlsx from 'xlsx'
  export const readFile = (file) => {
    return new Promise(resolve => {
      let reader = new FileReader()
      reader.readAsBinaryString(file)
      reader.onload = ev => {
        resolve(ev.target.result)
      }
    })
  }

  export default {

    data() {
      return {

        eduOptions: [{
          value: 3,
          label: '本科及以上'
        }, {
          value: 2,
          label: '专科'
        }, {
          value: 1,
          label: '专科以下'
        }, ],


        creditOptions: [{
          value: 1,
          label: 'A级'
        }, {
          value: 0,
          label: 'B级'
        }, {
          value: -1,
          label: 'C级'
        }, ],

        locationOptions: [{
            value: 5,
            label: '商业中心'
          }, {
            value: 4,
            label: '工业区'
          }, {
            value: 3,
            label: '城市居民区'
          }, {
            value: 2,
            label: '乡镇生活区'
          },
          {
            value: 1,
            label: '娱乐旅游区'
          },
        ],

        sortOptions: [{
          value: 5,
          label: '烟酒商店'
        }, {
          value: 4,
          label: '食杂店/便利店'
        }, {
          value: 3,
          label: '超市'
        }, {
          value: 1,
          label: '娱乐服务类及其它'
        }, ],

        //下拉框
        options: [{
          value: -1,
          label: '不及格'
        }, {
          value: 60,
          label: '60-70分'
        }, {
          value: 70,
          label: '70-80分'
        }, {
          value: 80,
          label: '80-90分'
        }, {
          value: 90,
          label: '90-100分'
        }],



        UserDetailForm: {},
        //is_getUserByScore
        isGetUserByScore: false,
        // 修改用户
        abilityCard: false,
        breedCard: false,
        envCard: false,
        creditCard: false,

        // 添加用户对话框
        addDialogVisible: false,
        // 用户添加
        addUserForm: {
          account: '',
          shopName: '',
          age: '',
          education: 1,
          degree: '',
          sort: 5,
          openTime: '',
          isSkill: 0,
          duration: '',
          isCoordinate: 0,
          lengthCab: '',
          isDisplay: 0,
          isPrice: 0,
          brandStr: '',
          isAdv: 0,
          location: 1,
          isImage: 0,
          square: '',
          isCpu: 0,
          isNet: 0,
          exArea: '',
          isCredit: 1,
          halfFake: '',
          halfOut: '',
          isIllegal: 0,
        },
        // 用户添加表单验证规则
        addUserFormRules: {
          account: [{
            required: true,
            message: '请输入订烟账号',
            trigger: 'blur'
          }],
          shopName: [{
            required: true,
            message: '请输入店铺名',
            //失去焦点触发
            trigger: 'blur'
          }],
          age: [{
            required: true,
            message: '请输入年龄',
            //失去焦点触发
            trigger: 'blur'
          }],

          degree: [{
            required: true,
            message: '请输入档位',
            //失去焦点触发
            trigger: 'blur'
          }],

          openTime: [{
            required: true,
            message: '请输入一天内经营时间',
            //失去焦点触发
            trigger: 'blur'
          }],

          duration: [{
            required: true,
            message: '请输入经营年长',
            //失去焦点触发
            trigger: 'blur'
          }],
          lengthCab: [{
            required: true,
            message: '请输入烟柜长',
            //失去焦点触发
            trigger: 'blur'
          }],
          brandStr: [{
            required: true,
            message: '请输入品牌结构',
            //失去焦点触发
            trigger: 'blur'
          }],
          square: [{
            required: true,
            message: '请输入店铺大小',
            //失去焦点触发
            trigger: 'blur'
          }],
          exArea: [{
            required: true,
            message: '请输入体验区大小',
            //失去焦点触发
            trigger: 'blur'
          }],
          halfFake: [{
            required: true,
            message: '请输入数值',
            //失去焦点触发
            trigger: 'blur'
          }],
          halfOut: [{
            required: true,
            message: '请输入数值',
            //失去焦点触发
            trigger: 'blur'
          }],
        },





        //excelData
        excelData: [],

        //上传列表
        fileList: [],
        queryInfo: {
          lowScore: '',
          flag: 'UnBusiness',
          query: '',
          // 当前页数
          pageNum: 1,
          // 每页显示多少数据
          pageSize: 5
        },
        userlist: [],
        total: 0,
        // 修改用户
        editDialogVisible: false,
        editUserForm: {},
        // 编辑用户表单验证
        editUserFormRules: {
          xkzNum: [{
            required: true,
            message: '请输入许可证号',
            trigger: 'blur'
          }],
          shopName: [{
            required: true,
            message: '请输入店铺名',
            //失去焦点触发
            trigger: 'blur'
          }],
          address: [{
            required: true,
            message: '请输入地址',
            //失去焦点触发
            trigger: 'blur'
          }],
          manager: [{
            required: true,
            message: '请输入负责人',
            //失去焦点触发
            trigger: 'blur'
          }],
          phone: [{
            required: true,
            message: '请输入手机号',
            //失去焦点触发
            trigger: 'blur'
          }],

          beginTime: [{
            required: true,
            message: '请输入许可证开始期限',
            //失去焦点触发
            trigger: 'blur'
          }],

          endTime: [{
            required: true,
            message: '请输入许可证截止期限',
            //失去焦点触发
            trigger: 'blur'
          }],

          longitude: [{
            required: true,
            message: '请输入坐标经度',
            //失去焦点触发
            trigger: 'blur'
          }],
          latitude: [{
            required: true,
            message: '请输入坐标纬度',
            //失去焦点触发
            trigger: 'blur'
          }],
        },

      }
    },

    created() {

      this.getUserList()
    },

    methods: {
      //Excel导入提醒
      async uploadExcel() {
        return this.$message.error('您无该权限，请联系管理员');
      },

      // //上传Excel方法
      // async handleChange(file, filelist) {
      //   var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
      //   const extension = testmsg === 'xls'
      //   const extension2 = testmsg === 'xlsx'

      //   if (extension || extension2) {
      //     let dataBinary = await readFile(file.raw)
      //     let workBook = xlsx.read(dataBinary, {
      //       type: 'binary',
      //       cellDates: true
      //     })
      //     let workSheet = workBook.Sheets[workBook.SheetNames[0]];
      //     this.excelData = xlsx.utils.sheet_to_json(workSheet);
      //     this.upLoadExcel();
      //   } else {
      //     this.$refs.upload.clearFiles();
      //     return this.$message.error('上传 xls 或 xlsx格式的表格');
      //   }
      // },

      // //excel数据更新
      // async upLoadExcel() {
      //   const {
      //     data: res
      //   } = await this.$http.post('uploadExcel', this.excelData)
      //   if (res !== 200) {
      //     return this.$message.error('导入用户信息失败！')
      //   }
      //   this.$message.success('更新用户信息成功！')
      //   this.$refs.upload.clearFiles();
      //   this.getUserList()
      // },

      handleError(file) {
        return this.$message.error('导入表格失败!');
      },

      handleSuccess(file) {
        this.$refs.upload.clearFiles();
        return this.$message.success('导入表格成功');
      },



      // 编辑用户信息
      async showEditDialog(account) {
        const {
          data: res
        } = await this.$http.get('getUserDetail/' + account)
        this.editUserForm = res;
        console.log(res);
        this.editDialogVisible = true
      },
      // 监听修改用户对话框的关闭事件
      editDialogClosed() {
        this.$refs.editUserFormRef.resetFields()
      },
      // 修改用户信息
      editUser() {
        // 提交请求前，表单预验证
        this.$refs.editUserFormRef.validate(async valid => {
          // console.log(valid)
          // 表单预校验失败
          if (!valid) return
          const {
            data: res
          } = await this.$http.post('editUserDetail', this.editUserForm)
          if (res !== 200) {
            return this.$message.error('更新用户信息失败！')
          }
          // 隐藏添加用户对话框
          this.editDialogVisible = false
          this.$message.success('更新用户信息成功！')
          this.getUserList()
        })
      },
      // 删除用户
      async removeUserById(account) {
        var pagenum = this.queryInfo.pageNum;
        var pagesize = this.queryInfo.pageSize;
        var total = this.total;
        if (((pagenum - 1) * pagesize == this.total - 1) && this.total != 1) {
          this.queryInfo.pageNum = pagenum - 1;
        }
        const confirmResult = await this.$confirm(
          '此操作将永久删除该用户, 是否继续?',
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
        } = await this.$http.delete('deleteBusiness/' + account)
        if (res !== 200) return this.$message.error('删除用户失败！')
        this.$message.success('删除用户成功！')
        this.getUserList()
      },

      // 监听 添加用户对话框的关闭事件
      addDialogClosed() {
        this.$refs.addUserFormRef.resetFields()
      },
      // 添加用户
      addUser() {
        // 提交请求前，表单预验证
        this.$refs.addUserFormRef.validate(async valid => {
          // console.log(valid)
          // 表单预校验失败
          if (!valid) return
          const {
            data: res
          } = await this.$http.post('addUserDetail', this.addUserForm)

          if (res == 500) {
            return this.$message.error('该用户已存在！')
          } else {
            this.$message.success('添加用户成功！')
            // 隐藏添加用户对话框
            this.addDialogVisible = false
            this.getUserList()
          }

        })
      },


      //分数段查找
      //获取所有用户
      async getUserByScore() {
        this.isGetUserByScore = true;
        if (this.queryInfo.lowScore != 0) {
          const {
            data: res
          } = await this.$http.get('getUserByScore', {
            params: this.queryInfo
          })

          if (res.status !== 200) {
            return this.$message.error('获取用户列表失败！')
          }
          this.userlist = res.simpleScoreEntities;
          this.total = res.total;
        }
      },


      //展示信用得分详情
      showCreditCard(account) {
        this.getUserDetail(account)
        this.creditCard = true;
      },

      //展示环境得分详情
      showEnvCard(account) {
        this.getUserDetail(account)
        this.envCard = true;
      },

      //展示培育得分详情
      showBreedCard(account) {
        this.getUserDetail(account)
        this.breedCard = true;
      },

      //展示能力得分详情
      showAbilityCard(account) {
        this.getUserDetail(account)
        this.abilityCard = true;
      },
      //get User Detail

      async getUserDetail(account) {
        const {
          data: res
        } = await this.$http.get('getUserDetail/' + account)

        this.UserDetailForm = res; //console.log(res.zmkhEntity);
      },

      async setUserSetUp(id) {
        const {
          data: res
        } = await this.$http.get('setUserSetUp/' +id)

        if (res!== 200) {
          return this.$message.error('安装操作失败！')
        }
        this.getUserList();
        return this.$message.success('操作成功！')

      },

      async setUserUnSetUp(id) {
        const {
          data: res
        } = await this.$http.get('setUserUnSetUp/' +id)

        if (res!== 200) {
          return this.$message.error('取消安装操作失败！')
        }
        this.getUserList();
        return this.$message.success('操作成功！')
      },


      //获取所有用户
      async getUserList() {
        this.isGetUserByScore = false;
        const {
          data: res
        } = await this.$http.get('getUser', {
          params: this.queryInfo
        })

        if (res.status !== 200) {
          return this.$message.error('获取用户列表失败！')
        }
        this.userlist = res.simpleScoreEntities;
        this.total = res.total;
      },

      // 监听 pagesize改变的事件
      handleSizeChange(newSize) {
        this.queryInfo.pageSize = newSize;
        if (this.isGetUserByScore == false) {
          this.getUserList();
        } else {
          this.getUserByScore();
        }

      },
      // 监听 页码值 改变事件
      handleCurrentChange(newSize) {
        this.queryInfo.pageNum = newSize
        if (this.isGetUserByScore == false) {
          this.getUserList();
        } else {
          this.getUserByScore();
        }
      },

      //method{
    },
  }
</script>

<style>

</style>
