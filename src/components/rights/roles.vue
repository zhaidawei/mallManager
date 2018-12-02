<template>
  <el-card>
    <!-- 面包屑 -->
    <my-bread level1="权限管理" level2="角色列表"></my-bread>
    <!-- 添加角色按钮 -->
    <el-button plain class="role_btn" @click=showAddRoleBox>添加角色</el-button>
    <!-- 表格 -->
    <el-table height="430" :data="roleList" style="width: 100%">
      <el-table-column type="expand" width="50">
        <template slot-scope="scope">
          <el-row v-for="(item1,i) in scope.row.children" :key="i">
            <el-col :span="4">
              <el-tag @close="deleRole(scope.row,item1.id)" closable>{{item1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row v-for="(item2,i) in item1.children" :key="i">
                <el-col :span="5">
                  <el-tag @close="deleRole(scope.row,item2.id)" closable type="success">{{item2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="19">
                  <el-row>
                    <el-tag @close="deleRole(scope.row,item3.id)" closable type="warning" v-for="(item3,i) in item2.children" :key="i">
                    {{item3.authName}}</el-tag>
                  </el-row>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <span v-if="scope.row.children.length===0">未分配权限</span>
        </template>
      </el-table-column>
      <el-table-column type="index" label="#" width="100"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="180"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="180"></el-table-column>
      <el-table-column
      label="操作">
        <template slot-scope="scope">
          <el-button size="mini" plain type="primary" icon="el-icon-edit" 
          @click="showEditRoleDia(scope.row)" circle></el-button>
          <el-button size="mini" plain type="danger" icon="el-icon-delete"
          @click="showDeleRoleMsgBox(scope.row.id)" circle></el-button>
          <el-button size="mini" plain type="success" icon="el-icon-check"
          @click="showRightsMsgBox(scope.row)" circle></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加角色 -->
    <el-dialog title="添加角色" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="form">
        <el-form-item label="角色名称" label-width="100px" required>
          <el-input v-model="form.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" label-width="100px">
        <el-input v-model="form.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addRole()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑角色 -->
    <el-dialog title="编辑角色" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="form">
        <el-form-item label="角色名称" label-width="100px" required>
          <el-input v-model="form.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" label-width="100px">
        <el-input v-model="form.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="editRole()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配角色 -->
    <el-dialog title="分配权限" :visible.sync="dialogFormVisibleRights">
      <el-tree
        ref = "tree"
        :data="roleListTree"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="checkedKeys"
        :props="defaultProps">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRights = false">取 消</el-button>
        <el-button type="primary" @click="handleSetRoles">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
  export default {
    data() {
      return {
        roleList: [],
        dialogFormVisibleAdd: false,
        dialogFormVisibleEdit: false,
        dialogFormVisibleRights: false,
        //添加角色
        form: {
          roleName: '',
          roleDesc: ''
        },

        roleListTree: [],
        checkedKeys: [],
        currentRoleId: -1,
        defaultProps: {
          children: 'children',
          label: 'authName'
        }
      }
    },
    created() {
      this.getData()
    },
    methods: {
      //获取角色列表
      async getData() {
        const res = await this.$http.get(`roles`)
        // console.log(res)
        this.roleList = res.data.data
      },
      //添加角色
      showAddRoleBox() {
        this.dialogFormVisibleAdd = true
      },
      async addRole() {
        this.dialogFormVisibleAdd = false
        const data = {roleName: this.form.roleName, roleDesc: this.form.roleDesc}
        const res = this.$http.post(
          `roles`,data)
        //取出PromiseValue
        var res1 = Promise.resolve(res)
        // Promise {[[PromiseStatus]]: "resolved", [[PromiseValue]]: "xx"}
        res1.then( (result) => { 
          const {data, meta: {msg, status}} = result.data
          if (status === 201) {
            this.$message.success(msg)
            this.getData()
          } else {
            this.$message.warning(msg)
          }
        })
        this.form = {}
      },
      //编辑角色
      showEditRoleDia(user) {
        this.dialogFormVisibleEdit = true
        this.form = user
      },
      async editRole(user) {
        this.dialogFormVisibleEdit = false
        const res = await this.$http.put(`roles/${this.form.id}`,
        {roleName: this.form.roleName, roleDesc: this.form.roleDesc})
        // console.log(res)
        const {data, meta: {status, msg}} = res.data
        if (status === 200) {
          this.$message.success(msg)
          this.getData()
        } else {
          this.$message.warning(msg)
        }
      },
      //删除角色
      async showDeleRoleMsgBox(id) {
        const res = await this.$http.delete(`roles/${id}`)
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.getData()
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      //删除角色权限
      async deleRole(role,rightId) {
        const res = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
        // console.log(res)
        const {data, meta: {status, msg}} = res.data
        console.log(data)
        if (status === 200) {
          this.$message.success(msg)
          role.children = data
        } else {
          this.$message.warning(msg)
        }
      },
      //分配权限
      async showRightsMsgBox(role) {
        this.dialogFormVisibleRights = true
        this.currentRoleId = role.id
        const res = await this.$http.get(`rights/tree`)
        // console.log(res)
        const data = res.data.data
        // console.log(data)
        this.roleListTree = data
        let arrtmp = []
        role.children.forEach(item1 => {
          item1.children.forEach(item2 => {
            item2.children.forEach(item3 =>{
              arrtmp.push(item3.id)
            })
          })
        })
        this.checkedKeys = arrtmp
      },
      async handleSetRoles() {
        
        const checkedKeys = this.$refs.tree.getCheckedKeys()
        // console.log(checkedKeys)
        const checkhalfKeys = this.$refs.tree.getHalfCheckedKeys()
        const newarr = [...checkedKeys,...checkhalfKeys]
        const res = await this.$http.post(`roles/${this.currentRoleId}/rights`, 
                    {rids: newarr.join(',')})
        // console.log(res)
        const {data, meta: {status, msg}} = res.data
        if (status === 200) {
          this.dialogFormVisibleRights = false
          this.$message.success(msg)
          this.getData()
        } else {
          this.$message.warning(msg)
        }
      },
    }
  }
</script>


<style>
  .role_btn {
    margin-top: 20px;
  }
</style>