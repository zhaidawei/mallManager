<template>
	<div class="login_wrap">
		<el-form label-position="top" label-width="80px" :model="formdata" class="login_form">
			<h3>用户登录</h3>
			<el-form-item label="用户名">
				<el-input v-model="formdata.username"></el-input>
			</el-form-item>
			<el-form-item label="密码">
				<el-input v-model="formdata.password" type="password"></el-input>
			</el-form-item>
			<el-button type="primary" class="login_btn" @click.prevent="handleLogin()">登录</el-button>
		</el-form>
	</div>
</template>

<script>
	export default {
		data () {
			return {
				formdata: {
					username: '',
					password: ''
				}
			}
		},
		methods: {
			async handleLogin() {
        const res = await this.$http.post('login',this.formdata)
         // console.log(res);
         const {data, meta: {msg, status}} = res.data
         if (status === 200) {
            localStorage.setItem('token', data.token)   
            this.$router.push({name: 'home'})
            this.$message.success(msg)

         } else {
            this.$message.error(msg)
         }

				// this.$http.post('login',this.formdata).then((res) => {
				// 	// console.log(res);
				// 	const {data, meta: {msg, status}} = res.data
				// 	if (status === 200) {
    //         this.$router.push({name: 'home'})
				// 		this.$message.success(msg);
				// 	} else {
				// 		this.$message.error(msg);
				// 	}
				// })
			}
		}
	}
</script>

<style>
	.login_wrap {
		height: 100%;
		background-color: #324152;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.login_form {
		width: 400px;
		background-color: #fff;
		padding:30px;
		border-radius: 15px;
	}
	.login_btn {
		width: 100%;
	}
</style>
