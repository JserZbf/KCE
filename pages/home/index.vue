<template>
	<view class="u-page">
		<view class="u-demo-block">
			<view class="u-demo-block__content">
				<u-row justify="space-between">
					<u-col span="12">
						<view class="demo-layout bg-purple-light flex-ac flex-y">
							<view class="scan flex-ac-sb">
								<view class="label text-1 flex0">选择扶梯配置:</view>
								<view class="qrCode flex-ac flex1" @click="selectShow = true">
									<view :class="config.flowTypeName?'':'c888'">
										{{config.flowTypeName?config.flowTypeName:'点击选择扶梯配置'}}
									</view>
								</view>
							</view>

							<view class="scan flex-ac-sb" style="margin-top:20px">
								<view class="label text-1 flex0">订单号:</view>
								<view
									:class="!/^[0-9]{8}$/.test(this.qrCode)?'qrCode flex-ac  flex1 borderNull':'qrCode flex-ac  flex1'"
									class="">

									<input class="ipt" type="text" v-model="qrCode" placeholder="请输入订单号" />
								</view>
							</view>

							<view class="w100">
								<view class="flex btns" style="margin-bottom: 10rpx;">
									<button class="btn_item" type="primary" @click="search()" size="mini">搜索订单号</button>
									<button class="btn_item" type="primary" @click="getQr()" size="mini">扫描二维码</button>
									<!-- 		<button class="btn_item" type="primary" @click="cameraChange()"
										size="mini">测试拍摄</button> -->
									<button class="btn_item" type="primary" @click="getTypeConfigList('btn')"
										size="mini">获取扶梯配置</button>
									<button class="btn_item" type="primary" @click="detection()"
										size="mini">检测完成度</button>
								</view>
							</view>
						</view>
					</u-col>
				</u-row>



				<view class="bg flex1" v-if="directionList.length > 0">
					<view v-for="(item,idx) in directionList" :key="idx"
						:class="item.fileList && item.fileList.length && item.fileList.length >= item.swiperList.length?'scan_list':'scan_list typeNull'">
						<view class="flex-ac-sb" style="padding: 0 10rpx;">
							<view class="">
								<text class="u-demo-block__title">{{item.flowItemName}}</text>
								<text class="font28"
									v-if="item.swiperList.length != 0">(至少拍摄{{item.swiperList.length}}个图片或视频)</text>
							</view>
							<image @click="tisOn(item,idx)" class="icon" src="../../static/image/info.png" mode="">
							</image>
						</view>
						<view class="demo-layout bg-purple-light flex-c-c">
							<view class="camera_view flex flex-y">
								<view class="view_box flex">
									<block v-for="(items,idxs) in item.fileList" :key="idxs">
										<view v-if="items.fileType === 'image'" class="view_item">
											<view class="zzc" @click="preview(items)"></view>
											<image class="" :src="items.filePath" mode="" />
										</view>
										<view v-if="items.fileType === 'video'" class="view_item">
											<view class="zzc  flex-c-c flex-y" @click="preview(items)">
												<image class="icon" src="../../static/image/play.png" mode="" />
												<view class="videoName c000 font44 weightB">{{items.name}}</view>
											</view>
										</view>
									</block>

									<view class="view_item flex-c-c flex-y" @click="direction(item)">
										<image class="icon" src="../../static/image/camera.png" mode=""></image>
										<text>拍照/视频</text>
									</view>
								</view>

							</view>
						</view>

					</view>


				</view>
				<view class="bg flex-c-c flex1" v-else>
					未配置流程
				</view>
			</view>

		</view>


		<u-popup class="popupBox" :show="isSwiper" @close="isSwiper = false" @open="dialogSwiperConfirm" mode="center">
			<view class="popBox flex-c-c" style="width: 100vw;height: 100%;">
				<swiper class="swiper" style="width: 100vw;height: 60vh;" circular :indicator-dots="true"
					:autoplay="false" :interval="0" :duration="500">
					<swiper-item class="flex-c-c" style="width: 100%;height: 100%;" v-for="(item,idx) in swiperList"
						:key="idx">
						<view class="swiper-item flex-c-c" style="width: 100vw;height: auto;">
							<image style="width: 100vw;height: 200rpx;" :src="item.filePath" mode="widthFix"></image>
						</view>
					</swiper-item>
				</swiper>

			</view>
		</u-popup>

		<view class="lineBox" v-if="isProgressShow">
			<u-line-progress height="20" :percentage="progressNum" activeColor="#19be6b"></u-line-progress>
		</view>

		<u-modal :show="isVideoName" title="输入视频名称" :showCancelButton="true" @confirm="dialogInputConfirm"
			@cancel="isVideoName = false">
			<view class="slot-content qrCode">
				<input class="ipt videoNameIpt" type="text" v-model="videoName" placeholder="请输入视频名称" />
			</view>
		</u-modal>

		<u-action-sheet :actions="sheetList" @close="popupShow = false" @select="selectClick" :title="sheetTitle"
			:show="popupShow">
		</u-action-sheet>
		<!--  -->
		<u-popup bgColor="transparent" class="popupBox" :show="popupShow2" @close="popupShow2 = false" @open="openPopup"
			mode="center" :closeable="true">
			<image class="icon close" src="../../static/image/close.png" mode="" @click="popupShow2 = false"></image>
			<view class="popBox flex-c-c" v-html="videoHtml">
				<!-- <view ></view> -->
				<!-- <video id="popupVideo" :src="videoThat.filePath" mode="" @fullscreenchange="fullscreenchange" /> -->
			</view>
		</u-popup>
		<u-picker :show="selectShow" :columns="[typeConfigList]" keyName="flowTypeName" @confirm="selectConfig"
			@cancel="selectShow = false"></u-picker>
		<view class="foot_tag flex-c-c">
			<image src="../../static/image/logout.png" mode="" @click="loginOut()"></image>
		</view>
	</view>
