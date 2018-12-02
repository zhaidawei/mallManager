<template>
	<el-container class="container">
  <!-- 头部 -->
    <el-header class="home_header">
      <el-row>
        <el-col :span="4">
          <img src="../../assets/logo.png" height="56" width="207" alt="">
        </el-col>
        <el-col :span="19" class="middle">
          <h1>电商后台管理系统</h1>
        </el-col>
        <el-col :span="1">
          <a href="#" class="logout" @click.prevent="logout">退出</a>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
    <!-- 侧边栏 -->
      <el-aside width="200px" class="home_aside">
        <el-menu
          :router="true"
          :unique-opened="true">
          <el-submenu :index="''+item1.order" v-for="(item1,i) in menus" :key="i">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>{{item1.authName}}</span>
            </template>
            <el-menu-item :index="item2.path" v-for="(item2,i) in item1.children" :key="i">
              <i class="el-icon-location"></i>
              <span>{{item2.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
    <!-- 主体部分 -->
      <el-main class="home_main">
        <router-view class="inner_main"></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>



<script>
	export default {
    data() {
      return {
        menus: []
      }
    },
    beforeCreated() {
      // const token = localStorage.getItems('token')
      // if (!token) {
      //   this.$router.push({name:'login'})
      // }
    },
    created() {
      this.getMenus()
    },
		methods: {
      //退出
      logout() {
        localStorage.clear()
        this.$message.success('退出成功')
        this.$router.push({name: 'login'})
      },
      async getMenus() {
        const res = await this.$http.get(`menus`)
        // console.log(res)
        this.menus = res.data.data
      }
    }
	}
</script>


<style>
  .container {
    height: 100%;
  }
	.home_header {
    background-color: #b3c0d1;
    padding: 0;
    line-height: 60px;
  }
  .middle {
    color: #fff;
    text-align: center;
  }
  .logout {
    text-decoration: none;
    text-align: right;
  }
  .home_aside {
    background-color: #d3dce6;
    height: 100%;
  }
  .home_main {
    background-color: #e9eef3;
    /* height: 100%; */
  }
  .inner_main {
    height: 100%;
/*     box-sizing: border-box;
    padding: 20px;
    background-color: #fff;
    
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    border: 1px solid #ebeef5;
    color: #303133;
    border-radius: 4px; */
  }
</style>