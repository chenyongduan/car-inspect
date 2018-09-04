// pages/home/search-page/search-page.js
const moment = require('../../../libs/moment.js');
const _ = require('../../../libs/lodash.js');
const { extend } = require('../../../utils/util.js');
const { wxRequest } = require('../../../utils/wx-request');
const { searchCar } = require('../../../server-api/car');
const dealCar = require('../common/deal-car.js');

const app = getApp();

const searchPage = {
  data: {
    searchValue: '',
    carList: [],
    netError: false,
  },
  onLoad: function () {
    app.setPageCallback('homeDeleteCar', this.deleteCar);
    app.setPageCallback('searchUpdateCar', this.updateCar);
    app.setPageCallback('searchUpdateCarImages', this.updateCarImages);
  },
  onUnload: function () {
    app.removePageCallback('homeDeleteCar');
    app.removePageCallback('searchUpdateCar');
    app.removePageCallback('searchUpdateCarImages');
  },
  bindSearchInput: function (e) {
    const value = e.detail.value;
    this.setData({ searchValue: value });
  },
  searchCar: function (searchValue) {
    wx.showLoading({
      title: '正在搜索中',
    });
    wxRequest(searchCar(searchValue)).then((result) => {
      wx.hideLoading();
      let netError = true;
      this.searchValue = searchValue;
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
  onSearchClick: function () {
    const { searchValue } = this.data;
    if (searchValue === '') {
      wx.showToast({
        title: '请输入搜索内容',
      });
      return;
    }
    this.searchCar(searchValue);
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
    this.searchCar(this.searchValue);
  },
  onPhoneCall: function (evt) {
    const { phone } = evt.currentTarget.dataset;
    if (!phone) return;
    wx.makePhoneCall({ phoneNumber: phone });
  },
};

Page(extend(searchPage, dealCar));
