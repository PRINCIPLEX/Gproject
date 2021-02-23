<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索 添加 -->
      <el-row :gutter="100">
        <el-col :span="12">
          <el-input placeholder="输入类名搜索" v-model="queryInfo.query" clearable @clear="getCategoryList">
            <el-button slot="append" icon="el-icon-search" @click="getCategoryList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="categorylist" border stripe>
        <!-- stripe: 斑马条纹
              border：边框-->
        <el-table-column align="center" type="index" label="#"></el-table-column>
        <el-table-column align="center" sortable prop="name" label="分类"></el-table-column>

        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="showEditDialog(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="removeCategoryById(scope.row.id)"></el-button>
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
        <el-form :model="addCategoryForm" ref="addCategoryFormRef" :rules="addCategoryFormRules" label-width="100px">
          <el-form-item label="分类名" prop="name">
            <el-input v-model="addCategoryForm.name"></el-input>
          </el-form-item>

        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCategory">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改用户的对话框 -->
      <el-dialog title="修改分类" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
        <!-- 内容主体 -->
        <el-form :model="editCategoryForm" ref="editCategoryFormRef" :rules="editCategoryFormRules" label-width="70px">
          <el-form-item label="分类" prop="name">
            <el-input v-model="editCategoryForm.name"></el-input>
          </el-form-item>

        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editCategory">确 定</el-button>
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
        categorylist: [],
        total: 0,
        // 修改用户
        editDialogVisible: false,
        editCategoryForm: {},
        // 编辑用户表单验证
        editCategoryFormRules: {
          name: [{
            required: true,
            message: '请输入分类名',
            trigger: 'blur'
          }, ]
        },
        // 添加用户对话框
        addDialogVisible: false,
        // 用户添加
        addCategoryForm: {
          name: '',
        },
        // 用户添加表单验证规则
        addCategoryFormRules: {
          name: [{
            required: true,
            message: '请输入分类名',
            trigger: 'blur'
          }]
        },
      }
    },

    created() {
      this.getCategoryList()
    },

    methods: {
      async getCategoryList() {
        const {
          data: res
        } = await this.$http.get('category', {
          params: this.queryInfo
        })

        if (res.status !== 200) {
          return this.$message.error('获取分类列表失败！')
        }
        this.categorylist = res.categoryEntity;
        this.total = res.total;
      },
      // 监听 pagesize改变的事件
      handleSizeChange(newSize) {
        this.queryInfo.pageSize = newSize
        this.getCategoryList()
      },
      // 监听 页码值 改变事件
      handleCurrentChange(newSize) {
        this.queryInfo.pageNum = newSize
        this.getCategoryList()
      },
      // 编辑用户信息
      async showEditDialog(id) {
        const {
          data: res
        } = await this.$http.get('editCategory/' + id)
        this.editCategoryForm = res
        this.editDialogVisible = true
      },
      // 监听修改用户对话框的关闭事件
      editDialogClosed() {
        this.$refs.editCategoryFormRef.resetFields()
      },
      // 修改用户信息
      editCategory() {
        // 提交请求前，表单预验证
        this.$refs.editCategoryFormRef.validate(async valid => {
          // console.log(valid)
          // 表单预校验失败
          if (!valid) return
          const {
            data: res
          } = await this.$http.get(
            'editCategory/' + this.editCategoryForm.id + '/' +
            this.editCategoryForm.name
          )
          if(res==501)
          {
            return this.$message.error('分类已存在！')
            
          }
          
          else if (res !== 200) {
            return this.$message.error('更新分类失败！')
          }
          else
          {
            // 隐藏添加用户对话框
            this.editDialogVisible = false
            this.$message.success('更新分类成功！')
            this.getCategoryList()
          }
         
        })
      },
      // 删除用户
      async removeCategoryById(id) {
        var pagenum = this.queryInfo.pageNum;
        var pagesize = this.queryInfo.pageSize;
        var total = this.total;
        if (((pagenum - 1) * pagesize == this.total - 1)&&this.total!=1) {
          this.queryInfo.pageNum = pagenum - 1;
        }
        const confirmResult = await this.$confirm(
          '此操作将永久删除该分类且相关商品分类将重置, 是否继续?',
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
        } = await this.$http.delete('editCategory/' + id)
        if (res !== 200) return this.$message.error('删除信息失败！')
        this.$message.success('删除信息成功！')
        this.getCategoryList()
      },

      // 监听 添加用户对话框的关闭事件
      addDialogClosed() {
        this.$refs.addCategoryFormRef.resetFields()
      },
      // 添加用户
      addCategory() {
        // 提交请求前，表单预验证
        this.$refs.addCategoryFormRef.validate(async valid => {
          // console.log(valid)
          // 表单预校验失败
          if (!valid) return
          const {
            data: res
          } = await this.$http.post('addCategory', this.addCategoryForm)
          if(res==501)
          {
            return this.$message.error('分类已存在！')
          }

          else if (res !== 201) {
            return this.$message.error('添加分类失败！')
          }
          else
          {
            this.$message.success('添加分类成功！')
            // 隐藏添加分类对话框
            this.addDialogVisible = false
            this.getCategoryList()
          }
        })
      },

    },
  }
</script>

<style lang="less" scoped>
</style>
