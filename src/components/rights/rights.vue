<template>
  <el-card>
    <my-bread level1="权限管理" level2="权限列表"></my-bread>

        <!-- 表格 -->
    <el-table height="450" :data="roleList" style="width: 100%" class="table_rights">
      <el-table-column type="index" label="#" width="100"></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="180"></el-table-column>
      <el-table-column prop="path" label="路径" width="180"></el-table-column>
      <el-table-column label="层级" width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.level === '0'">一级</span>
          <span v-if="scope.row.level === '1'">二级</span>
          <span v-if="scope.row.level === '2'">三级</span>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>



<script>
  export default {
    data() {
      return {
        roleList:[],
      }
    },
    created() {
      this.getData()
    },
    methods: {
      async getData() {
        const res = await this.$http.get(`rights/list`)
        // console.log(res)
        this.roleList = res.data.data
        // console.log(this.roleList)
      },
    }
  }
</script>


<style>
  .table_rights {
    margin-top: 20px;
  }
</style>