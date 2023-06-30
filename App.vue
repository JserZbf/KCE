<script>
	export default {
		onLaunch: function() {},
		onShow: function() {

		},
		onHide: function() {

		},
		onLaunch: function() {
			// #ifdef APP-PLUS
			// plus.screen.lockOrientation('landscape-primary'); //锁定横屏
			plus.screen.lockOrientation('portrait-primary'); // 锁定竖屏
			// plus.navigator.setFullscreen(true); //隐藏状态栏(应用全屏:只能隐藏状态栏，标题栏和虚拟返回键都还可以显示)	
			// #endif	
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "@/uni_modules/uview-ui/index.scss";
	// @import "common/demo.scss";
	@import "static/style/cz.scss";

	uni-page-body,
	html,
	body {
		width: 100vw;
		height: 100%;
	}
</style>