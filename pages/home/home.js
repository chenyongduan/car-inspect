// pages/home/home.js
const { valid, wxPromise } = require('../../utils/util');
const { wxRequest } = require('../../utils/wx-request');
const { fetchCars } = require('../../server-api/car');

Page({
  data: {
		carList: [],
  },
  onLoad: function (options) {
		wx.showLoading({
			title: '正在加载',
		});
		wxRequest(fetchCars()).then((result) => {
			wx.hideLoading();
			if (!result.errorMsg) {
				console.warn(result.response.data)
				this.setData({ carList: result.response.data });
			}
		});
  },
	onAddCarClick: function () {
		wx.navigateTo({
			url: '/pages/home/car-page/car-page',
		});
	},
})