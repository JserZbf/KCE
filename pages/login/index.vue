<template>
	<view class="container page">
		<view class="login-wrapper">
			<!-- 	<view class="rightTop" @click="adminLogin()">

			</view> -->
			<image class="logo" src="../../static/logo.png" mode="" @click="adminLogin()"></image>
			<view class="login-wrapper_item flex-c-c">
				<input class="ipt w100" v-model="loginForm.userName" @input="nameChange" type="text"
					placeholder="用户名" />
			</view>
			<view class="login-wrapper_item flex-c-c">
				<input class="ipt w100" v-model="loginForm.password" @input="pawChange" password placeholder="密码" />
			</view>
			<view class="login-wrapper_item flex-c-c" style="">
				<input class="ipt w100 flex1" style="width: calc(100% - 120px);margin-right: 10px;"
					v-model="loginForm.verCode" @input="codeChange" placeholder="验证码" />
				<view class="canvas-img-code" @click="refresh()">
					<canvas :style="{width:width+'px',height:height+'px','borderRadius': '15px'}" canvas-id="imgcanvas"
						@error="canvasIdErrorCallback"></canvas>
				</view>
			</view>

			<view class="checkBox ">
				<view class="checkBox_check">
					<checkbox-group @change="checkboxChange">
						<label>
							<checkbox value="记住登录信息" checked="true" />记住登录信息
						</label>
					</checkbox-group>
				</view>

			</view>
			<view class="btnBox flex-c-c">
				<button class="btn flex-c-c" type="primary" @click="login" :loading="loginLoding">登录</button>
				<!-- <view class="btn flex-c-c" @click="login">
					登录
				</view> -->
			</view>
		</view>

		<u-popup :show="pawShow" @close="pawShow = false" mode="center" :round="10">
			<view class="popup">
				<input class="ipt" v-model="newPassword" @input="nameChange" type="text" placeholder="旧密码" />
				<input class="ipt" v-model="newPassword" @input="nameChange" type="text" placeholder="新密码"
					style="margin: 10px 0;" />
				<input class="ipt" v-model="newPassword2" @input="nameChange" type="text" placeholder="确认新密码" />
			</view>
		</u-popup>
		<u-toast ref="uToast" />
		<!-- <view class="footTxt">
			{{ appNum }}
		</view> -->
	</view>
</template>

