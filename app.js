//app.js
const { wxPromise } = require('/utils/util');

App({
	globalData: {
		userInfo: null,
	},
	pageCallbackList: {},
  onLaunch: function () {
		wxPromise(
			wx.getStorage,
			{ key: 'token' },
		).then((res) => {
			this.setToken(res.data);
      wx.reLaunch({
				url: '/pages/home/home',
			});
		}).catch(() => {
			// wx.reLaunch({
			// 	url: '/pages/authenticate/authenticate',
			// });
		});
  },
	setToken: function (token) {
		this.token = token;
	},
	getToken: function () {
		return this.token;
	},
	setPageCallback: function (pageKey, callback) {
		if (!pageKey) return;
		this.pageCallbackList[pageKey] = callback;
	},
	removePageCallback: function (pageKey) {
		if (!pageKey) return;
		this.pageCallbackList[pageKey] = null;
	},
	executePageCallback: function (pageKey, param) {
		const pageCallback = this.pageCallbackList[pageKey];
		if (pageCallback) {
			pageCallback(param);
		}
	},
})