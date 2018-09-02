// pages/home/home.js
const moment = require('../../libs/moment.js');
const _ = require('../../libs/lodash.js');
const { HOST } = require('../../constants/index.js');
const { extend } = require('../../utils/util.js');
const { wxRequest } = require('../../utils/wx-request');
const { fetchCars } = require('../../server-api/car');
const dealCar = require('./common/deal-car.js');

const app = getApp();

const homePage = {
  data: {
		carList: [],
    netError: false,
  },
  onLoad: function (options) {
    this.fetchData();
    app.setPageCallback('homeAddCar', this.addCar);
    app.setPageCallback('homeUpdateCar', this.updateCar);
    app.setPageCallback('homeUpdateCarImages', this.updateCarImages);
  },
  onUnload: function () {
    console.warn('home unload');
    app.removePageCallback('homeAddCar');
    app.removePageCallback('homeUpdateCar');
    app.removePageCallback('homeUpdateCarImages');
  },
  fetchData: function () {
    wx.showLoading({
      title: '正在加载',
    });
    wxRequest(fetchCars()).then((result) => {
      wx.hideLoading();
      let netError = true;
      if (!result.message) {
        const carList = [];
        result.response.map((value) => {
          const newCarInfo = this.dealCar(value);
          const carInfo = Object.assign(value, newCarInfo);
          carList.push(carInfo);
        });
        netError = false;
        this.setData({ carList });
      }
      this.setData({ netError });
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
  onSearchClick: function () {
    wx.navigateTo({
      url: '/pages/home/search-page/search-page',
    });
  },
  onCarItemClick: function (evt) {
    const { carList } = this.data;
    const { id } = evt.currentTarget.dataset;
    const curCarInfo = _.find(carList, { id });
    app.setCarInfo(curCarInfo);
    wx.navigateTo({
      url: '/pages/home/car-page/car-page',
    });
  },
  onNetworkRetryHandler: function () {
    this.fetchData();
  },
};

Page(extend(homePage, dealCar));
