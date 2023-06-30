function android(options) {
	const VIDEOZOOM = 200;
	let MediaStore = plus.android.importClass('android.provider.MediaStore');
	let Intent = plus.android.importClass('android.content.Intent');
	// 导入后可以使用new方法创建类的示例对象
	let intent = new Intent('android.media.action.VIDEO_CAPTURE');
	intent.putExtra('android.intent.extra.videoQuality', 0.1); //0 means low quality, 1 means high quality
	//intent.putExtra("android.provider.MediaStore.EXTRA_OUTPUT", url);
	intent.putExtra('android.intent.extra.durationLimit', options.time || 60000); //设置录像时间
	let main = plus.android.runtimeMainActivity();
	main.startActivityForResult(intent, VIDEOZOOM);
	//获取返回参数
	main.onActivityResult = function(requestCode, resultCode, data) {
		let context = main;
		plus.android.importClass(data);
		let uri = data.getData();
		let resolver = context.getContentResolver();
		plus.android.importClass(resolver);
		let cursor = resolver.query(uri, null, null, null, null);
		plus.android.importClass(cursor);
		cursor.moveToFirst();
		let column = cursor.getColumnIndexOrThrow(MediaStore.Video.Media.DATA);
		// 获取录制的视频路径
		let filePath = cursor.getString(column);
		// 解析视频文件的属性
		plus.io.resolveLocalFileSystemURL(
			filePath,
			(entry) => {
				entry.file(function(file) {
					typeof(options.success) === 'function' && options.success({
						fullPath: entry.fullPath,
						file
					})
				});
			},
			(e) => {
				typeof(options.fail) === 'function' && options.fail(e)
			}
		);
	};
}
 
function ios(options) {
	let cmr = plus.camera.getCamera();
	let res = cmr.supportedVideoResolutions[0];
	let fmt = cmr.supportedVideoFormats[0];
	cmr.startVideoCapture(
		function(path) {
			plus.io.resolveLocalFileSystemURL(
				path,
				(entry) => {
					console.log(entry)
					entry.file(function(file) {
						console.log(entry.fullPath)
						typeof(options.success) === 'function' && options.success({
							fullPath: entry.fullPath,
							file
						}) 
					});
				},
				(e) => {}
			);
		},
		function(error) {
			typeof(options.fail) === 'function' && options.fail(error)
		}, {
			resolution: res,
			format: fmt,
			videoMaximumDuration: options.time || 10
		}
	);
}
 
export default {
	/**
	 *  options.time [number] 视频最大长度 单位s
	 *  options.success [function] 成功回调函数
	 *  options.fail [function] 失败回调函数
	 */
	camera(options) {
		if (uni.getSystemInfoSync().platform === 'android') {
			console.log('安卓')
			android(options)
		} else {
			ios(options)
			console.log('ios')
 
		}
 
	}
}