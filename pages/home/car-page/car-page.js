// pages/home/car-page/car-page.js
const { valid } = require('../../../utils/util');
const { wxRequest } = require('../../../utils/wx-request');
const { addCar } = require('../../../server-api/car');

const ERROR_MSG = {
	userName: '请输入车主姓名',
	carNumber: '请输入正确的车牌号',
	checkDay: '请选择车检日期',
	phone: '请输入正确的手机号',
}

Page({
  data: {
		userName: '',
		carNumber: '',
		phone: '',
		checkDay: '',
  },
	inputValueChange: function (e) {
		const id = e.target.id;
		const value = e.detail.value;
		const obj = {};
		obj[id] = value;
		this.setData(obj);
	},
	bindDateChange: function (evt) {
		const { value } = evt.detail;
		this.setData({ checkDay: value });
	},
	showTips: function (content) {
		wx.showModal({
			content: content,
			showCancel: false,
		});
	},
	onSavePress: function () {
		const { userName, carNumber, phone, checkDay } = this.data;
		if (userName === '') {
			this.showTips(ERROR_MSG['userName']);
			return;
		}
		if (!valid(carNumber, 'carNumber')) {
			this.showTips(ERROR_MSG['carNumber']);
			return;
		}
		if (phone !== '' && !valid(phone, 'phone')) {
			this.showTips(ERROR_MSG['phone']);
			return;
		}
		if (checkDay === '') {
			this.showTips(ERROR_MSG['checkDay']);
			return;
		}
		wx.showLoading({
			title: '正在保存中',
		});
		wxRequest(addCar(userName, carNumber, phone, checkDay)).then((result) => {
			wx.hideLoading();
			if (result.errorMsg) {
				this.showTips(result.errorMsg);
			} else {
				this.showTips('保存成功');
			}
		});
	},
});
