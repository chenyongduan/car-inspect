// pages/home/search-page/search-page.js
const { wxRequest } = require('../../../utils/wx-request');
const { searchCar } = require('../../../server-api/car');
const moment = require('../../../libs/moment.js');
const _ = require('../../../libs/lodash.js');

const app = getApp();

Page({
  data: {
    searchValue: '',
    carList: [],
  },
  bindSearchInput: function (e) {
    const value = e.detail.value;
    console.warn(value)
    this.setData({ searchValue: value });
  },
  onSearchClick: function () {
    const { searchValue } = this.data;
    if (searchValue === '') {
      wx.showToast({
        title: '请输入搜索内容',
      });
      return;
    }
    wx.showLoading({
      title: '正在搜索中',
    });
    wxRequest(searchCar(searchValue)).then((result) => {
      wx.hideLoading();
      if (!result.message) {
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
    })
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
})
