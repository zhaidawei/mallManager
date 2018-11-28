<template>
  <el-card>
  <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item class="home">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
  <!-- 搜索框 -->
    <div style="margin-top: 15px;">
      <el-input 
      @clear="loadUserList"
      placeholder="请输入内容" 
      v-model="query"
      class="input-with-select userSearch" clearable>
        <el-button slot="append" icon="el-icon-search" @click="searchBox"></el-button>
      </el-input>
      <el-button type="success" plain @click="showAddUserDia">添加用户</el-button>
    </div>
    <!-- 表格 -->
     <el-table
     height="300"
      :data="userList"
      style="width: 100%">
      <el-table-column
        type="index"
        label="#"
        width="30">
      </el-table-column>
      <el-table-column
        prop="username"
        label="姓名"
        width="100">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="150">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话"
        width="150">
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="创建日期"
        width="180">
        <template slot-scope="scope">
          {{scope.row.create_time | fmtdate}}
        </template>
      </el-table-column>
      <el-table-column
        label="用户状态"
        width="100">
        <template slot-scope="scope">
          <el-switch
           @change="changeStatus(scope.row)"
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>

      </el-table-column>
      <el-table-column
        label="操作"
        width="180">
        <template slot-scope="scope">
            <el-button size="mini" plain type="primary" icon="el-icon-edit" 
            @click="showEditUserDia(scope.row)" circle></el-button>
            <el-button size="mini" plain type="danger" icon="el-icon-delete"
            @click="showDeleUserMsgBox(scope.row.id)" circle></el-button>
            <el-button size="mini" plain type="success" icon="el-icon-check"
            @click="showRoleUserMsgBox(scope.row)" circle></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2,4,6,8]"
      :page-size="2"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

      <!-- 添加用户 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="form">
        <el-form-item label="用户名" label-width="100px" required>
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密  码" label-width="100px" required>
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮  箱" label-width="100px">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电  话" label-width="100px">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑用户 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="form">
        <el-form-item label="用户名" label-width="100px" required>
          <el-input v-model="form.username" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮  箱" label-width="100px">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电  话" label-width="100px">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配角色 -->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRole">
      <el-form :model="form">
        <el-form-item label="用户名" label-width="100px" >
          {{currUsername}}
          <!-- <el-input v-model="form.name" autocomplete="off"></el-input> -->
        </el-form-item>
        <el-form-item label="角色" label-width="100px">
          <el-select v-model="currRoleId">
            <el-option label="请选择" :value="-1"></el-option>
            <el-option v-for="(item,i) in roles" :key="i"
            :label="item.roleName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRole = false">取 消</el-button>
        <el-button type="primary" @click="setRole()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>



<script>
  export default {
    data() {
      return {
        query: '',
        total: -1,
        pagenum: 1,
        pagesize: 2,
        userList: [],
        form: {
          username: '',
          password: '',
          email: '',
          mobile: ''
        },
        dialogFormVisibleAdd: false,
        dialogFormVisibleEdit: false,
        dialogFormVisibleRole: false,

        currRoleId: -1,
        currUserId: -1,
        currUsername: '',
        roles:[],
      }
    },
    created() {
      this.getData()
    },
    methods: {
      //获取用户列表
      async getData() {
        const AUTH_TOKEN = localStorage.getItem('token')
        this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN
        const res = await this.$http.get(
          `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`,this.userList)
        // console.log(res)
        const {data:{users, total}, meta:{msg, status}} = res.data
        if (status === 200) {
          this.userList = users
          this.total = total
          // this.$message.success(msg)
        } else {
          // this.$message.error(msg)
        }
      },
      //分页操作
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.pagesize = val
        this.pagenum = 1
        this.getData()
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.pagenum = val
        this.getData()
      },
      // 搜索框
      searchBox() {
        this.pagenum = 1
        this.getData()
      },
      loadUserList() {
        // this.cu
        // this.pagenum = 1
        this.getData()
      },
      //添加用户
      showAddUserDia() {
        this.form = {}
        this.dialogFormVisibleAdd = true
      },
      async addUser() {
        this.dialogFormVisibleAdd = false
        const res = await this.$http.post(`users`,this.form)
        // console.log(res)
        const {data, meta:{msg, status}} = res.data
        if (status === 201) {
          this.$message.success(msg)
          this.getData() 
          this.form = {}
        } else {
          this.$message.error(msg)
        }
      },
      // 修改用户状态
      async changeStatus(user) {
        const res = await this.$http.put(`users/${user.id}/state/${user.mg_state}`)
        // console.log(res)
        const {data, meta: {msg, status}} = res.data
        if (status === 200) {
          this.$message.success(msg)
        } else {
          this.$message.error(msg)
        }
      },
      // 删除用户
      showDeleUserMsgBox(id) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const res = await this.$http.delete(`users/${id}`)
          // console.log(res)
          const {data, meta: {msg, status}} = res.data
          if (status === 200) {
            this.pagenum = 1
            this.getData()
            this.$message({
            type: 'success',
            message: msg
          })            
          } else {
            this.$message.error(msg)            
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      // 编辑用户
      showEditUserDia(user) {
        this.dialogFormVisibleEdit = true
        this.form = {username: user.username, email: user.email, mobile: user.mobile,
                    id: user.id, mg_state: user.mg_state}
        
      },
      async editUser() {
        this.dialogFormVisibleEdit = false
        const res = await this.$http.put(`users/${this.form.id}`,this.form)
        // console.log(res)
        const {data, meta: {msg, status}} = res.data
        if (status === 200) {
          this.$message.success(msg)
          this.pagenum = 1
          this.getData()
        } else {
          this.$message.warning(msg)
        }
      },
      //角色分配
      async showRoleUserMsgBox(user) {
        // console.log(user)
        this.dialogFormVisibleRole = true
        this.currUserId = user.id
        this.currUsername = user.username
        const res = await this.$http.get(`roles`)
        this.roles = res.data.data
        // console.log(res)
        const res1 = await this.$http.get(`users/${user.id}`)
        // console.log(res1)
        this.currRoleId = res1.data.data.rid
        // console.log(this.currRoleId)
      },
      async setRole() {
        this.dialogFormVisibleRole = false
        const res = await this.$http.put(`users/${this.currUserId}/role`,{rid:this.currRoleId})
        // console.log(res)
        if (res.data.meta.status === 200) {
          this.$message.success(res.data.meta.msg)
        } else {
          this.$message.warning(res.data.meta.msg)
        }
      },
    }
  }
</script>


<style>
  .home {
    font-weight: 700;
  }
  .userSearch {
    width: 350px;
    /* padding: 0 30px 0 20px; */
  }
</style>