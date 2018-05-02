// pages/authenticate/authenticate.js
const { valid, wxPromise } = require('../../utils/util');
const { wxRequest } = require('../../utils/wx-request');
const { login } = require('../../server-api/user');

const errorMessage = {
	adminName: '昵称只能包含字母或者数字',
	password: '密码长度为3-30位，且只能包含字母、数字、“-”和“_”',
}

const app = getApp();

Page({
  data: {
		adminName: '',
		password: '',
  },
  onLoad: function (options) {
		wxPromise(
			wx.getStorage,
			{ key: 'adminName' },
		).then((res) => {
			this.setData({ adminName: res.data });
		}).catch(() => {});
  },
	inputValueChange: function (e) {
		const id = e.target.id;
		const value = e.detail.value;
		const obj = {};
		obj[id] = value;
		this.setData(obj);
	},
	checkInputValue: function (data) {
		for (const param in data) {
			const val = data[param];
			if (!val || !valid(val, param)) {
				wx.showModal({
					content: errorMessage[param],
					showCancel: false,
				});
				return false;
			}
		}
		return true;
	},
	onLoginPress: function () {
		const { adminName, password } = this.data;
		const data = { adminName, password };
		if (!this.checkInputValue(data)) {
			return;
		}
		wx.showLoading({
			title: '正在登录',
			mask: true,
		});
		wxRequest(login(adminName, password)).then((result) => {
			const { response, errorMsg } = result;
			if (!errorMsg) {
				wx.setStorage({
					key: 'token',
					data: response,
				});
				app.setToken(response);
				wx.setStorage({
					key: 'adminName',
					data: adminName,
				});
				wx.showLoading({
					title: '登录成功',
					mask: true,
				});
				wx.reLaunch({
					url: '/pages/home/home',
				});
			} else {
				wx.showModal({
					content: errorMsg,
					showCancel: false
				});
			}
		});
	},
});
