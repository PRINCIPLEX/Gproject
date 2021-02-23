<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>商家</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索 添加 -->
      <el-row :gutter="100">
        <el-col :span="12">
          <el-input placeholder="输入用户账号搜索" v-model="queryInfo.query" clearable @clear="getUserList">
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
        <el-table-column align="center" sortable prop="account" label="账号"></el-table-column>
        <el-table-column align="center" sortable prop="password" label="密码"></el-table-column>

        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="showEditDialog(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="removeUserById(scope.row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pageNum"
        :page-sizes="[5, 10, 15]" :page-size="queryInfo.pageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
      <!-- 添加用户的对话框 -->
      <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
        <!-- 内容主体 -->
        <el-form :model="addUserForm" ref="addUserFormRef" :rules="addUserFormRules" label-width="100px">
          <el-form-item label="用户名" prop="account">
            <el-input v-model="addUserForm.account"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addUserForm.password"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改用户的对话框 -->
      <el-dialog title="修改用户信息" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
        <!-- 内容主体 -->
        <el-form :model="editUserForm" ref="editUserFormRef" :rules="editUserFormRules" label-width="70px">
          <el-form-item label="账号" prop="account">
            <el-input v-model="editUserForm.account"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="editUserForm.password"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUser">确 定</el-button>
        </span>
      </el-dialog>
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
        // 修改用户
        editDialogVisible: false,
        editUserForm: {},
        // 编辑用户表单验证
        editUserFormRules: {
          account: [{
            required: true,
            message: '请输入账号',
            trigger: 'blur'
          }, ],
          password: [{
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }, ]
        },
        // 添加用户对话框
        addDialogVisible: false,
        // 用户添加
        addUserForm: {
          account: '',
          password: '',
        },
        // 用户添加表单验证规则
        addUserFormRules: {
          account: [{
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }],
          password: [{
            required: true,
            message: '请输入用户密码',
            trigger: 'blur'
          }],
        },
      }
    },

    created() {
      this.getUserList()
    },

    methods: {
      async getUserList() {
        const {
          data: res
        } = await this.$http.get('business', {
          params: this.queryInfo
        })

        if (res.status !== 200) {
          return this.$message.error('获取用户列表失败！')
        }
        this.userlist = res.adminUserEntity;
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
      // 编辑用户信息
      async showEditDialog(id) {
        const {
          data: res
        } = await this.$http.get('editBusiness/' + id)
        if (res.status !== 200) {
          return this.$message.error('查询用户信息失败！')
        }
        this.editUserForm = res.adminUserEntity
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
          } = await this.$http.get(
            'editBusiness/' + this.editUserForm.id + '/' +
            this.editUserForm.account + '/' +
            this.editUserForm.password
          )
          if (res == 501) {
            return this.$message.error('该用户账号已存在！')
          }

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
      async removeUserById(id) {
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
        } = await this.$http.delete('editBusiness/' + id)
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
          } = await this.$http.post('addBusiness', this.addUserForm)

          if (res == 501) {
            return this.$message.error('账号已存在！')
          }
          if (res !== 201) {
            return this.$message.error('添加用户失败！')
          }
          this.$message.success('添加用户成功！')
          // 隐藏添加用户对话框
          this.addDialogVisible = false
          this.getUserList()
        })
      },

    },
  }
</script>

<style lang="less" scoped>
</style>