</template>

<script>
	import {
		addPicVideo,
		getPicVideo,
		delPicVideo,
		getTypeConfig,
		getItemConfig
	} from '@/config/api.js';
	import {
		baseUrl
	} from '@/config/baseUrl.js'
	import timeline from '../../components/chenbin-timeline/timeLine.vue'
	import timelineItem from '../../components/chenbin-timeline/timelineItem.vue'
	import camera from '@/utils/cooseVideo.js';

	export default {
		data() {
			return {
				$user: {},
				selectShow: false,
				isSwiper: false,
				swiperList: [],
				// seleteColumns:[],
				typeConfigList: [],
				thatNum: "OP10", // 当前工位
				config: {},
				errmsg: '',
				directionList: [], // 相机拍照位置 、
				sheetTitle: "", // 标题
				thatCamera: {},
				videoThat: {},
				videoContext: null, // 当前点击视频组件
				sheetList: [{
					name: '拍照',
					// subname: "拍照不超过2M",
					accept: 'image',
					fontSize: '32'
				}, {
					name: '相册选择',
					subname: "选择视频上传",
					accept: 'videoAlbum',
					fontSize: '32'
				}, {
					name: '录像',
					subname: "录像最长10分钟",
					accept: 'video',
					fontSize: '32'
				}],
				columns: [{
					name: 'OP10',
					desc: '已完成',
					that: true,
					time: "2023-03-03"
				}, {
					name: 'OP11',
					that: false,
					desc: '未完成',
					// time: "2023-03-03"
				}, {
					name: 'OP12',
					that: false,
					desc: '未完成',
					// time: "2023-03-03"
				}], // 工位列表
				showNum: false, // 工位选择
				qrCode: '', // 二维码内容
				popupShow: false,
				popupShow2: false,

				isVideoName: false,
				videoName: "",

				progressNum: 0,
				isProgressShow: false,
			};
		},
		computed: {
			videoHtml: function() {
				return `<video id="popupVideo" style="width:100%;height:50%" controls="controls" @fullscreenchange="${this.fullscreenchange}"><source src="${this.videoThat.filePath}" type="video/mp4" ></video>`;
			}
		},
		components: {
			timeline,
			timelineItem
		},
		onLoad() {
			var that = this;
			uni.getStorage({
				key: '$user',
				success: function(res) {
					that.$user = JSON.parse(res.data);
					if (!that.$user.isAdmin) that.$user.isAdmin = false;
				}
			});
			this.getTypeConfigList();
		},
		onShow() {
			uni.hideLoading();
		},
		methods: {
			detection() {
				var list = this.directionList;
				let str = '';
				list.forEach((el,idx)=>{
					if(el.fileList < el.swiperList){
						str +=`${el.flowItemName},`
					}
				})
				str += '配置项未达到上传要求数量';
				uni.showToast({
					title: str,
					icon: 'none',
					duration: 8000
				});
			},
			dialogSwiperConfirm() {

			},


			tisOn(item, idx) {
				console.log(item);
				console.log(idx);
				this.swiperList = item.swiperList;


				if (!this.swiperList) {
					this.isSwiper = false;
					uni.showToast({
						title: '当前无提示图',
						icon: 'none',
						duration: 5000
					});
				} else {
					this.isSwiper = true;
				}
				// this.swiperList = [];

				// this.getFileList({
				// 	configID: item.id,
				// 	FileType: 'demoImg'
				// }, idx, 'demoImg', 'view')
			},
			videoNameOpen() {
				console.log('open');
			},

			cameraChange() {
				var that = this;
				let iptVal = this.videoName;
				// 测试拍摄
				camera.camera({
					time: 6000, // 视频最大长度，单位为秒
					success: function(res) {
						console.log('录制视频:', res)
						console.log('录制视频的本地路径', res.fullPath) // 录制视频的本地路径
						console.log('录制视频的文件对象', res.file) // 录制视频的文件对象
						uni.showLoading({
							title: '视频拍摄完成，压缩中',
							mask: true
						});
						const tempFilePaths = res.fullPath;
						// that.popupShow = false;
						that.isProgressShow = true;
						uni.compressVideo({
							src: tempFilePaths,
							quality: "medium", //视频质量高低，基本上高质量时60m视频压缩后为6做左右，中质量60m压缩为3m左右，低质量60m压缩为2m左右（看不清人了）
							bitrate: 2000,
							fps: 24,
							resolution: 1,
							success: (result) => {
								uni.hideLoading();
								console.log('视频压缩', result);
								uni.showLoading({
									title: '视频压缩完成，上传中',
									mask: true
								});
								// that.videoRecordingPath = result.tempFilePath;
								const uploadTask = uni.uploadFile({
									url: baseUrl + '/api/File/Upload',
									filePath: result.tempFilePath,
									name: 'formFiles',
									// compressed:true,
									// maxDuration: 600,
									formData: {
										'user': 'test'
									},
									success: (uploadFileRes) => {
										uni.hideLoading();
										uni.showLoading({
											title: '视频压缩完成，正在上传',
											mask: true
										});
										// that.thatCamera.filePath = tempFilePaths;
										that.selectFile(that.thatCamera);
										console.log(uploadFileRes);
										console.log(JSON.parse(uploadFileRes.data)
											.data);
										if (JSON.parse(uploadFileRes.data).code ==
											0) {
											let params = {
												"sn": that.qrCode,
												"configID": that.thatCamera.id,
												"userID": that.$user.id,
												"fileType": "video",
												"filePath": JSON.parse(
														uploadFileRes.data)
													.data,
												"name": iptVal
											}
											uni.hideLoading();
											uni.showToast({
												title: iptVal + '上传完成',
												icon: 'none',
												duration: 5000
											});
											setTimeout(() => {
												that.isProgressShow =
													false;
											}, 3000)
											that.formSub(params);
											console.log(JSON.parse(uploadFileRes
												.data));
										}
									},
									fail: (err) => {
										uni.hideLoading();
										uni.showToast({
											title: iptVal + '上传失败',
											icon: 'none',
											duration: 5000
										});
										setTimeout(() => {
											that.isProgressShow = false;
										}, 3000)
										// that.errmsg = JSON.stringify(err);
										console.log('errmsg', err);
									}
								});

								uploadTask.onProgressUpdate(function(lineRes) {
									that.progressNum = lineRes.progress;
									console.log('上传进度' + lineRes.progress);
									// console.log('已经上传的数据长度' + lineRes.totalBytesSent);
									// console.log('预期需要上传的数据总长度' + lineRes
									// 	.totalBytesExpectedToSend);
								});
								that.thatCamera.filePath = res.fullPath;
								that.selectFile(that.thatCamera);
							},
							fail: () => {
								setTimeout(() => {
									that.isProgressShow = false;
								}, 2000)
								uni.showToast({
									title: '视频压缩失败！',
									icon: 'none',
									duration: 5000
								});
								setTimeout(function() {
									uni.hideLoading();
								}, 5000)
							}
						})
						// console.log(res.fullPath) // 录制视频的本地路径
						// console.log(res.file) // 录制视频的文件对象
					},
					fail: function(e) {
						uni.hideLoading();
						uni.showToast({
							title: '拍摄失败' + e,
							icon: 'none',
							duration: 5000
						});
						console.log('拍摄失败原因', e) // 失败原因
					}
				})
			},
			dialogInputConfirm() {
				// console.log(iptVal)
				let iptVal = this.videoName;
				var that = this;
				this.thatCamera.videoName = iptVal;
				this.isVideoName = false;
				console.log(this.thatCamera.accept);
				that.progressNum = 0;

				if (!iptVal) {
					uni.showToast({
						title: '请输入视频名称',
						icon: 'none',
						duration: 3000
					});
					return
				}

				if (this.thatCamera.accept === 'video') {
					setTimeout(function() {
						uni.showToast({
							title: '如果长时间没反应请打开应用的相机权限',
							icon: 'none',
							duration: 3000
						});
					}, 1500)
					camera.camera({
						time: 6000, // 视频最大长度，单位为秒
						success: function(res) {
							console.log('拍摄RES:', res)
							console.log('录制视频的本地路径', res.fullPath) // 录制视频的本地路径
							console.log('录制视频的文件对象', res.file) // 录制视频的文件对象
							uni.showLoading({
								title: '视频拍摄完成，压缩中',
								mask: true
							});
							const tempFilePaths = res.fullPath;
							// that.popupShow = false;
							that.isProgressShow = true;
							uni.compressVideo({
								src: tempFilePaths,
								quality: "medium", //视频质量高低，基本上高质量时60m视频压缩后为6做左右，中质量60m压缩为3m左右，低质量60m压缩为2m左右（看不清人了）
								bitrate: 2000,
								fps: 24,
								resolution: 1,
								success: (result) => {
									// uni.hideLoading();
									console.log('视频压缩完成', result);
									console.log('视频压缩完成', result.tempFilePath);

									uni.showLoading({
										title: '视频压缩完成，上传中',
										mask: true
									});
									// that.videoRecordingPath = result.tempFilePath;
									const uploadTask = uni.uploadFile({
										url: baseUrl + '/api/File/Upload',
										filePath: result.tempFilePath,
										name: 'formFiles',
										// compressed:true,
										// maxDuration: 600,
										formData: {
											'user': 'test'
										},
										success: (uploadFileRes) => {
											uni.hideLoading();
											uni.showLoading({
												title: '视频压缩完成，正在上传',
												mask: true
											});
											// that.thatCamera.filePath = tempFilePaths;
											// that.selectFile(that.thatCamera);
											console.log(uploadFileRes);
											console.log(JSON.parse(uploadFileRes.data)
												.data);
											if (JSON.parse(uploadFileRes.data).code ==
												0) {
												let params = {
													"sn": that.qrCode,
													"configID": that.thatCamera.id,
													"userID": that.$user.id,
													"fileType": "video",
													"filePath": JSON.parse(
															uploadFileRes.data)
														.data,
													"name": iptVal
												}
												uni.hideLoading();
												uni.showToast({
													title: iptVal + '上传完成',
													icon: 'none',
													duration: 5000
												});
												setTimeout(() => {
													that.isProgressShow =
														false;
												}, 3000)
												that.formSub(params);
												console.log(JSON.parse(uploadFileRes
													.data));
											}
										},
										fail: (err) => {
											uni.hideLoading();
											uni.showToast({
												title: iptVal + '上传失败',
												icon: 'none',
												duration: 5000
											});
											setTimeout(() => {
												that.isProgressShow = false;
											}, 3000)
											// that.errmsg = JSON.stringify(err);
											console.log('errmsg', err);
										}
									});

									uploadTask.onProgressUpdate(function(lineRes) {
										that.progressNum = lineRes.progress;
										console.log('上传进度' + lineRes.progress);
									});
									that.thatCamera.filePath = res.fullPath;
									that.selectFile(that.thatCamera);
								},
								fail: () => {
									setTimeout(() => {
										that.isProgressShow = false;
									}, 2000)
									uni.showToast({
										title: '视频压缩失败！',
										icon: 'none',
										duration: 5000
									});
									setTimeout(function() {
										uni.hideLoading();
									}, 5000)
								}
							})
							// console.log(res.fullPath) // 录制视频的本地路径
							// console.log(res.file) // 录制视频的文件对象
						},
						fail: function(e) {
							uni.showToast({
								title: '拍摄失败' + e,
								icon: 'none',
								duration: 5000
							});
							setTimeout(function() {
								uni.hideLoading();
							}, 5000)
							console.log(e) // 失败原因
						}
					})
					// camera.camera({
					// 	time: 6000, // 视频最大长度，单位为秒
					// 	success: function(res) {
					// 		// console.log(res.fullPath) // 录制视频的本地路径
					// 		// console.log(res.file) // 录制视频的文件对象
					// 		uni.showLoading({
					// 			title: '视频压缩中',
					// 			mask: true
					// 		});
					// 		that.popupShow = false;
					// 		that.isProgressShow = true;
					// 		console.log('videoRes:', res)
					// 		const tempFilePaths = res.fullPath;

					// 		uni.compressVideo({
					// 			src: tempFilePaths,
					// 			quality: "medium", //视频质量高低，基本上高质量时60m视频压缩后为6做左右，中质量60m压缩为3m左右，低质量60m压缩为2m左右（看不清人了）
					// 			bitrate: 2000,
					// 			fps: 24,
					// 			resolution: 1,
					// 			success: (result) => {
					// 				// that.videoRecordingPath = result.tempFilePath;
					// 				uni.showLoading({
					// 					title: '视频压缩完成',
					// 					mask: true
					// 				});
					// 				const uploadTask = uni.uploadFile({
					// 					url: baseUrl + '/api/File/Upload',
					// 					filePath: result.tempFilePath,
					// 					name: 'formFiles',
					// 					// compressed:true,
					// 					// maxDuration: 600,
					// 					formData: {
					// 						'user': 'test'
					// 					},
					// 					success: (uploadFileRes) => {
					// 						uni.showLoading({
					// 							title: '视频上传中',
					// 							mask: true
					// 						});
					// 						that.thatCamera.filePath = tempFilePaths;
					// 						that.selectFile(that.thatCamera);
					// 						console.log(uploadFileRes);
					// 						console.log(JSON.parse(uploadFileRes.data)
					// 							.data);
					// 						if (JSON.parse(uploadFileRes.data).code ==
					// 							0) {
					// 							let params = {
					// 								"sn": that.qrCode,
					// 								"configID": that.thatCamera.id,
					// 								"userID": that.$user.id,
					// 								"fileType": "video",
					// 								"filePath": JSON.parse(
					// 										uploadFileRes.data)
					// 									.data,
					// 								"name": iptVal
					// 							}
					// 							uni.showToast({
					// 								title: iptVal + '上传完成',
					// 								icon: 'none',
					// 								duration: 5000
					// 							});
					// 							setTimeout(() => {
					// 								that.isProgressShow =
					// 									false;

					// 							}, 3000)
					// 							uni.hideLoading();
					// 							that.formSub(params);
					// 							console.log(JSON.parse(uploadFileRes
					// 								.data));
					// 						}
					// 					},
					// 					fail: (err) => {
					// 						uni.showToast({
					// 							title: iptVal + '上传失败',
					// 							icon: 'none',
					// 							duration: 5000
					// 						});
					// 						setTimeout(() => {
					// 							that.isProgressShow = false;
					// 						}, 2000)
					// 						uni.hideLoading();
					// 						// that.errmsg = JSON.stringify(err);
					// 						console.log('errmsg', err);
					// 					}
					// 				});

					// 				uploadTask.onProgressUpdate(function(lineRes) {
					// 					that.progressNum = lineRes.progress;
					// 					console.log('上传进度' + lineRes.progress);
					// 					// console.log('已经上传的数据长度' + lineRes.totalBytesSent);
					// 					// console.log('预期需要上传的数据总长度' + lineRes
					// 					// 	.totalBytesExpectedToSend);
					// 				});
					// 				that.thatCamera.filePath = res.fullPath;
					// 				that.selectFile(that.thatCamera);
					// 			},
					// 			fail: () => {
					// 				uni.hideLoading();
					// 				setTimeout(() => {
					// 					that.isProgressShow = false;
					// 				}, 2000)
					// 				uni.showToast({
					// 					title: '相机调用失败！',
					// 					icon: 'none',
					// 					duration: 1500
					// 				});
					// 			}
					// 		})
					// 		// console.log(res.fullPath) // 录制视频的本地路径
					// 		// console.log(res.file) // 录制视频的文件对象
					// 	},
					// 	fail: function(e) {
					// 		uni.hideLoading();
					// 		uni.showToast({
					// 			title: '上传失败' + e,
					// 			icon: 'none',
					// 			duration: 5000
					// 		});
					// 		console.log(e) // 失败原因
					// 	}
					// })

				} else {
					uni.chooseVideo({
						count: 1, //默认9
						sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
						sourceType: ['album'],
						// compressed:true,
						success: function(res) {
							console.log('选择shipin', res);
							uni.showLoading({
								title: '视频压缩上传中',
								mask: true
							});
							that.popupShow = false;
							that.isProgressShow = true;
							const tempFilePaths = res.tempFilePath;

							// #ifdef H5
							const uploadTask = uni.uploadFile({
								url: baseUrl + '/api/File/Upload',
								filePath: tempFilePaths,
								name: 'formFiles',
								// compressed:true,
								// maxDuration: 600,
								formData: {
									'user': 'test'
								},
								success: (uploadFileRes) => {
									that.thatCamera.filePath = tempFilePaths;
									that.selectFile(that.thatCamera);
									console.log('uploadFile=>', uploadFileRes);
									console.log('uploadFile=>>', JSON.parse(
											uploadFileRes.data)
										.data);
									if (JSON.parse(uploadFileRes.data).code ==
										0) {
										let params = {
											"sn": that.qrCode,
											"configID": that.thatCamera.id,
											"userID": that.$user.id,
											"fileType": "video",
											"filePath": JSON.parse(
													uploadFileRes.data)
												.data,
											"name": iptVal
										}
										uni.showToast({
											title: iptVal + '上传完成',
											icon: 'none',
											duration: 5000
										});
										setTimeout(() => {
											that.isProgressShow =
												false;
										}, 2000)
										uni.hideLoading();
										that.formSub(params);
										console.log(JSON.parse(uploadFileRes
											.data));
									}
								},
								fail: (err) => {
									uni.hideLoading();
									uni.showToast({
										title: iptVal + '上传失败',
										icon: 'none',
										duration: 5000
									});
									// that.errmsg = JSON.stringify(err);
									console.log('errmsg', err);
								}
							});

							uploadTask.onProgressUpdate(function(lineRes) {
								that.progressNum = lineRes.progress;
								console.log('上传进度' + lineRes.progress);
								// console.log('已经上传的数据长度' + lineRes.totalBytesSent);
								// console.log('预期需要上传的数据总长度' + lineRes
								// 	.totalBytesExpectedToSend);
							});

							that.thatCamera.filePath = res.fullPath;
							that.selectFile(that.thatCamera);
							// #endif
							// #ifdef APP-PLUS
							uni.compressVideo({
								src: tempFilePaths,
								quality: "high", //视频质量高低，基本上高质量时60m视频压缩后为6做左右，中质量60m压缩为3m左右，低质量60m压缩为2m左右（看不清人了）
								// bitrate: 2000,
								// fps: 1,
								// resolution: 0,
								success: (result) => {

									console.log('压缩===>', result);
									// that.videoRecordingPath = result.tempFilePath;

									const uploadTask = uni.uploadFile({
										url: baseUrl + '/api/File/Upload',
										filePath: result.tempFilePath,
										name: 'formFiles',
										// compressed:true,
										// maxDuration: 600,
										formData: {
											'user': 'test'
										},
										success: (uploadFileRes) => {
											// that.thatCamera.filePath = tempFilePaths;
											// that.selectFile(that.thatCamera);
											console.log('uploadFile=>', uploadFileRes);
											console.log('uploadFile=>>', JSON.parse(
													uploadFileRes.data)
												.data);
											if (JSON.parse(uploadFileRes.data).code ==
												0) {
												let params = {
													"sn": that.qrCode,
													"configID": that.thatCamera.id,
													"userID": that.$user.id,
													"fileType": "video",
													"filePath": JSON.parse(
															uploadFileRes.data)
														.data,
													"name": iptVal
												}
												uni.showToast({
													title: iptVal + '上传完成',
													icon: 'none',
													duration: 5000
												});
												setTimeout(() => {
													that.isProgressShow =
														false;
												}, 2000)
												uni.hideLoading();
												that.formSub(params);
												console.log(JSON.parse(uploadFileRes
													.data));
											}
										},
										fail: (err) => {
											uni.hideLoading();
											uni.showToast({
												title: iptVal + '上传失败',
												icon: 'none',
												duration: 5000
											});
											// that.errmsg = JSON.stringify(err);
											console.log('errmsg', err);
										}
									});

									uploadTask.onProgressUpdate(function(lineRes) {
										that.progressNum = lineRes.progress;
										console.log('上传进度' + lineRes.progress);
										console.log('压缩===>', (result.size / 1024 / 1024) +
											'MB');

										// console.log('已经上传的数据长度' + lineRes.totalBytesSent);
										// console.log('预期需要上传的数据总长度' + lineRes
										// 	.totalBytesExpectedToSend);
									});

									that.thatCamera.filePath = res.fullPath;
									// that.selectFile(that.thatCamera);
								},
								fail: (error) => {
									console.log('yasuo', error);
									uni.hideLoading();
									uni.showToast({
										title: '视频压缩失败！',
										icon: 'none',
										duration: 5000
									});
								}
							})
							// #endif	

							// that.thatCamera.filePath = res.tempFilePaths[0];
							that.thatCamera.fileList = that.thatCamera.fileList ? that.thatCamera.fileList :
								'';
							// that.thatCamera.fileList.push(res.tempFilePaths[0]);
							that.selectFile(that.thatCamera);
						},
						fail: function(err) {
							uni.showToast({
								title: '拍摄失败',
								icon: 'none',
								duration: 5000
							});
						}
					});
				}

				// uni.chooseVideo({
				// 	count: 1,
				// 	sourceType: ['camera'],
				// 	success: function(res) {

				// 	},
				// 	fail: function(err) {
				// 		uni.showToast({
				// 			title: '拍摄失败',
				// 			icon: 'none',
				// 			duration: 5000
				// 		});
				// 	}
				// });
				// this.value = val
				// 关闭窗口后，恢复默认内容
			},
			search() {
				if (!this.config.id) {
					uni.showToast({
						title: '请选择扶梯配置',
						icon: 'none',
						duration: 5000
					});
					return;
				}
				if (!this.qrCode) {
					uni.showToast({
						title: '请输入正确的八位订单号',
						icon: 'none',
						duration: 5000
					});
					return;
				}

				this.directionList.forEach((el, idx) => {
					this.getFileList({
						sn: this.qrCode,
						configID: el.id,
						userID: this.$user.id,
					}, idx);

					this.getFileList({
						configID: el.id,
						FileType: 'demoImg'
					}, idx, 'demoImg', 'view')
				})
			},
			getFileList(params, idx, type, view) {
				if (type === 'demoImg') {
					params.FileType = 'demoImg';
				}
				getPicVideo(params)
					.then(res => {
						console.log('getFileList', res);
						res.picVideoList.forEach((el, idx) => {
							res.picVideoList[idx].filePath = baseUrl + "/api/File/download?fileId=" + el.id;
						})
						if (type === 'demoImg') {
							this.swiperList = res.picVideoList;
							console.log(res.picVideoList);
							if (res.picVideoList.length <= 0) {
								this.isSwiper = false;
								if (!view) {
									uni.showToast({
										title: '当前无提示图',
										icon: 'none',
										duration: 5000
									});
								}

							} else {
								if (view) {
									this.directionList[idx].swiperList = res.picVideoList;
								} else {
									this.isSwiper = true;
								}
							}
						} else {
							this.directionList[idx].fileList = res.picVideoList;
						}

						this.$forceUpdate()
						console.log('getFileList', this.directionList[idx]);
					}).catch((err) => {
						console.log(err);
					})

			},
			selectConfig(val) {
				console.log(val.value[0].id)
				var id = val?.value[0]?.id
				let params = {
					enable: 1,
					FlowTypeID: val?.value[0]?.id
				};
				this.config = val?.value[0];
				getItemConfig(params).then((res) => {
					res.forEach((el, idx) => {
						res[idx].swiperList = [];
					})
					this.directionList = res;
					this.selectShow = false;
				}).catch((err) => {


					console.log(err);
				})
			},
			getTypeConfigList(type) {
				getTypeConfig({
					enable: 1
				}).then((res) => {
					console.log(res);
					if(type == 'btn'){
						uni.showToast({
							title: '已重新获取扶梯配置',
							icon: 'none',
							duration: 5000
						});
					}
					this.typeConfigList = res;
				}).catch((err) => {
					uni.showToast({
						title: '取扶梯配置失败',
						icon: 'none',
						duration: 5000
					});
					console.log(err);
				})
			},
			formSub(params) {
				addPicVideo(params).then((res) => {
					this.directionList.forEach((el, idx) => {
						if (el.id === this.thatCamera.id) {
							this.getFileList({
								sn: params.sn,
								configID: params.configID,
								userID: params.userID
							}, idx);
							// this.directionList[idx].fileList.push(params);
						}
					})

					console.log(res);
				}).catch((err) => {
					console.log(err);
				})
			},
			onThatType(type) {
				if (type === "video") {
					console.log(type);
				}
			},
			openPopup() {

			},
			selectFile(e) {
				var that = this;
				this.$forceUpdate()
				console.log('selectFile===========', e)
			},
			preview(item) {
				var that = this;
				console.log(item);
				if (item.fileType == 'image') {
					uni.previewImage({
						urls: [item.filePath],
						longPressActions: {
							success: function(data) {
								console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
							},
							fail: function(err) {
								console.log(err.errMsg);
							}
						}
					});
				} else if (item.fileType == 'video') {
					console.log(111);
					console.log(item);
					this.videoThat = item;
					this.popupShow2 = true;
					// this.videoContext.play()
				}
			},
			//退出全屏时停止播放
			fullscreenchange(e) {
				console.log(e)
				if (!e.detail.fullScreen) {
					this.videoContext.stop()
					this.isOpenVideo = false
				}
			},
			selectClick(item) {
				console.log(item)
				this.thatCamera.accept = item.accept;
				this.videoName = '';
				var that = this;
				this.videoName = ''
				if (item.accept == 'image') {
					uni.chooseImage({
						count: 1, //默认9
						sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
						sourceType: ['camera'],
						success: function(res) {
							that.popupShow = false;
							console.log('ImageRes:', res)
							const tempFilePaths = res.tempFilePaths;
							uni.uploadFile({
								url: baseUrl + '/api/File/Upload',
								filePath: tempFilePaths[0],
								name: 'formFiles',
								formData: {
									'user': 'test'
								},
								success: (uploadFileRes) => {
									that.thatCamera.filePath = res.tempFilePaths[0];
									that.selectFile(that.thatCamera);
									console.log(uploadFileRes);
									console.log(JSON.parse(uploadFileRes.data).data);
									if (JSON.parse(uploadFileRes.data).code == 0) {
										let params = {
											"sn": that.qrCode,
											"configID": that.thatCamera.id,
											"userID": that.$user.id,
											"fileType": "image",
											"filePath": JSON.parse(uploadFileRes.data).data,
											"name": 'image',
										}
										that.formSub(params);
										console.log(JSON.parse(uploadFileRes.data));
									}
								}
							});
							// that.thatCamera.filePath = res.tempFilePaths[0];
							that.thatCamera.fileList = that.thatCamera.fileList ? that.thatCamera.fileList :
								'';
							that.thatCamera.fileList.push(res.tempFilePaths[0]);
							that.selectFile(that.thatCamera);
						},
						fail: function(err) {
							uni.showToast({
								title: '拍摄失败',
								icon: 'none',
								duration: 5000
							});
						}
					});
				} else if (item.accept == 'video') {
					// that.$refs.inputDialog.open()
					that.isVideoName = true;
				} else if (item.accept == 'videoAlbum') {
					that.isVideoName = true;
				}
				// console.log(this.thatCamera.accept)
			},


			direction(item) {
				if (this.config.id) {
					let patt = /^[0-9]{8}$/;
					if (!patt.test(this.qrCode)) {
						uni.showToast({
							title: '请输入正确的八位订单号',
							icon: 'none',
							duration: 5000
						});
						return;
					}
					this.sheetTitle = item.title;
					this.thatCamera = item;
					this.popupShow = true
					if (item.direction == 'leftFront') {
						this.popupShow = true
					}
				} else {
					uni.showToast({
						title: '请选择扶梯配置',
						icon: 'none',
						duration: 5000
					});
				}
			},
			close() {
				this.popupShow = false
			},
			thatLine(e, index) {
				// name: 'OP12',
				// that: false,
				// desc: '未完成',
				console.log(index)
				var arr = this.columns;
				arr.forEach((el, idx) => {
					if (idx < index) {
						el.that = true;
						el.desc = '已完成'
					}
				})
				console.log(arr)
				this.columns = arr;
			},
			loginOut() {
				console.log('loginOut');
				uni.redirectTo({
					//关闭当前页面，跳转到应用内的某个页面。
					url: '/pages/login/index'
				});
			},
			numChange(e) {
				console.log(e)
				this.thatNum = e.value[0];
				this.showNum = false;
			},
			getQr() {
				var that = this;
				uni.scanCode({
					success: function(res) {
						that.qrCode = res.result;
						console.log('条码类型：' + res.scanType);
						console.log('条码内容：' + res.result);
					},
					fail: function() {
						uni.showToast({
							title: '识别失败',
							icon: 'none',
							duration: 5000
						});
					}

				});
			},



		}
	}
