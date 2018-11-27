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
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item index="1-1">
              <i class="el-icon-location"></i>
              <span>用户列表</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item index="1-1">
              <i class="el-icon-location"></i>
              <span>角色列表</span>
            </el-menu-item>
            <el-menu-item index="1-1">
              <i class="el-icon-location"></i>
              <span>权限列表</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>商品管理</span>
            </template>
            <el-menu-item index="1-1">
              <i class="el-icon-location"></i>
              <span>商品列表</span>
            </el-menu-item>
            <el-menu-item index="1-1">
              <i class="el-icon-location"></i>
              <span>分类参数</span>
            </el-menu-item>
            <el-menu-item index="1-1">
              <i class="el-icon-location"></i>
              <span>商品分类</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>订单管理</span>
            </template>
            <el-menu-item index="1-1">
              <i class="el-icon-location"></i>
              <span>订单列表</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>数据统计</span>
            </template>
            <el-menu-item index="1-1">
              <i class="el-icon-location"></i>
              <span>数据报表</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
    <!-- 主体部分 -->
      <el-main class="home_main">
      </el-main>
    </el-container>
  </el-container>
</template>



<script>
	export default {
    beforeCreated() {
      const token = localStorage.getItems('token')
      if (!token) {
        this.$router.push({name:'login'})
      }
    },
		methods: {
      //退出
      logout() {
        localStorage.clear()
        this.$message.success('退出成功')
        this.$router.push({name: 'login'})
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
    /* height: 100%; */
  }
  .home_main {
    background-color: #e9eef3;
    /* height: 100%; */
  }
</style>