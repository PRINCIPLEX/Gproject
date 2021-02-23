<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品修改</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>



      <!-- 提示 -->
      <el-alert title="修改商品信息" type="info" center show-icon :closable="false"></el-alert>

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

          <el-form-item label="原商品图">

            <template>
              <img style="height: 148px;width: 148px" :src="'data:image/jpg;base64,'+this.addForm.img">
            </template>
          </el-form-item>

          <el-form-item label="替换图片">

            <el-upload ref="upload" :file-list='fileList' :multiple="false" :limit="1" :auto-upload="false" :data="this.addForm"
              :action="upURL" :on-change="handleChange" :on-error="handleError" :on-success="handleSuccess" list-type="picture-card">
              <i class="el-icon-plus"></i>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过4MB</div>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <div style="text-align:center">
      <el-button type="primary" @click="addGoods">修改商品</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    inject: ['reload'],
    data() {
      return {

        goodId: '',
        isImage: false,
        is4M: false,
        upURL: 'http://49.234.221.164:1234/addGoods',
        categorylist: [],
        fileList: [],

        // 添加商品的表单对象
        addForm: {
          id: '',
          gname: '',
          price: '',
          sales: '',
          img: '',
          issale: '',
          categoryId: ''
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
      this.goodId = this.$route.query.goodId;
      this.getGoodList();
      this.getCategoryList();
    },

    methods: {

      addGoods() {
        this.$refs.addFormRef.validate(valid => {
          if (!valid) return this.$message.error('请完善商品内容！')
          if (!this.isImage) {
            this.editGood();
          } else {
            if (!this.is4M) {
              return this.$message.error('上传图片大小不能超过 4MB!');
            }

            this.$refs.upload.submit();
            this.is4M = false;
            this.isImage = false;
          }
          setTimeout(() => {
            this.$router.push({
              path: '/goods',
            })
          }, 300);

        })
      },


      async editGood() {
        const {
          data: res
        } = await this.$http.post('editgood', this.addForm)
        if (res !== 201) {
          this.$message.error('修改商品失败！')
        }
        this.$message.success('修改商品成功！')
      },

      async getCategoryList() {
        const {
          data: res
        } = await this.$http.get('getcategory', {

        })
        this.categorylist = res;
      },

      async getGoodList() {
        const {
          data: res
        } = await this.$http.get('editGoods/' + this.goodId)
        this.addForm.id = res.id;
        this.addForm.gname = res.gname;
        this.addForm.price = res.price;
        this.addForm.sales = res.sales;
        this.addForm.categoryId = res.categoryId;
        this.addForm.img = res.img;
        this.addForm.issale=res.issale;
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

      handleSuccess(file) {
        return this.$message.success('修改商品成功!');
      }

    }
  }
</script>

<style lang='less' scoped>
  .add_form {
    padding-top: 30px;
  }
</style>
