// pages/home/home.js
const { valid, wxPromise } = require('../../utils/util');
const { wxRequest } = require('../../utils/wx-request');
const { fetchCars } = require('../../server-api/car');
const moment = require('../../libs/moment.js');

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
				const carList = [];
				result.response.map((value) => {
					value.checkAt = moment.unix(value.checkAt).format('YYYY-MM-DD');
					const surplusDay = moment().diff(moment(value.checkAt), 'days');
					value.surplusDay = surplusDay;
					value.surplusColor = surplusDay <= 15 ? '#FF0000' : '#4A4A4A';
					carList.push(value);
				});
				this.setData({ carList });
			}
		});
  },
	onAddCarClick: function () {
		wx.navigateTo({
			url: '/pages/home/car-page/car-page',
		});
	},
	onPhoneCall: function (evt) {
		const { phone } = evt.currentTarget.dataset;
		wx.makePhoneCall({ phoneNumber: phone	});
	},
})
