<template>
  <!-- 面包屑 -->
  <el-breadcrumb separator="/">
    <el-breadcrumb-item class="home">首页</el-breadcrumb-item>
    <el-breadcrumb-item>{{level1}}</el-breadcrumb-item>
    <el-breadcrumb-item>{{level2}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
  export default {
    name: 'my-bread',
    props: ['level1', 'level2']
  }
</script>


<style>
  .home {
    font-weight: 700
  }
</style>