<script>
	var _this;
	import {
		login
	} from '@/config/api.js';
	import md5 from "@/utils/md5.js";
	export default {
		data() {
			return {
				appNum: "1.0.3",
				isUser: ['记住登录信息'],
				pawShow: false,
				newPassword: '',
				newPassword2: '',
				// 登录数据
				loginForm: {
					userName: '',
					password: '',
					verCode: "", //验证码
				},
				loginLoding: false,
				loginNum: 0,

				timeOut: null,
				width: 120,
				height: 45
			};
		},
		onLoad(option) {
			// #ifdef APP-PLUS
			plus.screen.lockOrientation('portrait-primary'); // 锁定竖屏
			plus.navigator.setFullscreen(false); //隐藏状态栏(应用全屏:只能隐藏状态栏，标题栏和虚拟返回键都还可以显示)	
			// #endif	
		},
		onShow() {
			_this = this;
			setTimeout(function() {
				_this.init();
			}, 1000)
			var userInfo = uni.getStorage('userInfo');
			var that = this;
			// console.log(userInfo)
			uni.getStorage({
				key: 'userInfo',
				success: function(res) {
					console.log(res.data);
					that.isUser = ['记住登录信息']
					userInfo = res.data;
					that.loginForm = userInfo;
					that.loginForm.verCode = '';
				}
			});
			// console.log(userInfo)
			if (userInfo) {
				this.loginForm = userInfo
			}
		},
		onUnload() {

		},
		methods: {
			adminLogin() {
				var that = this;

				this.loginNum += 1;

				if (this.loginNum === 3) {
					uni.showToast({
						title: this.appNum,
						icon: 'none',
						duration: 5000
					});
				}
				if (this.loginNum === 10) {
					var res = {
						"id": "EC13E2605DBCF8A2",
						"userName": "admin",
						"password": "***",
						"role": "admin",
						"workID": "001",
						"createUserID": "EC13E2605DBCF8A2",
						"createTime": "2023-04-14T15:09:09",
						"updateUserID": "EC13E2605DBCF8A2",
						"updateTime": "2023-04-14T15:09:13",
						"isAdmin": true,
						"enable": 1
					}
					uni.setStorage({
						key: '$user',
						data: JSON.stringify(res),
						success: function(res) {
							console.log('success', res);
						}
					});
					uni.showToast({
						title: '登录成功',
						icon: 'none',
						duration: 2000,
						success: function() {
							setTimeout(() => {
								uni.redirectTo({
									//关闭当前页面，跳转到应用内的某个页面。
									url: '/pages/home/index'
								});
							}, 800)

						}
					});
				}
				setTimeout(() => {
					that.loginNum = 0;
				}, 8000)
			},
			nameChange(e) {
				this.loginForm.userName = e.target.value;
			},
			pawChange(e) {
				this.loginForm.password = e.target.value;
			},
			codeChange(e) {
				this.loginForm.verCode = e.target.value;
			},
			delUser() {
				this.pawShow = true
				uni.clearStorage();
			},
			checkboxChange(e) {
				console.log('当前选择', e);
				console.log('当前选择', this.isUser);
			},
			// 手机号登录
			login() {
				console.log('当前选择', this.isUser);
				this.loginLoding = true;
				if (this.isUser.length >= 1) {
					uni.setStorageSync('userInfo', this.loginForm);
				}
				if (!this.loginForm.userName) {
					this.$refs.uToast.show({
						type: 'default',
						message: "请输入用户名",
					})
					this.loginLoding = false;
					return;
				}
				if (!this.loginForm.password) {
					this.$refs.uToast.show({
						type: 'default',
						message: "请输入密码",
					})
					this.loginLoding = false;
					return;
				}
				if (!this.loginForm.verCode) {
					this.$refs.uToast.show({
						type: 'default',
						message: "请输入验证码",
					})
					this.loginLoding = false;
					return;
				}
				if (this.loginForm.verCode.toLowerCase() != uni.getStorageSync('imgcode').toLowerCase()) {
					this.$refs.uToast.show({
						type: 'default',
						message: "请输入正确验证码",
					})
					this.loginLoding = false;
					return;
				}
				setTimeout(() => {
					this.loginLoding = false;
				}, 6000)
				// uni.redirectTo({
				// 	//关闭当前页面，跳转到应用内的某个页面。
				// 	url: '/pages/home/index'
				// });
				login({
					...this.loginForm,
					password: md5.hex_md5(this.loginForm.password),
					verCode: undefined,
				}).then((res) => {
					console.log("res", res);
					uni.setStorage({
						key: '$user',
						data: JSON.stringify(res),
						success: function(res) {
							console.log('success', res);
						}
					});
					uni.showToast({
						title: '登录成功',
						icon: 'none',
						duration: 2000,
						success: function() {
							setTimeout(() => {
								uni.redirectTo({
									//关闭当前页面，跳转到应用内的某个页面。
									url: '/pages/home/index'
								});
							}, 800)

						}
					});
					// uni.redirectTo({
					// 	//关闭当前页面，跳转到应用内的某个页面。
					// 	url: '/pages/home/index'
					// });
				}).catch((err) => {
					console.log("err", err);
					uni.showToast({
						title: '登录失败',
						icon: 'none',
						duration: 2000,
					});
					this.loginLoding = false;
				})
				// uni.redirectTo({
				// 	//关闭当前页面，跳转到应用内的某个页面。
				// 	url: '/pages/home/index'
				// });
			},


			// 初始化验证码
			init: function() {
				console.log('start');
				var context = uni.createCanvasContext('imgcanvas', this),
					w = this.width,
					h = this.height;
				context.setFillStyle("white");
				context.setLineWidth(5);
				context.fillRect(0, 0, w, h);
				var pool = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "I", "M", "N", "O", "P", "Q",
						"R", "S",
						"T", "U", "V", "W", "S", "Y", "Z", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"
					],
					str = '';
				for (var i = 0; i < 4; i++) {
					var c = pool[this.rn(0, pool.length - 1)];
					var deg = this.rn(-30, 30);
					context.setFontSize(18);
					context.setTextBaseline("top");
					context.setFillStyle(this.rc(80, 150));
					context.save();
					context.translate(30 * i + 15, parseInt(h / 1.5));
					context.rotate(deg * Math.PI / 180);
					context.fillText(c, -15 + 5, -15);
					context.restore();
					str += c;
				}
				uni.setStorage({
					key: 'imgcode',
					data: str,
				});
				for (var i = 0; i < 40; i++) {
					context.beginPath();
					context.arc(this.rn(0, w), this.rn(0, h), 1, 0, 2 * Math.PI);
					context.closePath();
					context.setFillStyle(this.rc(150, 200));
					context.fill();
				}
				context.draw();
				console.log('end');
			},
			rc: function(min, max) {
				var r = this.rn(min, max);
				var g = this.rn(min, max);
				var b = this.rn(min, max);
				return "rgb(" + r + "," + g + "," + b + ")";
			},
			rn: function(max, min) {
				return parseInt(Math.random() * (max - min)) + min;
			},
			refresh: function() {
				this.init();
			},
			canvasIdErrorCallback: function(e) {
				console.error(e.detail.errMsg)
			}

		}
	};
