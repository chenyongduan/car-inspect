// pages/home/car-page/car-page.js
const { valid } = require('../../../utils/util');
const { wxRequest } = require('../../../utils/wx-request');
const { addCar, updateCar } = require('../../../server-api/car');
const { deleteImage } = require('../../../server-api/image.js');
const { HOST } = require('../../../constants/index.js');
const moment = require('../../../libs/moment.js');
const { remove } = require('../../../libs/lodash.js');

const app = getApp();

const ERROR_MSG = {
  userName: '请输入车主姓名',
  carNumber: '请输入正确的车牌号',
  checkDay: '请选择车检日期',
  phone: '请输入正确的手机号',
}

Page({
  data: {
    id: null,
    userName: '',
    carNumber: '闽D',
    phone: '',
    checkDay: '',
    checkPrice: 0,
    imagePath: [],
    HOST,
    showImagePage: false,
    modalImagePath: '',
    imageWidth: 0,
    imageHeight: 0,
  },
  onLoad: function () {
    const curCarInfo = app.getCarInfo();
    if (!curCarInfo) return;
    const { id, userName, phone, carNumber, checkAt, checkPrice, images } = curCarInfo;
    this.setData({
      id,
      userName,
      phone,
      carNumber,
      checkDay: checkAt,
      checkPrice,
      imagePath: images,
    });
  },
  onUnload: function () {
    app.setCarInfo(null);
  },
  inputValueChange: function(e) {
    const id = e.target.id;
    const value = e.detail.value;
    const obj = {};
    obj[id] = value;
    this.setData(obj);
  },
  bindDateChange: function(evt) {
    const {
      value
    } = evt.detail;
    this.setData({
      checkDay: value
    });
  },
  showTips: function(content) {
    wx.showModal({
      content: content,
      showCancel: false,
    });
  },
  onSavePress: function() {
    const {
      id,
      userName,
      carNumber,
      phone,
      checkDay,
      checkPrice,
    } = this.data;
    if (!!id) {
      this.onChangeCarPress();
      return;
    }
    if (userName === '') {
      this.showTips(ERROR_MSG['userName']);
      return;
    }
    // if (!valid(carNumber, 'carNumber')) {
    // 	this.showTips(ERROR_MSG['carNumber']);
    // 	return;
    // }
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
    const checkDayStamp = moment(checkDay).unix();
    wxRequest(addCar(userName, carNumber, phone, checkDayStamp, checkPrice)).then((result) => {
      wx.hideLoading();
      const { message, response } = result;
      if (message) {
        this.showTips(result.message);
      } else {
        app.executePageCallback('homeAddCar', response);
        wx.showToast({
          title: '添加成功',
        });
        this.setData({ id: response.id });
      }
    });
  },
  onChangeCarPress: function () {
    const {
      id,
      userName,
      phone,
      carNumber,
      checkDay,
      checkPrice,
    } = this.data;
    if (userName === '') {
      this.showTips(ERROR_MSG['userName']);
      return;
    }
    if (phone !== '' && !valid(phone, 'phone')) {
      this.showTips(ERROR_MSG['phone']);
      return;
    }
    wx.showLoading({
      title: '正在修改中',
    });
    const checkDayStamp = moment(checkDay).unix();
    wxRequest(updateCar(id, userName, carNumber, phone, checkDayStamp, checkPrice)).then((result) => {
      wx.hideLoading();
      if (result.message) {
        this.showTips(result.message);
      } else {
        app.executePageCallback('homeUpdateCar', result.response);
        app.executePageCallback('searchUpdateCar', result.response);
        wx.showToast({
          title: '修改成功',
        });
      }
    });
  },
  addImageClick: function() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.uploadImage(res.tempFilePaths);
      }
    });
  },
  uploadImage: function (tempFilePaths) {
    const { id } = this.data;
    wx.uploadFile({
      url: `${HOST}/uploadImage`,
      filePath: tempFilePaths[0],
      name: 'image',
      header: { token: app.getToken() },
      formData: { carId: id },
      success: (res) => {
        const data = JSON.parse(res.data);
        if (data.response) {
          const { imagePath } = this.data;
          const curImagePath = imagePath.concat(data.response);
          this.setData({ imagePath: curImagePath });
          app.executePageCallback('homeUpdateCarImages', { id, images: curImagePath});
          app.executePageCallback('searchUpdateCarImages', { id, images: curImagePath });
        } else if (data.message) {
          wx.showToast({
            title: data.message,
            icon: 'none',
          });
        }
      },
      fail: (error) => {
        console.warn(error)
      }
    });
  },
  onImageClick: function (evt) {
    const { imagepath } = evt.currentTarget.dataset;
    this.setData({
      showImagePage: true,
      modalImagePath: imagepath,
    });
  },
  bindImageLoad: function (evt) {
    const { width, height } = evt.detail;
    this.setData({
      imageWidth: width,
      imageHeight: height,
    });
  },
  onImagePageClick: function () {
    this.setData({
      showImagePage: false,
      modalImagePath: '',
    });
  },
  onDeleteClick: function () {
    const { id, modalImagePath, imagePath } = this.data;
    wx.showLoading({
      title: '正在删除图片',
    });
    wxRequest(deleteImage(id, modalImagePath)).then((result) => {
      wx.hideLoading();
      if (result.message) {
        this.showTips(result.message);
      } else {
        wx.showToast({
          title: '删除成功',
        });
        remove(imagePath, (image) => image === modalImagePath);
        this.setData({
          showImagePage: false,
          modalImagePath: '',
          imagePath,
        });
        app.executePageCallback('homeUpdateCarImages', { id, images: imagePath });
        app.executePageCallback('searchUpdateCarImages', { id, images: imagePath });
      }
    });
  },
});
