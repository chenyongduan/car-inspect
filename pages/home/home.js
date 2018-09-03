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
    showFooterTips: false,
  },
  page: 1,
  pageSize: 5,
  total: 0,
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
    wxRequest(fetchCars(this.page, this.pageSize)).then((res) => {
      const { message, response } = res;
      wx.hideLoading();
      let netError = true;
      if (response) {
        netError = false;
        this.dealCarsResult(response);
      }
      this.setData({ netError });
    });
  },
  fetchNextCars: function () {
    if (this.page * this.pageSize >= this.total) return;
    wxRequest(fetchCars(this.page + 1, this.pageSize)).then((res) => {
      const { message, response } = res;
      if (message) return;
      this.dealCarsResult(response);
    });
  },
  dealCarsResult: function (response) {
    const { carList } = this.data;
    const { result, page, pageSize, total } = response;
    result.map((value) => {
      const newCarInfo = this.dealCar(value);
      const carInfo = Object.assign(value, newCarInfo);
      carList.push(carInfo);
    });
    this.page = page;
    this.pageSize = pageSize;
    this.total = total;
    const curCount = page * pageSize;
    const showFooterTips = curCount >= total && curCount >= 4;
    this.setData({ carList, showFooterTips });
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
  bindScrollToLower: function () {
    this.fetchNextCars();
  },
};

Page(extend(homePage, dealCar));