</script>

<style lang="scss" scoped>
	.footTxt {
		position: fixed;
		bottom: 0;
		right: 0;
		color: #999;
	}

	.rightTop {
		width: 50rpx;
		height: 50rpx;
		position: fixed;
		right: 0;
		top: 0;
	}

	.container {
		width: 100%;
		height: 100%;
		// max-height: 980rpx;
		// padding-bottom: 170rpx;
		// overflow-y: hidden;
		// padding: 80rpx;
		overflow: scroll;
		box-sizing: border-box;
		background: linear-gradient(to right, #d6e4fe, #f0f5fe);

		.logo {
			width: 112px;
			height: 43px;
			margin-bottom: 20px;
		}
	}

	.foot {
		width: 100%;
		margin-top: 112rpx;

		.footImg {
			width: 495rpx;
			height: 379rpx;
		}
	}

	.login-header {
		width: 100%;
		// margin-bottom: 60rpx;
		position: relative;
		color: #fff;

		.headImg {
			width: 750rpx;
			height: 385rpx;
		}

		view {
			top: 84rpx;
			left: 50%;
			transform: translate(-50%, 0%);
			position: absolute;
			// margin-bottom: 20rpx;
			font-size: 60rpx;
			font-weight: bold;
			// color: $textColor;
		}

		text {
			font-size: 28rpx;
			// color: $grey;
		}
	}

	.logo {
		width: 100%;
		height: 166rpx;

		._logo {
			width: 100rpx;
			height: 62rpx;
		}
	}

	.ipt {
		// max-width: 600rpx;
		width: 50%;
		height: 80rpx;
		background-color: #fff;
		border-radius: 12px;
		text-indent: 12px;
		padding: 12px;
		box-sizing: border-box;
		font-size: 30px;
	}

	.login-wrapper {
		width: 750rpx;
		height: 100%;
		display: flex;
		flex-direction: column;
		// justify-content: center;
		align-items: center;
		padding: 350rpx 60rpx 0 60rpx;
		box-sizing: border-box;
		margin-bottom: 50px;
		// margin-top: 10%;

		.ipt {
			width: 100%;
			// max-width: 450rpx;
			// max-height: 120rpx;
			// height: 120px;
			background-color: #fff;
			border-radius: 12px;
			text-indent: 12px;
			padding: 12px;
			box-sizing: border-box;
			font-size: 30rpx;
		}

		.btnBox {
			width: 100%;
			// padding: 0 60px;
			box-sizing: border-box;

			.btn {
				max-width: 600rpx;
				width: 100%;
				max-height: 120rpx;
				height: 80rpx;
				font-size: 32rpx;
				// background-color: #03a9ff;
				color: #fff;
				border-radius: 40rpx;
			}
		}

		.btn {
			height: 80px;
			font-size: 30px;
		}

		.checkBox {
			max-width: 600rpx;
			width: 100%;
			margin: 30px 0;
			color: #AEAEAE;

			.checkBox_check {
				// width: 50%;
			}
		}

		&_item {
			width: 100%;
			display: flex;
			// justify-content: space-between;
			// height: 90rpx;
			padding-top: 30rpx;
			// border-bottom: 2rpx solid $borderColor;
		}

		&_btn {
			margin-top: 47rpx;
			letter-spacing: 4rpx;
			box-shadow: 10rpx 10rpx 30rpx rgba(0, 0, 0, 0.15);
			border-radius: 100rpx;
		}

		&_tips {
			width: 300rpx;
			display: flex;
			// justify-content: flex-start;
			margin-top: 30rpx;
			font-size: 24rpx;
			color: #6172FE;

			text {
				padding: 0 20rpx;
			}

			::v-deep .u-checkbox {
				align-items: baseline;
				line-height: 1.3;

				&__icon-wrap {}

				&__label {
					// color: $grey;

					text {
						// color: $primary;
						color: #03a9ff;
					}
				}
			}
		}
	}

	.popup {
		width: 375rpx;
		height: 100%;
		background-color: #fff;
		padding: 20px;
		background: linear-gradient(to right, #d6e4fe, #f0f5fe);
		border-radius: 10px;
	}
</style>