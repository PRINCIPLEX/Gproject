<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品上传</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>



      <!-- 提示 -->
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>

      <div class="add_form">
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="left">
          <el-form-item label="商品名称" prop="gname">
            <el-input v-model="addForm.gname"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="price">
            <el-input v-model="addForm.price" type="number"></el-input>
          </el-form-item>
          <el-form-item label="商品销量" prop="sales">
            <el-input v-model="addForm.sales" type="number"></el-input>
          </el-form-item>

          <el-form-item label="商品分类" prop="categoryId">
            <el-select v-model="addForm.categoryId" clearable placeholder="请选择">
              <el-option v-for="item in this.categorylist" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="是否上架" prop="sales">
            <el-switch v-model="addForm.issale" active-text="上架"
            inactive-text="下架">
            </el-switch>
          </el-form-item>

          <el-form-item label="上传图片">
            <el-upload ref="upload"
            :file-list='fileList'
            :multiple="false" :limit="1" :auto-upload="false" :data="this.addForm" :action="upURL"
              :on-change="handleChange" :on-error="handleError" :on-success="handleSuccess" list-type="picture-card">
              <i class="el-icon-plus"></i>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过4MB</div>
            </el-upload>
          </el-form-item>

        </el-form>
      </div>
    </el-card>

    <div style="text-align:center">
      <el-button type="primary" @click="addGoods">添加商品</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {

        isImage: false,
        is4M: false,
        upURL: 'http://49.234.221.164:1234/addGoods',
        categorylist: [],
        fileList:[],
        // 添加商品的表单对象
        addForm: {
          gname: '',
          price: '',
          sales: '',
          img: '',
          categoryId: '',
          issale:false
        },
        addFormRules: {
          gname: [{
            required: true,
            message: '请输入商品名称',
            trigger: 'blur'
          }],
          price: [{
            required: true,
            message: '请输入商品价格',
            trigger: 'blur'
          }],
          sales: [{
            required: true,
            message: '请输入商品数量',
            trigger: 'blur'
          }],
          categoryId: [{
            required: true,
            message: '请选择商品分类',
            trigger: 'blur'
          }],
        },

      }
    },
    created() {
      this.getCategoryList()
    },

    methods: {

      addGoods() {
        this.$refs.addFormRef.validate(valid => {
          if (!valid) return this.$message.error('请完善商品内容！')
          if (!this.isImage) {
            return this.$message.error('请上传 JPG/JPEG/PNG 格式的图片!');
          }
          if (!this.is4M) {
            return this.$message.error('上传图片大小不能超过 4MB!');
          }
          this.$refs.upload.submit();
          this.is4M = false;
          this.isImage = false;
          this.$refs.addFormRef.resetFields()
        })
      },

      async getCategoryList() {
        const {
          data: res
        } = await this.$http.get('getcategory', {

        })
        this.categorylist = res;
      },


      handleChange(file, filelist) {
        this.isImage = (file.raw.type === 'image/jpeg' || file.raw.type === 'image/jpg' || file.raw.type ===
          'image/png');

        if (!this.isImage) {
          return this.$message.error('上传 JPG/JPEG/PNG 格式的图片!');
        }

        this.is4M = file.size / 1024 / 1024 < 4;

        if (!this.is4M) {
          return this.$message.error('上传头像图片大小不能超过 4MB!');
        }

      },

      handleError(file) {
        return this.$message.error('上传图片失败!');
      },

      handleSuccess(file){
        this.$refs.upload.clearFiles();
        return this.$message.success('添加商品成功!');

      }

    }
  }
</script>

<style lang='less' scoped>
  .add_form {
    padding-top: 30px;
  }
</style>
