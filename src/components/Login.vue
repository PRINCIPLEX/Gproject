<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png">
      </div>

     <el-form
     ref="loginFormRef"
     :model="loginForm"
     :rules="loginFormRules"
     class="login_form">
       <!-- 用户名 -->
       <el-form-item prop="account">
         <el-input v-model="loginForm.account"
             placeholder="请输入用户名"
             prefix-icon="el-icon-user">
         </el-input>
       </el-form-item>
       <!-- 密码 -->
       <el-form-item prop="password">
         <el-input v-model="loginForm.password"
             type="password"
             placeholder="请输入密码"
             prefix-icon="el-icon-lock">
         </el-input>
       </el-form-item>

       <el-form-item class="btns">
         <el-button
         @click="login"
         type="primary">登录</el-button>
       </el-form-item>
     </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        account: 'zcyx',
        password:'',
      },

      loginFormRules: {
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },


    }
  },
  methods: {
    login () {
      /*this.$refs.loginFormRef.validate(async valid => {
        if (!valid) { return };
        const { data: res } = await this.$http.post('super_login', this.loginForm)
        if (res.status !== 200) {
          return this.$message.error('账号或密码错误')
        }
        this.$message.success('登录成功')
        window.sessionStorage.setItem('token', res.token)
       // window.sessionStorage.setItem('token', 'a')
        this.$router.push('/home')
      })*/


      if(this.loginForm.password !== 'zcyx') {
        return this.$message.error('账号或密码错误')
      }
      window.sessionStorage.setItem('token', 'zcyx')
      this.$message.success('登录成功')
      this.$router.push('/home')
    }
  },
  mounted () {
    window.sessionStorage.clear()
  }
}
</script>

<style lang="less" scoped>
.login_container {
    //background: url('../assets/bg.jpg') center center no-repeat;
    background-color: #1F8C52;
    height: 100%;
  }
.login_box {
  width: 420px;
  height: 320px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
  background-color: #fff;
  }
 .avatar_box {
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
}
.login_form {
  position: absolute;
  bottom: 10px;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: center;
}
</style>