</script>

<style lang="scss" scoped>
	.u-page {
		padding: 20rpx;
		box-sizing: border-box;
		overflow-y: scroll;

		.lineBox {
			position: fixed;
			left: 0rpx;
			right: 0rpx;
			top: 0rpx;
			z-index: 1000;
		}

		.icon {
			width: 44rpx;
			height: 44rpx;
			display: block;
		}

		.close {
			position: fixed;
			top: 20rpx;
			right: 20rpx;
			z-index: 10;
		}

		.videoNameIpt {
			// border: solid 1px #999;
			// background-color: #EFF2FF;

		}

		.custom-style {
			min-width: 199px;
			height: 43px;
			border-radius: 9px 9px 9px 9px;
			opacity: 1;
			border-radius: 12px;
			font-weight: bold;
		}

		.borderNull {
			border: 1px solid #e64340 !important;
		}

		.qrCode {
			width: 100%;
			height: 80rpx;
			background: #EFF2FF;
			border-radius: 4px 4px 4px 4px;
			opacity: 1;
			border: 1px solid #CDCBCB;
			font-size: 30rpx;
			padding: 0 20px;


			.ipt {
				width: 100%;
				height: 100%;
				font-size: 32rpx;
			}

			// font-size: 50rpx;
		}



		.bg {
			// padding: 12rpx 0 12rpx 12rpx;
			box-sizing: border-box;
			// border: 2px dashed #9EABE0;
			// border-radius: 9px 9px 9px 9px;
			// background: linear-gradient(180deg, #F8FAFF 0%, #DEE8FA 100%);
			margin-top: 31rpx;

			.scan_list {
				padding: 12rpx 0 12rpx 12rpx;
				margin-bottom: 20px;
				border: 2px dashed #9EABE0;
				border-radius: 9px;
				background: linear-gradient(180deg, #F8FAFF 0%, #DEE8FA 100%);
			}

			.typeNull {
				border: 3px dashed #e64340 !important;
			}
		}

		.u-demo-block {
			margin: 0;
		}

		.u-demo-block__title {
			font-size: 20px;
			font-weight: bold;
			color: #000;
		}


		.u-demo-block__content {
			.demo-layout {
				width: 100%;
				height: 100%;





				.scan {
					width: 100%;
					// height: 40px;

					.label {
						font-size: 30rpx;
						color: #000;
						font-weight: bold;
						marign-right: 10rpx;
						padding-right: 10px;
						width: 190rpx;
					}


				}

				.btns {
					margin-top: 20rpx;
					flex-wrap: wrap;

					.btn_item {
						margin-left: 0rpx;
						margin-right: 10rpx;
						margin-bottom: 10rpx;
					}
				}



				// .camera_type {
				// 	width: 50%;
				// 	height: 250rpx;
				// 	margin-right: 10px;
				// 	background: linear-gradient(313deg, #DCE2EC 0%, #EEF1F5 100%);
				// 	border-radius: 6px 6px 6px 6px;
				// 	border: solid 6rpx #F2F7FC;
				// 	box-sizing: border-box;
				// }

				text {
					font-size: 17px;
					font-weight: bold;
					color: #4B4B4B;
				}

				.camera_view {
					width: 100%;
					// height: 250rpx;
					position: relative;
					// background: linear-gradient(313deg, #DCE2EC 0%, #EEF1F5 100%);
					// border-radius: 6px 6px 6px 6px;
					// border: solid 6rpx #F2F7FC;
					box-sizing: border-box;

					// .zzc {
					// 	width: 100%;
					// 	height: 100%;
					// 	position: absolute;
					// 	top: 0;
					// 	left: 0;
					// 	right: 0;
					// 	bottom: 0;
					// 	z-index: -1;
					// }



					.view_box {
						width: 100%;
						height: 100%;
						flex-wrap: wrap;

						.camera_type {
							width: 215rpx;
							height: 215rpx;
							// background-color: #000;
							margin-top: 15rpx;
							margin-right: 10rpx;
							border: solid 1rpx #999;
						}

						.view_item {
							width: 215rpx;
							height: 215rpx;
							margin: 15rpx 12rpx 15rpx 0;
							border-radius: 10rpx;
							border: solid 1rpx #999;
							position: relative;

							.videoName {
								// position: absolute;
								// top: 50%;
								// left: 50%;
								// transform: translate(-50%, -50%);
								// z-index: 9;
							}

							.icon {
								width: 48rpx;
								height: 48rpx;
							}

							.zzc {
								position: absolute;
								top: 0;
								right: 0;
								left: 0;
								bottom: 0;
								z-index: 100;

								image {
									width: 88rpx;
									height: 88rpx;
									position: relative;
									z-index: 10;
								}
							}
						}

						image {
							width: 100%;
							height: 100%;
						}

						video {
							width: 100%;
							height: 100%;
							position: relative;
							z-index: 0;
						}
					}
				}
			}

		}




		.popBox {
			// position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			width: 750rpx;
			background-color: inherit;

			#popupVideo {
				width: 750rpx;
				height: 50vh;
				display: block;

			}

			video {
				// width: 100%;
				width: 375rpx;
				display: block;
				height: 375rpx;
			}

			// height: 100%;
		}

	}




	.foot_tag {
		width: 50px;
		height: 50px;
		border-radius: 50%;
		background-color: #fff;
		position: fixed;
		bottom: 20rpx;
		right: 20rpx;
		z-index: 10000;

		image {
			width: 30px;
			height: 30px;
			position: absolute;
		}
	}

	.demo-layout {
		// height: 25px;
		border-radius: 4px;
	}

	// .bg-purple {
	// 	background: #CED7E1;
	// }

	// .bg-purple-light {
	// 	background: #e5e9f2;
	// }

	// .bg-purple-dark {
	// 	background: #99a9bf;
	// }
</style>